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

export default function GalleryLightbox({ photos }: GalleryLightboxProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (activeIndex === null) {
      return undefined;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveIndex(null);
      }

      if (event.key === "ArrowRight") {
        setActiveIndex((current) =>
          current === null ? 0 : (current + 1) % photos.length,
        );
      }

      if (event.key === "ArrowLeft") {
        setActiveIndex((current) =>
          current === null
            ? photos.length - 1
            : (current - 1 + photos.length) % photos.length,
        );
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, photos.length]);

  const activePhoto = activeIndex === null ? null : photos[activeIndex];

  return (
    <>
      <div className="gallery-grid">
        {photos.map((photo, index) => (
          <button
            key={photo.path}
            type="button"
            className="gallery-card"
            onClick={() => setActiveIndex(index)}
            aria-label={`Open ${photo.alt}`}
          >
            <img
              src={photo.src}
              alt={photo.alt}
              className="gallery-image"
              loading="lazy"
              decoding="async"
            />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {activePhoto && (
          <motion.div
            className="lightbox-shell"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            onClick={() => setActiveIndex(null)}
          >
            <motion.button
              type="button"
              className="lightbox-close"
              onClick={() => setActiveIndex(null)}
              aria-label="Close image"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              Close
            </motion.button>

            <motion.button
              type="button"
              className="lightbox-arrow lightbox-arrow-left"
              onClick={(event) => {
                event.stopPropagation();
                setActiveIndex((current) =>
                  current === null
                    ? photos.length - 1
                    : (current - 1 + photos.length) % photos.length,
                );
              }}
              aria-label="Previous image"
            >
              Prev
            </motion.button>

            <motion.figure
              className="lightbox-figure"
              initial={{ opacity: 0, scale: 0.98, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 12 }}
              transition={{ duration: 0.26, ease: "easeOut" }}
              onClick={(event) => event.stopPropagation()}
            >
              <img src={activePhoto.src} alt={activePhoto.alt} className="lightbox-image" />
              <figcaption className="lightbox-caption">{activePhoto.alt}</figcaption>
            </motion.figure>

            <motion.button
              type="button"
              className="lightbox-arrow lightbox-arrow-right"
              onClick={(event) => {
                event.stopPropagation();
                setActiveIndex((current) =>
                  current === null ? 0 : (current + 1) % photos.length,
                );
              }}
              aria-label="Next image"
            >
              Next
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
