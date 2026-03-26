import { motion } from "framer-motion";

type MotionHeroProps = {
  eyebrow: string;
  title: string;
  body: string;
};

export default function MotionHero({
  eyebrow,
  title,
  body,
}: MotionHeroProps) {
  return (
    <div className="motion-hero">
      <motion.p
        className="hero-eyebrow"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {eyebrow}
      </motion.p>
      <motion.h1
        className="hero-title"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, delay: 0.08, ease: "easeOut" }}
      >
        {title}
      </motion.h1>
      <motion.p
        className="hero-body"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.16, ease: "easeOut" }}
      >
        {body}
      </motion.p>
    </div>
  );
}
