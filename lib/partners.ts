export type Partner = {
  name: string;
  src: string;
  width: number;
  height: number;
  href?: string;
};

export const partners: Partner[] = [
  { name: "USIT", src: "/gallery/usit_logo.svg", width: 923, height: 556 },
  { name: "Euro", src: "/gallery/euro_logo.svg", width: 384, height: 384, href: "https://euroeducation.ro/" },
  { name: "IFALL", src: "/gallery/ifall_logo.svg", width: 417, height: 183, href: "https://ifall.se/" },
  { name: "FAAL", src: "/gallery/faal_logo.svg", width: 417, height: 183, href: "https://faal.org.tr/" },
  { name: "Begin Global", src: "/gallery/Begin_global_logo.svg", width: 1254, height: 1254 },
];
