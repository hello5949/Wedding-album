export type BgmTrack = {
  name: string;
  src: string;
  startIndex: number;
};

export const bgmTracks: BgmTrack[] = [
  { name: "登入音樂", src: "bgm/1-登入音樂.mp3", startIndex: 0 },
  { name: "自由市場", src: "bgm/2-自由市場.mp3", startIndex: 4 },
  { name: "不夜城", src: "bgm/3-不夜城.mp3", startIndex: 8 },
  { name: "墮落城市", src: "bgm/4-墮落城市.mp3", startIndex: 12 },
  { name: "天空之城", src: "bgm/5-天空之城.mp3", startIndex: 16 },
  { name: "玩具城", src: "bgm/6-玩具城.mp3", startIndex: 20 },
  { name: "西門町", src: "bgm/7-西門町.mp3", startIndex: 24 },
  { name: "魔法森林", src: "bgm/8-魔法森林.mp3", startIndex: 28 },
];
