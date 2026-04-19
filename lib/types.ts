/* ─── Shared TypeScript types for FormPilot ─── */

/** Field types supported in form builder */
export type FieldType = "short_text" | "long_text" | "mcq" | "rating" | "file_upload";

/** A single form field definition (stored in Form.schema JSON) */
export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  /** MCQ options list */
  options?: string[];
  /** Rating field labels */
  minLabel?: string;
  maxLabel?: string;
  /** File upload config */
  allowedFileTypes?: ("pdf" | "image" | "any")[];
}

/** Form data shape (mirrors Prisma Form model) */
export interface FormData {
  id: string;
  orgId: string;
  slug: string;
  title: string;
  description: string | null;
  schema: FormField[];
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    responses: number;
  };
}

/** Response data shape */
export interface ResponseData {
  id: string;
  formId: string;
  answers: Record<string, unknown>;
  timeTakenSec: number | null;
  completedAt: Date;
}

/** AI Summary shape */
export interface AiSummaryData {
  id: string;
  formId: string;
  summary: string;
  themes: string[];
  sentiment: "positive" | "neutral" | "negative";
  actionItems: string[];
  generatedAt: Date;
}

/** Organization shape */
export interface OrgData {
  id: string;
  clerkOrgId: string;
  name: string;
  logoUrl: string | null;
  accentColor: string;
  createdAt: Date;
}

/** API Key (safe shape — never includes the raw key) */
export interface ApiKeyData {
  id: string;
  orgId: string;
  label: string | null;
  lastFour: string;
  lastUsedAt: Date | null;
  createdAt: Date;
}

/** Dashboard metric card */
export interface MetricCardData {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    positive: boolean;
  };
}

/** Nav item for sidebar */
export interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  active?: boolean;
}
