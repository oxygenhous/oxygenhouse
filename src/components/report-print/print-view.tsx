import type { Hospital, Report } from "@/lib/types";

const MONTH_NAMES = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
];

type PageConfig = {
  sectionKey: string;
  image: string;
  mandatory: boolean;
};

const PAGES: PageConfig[] = [
  { sectionKey: "air_plant", image: "/report-assets/page-air-plant.png", mandatory: true },
  { sectionKey: "vacuum_plant", image: "/report-assets/page-vacuum-plant.png", mandatory: false },
  { sectionKey: "oxygen_plant", image: "/report-assets/page-liquid-oxygen-tank.png", mandatory: true },
  { sectionKey: "oxygen_manifold_automatic", image: "/report-assets/page-o2-auto-manifold.png", mandatory: true },
  { sectionKey: "oxygen_manifold_manual", image: "/report-assets/page-o2-manual-manifold.png", mandatory: false },
  { sectionKey: "n2o_manifold_automatic", image: "/report-assets/page-n2o-auto-manifold.png", mandatory: false },
  { sectionKey: "air_manual_manifold", image: "/report-assets/page-air-manual-manifold.png", mandatory: false },
  { sectionKey: "oxygen_generator", image: "/report-assets/page-oxygen-generator.png", mandatory: false },
];

function isEnabled(sections: Record<string, unknown>, page: PageConfig): boolean {
  if (page.mandatory) return true;
  const value = sections[page.sectionKey] as { mandatory?: boolean } | undefined;
  return Boolean(value?.mandatory);
}

function formatDate(report: Report): string {
  const d = new Date(report.report_date);
  return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getFullYear()} (${MONTH_NAMES[report.month - 1]} ${report.year})`;
}

function HeaderOverlay({ hospital, report }: { hospital: Hospital; report: Report }) {
  return (
    <>
      {/* HOSPITAL NAME */}
      <span className="absolute text-[9pt] font-medium" style={{ top: "6.8%", left: "22%", right: "50%" }}>
        {hospital.name}
      </span>
      {/* CONTRACTOR NAME */}
      <span className="absolute text-[9pt] font-medium" style={{ top: "9.5%", left: "22%", right: "50%" }}>
        {hospital.contractor_name || ""}
      </span>
      {/* DATE */}
      <span className="absolute text-[9pt] font-medium" style={{ top: "5.2%", right: "3%", textAlign: "left" }}>
        {formatDate(report)}
      </span>
      {/* CITY / LOCATION */}
      <span className="absolute text-[9pt] font-medium" style={{ top: "7.6%", right: "3%", textAlign: "left" }}>
        {[hospital.city, hospital.governorate].filter(Boolean).join(" - ") || ""}
      </span>
    </>
  );
}

function SignatureOverlay({ report }: { report: Report }) {
  const sig = (report.sections.signatures as Record<string, string>) ?? {};
  return (
    <>
      {/* GAS/IGAS ENG NAME */}
      <span className="absolute text-[8pt]" style={{ bottom: "7.8%", left: "18%", right: "52%" }}>
        {sig.igas_eng_name || ""}
      </span>
      {/* CONT ENG NAME */}
      <span className="absolute text-[8pt]" style={{ bottom: "6.2%", left: "18%", right: "52%" }}>
        {sig.contractor_eng_name || ""}
      </span>
      {/* M.O.H ENG NAME */}
      <span className="absolute text-[8pt]" style={{ bottom: "4.6%", left: "18%", right: "52%" }}>
        {sig.moh_eng_name || ""}
      </span>
      {/* GAS/IGAS ENG SIGNATURE */}
      <span className="absolute text-[8pt]" style={{ bottom: "7.8%", left: "68%", right: "3%" }}>
        {sig.igas_eng_signature || ""}
      </span>
      {/* CONT ENG SIGNATURE */}
      <span className="absolute text-[8pt]" style={{ bottom: "6.2%", left: "68%", right: "3%" }}>
        {sig.contractor_eng_signature || ""}
      </span>
      {/* M.O.H ENG SIGNATURE */}
      <span className="absolute text-[8pt]" style={{ bottom: "4.6%", left: "68%", right: "3%" }}>
        {sig.moh_eng_signature || ""}
      </span>
    </>
  );
}

function RecommendationOverlay({ report }: { report: Report }) {
  const rec = (report.sections.recommendation as string) || "";
  const notes = (report.sections.notes as string) || "";
  return (
    <>
      <span className="absolute text-[7pt] whitespace-pre-wrap overflow-hidden" style={{ bottom: "12%", left: "3%", right: "52%", maxHeight: "5%" }}>
        {rec}
      </span>
      <span className="absolute text-[7pt] whitespace-pre-wrap overflow-hidden" style={{ bottom: "12%", left: "52%", right: "3%", maxHeight: "5%" }}>
        {notes}
      </span>
    </>
  );
}

export function PrintView({
  hospital,
  report,
}: {
  hospital: Hospital;
  report: Report;
}) {
  const sections = report.sections ?? {};
  const enabledPages = PAGES.filter((p) => isEnabled(sections, p));

  return (
    <div className="space-y-6 print:space-y-0">
      {/* Cover page */}
      <div className="print-page relative mx-auto w-[210mm] bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/report-assets/cover-page.png"
          alt="Medical Gas Maintenance Report"
          className="w-full h-auto block"
        />
      </div>

      {/* Section pages — each is the original ministry image with data overlaid */}
      {enabledPages.map((page) => (
        <div key={page.sectionKey} className="print-page relative mx-auto w-[210mm] bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={page.image}
            alt={page.sectionKey}
            className="w-full h-auto block"
          />
          <div className="absolute inset-0">
            <HeaderOverlay hospital={hospital} report={report} />
            <SignatureOverlay report={report} />
            <RecommendationOverlay report={report} />
          </div>
        </div>
      ))}
    </div>
  );
}
