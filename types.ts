
export interface GhgTableRow {
  category: string; // e.g., "範疇一 (tCO2e)", "範疇一+二：溫室氣體排放密集度(公噸/千元)"
  values: string[]; // e.g., ["10500", "11200", "12000"]
}

export interface GhgTableData {
  found: boolean;
  page: string;
  scope1And2: {
    years: string[];
    rows: GhgTableRow[];
  };
  scope3: {
    years: string[];
    rows: GhgTableRow[];
  };
}

export interface CompanyInfo {
  code: string;      // e.g., "2330"
  name: string;      // e.g., "台積電"
  year: string;      // e.g., "2023"
}

export interface AnalysisResult {
  companyInfo: CompanyInfo;
  ghgData: GhgTableData; // Renamed from ghgTable
  thirdPartyAssurance: {
    hasAssurance: boolean;
    page: string;
    provider: string;
    details: string;
  };
  reductionTargets: {
    hasTargets: boolean;
    page: string;
    targets: string;
    details: string;
  };
}

export interface FileState {
  file: File | null;
  base64: string | null;
}

export interface VerificationItem {
  category: string;
  pdfValue: string;
  twseValue: string;
  mopsValue: string;
  mopsPage: string;
  isMatch: boolean;
  status: 'match' | 'partial' | 'mismatch';
}

export interface VerificationResult {
  targetYear: string;
  items: VerificationItem[];
}
