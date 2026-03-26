import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

type Photo = {
  alt: string;
  path: string;
  src: string;
};

type GalleryLightboxProps = {
  photos: Photo[];
};

const swipeThreshold = 70;

export default function GalleryLightbox({ photos }: GalleryLightboxProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        goToNext();
      }

      if (event.key === "ArrowLeft") {
        goToPrevious();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  const goToIndex = (index: number) => {
    if (index === activeIndex) {
      return;
    }

    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  const goToNext = () => {
    setDirection(1);
    setActiveIndex((current) => (current + 1) % photos.length);
  };

  const goToPrevious = () => {
    setDirection(-1);
    setActiveIndex((current) => (current - 1 + photos.length) % photos.length);
  };

  const activePhoto = photos[activeIndex];

  return (
    <section className="carousel-shell" aria-label="Wedding gallery carousel">
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
              key={activePhoto.path}
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
              <img
                src={activePhoto.src}
                alt={activePhoto.alt}
                className="carousel-image"
                loading="eager"
                decoding="async"
              />
              <figcaption className="carousel-meta">
                <div>
                  <p className="carousel-index">
                    {String(activeIndex + 1).padStart(2, "0")}
                    <span> / {String(photos.length).padStart(2, "0")}</span>
                  </p>
                  <p className="carousel-caption">{activePhoto.alt}</p>
                </div>
                <p className="carousel-hint">Swipe or use arrow keys</p>
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
            key={photo.path}
            type="button"
            className={`thumbnail-card${index === activeIndex ? " is-active" : ""}`}
            onClick={() => goToIndex(index)}
            aria-label={`View ${photo.alt}`}
            aria-pressed={index === activeIndex}
          >
            <img
              src={photo.src}
              alt=""
              className="thumbnail-image"
              loading="lazy"
              decoding="async"
            />
          </button>
        ))}
      </div>
    </section>
  );
}
