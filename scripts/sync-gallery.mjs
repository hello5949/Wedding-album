import { copyFile, mkdir, readdir, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const sourceDir = path.join(rootDir, "drive-download-20260326T151214Z-1-001");
const bgmSourceDir = path.join(rootDir, "BGM");
const outputDir = path.join(rootDir, "public", "photos");
const bgmOutputDir = path.join(rootDir, "public", "bgm");
const originalDir = path.join(outputDir, "original");
const webDir = path.join(outputDir, "web");
const thumbDir = path.join(outputDir, "thumbs");
const dataFile = path.join(rootDir, "src", "data", "gallery.ts");
const bgmDataFile = path.join(rootDir, "src", "data", "bgm.ts");
const webWidth = 1800;
const thumbWidth = 480;
const videoPosterWidth = 480;
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
const videoCaptions = {
  "IMG_1945.mp4": "",
};

function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stderr = "";

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(
        new Error(
          `${command} exited with code ${code}${stderr ? `: ${stderr.trim()}` : ""}`,
        ),
      );
    });
  });
}

async function createSilentVideo(sourcePath, outputPath) {
  await runCommand("gst-launch-1.0", [
    "-q",
    "filesrc",
    `location=${sourcePath}`,
    "!",
    "qtdemux",
    "name=demux",
    "demux.video_0",
    "!",
    "queue",
    "!",
    "decodebin",
    "!",
    "videoconvert",
    "!",
    "x264enc",
    "speed-preset=veryfast",
    "tune=zerolatency",
    "!",
    "mp4mux",
    "faststart=true",
    "!",
    "filesink",
    `location=${outputPath}`,
  ]);
}

async function createVideoPoster(sourcePath, outputPath) {
  await runCommand("gst-launch-1.0", [
    "-q",
    "filesrc",
    `location=${sourcePath}`,
    "!",
    "qtdemux",
    "name=demux",
    "demux.video_0",
    "!",
    "queue",
    "!",
    "decodebin",
    "!",
    "videoconvert",
    "!",
    "videoscale",
    "!",
    `video/x-raw,width=${videoPosterWidth}`,
    "!",
    "jpegenc",
    "snapshot=true",
    "quality=85",
    "!",
    "filesink",
    `location=${outputPath}`,
  ]);
}

await mkdir(outputDir, { recursive: true });
await mkdir(bgmOutputDir, { recursive: true });
await mkdir(originalDir, { recursive: true });
await mkdir(webDir, { recursive: true });
await mkdir(thumbDir, { recursive: true });
await mkdir(path.dirname(dataFile), { recursive: true });
await mkdir(path.dirname(bgmDataFile), { recursive: true });

const photoSourceDir = existsSync(sourceDir) ? sourceDir : webDir;
const files = (await readdir(photoSourceDir))
  .sort((left, right) => left.localeCompare(right));
const imageFiles = files
  .filter((file) => file.toLowerCase().endsWith(".jpg"))
  .sort((left, right) => left.localeCompare(right));
const videoFiles = files
  .filter((file) => file.toLowerCase().endsWith(".mp4"))
  .sort((left, right) => left.localeCompare(right));
const resolvedBgmSourceDir = existsSync(bgmSourceDir) ? bgmSourceDir : bgmOutputDir;
const bgmFiles = existsSync(resolvedBgmSourceDir)
  ? (await readdir(resolvedBgmSourceDir))
      .filter((file) => file.toLowerCase().endsWith(".mp3"))
      .sort((left, right) =>
        left.localeCompare(right, undefined, {
          numeric: true,
          sensitivity: "base",
        }),
      )
  : [];

if (photoSourceDir === sourceDir) {
  await Promise.all(
    imageFiles.map(async (file) => {
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

  await Promise.all(
    videoFiles.map(async (file) => {
      const sourcePath = path.join(sourceDir, file);
      const silentPath = path.join(webDir, file);
      const posterPath = path.join(thumbDir, file.replace(/\.mp4$/i, ".jpg"));

      await createSilentVideo(sourcePath, silentPath);
      await createVideoPoster(silentPath, posterPath);
    }),
  );
}

if (resolvedBgmSourceDir === bgmSourceDir) {
  await Promise.all(
    bgmFiles.map(async (file) => {
      await copyFile(path.join(bgmSourceDir, file), path.join(bgmOutputDir, file));
    }),
  );
}

const imageEntries = imageFiles
  .map(
    (file, index) =>
      `  { mediaType: "image", src: "photos/web/${file}", thumb: "photos/thumbs/${file}", original: "photos/original/${file}", alt: "${captions[index] ?? ""}" },`,
  )
  .join("\n");

const videoEntries = videoFiles
  .map((file) => {
    const posterFile = file.replace(/\.mp4$/i, ".jpg");
    return `  { mediaType: "video", src: "photos/web/${file}", thumb: "photos/thumbs/${posterFile}", original: "photos/web/${file}", alt: "${videoCaptions[file] ?? ""}" },`;
  })
  .join("\n");

const entries = [imageEntries, videoEntries].filter(Boolean).join("\n");

const content = `export type GalleryPhoto = {
  mediaType: "image" | "video";
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

const bgmEntries = bgmFiles
  .map((file, index) => {
    const name = file.replace(/^\d+-/, "").replace(/\.mp3$/i, "");
    return `  { name: "${name}", src: "bgm/${file}", startIndex: ${index * 4} },`;
  })
  .join("\n");

const bgmContent = `export type BgmTrack = {
  name: string;
  src: string;
  startIndex: number;
};

export const bgmTracks: BgmTrack[] = [
${bgmEntries}
];
`;

await writeFile(bgmDataFile, bgmContent, "utf8");

console.log(
  `Prepared ${imageFiles.length} images, ${videoFiles.length} videos, and ${bgmFiles.length} BGM tracks.`,
);
