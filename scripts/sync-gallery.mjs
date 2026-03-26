import { copyFile, mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const sourceDir = path.join(rootDir, "drive-download-20260326T151214Z-1-001");
const outputDir = path.join(rootDir, "public", "photos");
const dataFile = path.join(rootDir, "src", "data", "gallery.ts");

await mkdir(outputDir, { recursive: true });
await mkdir(path.dirname(dataFile), { recursive: true });

const photoSourceDir = existsSync(sourceDir) ? sourceDir : outputDir;
const files = (await readdir(photoSourceDir))
  .filter((file) => file.toLowerCase().endsWith(".jpg"))
  .sort((left, right) => left.localeCompare(right));

if (photoSourceDir === sourceDir) {
  await Promise.all(
    files.map((file) =>
      copyFile(path.join(sourceDir, file), path.join(outputDir, file)),
    ),
  );
}

const entries = files
  .map(
    (file, index) =>
      `  { path: "photos/${file}", alt: "Wedding portrait ${String(index + 1).padStart(2, "0")}" },`,
  )
  .join("\n");

const content = `export type GalleryPhoto = {
  alt: string;
  path: string;
};

export const galleryPhotos: GalleryPhoto[] = [
${entries}
];

export const heroPhoto =
  galleryPhotos.find((photo) => photo.path.endsWith("41ooxx-00116.jpg")) ??
  galleryPhotos[0];
`;

await writeFile(dataFile, content, "utf8");

console.log(`Prepared ${files.length} photos and updated src/data/gallery.ts.`);
