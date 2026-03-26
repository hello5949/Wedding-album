export type GalleryPhoto = {
  alt: string;
  original: string;
  src: string;
  thumb: string;
};

export const galleryPhotos: GalleryPhoto[] = [
  { src: "photos/web/41ooxx-00001.jpg", thumb: "photos/thumbs/41ooxx-00001.jpg", original: "photos/original/41ooxx-00001.jpg", alt: "Wedding portrait 01" },
  { src: "photos/web/41ooxx-00005.jpg", thumb: "photos/thumbs/41ooxx-00005.jpg", original: "photos/original/41ooxx-00005.jpg", alt: "Wedding portrait 02" },
  { src: "photos/web/41ooxx-00011.jpg", thumb: "photos/thumbs/41ooxx-00011.jpg", original: "photos/original/41ooxx-00011.jpg", alt: "Wedding portrait 03" },
  { src: "photos/web/41ooxx-00037.jpg", thumb: "photos/thumbs/41ooxx-00037.jpg", original: "photos/original/41ooxx-00037.jpg", alt: "Wedding portrait 04" },
  { src: "photos/web/41ooxx-00045.jpg", thumb: "photos/thumbs/41ooxx-00045.jpg", original: "photos/original/41ooxx-00045.jpg", alt: "Wedding portrait 05" },
  { src: "photos/web/41ooxx-00054.jpg", thumb: "photos/thumbs/41ooxx-00054.jpg", original: "photos/original/41ooxx-00054.jpg", alt: "Wedding portrait 06" },
  { src: "photos/web/41ooxx-00080.jpg", thumb: "photos/thumbs/41ooxx-00080.jpg", original: "photos/original/41ooxx-00080.jpg", alt: "Wedding portrait 07" },
  { src: "photos/web/41ooxx-00116.jpg", thumb: "photos/thumbs/41ooxx-00116.jpg", original: "photos/original/41ooxx-00116.jpg", alt: "Wedding portrait 08" },
  { src: "photos/web/41ooxx-00138.jpg", thumb: "photos/thumbs/41ooxx-00138.jpg", original: "photos/original/41ooxx-00138.jpg", alt: "Wedding portrait 09" },
  { src: "photos/web/41ooxx-00140.jpg", thumb: "photos/thumbs/41ooxx-00140.jpg", original: "photos/original/41ooxx-00140.jpg", alt: "Wedding portrait 10" },
  { src: "photos/web/41ooxx-00176.jpg", thumb: "photos/thumbs/41ooxx-00176.jpg", original: "photos/original/41ooxx-00176.jpg", alt: "Wedding portrait 11" },
  { src: "photos/web/41ooxx-00218.jpg", thumb: "photos/thumbs/41ooxx-00218.jpg", original: "photos/original/41ooxx-00218.jpg", alt: "Wedding portrait 12" },
  { src: "photos/web/41ooxx-00282.jpg", thumb: "photos/thumbs/41ooxx-00282.jpg", original: "photos/original/41ooxx-00282.jpg", alt: "Wedding portrait 13" },
  { src: "photos/web/41ooxx-00301.jpg", thumb: "photos/thumbs/41ooxx-00301.jpg", original: "photos/original/41ooxx-00301.jpg", alt: "Wedding portrait 14" },
  { src: "photos/web/41ooxx-00304.jpg", thumb: "photos/thumbs/41ooxx-00304.jpg", original: "photos/original/41ooxx-00304.jpg", alt: "Wedding portrait 15" },
  { src: "photos/web/41ooxx-00317.jpg", thumb: "photos/thumbs/41ooxx-00317.jpg", original: "photos/original/41ooxx-00317.jpg", alt: "Wedding portrait 16" },
  { src: "photos/web/41ooxx-00344.jpg", thumb: "photos/thumbs/41ooxx-00344.jpg", original: "photos/original/41ooxx-00344.jpg", alt: "Wedding portrait 17" },
  { src: "photos/web/41ooxx-00353.jpg", thumb: "photos/thumbs/41ooxx-00353.jpg", original: "photos/original/41ooxx-00353.jpg", alt: "Wedding portrait 18" },
  { src: "photos/web/41ooxx-00411.jpg", thumb: "photos/thumbs/41ooxx-00411.jpg", original: "photos/original/41ooxx-00411.jpg", alt: "Wedding portrait 19" },
  { src: "photos/web/41ooxx-00413.jpg", thumb: "photos/thumbs/41ooxx-00413.jpg", original: "photos/original/41ooxx-00413.jpg", alt: "Wedding portrait 20" },
  { src: "photos/web/41ooxx-00449.jpg", thumb: "photos/thumbs/41ooxx-00449.jpg", original: "photos/original/41ooxx-00449.jpg", alt: "Wedding portrait 21" },
  { src: "photos/web/41ooxx-00465.jpg", thumb: "photos/thumbs/41ooxx-00465.jpg", original: "photos/original/41ooxx-00465.jpg", alt: "Wedding portrait 22" },
  { src: "photos/web/41ooxx-00482.jpg", thumb: "photos/thumbs/41ooxx-00482.jpg", original: "photos/original/41ooxx-00482.jpg", alt: "Wedding portrait 23" },
  { src: "photos/web/41ooxx-00504.jpg", thumb: "photos/thumbs/41ooxx-00504.jpg", original: "photos/original/41ooxx-00504.jpg", alt: "Wedding portrait 24" },
  { src: "photos/web/41ooxx-00507.jpg", thumb: "photos/thumbs/41ooxx-00507.jpg", original: "photos/original/41ooxx-00507.jpg", alt: "Wedding portrait 25" },
  { src: "photos/web/41ooxx-00538.jpg", thumb: "photos/thumbs/41ooxx-00538.jpg", original: "photos/original/41ooxx-00538.jpg", alt: "Wedding portrait 26" },
  { src: "photos/web/41ooxx-00553.jpg", thumb: "photos/thumbs/41ooxx-00553.jpg", original: "photos/original/41ooxx-00553.jpg", alt: "Wedding portrait 27" },
  { src: "photos/web/41ooxx-00562.jpg", thumb: "photos/thumbs/41ooxx-00562.jpg", original: "photos/original/41ooxx-00562.jpg", alt: "Wedding portrait 28" },
  { src: "photos/web/41ooxx-00569.jpg", thumb: "photos/thumbs/41ooxx-00569.jpg", original: "photos/original/41ooxx-00569.jpg", alt: "Wedding portrait 29" },
  { src: "photos/web/41ooxx-00585.jpg", thumb: "photos/thumbs/41ooxx-00585.jpg", original: "photos/original/41ooxx-00585.jpg", alt: "Wedding portrait 30" },
];

export const heroPhoto =
  galleryPhotos.find((photo) => photo.src.endsWith("41ooxx-00116.jpg")) ??
  galleryPhotos[0];
