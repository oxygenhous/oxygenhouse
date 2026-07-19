import type { Hospital, Report } from "@/lib/types";

const MONTH_NAMES = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
];

export function PrintPage({
  hospital,
  report,
  titleEn,
  titleAr,
  pageNumber,
  totalPages,
  children,
}: {
  hospital: Hospital;
  report: Report;
  titleEn: string;
  titleAr: string;
  pageNumber: number;
  totalPages: number;
  children: React.ReactNode;
}) {
  return (
    <div className="print-page relative mx-auto w-[625pt] bg-white p-[18pt] text-black">
      <div className="flex items-start justify-between border-b border-gray-400 pb-2">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/report-assets/logo.png"
            alt="iGAS"
            className="h-[75pt] w-auto"
          />
          <div className="text-[9pt] leading-6">
            <p>
              <span className="font-bold">HOSPITAL NAME: </span>
              {hospital.name}
            </p>
            <p>
              <span className="font-bold">CONTRACTOR NAME: </span>
              {hospital.contractor_name || "—"}
            </p>
          </div>
        </div>
        <div className="text-left text-[9pt]">
          <div className="mb-1 border border-gray-400 bg-gray-300 px-4 py-1 text-center text-[11pt] font-bold">
            MEDICAL GAS MAINTENANCE CHECK LIST
          </div>
          <p>
            <span className="font-bold">DATE: </span>
            {new Date(report.report_date).toLocaleDateString("en-GB")} (
            {MONTH_NAMES[report.month - 1]} {report.year})
          </p>
          <p>
            <span className="font-bold">CITY / LOCATION: </span>
            {[hospital.city, hospital.governorate].filter(Boolean).join(" - ") || "—"}
          </p>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between border border-gray-500 bg-gray-300 px-3 py-1.5">
        <span className="text-[12pt] font-bold">{titleEn}</span>
        <span className="text-[11pt]">{titleAr}</span>
      </div>

      <div className="min-h-[420pt] py-3">{children}</div>

      <div className="mt-2 grid grid-cols-2 gap-3">
        <div>
          <div className="border border-gray-500 bg-gray-300 px-2 py-1 text-center text-[10pt] font-bold">
            RECOMMENDATION
          </div>
          <div className="min-h-[50pt] border border-t-0 border-gray-500 p-2 text-[9pt] whitespace-pre-wrap">
            {(report.sections.recommendation as string) || ""}
          </div>
        </div>
        <div>
          <div className="border border-gray-500 bg-gray-300 px-2 py-1 text-center text-[10pt] font-bold">
            NOTES
          </div>
          <div className="min-h-[50pt] border border-t-0 border-gray-500 p-2 text-[9pt] whitespace-pre-wrap">
            {(report.sections.notes as string) || ""}
          </div>
        </div>
      </div>

      <SignatureBlock report={report} />

      <div className="mt-3 border-t border-gray-400 pt-2 text-center text-[8pt] leading-4 text-gray-700">
        <p>Cairo - Egypt : 21 Hafez Al - Abhar Street</p>
        <p>02 / 4872003&nbsp;&nbsp;&nbsp;&nbsp;02 / 26821616</p>
        <p>01271332581 - 01032744799 - 01009084613 - 01015013648</p>
        <p>Giza - Egypt : El Nozha Boulak El Dakrour</p>
        <div className="mx-auto mt-1 flex h-[14pt] w-[14pt] items-center justify-center rounded-full bg-black text-[8pt] text-white">
          {pageNumber}
        </div>
      </div>
      <span className="sr-only">
        page {pageNumber} of {totalPages}
      </span>
    </div>
  );
}

function SignatureBlock({ report }: { report: Report }) {
  const sig = (report.sections.signatures as Record<string, string>) ?? {};
  return (
    <div className="mt-2 grid grid-cols-2 gap-3 text-[9pt]">
      <div className="divide-y divide-gray-500 border border-gray-500">
        <div className="px-2 py-1">
          <span className="font-bold">IGAS ENG NAME: </span>
          {sig.igas_eng_name || ""}
        </div>
        <div className="px-2 py-1">
          <span className="font-bold">CONT ENG NAME: </span>
          {sig.contractor_eng_name || ""}
        </div>
        <div className="px-2 py-1">
          <span className="font-bold">M.O.H ENG NAME: </span>
          {sig.moh_eng_name || ""}
        </div>
      </div>
      <div className="divide-y divide-gray-500 border border-gray-500">
        <div className="px-2 py-1">
          <span className="font-bold">IGAS ENG SIGNATURE: </span>
          {sig.igas_eng_signature || ""}
        </div>
        <div className="px-2 py-1">
          <span className="font-bold">CONT ENG SIGNATURE: </span>
          {sig.contractor_eng_signature || ""}
        </div>
        <div className="px-2 py-1">
          <span className="font-bold">M.O.H ENG SIGNATURE: </span>
          {sig.moh_eng_signature || ""}
        </div>
      </div>
    </div>
  );
}
