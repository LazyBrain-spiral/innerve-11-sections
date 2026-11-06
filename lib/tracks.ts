export type BreathingForm =
  | "insect"
  | "mist"
  | "flame"
  | "sound"
  | "stone"
  | "serpent"
  | "love"
  | "wind"
  | "water";

export interface Track {
  name: string;
  form: BreathingForm;
  formJp: string;
  formEn: string;
  /** Path under /public. */
  img: string;
  hashira: string;
  style: string;
  kanji: string;
  /** SVG pattern id defined in components/tracks/PatternDefs.tsx. */
  pat: string;
  desc: string;
}

/** Verbatim content from the static build's data.js → tracks. */
export const tracks: Track[] = [
  {
    name: "Health",
    form: "insect",
    formJp: "蟲の呼吸 · 蝶ノ舞「戯れ」",
    formEn: "Insect Breathing · Butterfly Dance: Caprice",
    img: "/assets/img/chars/shinobu.webp",
    hashira: "Shinobu Kocho",
    style: "Insect Breathing",
    kanji: "蟲",
    pat: "p-insect",
    desc: "Heal, detect, protect. Tech that keeps people alive.",
  },
  {
    name: "AR / VR",
    form: "mist",
    formJp: "霞の呼吸 · 壱ノ型「垂天遠霞」",
    formEn: "Mist Breathing · First Form: Low Clouds, Distant Haze",
    img: "/assets/img/chars/muichiro.webp",
    hashira: "Muichiro Tokito",
    style: "Mist Breathing",
    kanji: "霞",
    pat: "p-mist",
    desc: "Bend what the eye believes. Build worlds inside the world.",
  },
  {
    name: "EduTech",
    form: "flame",
    formJp: "炎の呼吸 · 壱ノ型「不知火」",
    formEn: "Flame Breathing · First Form: Unknowing Fire",
    img: "/assets/img/chars/rengoku.webp",
    hashira: "Kyojuro Rengoku",
    style: "Flame Breathing",
    kanji: "炎",
    pat: "p-flame",
    desc: "Pass the fire on. Tools that make learning burn brighter.",
  },
  {
    name: "GameDev",
    form: "sound",
    formJp: "音の呼吸 · 壱ノ型「轟」",
    formEn: "Sound Breathing · First Form: Roar",
    img: "/assets/img/chars/tengen.webp",
    hashira: "Tengen Uzui",
    style: "Sound Breathing",
    kanji: "音",
    pat: "p-sound",
    desc: "Flamboyant by design. Make something people can't put down.",
  },
  {
    name: "FinTech",
    form: "stone",
    formJp: "岩の呼吸 · 壱ノ型「蛇紋岩・双極」",
    formEn: "Stone Breathing · First Form: Serpentinite Bipolar",
    img: "/assets/img/chars/gyomei.webp",
    hashira: "Gyomei Himejima",
    style: "Stone Breathing",
    kanji: "岩",
    pat: "p-stone",
    desc: "Rock-solid money systems. Payments, credit, inclusion.",
  },
  {
    name: "CyberSec",
    form: "serpent",
    formJp: "蛇の呼吸 · 壱ノ型「委蛇斬り」",
    formEn: "Serpent Breathing · First Form: Winding Serpent Slash",
    img: "/assets/img/chars/obanai.webp",
    hashira: "Obanai Iguro",
    style: "Serpent Breathing",
    kanji: "蛇",
    pat: "p-serpent",
    desc: "Strike unseen. Find the threat before it finds you.",
  },
  {
    name: "BlockChain",
    form: "love",
    formJp: "恋の呼吸 · 壱ノ型「初恋のわななき」",
    formEn: "Love Breathing · First Form: Shivers of First Love",
    img: "/assets/img/chars/mitsuri.webp",
    hashira: "Mitsuri Kanroji",
    style: "Love Breathing",
    kanji: "恋",
    pat: "p-love",
    desc: "Bonds that can't be broken. Trust, chained block by block.",
  },
  {
    name: "Logistics",
    form: "wind",
    formJp: "風の呼吸 · 壱ノ型「塵旋風・削ぎ」",
    formEn: "Wind Breathing · First Form: Dust Whirlwind Cutter",
    img: "/assets/img/chars/sanemi.webp",
    hashira: "Sanemi Shinazugawa",
    style: "Wind Breathing",
    kanji: "風",
    pat: "p-wind",
    desc: "Move faster than the wind. Supply chains, routing, mobility.",
  },
  {
    name: "Defence",
    form: "water",
    formJp: "水の呼吸 · 壱ノ型「水面斬り」",
    formEn: "Water Breathing · First Form: Water Surface Slash",
    img: "/assets/img/chars/giyu.webp",
    hashira: "Giyu Tomioka",
    style: "Water Breathing",
    kanji: "水",
    pat: "p-hex",
    desc: "Dead calm under pressure. Tech that guards the nation.",
  },
];

export const pad = (n: number) => String(n).padStart(2, "0");
