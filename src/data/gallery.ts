export type GalleryPhoto = {
  alt: string;
  path: string;
};

export const galleryPhotos: GalleryPhoto[] = [
  { path: "photos/41ooxx-00001.jpg", alt: "Wedding portrait 01" },
  { path: "photos/41ooxx-00005.jpg", alt: "Wedding portrait 02" },
  { path: "photos/41ooxx-00011.jpg", alt: "Wedding portrait 03" },
  { path: "photos/41ooxx-00037.jpg", alt: "Wedding portrait 04" },
  { path: "photos/41ooxx-00045.jpg", alt: "Wedding portrait 05" },
  { path: "photos/41ooxx-00054.jpg", alt: "Wedding portrait 06" },
  { path: "photos/41ooxx-00080.jpg", alt: "Wedding portrait 07" },
  { path: "photos/41ooxx-00116.jpg", alt: "Wedding portrait 08" },
  { path: "photos/41ooxx-00138.jpg", alt: "Wedding portrait 09" },
  { path: "photos/41ooxx-00140.jpg", alt: "Wedding portrait 10" },
  { path: "photos/41ooxx-00176.jpg", alt: "Wedding portrait 11" },
  { path: "photos/41ooxx-00218.jpg", alt: "Wedding portrait 12" },
  { path: "photos/41ooxx-00282.jpg", alt: "Wedding portrait 13" },
  { path: "photos/41ooxx-00301.jpg", alt: "Wedding portrait 14" },
  { path: "photos/41ooxx-00304.jpg", alt: "Wedding portrait 15" },
  { path: "photos/41ooxx-00317.jpg", alt: "Wedding portrait 16" },
  { path: "photos/41ooxx-00344.jpg", alt: "Wedding portrait 17" },
  { path: "photos/41ooxx-00353.jpg", alt: "Wedding portrait 18" },
  { path: "photos/41ooxx-00411.jpg", alt: "Wedding portrait 19" },
  { path: "photos/41ooxx-00413.jpg", alt: "Wedding portrait 20" },
  { path: "photos/41ooxx-00449.jpg", alt: "Wedding portrait 21" },
  { path: "photos/41ooxx-00465.jpg", alt: "Wedding portrait 22" },
  { path: "photos/41ooxx-00482.jpg", alt: "Wedding portrait 23" },
  { path: "photos/41ooxx-00504.jpg", alt: "Wedding portrait 24" },
  { path: "photos/41ooxx-00507.jpg", alt: "Wedding portrait 25" },
  { path: "photos/41ooxx-00538.jpg", alt: "Wedding portrait 26" },
  { path: "photos/41ooxx-00553.jpg", alt: "Wedding portrait 27" },
  { path: "photos/41ooxx-00562.jpg", alt: "Wedding portrait 28" },
  { path: "photos/41ooxx-00569.jpg", alt: "Wedding portrait 29" },
  { path: "photos/41ooxx-00585.jpg", alt: "Wedding portrait 30" },
];

export const heroPhoto =
  galleryPhotos.find((photo) => photo.path.endsWith("41ooxx-00116.jpg")) ??
  galleryPhotos[0];
