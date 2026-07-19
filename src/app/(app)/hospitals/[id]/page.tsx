import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createReport, updateHospital } from "../../actions";
import type { Hospital, Report } from "@/lib/types";

const MONTH_NAMES = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
];

export default async function HospitalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: hospital } = await supabase
    .from("hospitals")
    .select("*")
    .eq("id", id)
    .single<Hospital>();

  if (!hospital) notFound();

  const { data: reports } = await supabase
    .from("reports")
    .select("*")
    .eq("hospital_id", id)
    .order("year", { ascending: false })
    .order("month", { ascending: false })
    .returns<Report[]>();

  const updateHospitalWithId = updateHospital.bind(null, hospital.id);
  const createReportWithId = createReport.bind(null, hospital.id);

  return (
    <div className="space-y-6 animate-[fadeIn_0.4s_ease-out]">
      {/* Back button */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-bold text-slate-600 shadow-sm hover:bg-slate-50 hover:text-slate-800 transition-all"
        >
          <span>&larr;</span>
          <span>العودة للمستشفيات</span>
        </Link>
      </div>

      {/* Hospital Hero Card */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm border-r-4 border-r-teal-600 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex rounded-lg bg-teal-50 px-2 py-0.5 text-[11px] font-bold text-teal-700">
              ملف مستشفى
            </span>
            {hospital.city && (
              <span className="inline-flex rounded-lg bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-500">
                {hospital.city}
              </span>
            )}
          </div>
          
          <h1 className="text-2xl font-extrabold text-slate-800">{hospital.name}</h1>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-semibold text-slate-500">
            {hospital.governorate && (
              <span className="flex items-center gap-1">
                <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {hospital.governorate}
              </span>
            )}
            {hospital.contractor_name && (
              <span className="flex items-center gap-1">
                <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                المقاول: {hospital.contractor_name}
              </span>
            )}
          </div>
        </div>

        <form action={createReportWithId} className="shrink-0">
          <button
            type="submit"
            className="w-full md:w-auto rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 px-5 py-3 text-sm font-bold text-white shadow-md shadow-teal-600/10 hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            إنشاء تقرير صيانة جديد
          </button>
        </form>
      </div>

      {/* Reports Directory Section */}
      <div className="space-y-3">
        <h2 className="text-lg font-extrabold text-slate-800">تقارير الصيانة الدورية</h2>
        
        <div className="grid grid-cols-1 gap-3">
          {reports?.length ? (
            reports.map((report) => (
              <Link
                key={report.id}
                href={`/hospitals/${hospital.id}/reports/${report.id}`}
                className="group flex items-center justify-between p-4 bg-white hover:bg-teal-50/10 border border-slate-100 hover:border-teal-500/20 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-500 group-hover:bg-teal-600 group-hover:text-white transition-all shadow-sm">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  
                  <div>
                    <h3 className="font-extrabold text-slate-800 group-hover:text-teal-700 transition-colors">
                      تقرير {MONTH_NAMES[report.month - 1]} {report.year}
                    </h3>
                    <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
                      تاريخ التقرير: {new Date(report.report_date).toLocaleDateString("ar-EG")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="hidden sm:inline-flex rounded-lg bg-emerald-50 border border-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                    مكتمل / جاهز للطباعة
                  </span>
                  
                  <span className="text-slate-400 group-hover:text-teal-600 font-bold transition-transform group-hover:translate-x-[-3px]">
                    فتح وتعديل &larr;
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm font-semibold text-slate-500">
              لا توجد أي تقارير صيانة مسجلة لهذه المستشفى بعد.
            </div>
          )}
        </div>
      </div>

      {/* Edit Hospital Details Panel */}
      <details className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300">
        <summary className="flex cursor-pointer items-center justify-between p-5 font-extrabold text-slate-700 bg-slate-50/50 hover:bg-slate-50 select-none list-none transition-colors">
          <div className="flex items-center gap-2">
            <svg className="h-4.5 w-4.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>تعديل بيانات وملف المستشفى</span>
          </div>
          <svg className="h-5 w-5 text-slate-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <div className="border-t border-slate-100 p-5 bg-white">
          <form action={updateHospitalWithId} className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-slate-600">اسم المستشفى بالكامل *</label>
              <input
                name="name"
                required
                defaultValue={hospital.name}
                placeholder="اسم المستشفى"
                className="rounded-xl border border-slate-200 bg-slate-50/30 px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-500/10 transition-all"
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600">المدينة</label>
              <input
                name="city"
                defaultValue={hospital.city ?? ""}
                placeholder="المدينة"
                className="rounded-xl border border-slate-200 bg-slate-50/30 px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-500/10 transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600">المحافظة</label>
              <input
                name="governorate"
                defaultValue={hospital.governorate ?? ""}
                placeholder="المحافظة"
                className="rounded-xl border border-slate-200 bg-slate-50/30 px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-500/10 transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-slate-600">اسم مقاول المشروع</label>
              <input
                name="contractor_name"
                defaultValue={hospital.contractor_name ?? ""}
                placeholder="اسم المقاول (افتراضي)"
                className="rounded-xl border border-slate-200 bg-slate-50/30 px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-500/10 transition-all"
              />
            </div>

            <button
              type="submit"
              className="mt-2 sm:col-span-2 rounded-xl bg-slate-800 hover:bg-slate-700 py-3 text-sm font-bold text-white shadow-md transition-all active:scale-[0.98] cursor-pointer text-center"
            >
              حفظ التعديلات الجديدة
            </button>
          </form>
        </div>
      </details>
    </div>
  );
}
