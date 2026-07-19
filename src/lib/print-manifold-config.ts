// Overlay positions (in % of the cropped illustration image) for the two
// fields that sit inside the original artwork on manifold pages.
export type Box = { left: number; top: number; width: number; height: number };

export type ManifoldPrintConfig = {
  sectionKey: string;
  image: string;
  cylinderLabel: string;
  cylinderCount: number;
  changeoverLabel: string;
  manufacturerBox: Box;
  serialBox: Box;
};

export const MANIFOLD_PRINT_CONFIGS: ManifoldPrintConfig[] = [
  {
    sectionKey: "oxygen_manifold_automatic",
    image: "/report-assets/o2-auto-manifold.png",
    cylinderLabel: "O2",
    cylinderCount: 4,
    changeoverLabel: "AUTOMATIC CHANGEOVER",
    manufacturerBox: { left: 35.7, top: 58.6, width: 19.8, height: 9.8 },
    serialBox: { left: 35.7, top: 84.0, width: 19.8, height: 9.8 },
  },
  {
    sectionKey: "oxygen_manifold_manual",
    image: "/report-assets/o2-manual-manifold.png",
    cylinderLabel: "O2",
    cylinderCount: 4,
    changeoverLabel: "REGULATOR CHANGEOVER",
    manufacturerBox: { left: 8.9, top: 49.4, width: 18.0, height: 10.7 },
    serialBox: { left: 8.9, top: 89.1, width: 18.0, height: 10.7 },
  },
  {
    sectionKey: "n2o_manifold_automatic",
    image: "/report-assets/n2o-auto-manifold.png",
    cylinderLabel: "N2O",
    cylinderCount: 4,
    changeoverLabel: "AUTOMATIC CHANGEOVER",
    manufacturerBox: { left: 35.7, top: 58.6, width: 19.8, height: 9.8 },
    serialBox: { left: 35.7, top: 84.0, width: 19.8, height: 9.8 },
  },
  {
    sectionKey: "air_manual_manifold",
    image: "/report-assets/air-manual-manifold.png",
    cylinderLabel: "MA4",
    cylinderCount: 4,
    changeoverLabel: "REGULATOR CHANGEOVER",
    manufacturerBox: { left: 8.9, top: 49.4, width: 18.0, height: 10.7 },
    serialBox: { left: 8.9, top: 89.1, width: 18.0, height: 10.7 },
  },
];

export const SECTION_PRINT_TITLES: Record<
  string,
  { en: string; ar: string }
> = {
  oxygen_plant: { en: "LIQUID OXYGEN TANK", ar: "تانك الاكسجين السائل" },
  oxygen_manifold_automatic: {
    en: "OXYGEN AUTOMATIC MANIFOLD",
    ar: "موزع الاكسجين الطبي",
  },
  oxygen_manifold_manual: {
    en: "OXYGEN MANUAL MANIFOLD",
    ar: "موزع الأكسجين الإحتياطى",
  },
  n2o_manifold_automatic: {
    en: "NITROUS OXIDE AUTOMATIC MANIFOLD",
    ar: "موزع اكسيد النيتروز الاوتوماتيك",
  },
  air_plant: { en: "MEDICAL AIR PLANT", ar: "كومبريسور الهواء الطبي" },
  air_manual_manifold: {
    en: "MEDICAL AIR MANUAL MANIFOLD",
    ar: "موزع الهواء الطبي الاحتياطى",
  },
  vacuum_plant: { en: "MEDICAL VACUUM PLANT", ar: "وحدة التفريغ الهوائي" },
  oxygen_generator: { en: "OXYGEN GENERATOR", ar: "مولد الاكسجين" },
  regulators_settings: {
    en: "REGULATORS SETTINGS",
    ar: "إعدادات المنظمات",
  },
};
