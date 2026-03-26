import { copyFile, mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const sourceDir = path.join(rootDir, "drive-download-20260326T151214Z-1-001");
const outputDir = path.join(rootDir, "public", "photos");
const originalDir = path.join(outputDir, "original");
const webDir = path.join(outputDir, "web");
const thumbDir = path.join(outputDir, "thumbs");
const dataFile = path.join(rootDir, "src", "data", "gallery.ts");
const webWidth = 1800;
const thumbWidth = 480;
const captions = [
  "晨光裡的回眸",
  "安靜相依",
  "剛剛好的笑意",
  "風景與我們",
  "靠近一點點",
  "眼神停留的瞬間",
  "輕輕牽著手",
  "把溫柔收進畫面",
  "白紗與光",
  "笑著看向你",
  "不需要太多言語",
  "一起走過的節奏",
  "把日常拍成浪漫",
  "留白裡的默契",
  "剛好的距離",
  "你在我身旁",
  "安靜也很動人",
  "風吹過來的時候",
  "彼此眼中的光",
  "把此刻留住",
  "慢慢走 慢慢愛",
  "今天很值得紀念",
  "像電影的一格",
  "把喜歡寫在臉上",
  "微光下的擁抱",
  "一點點俏皮",
  "柔軟的輪廓",
  "看向未來的方向",
  "並肩的安心感",
  "故事停在最美的地方",
];

await mkdir(outputDir, { recursive: true });
await mkdir(originalDir, { recursive: true });
await mkdir(webDir, { recursive: true });
await mkdir(thumbDir, { recursive: true });
await mkdir(path.dirname(dataFile), { recursive: true });

const photoSourceDir = existsSync(sourceDir) ? sourceDir : webDir;
const files = (await readdir(photoSourceDir))
  .filter((file) => file.toLowerCase().endsWith(".jpg"))
  .sort((left, right) => left.localeCompare(right));

if (photoSourceDir === sourceDir) {
  await Promise.all(
    files.map(async (file) => {
      const sourcePath = path.join(sourceDir, file);
      const originalPath = path.join(originalDir, file);
      const webPath = path.join(webDir, file);
      const thumbPath = path.join(thumbDir, file);

      await copyFile(sourcePath, originalPath);

      await sharp(sourcePath)
        .rotate()
        .resize({ width: webWidth, withoutEnlargement: true })
        .jpeg({ quality: 78, mozjpeg: true })
        .toFile(webPath);

      await sharp(sourcePath)
        .rotate()
        .resize({ width: thumbWidth, withoutEnlargement: true })
        .jpeg({ quality: 62, mozjpeg: true })
        .toFile(thumbPath);
    }),
  );
}

const entries = files
  .map(
    (file, index) =>
      `  { src: "photos/web/${file}", thumb: "photos/thumbs/${file}", original: "photos/original/${file}", alt: "${captions[index] ?? `照片 ${String(index + 1).padStart(2, "0")}`}" },`,
  )
  .join("\n");

const content = `export type GalleryPhoto = {
  alt: string;
  original: string;
  src: string;
  thumb: string;
};

export const galleryPhotos: GalleryPhoto[] = [
${entries}
];

export const heroPhoto =
  galleryPhotos.find((photo) => photo.src.endsWith("41ooxx-00116.jpg")) ??
  galleryPhotos[0];
`;

await writeFile(dataFile, content, "utf8");

console.log(`Prepared ${files.length} optimized photos and updated src/data/gallery.ts.`);
