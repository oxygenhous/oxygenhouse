export type Hospital = {
  id: string;
  name: string;
  city: string | null;
  governorate: string | null;
  contractor_name: string | null;
  created_at: string;
};

export type Report = {
  id: string;
  hospital_id: string;
  report_date: string;
  month: number;
  year: number;
  engineer_id: string;
  sections: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};
