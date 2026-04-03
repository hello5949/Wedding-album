import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Photo = {
  mediaType: "image" | "video";
  alt: string;
  original: string;
  src: string;
  thumb: string;
};

type GalleryLightboxProps = {
  photos: Photo[];
  bgmTracks: {
    name: string;
    src: string;
    startIndex: number;
  }[];
};

const swipeThreshold = 70;

export default function GalleryLightbox({ photos, bgmTracks }: GalleryLightboxProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isOriginalOpen, setIsOriginalOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.1);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrackRef = useRef<string>("");
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);

  useEffect(() => {
    if (window.matchMedia("(max-width: 720px)").matches) {
      setIsMuted(true);
    }
  }, []);

  const ensureAudioGraph = async () => {
    const audio = audioRef.current;
    if (!audio) {
      return null;
    }

    const AudioContextCtor = window.AudioContext || (window as typeof window & {
      webkitAudioContext?: typeof AudioContext;
    }).webkitAudioContext;

    if (!AudioContextCtor) {
      return null;
    }

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContextCtor();
    }

    if (!gainNodeRef.current) {
      gainNodeRef.current = audioContextRef.current.createGain();
    }

    if (!sourceNodeRef.current) {
      sourceNodeRef.current = audioContextRef.current.createMediaElementSource(audio);
      sourceNodeRef.current.connect(gainNodeRef.current);
      gainNodeRef.current.connect(audioContextRef.current.destination);
    }

    if (audioContextRef.current.state === "suspended") {
      await audioContextRef.current.resume();
    }

    return {
      audioContext: audioContextRef.current,
      gainNode: gainNodeRef.current,
    };
  };

  const updateVolume = (nextVolume: number) => {
    setVolume(nextVolume);

    if (audioRef.current) {
      audioRef.current.volume = 1;
    }

    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = isMuted ? 0 : nextVolume;
    }
  };

  const attemptPlayback = async () => {
    const audio = audioRef.current;
    if (!audio) {
      return false;
    }

    try {
      const graph = await ensureAudioGraph();

      if (graph) {
        graph.gainNode.gain.value = isMuted ? 0 : volume;
      } else {
        audio.volume = isMuted ? 0 : volume;
      }

      await audio.play();
      return true;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOriginalOpen) {
        setIsOriginalOpen(false);
        return;
      }

      if (event.key === "ArrowRight") {
        goToNext();
      }

      if (event.key === "ArrowLeft") {
        goToPrevious();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOriginalOpen]);

  const goToIndex = (index: number) => {
    if (index === activeIndex) {
      return;
    }

    setDirection(index > activeIndex ? 1 : -1);
    setIsOriginalOpen(false);
    setActiveIndex(index);
  };

  const goToNext = () => {
    setDirection(1);
    setIsOriginalOpen(false);
    setActiveIndex((current) => (current + 1) % photos.length);
  };

  const goToPrevious = () => {
    setDirection(-1);
    setIsOriginalOpen(false);
    setActiveIndex((current) => (current - 1 + photos.length) % photos.length);
  };

  const activePhoto = photos[activeIndex];
  const activeLabel =
    activePhoto.alt || (activePhoto.mediaType === "video" ? "wedding video" : "wedding photo");
  const activeTrackIndex =
    bgmTracks.length > 0 ? Math.min(Math.floor(activeIndex / 4), bgmTracks.length - 1) : -1;
  const activeTrack = activeTrackIndex >= 0 ? bgmTracks[activeTrackIndex] : null;
  const isTrackStartPhoto = activeTrack?.startIndex === activeIndex;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !activeTrack) {
      return;
    }

    if (currentTrackRef.current !== activeTrack.src) {
      audio.src = activeTrack.src;
      audio.load();
      currentTrackRef.current = activeTrack.src;
    }

    audio.volume = 1;
    audio.muted = false;

    let isDisposed = false;

    const onFirstInteraction = () => {
      if (isDisposed) {
        return;
      }

      void attemptPlayback();
    };

    const onCanPlay = () => {
      if (isDisposed) {
        return;
      }

      void attemptPlayback();
    };

    audio.addEventListener("canplay", onCanPlay);
    audio.addEventListener("loadeddata", onCanPlay);

    void attemptPlayback().then((didPlay) => {
      if (didPlay || isDisposed) {
        return;
      }

      window.addEventListener("pointerdown", onFirstInteraction, { once: true });
      window.addEventListener("click", onFirstInteraction, { once: true });
      window.addEventListener("keydown", onFirstInteraction, { once: true });
      window.addEventListener("touchstart", onFirstInteraction, { once: true });
    });

    return () => {
      isDisposed = true;
      audio.removeEventListener("canplay", onCanPlay);
      audio.removeEventListener("loadeddata", onCanPlay);
      window.removeEventListener("pointerdown", onFirstInteraction);
      window.removeEventListener("click", onFirstInteraction);
      window.removeEventListener("keydown", onFirstInteraction);
      window.removeEventListener("touchstart", onFirstInteraction);
    };
  }, [activeTrack, isMuted, volume]);

  return (
    <section className="carousel-shell" aria-label="Wedding gallery carousel">
      {activeTrack ? <audio ref={audioRef} autoPlay loop preload="auto" /> : null}
      {activeTrack ? (
        <div className="carousel-audio-controls">
          <p className="audio-hint">記得開音樂喔!</p>
          <label
            className="audio-volume"
            aria-label="Background music volume"
            onPointerDown={(event) => event.stopPropagation()}
            onTouchStart={(event) => event.stopPropagation()}
          >
            <span className="audio-volume-label" aria-hidden="true">
              Vol
            </span>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={Math.round(volume * 100)}
              className="audio-volume-slider"
              onInput={(event) => updateVolume(Number(event.currentTarget.value) / 100)}
              onChange={(event) => updateVolume(Number(event.currentTarget.value) / 100)}
              aria-label="Background music volume"
            />
          </label>
          <button
            type="button"
            className="audio-toggle"
            onClick={() => setIsMuted((current) => !current)}
            onPointerDown={(event) => event.stopPropagation()}
            aria-pressed={isMuted}
            aria-label={isMuted ? "Unmute background music" : "Mute background music"}
          >
            <span className="audio-toggle-icon" aria-hidden="true">
              {isMuted ? (
                <svg viewBox="0 0 24 24" className="audio-toggle-svg">
                  <path
                    d="M14.5 5.5v13a.75.75 0 0 1-1.28.53L8.69 14.5H5.25A1.25 1.25 0 0 1 4 13.25v-2.5A1.25 1.25 0 0 1 5.25 9.5h3.44l4.53-4.53a.75.75 0 0 1 1.28.53Z"
                    fill="currentColor"
                  />
                  <path
                    d="m18 9 4 4m0-4-4 4"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="1.8"
                  />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="audio-toggle-svg">
                  <path
                    d="M14.5 5.5v13a.75.75 0 0 1-1.28.53L8.69 14.5H5.25A1.25 1.25 0 0 1 4 13.25v-2.5A1.25 1.25 0 0 1 5.25 9.5h3.44l4.53-4.53a.75.75 0 0 1 1.28.53Z"
                    fill="currentColor"
                  />
                  <path
                    d="M18 9.2a4.6 4.6 0 0 1 0 5.6m2.1-8.4a8 8 0 0 1 0 11.2"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="1.8"
                  />
                </svg>
              )}
            </span>
          </button>
        </div>
      ) : null}
      <div className="carousel-stage">
        <button
          type="button"
          className="carousel-arrow carousel-arrow-left"
          onClick={goToPrevious}
          aria-label="Previous photo"
        >
          Prev
        </button>

        <div className="carousel-viewport">
          <AnimatePresence custom={direction} mode="wait">
            <motion.figure
              key={activePhoto.src}
              className="carousel-figure"
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 80 : -80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -80 : 80 }}
              transition={{ duration: 0.32, ease: "easeOut" }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.16}
              onDragEnd={(_, info) => {
                if (info.offset.x <= -swipeThreshold) {
                  goToNext();
                  return;
                }

                if (info.offset.x >= swipeThreshold) {
                  goToPrevious();
                }
              }}
            >
              <button
                type="button"
                className="carousel-image-button"
                onClick={() => setIsOriginalOpen(true)}
                aria-label={`Open full resolution version of ${activeLabel}`}
              >
                {activePhoto.mediaType === "video" ? (
                  <video
                    src={activePhoto.src}
                    className="carousel-video"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                  />
                ) : (
                  <img
                    src={activePhoto.src}
                    alt={activePhoto.alt}
                    className="carousel-image"
                    loading="eager"
                    decoding="async"
                  />
                )}
              </button>
              <figcaption className="carousel-meta">
                <p className="carousel-index">
                  {String(activeIndex + 1).padStart(2, "0")}
                  <span> / {String(photos.length).padStart(2, "0")}</span>
                </p>
                {isTrackStartPhoto ? (
                  <p className="carousel-bgm-name">{activeTrack.name}</p>
                ) : null}
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        <button
          type="button"
          className="carousel-arrow carousel-arrow-right"
          onClick={goToNext}
          aria-label="Next photo"
        >
          Next
        </button>
      </div>

      <div className="carousel-thumbnails" aria-label="Choose a photo">
        {photos.map((photo, index) => (
          <button
            key={photo.src}
            type="button"
            className={`thumbnail-card${index === activeIndex ? " is-active" : ""}`}
            onClick={() => goToIndex(index)}
            aria-label={`View ${photo.alt || (photo.mediaType === "video" ? "video" : "photo")}`}
            aria-pressed={index === activeIndex}
          >
            {photo.mediaType === "video" ? (
              <div className="thumbnail-video-shell">
                <img
                  src={photo.thumb}
                  alt=""
                  className="thumbnail-image"
                  loading="lazy"
                  decoding="async"
                />
                <span className="thumbnail-video-badge" aria-hidden="true">
                  Video
                </span>
              </div>
            ) : (
              <img
                src={photo.thumb}
                alt=""
                className="thumbnail-image"
                loading="lazy"
                decoding="async"
              />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {isOriginalOpen ? (
          <motion.div
            className="original-viewer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={() => setIsOriginalOpen(false)}
          >
            <button
              type="button"
              className="original-close"
              onClick={() => setIsOriginalOpen(false)}
              aria-label="Close full resolution image"
            >
              Close
            </button>
            <motion.figure
              className="original-figure"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              onClick={(event) => event.stopPropagation()}
            >
              {activePhoto.mediaType === "video" ? (
                <video
                  src={activePhoto.original}
                  className="original-video"
                  controls
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                />
              ) : (
                <img
                  src={activePhoto.original}
                  alt={activePhoto.alt}
                  className="original-image"
                  loading="eager"
                  decoding="async"
                />
              )}
              <figcaption className="original-meta">
                <a
                  className="original-link"
                  href={activePhoto.original}
                  target="_blank"
                  rel="noreferrer"
                >
                  {activePhoto.mediaType === "video" ? "Open Video File" : "Open Original File"}
                </a>
              </figcaption>
            </motion.figure>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
