import { useState } from "react";
import { getSession } from "next-auth/react";
import type { JnfFormData } from "@/components/forms/JnfFormPro";
import type { SelectionRound, ProgrammeStipend } from "@/components/forms/shared";
import type { Currency } from "@/components/forms/shared";

export type AutofillStatus = "idle" | "loading" | "success" | "error";

/** Shape returned by the backend /company/jd-parse endpoint */
interface JdExtracted {
  jobTitle?: string | null;
  jobDesignation?: string | null;
  jobLocation?: string | null;
  workMode?: "onsite" | "remote" | "hybrid" | null;
  expectedHires?: number | null;
  joiningMonth?: string | null;
  jobDescription?: string | null;
  skills?: string[];
  currency?: "INR" | "USD" | "EUR" | "GBP" | null;
  ctcAnnual?: number | null;
  stipendMonthly?: number | null;
  bonusAmount?: number | null;
  esopMentioned?: boolean | null;
  esopNotes?: string | null;
  selectionRounds?: string[];
  teamMembers?: number | null;
  roomsRequired?: number | null;
}

const VALID_ROUND_TYPES = [
  "ppt",
  "resume",
  "written_test",
  "aptitude_test",
  "technical_test",
  "group_discussion",
  "hr_interview",
  "technical_interview",
  "psychometric",
  "medical",
  "other",
] as const;

type RoundType = (typeof VALID_ROUND_TYPES)[number];

/**
 * Maps the AI-extracted selectionRounds string array into the
 * full SelectionRound[] structure expected by SelectionProcessBuilder.
 * Rounds not mentioned by the AI are kept but disabled.
 */
function buildSelectionRounds(
  aiRounds: string[],
  existing: SelectionRound[]
): SelectionRound[] {
  const aiSet = new Set(aiRounds.map((r) => r.toLowerCase()));

  return existing.map((round) => ({
    ...round,
    enabled: aiSet.has(round.type),
  }));
}

/**
 * Hook that uploads a JD PDF to the backend AI endpoint,
 * then merges the structured extraction into the JNF form data.
 */
export function useJdAutofill(onFill: (patch: Partial<JnfFormData>) => void) {
  const [status, setStatus] = useState<AutofillStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [missingFields, setMissingFields] = useState<string[]>([]);

  const parseAndFill = async (file: File, currentFormData: JnfFormData) => {
    setStatus("loading");
    setErrorMsg(null);
    setMissingFields([]);

    try {
      const session = await getSession();
      const token = session?.accessToken;
      if (!token) throw new Error("Not authenticated.");

      const isServer = typeof window === "undefined";
      const apiBase = isServer
        ? (process.env.INTERNAL_API_URL ?? "http://127.0.0.1:8000/api")
        : (process.env.NEXT_PUBLIC_API_URL ?? "/api/backend");

      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch(`${apiBase}/company/jd-parse`, {
        method: "POST",
        body: fd,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errPayload = await res.json().catch(() => ({}));
        throw new Error(
          (errPayload as { message?: string }).message ??
            "Could not parse JD. Please fill the form manually."
        );
      }

      const { extracted }: { extracted: JdExtracted } = await res.json();

      // ── Build the formData patch ──────────────────────────────────────
      const patch: Partial<JnfFormData> = {};
      const missing: string[] = [];

      if (extracted.jobTitle)       patch.jobTitle       = extracted.jobTitle;
      if (extracted.jobDesignation) patch.jobDesignation = extracted.jobDesignation;
      if (extracted.jobLocation)    patch.jobLocation    = extracted.jobLocation;
      if (extracted.workMode)       patch.workMode       = extracted.workMode;
      if (extracted.expectedHires != null)
        patch.expectedHires = String(extracted.expectedHires);
      if (extracted.joiningMonth)   patch.joiningMonth   = extracted.joiningMonth;
      if (extracted.jobDescription) patch.jobDescription = extracted.jobDescription;
      if (extracted.skills?.length) patch.skills         = extracted.skills;
      if (extracted.currency)       patch.currency       = extracted.currency;
      if (extracted.teamMembers != null)
        patch.teamMembers   = String(extracted.teamMembers);
      if (extracted.roomsRequired != null)
        patch.roomsRequired = String(extracted.roomsRequired);

      // Track genuinely missing fields
      if (!extracted.jobDesignation)    missing.push("Job Designation");
      if (!extracted.jobLocation)       missing.push("Place of Posting");
      if (!extracted.workMode)          missing.push("Work Mode");
      if (extracted.expectedHires == null) missing.push("Expected Hires");
      if (!extracted.joiningMonth)      missing.push("Joining Month");

      // ── Salary: patch the first enabled programme salary ─────────────
      const annualCtc =
        extracted.ctcAnnual ??
        (extracted.stipendMonthly ? extracted.stipendMonthly * 12 : null);

      if (annualCtc != null) {
        patch.programmeSalaries = currentFormData.programmeSalaries.map(
          (ps, idx) =>
            idx === 0
              ? { ...ps, enabled: true, ctcAnnual: String(annualCtc) }
              : ps
        );
      } else {
        missing.push("CTC / Compensation");
      }

      if (extracted.bonusAmount != null) {
        patch.salaryComponents = {
          ...currentFormData.salaryComponents,
          bonus: String(extracted.bonusAmount),
        };
      }

      // Map ESOP notes to esop field in salary components
      if (extracted.esopMentioned) {
        patch.salaryComponents = {
          ...(patch.salaryComponents ?? currentFormData.salaryComponents),
          esop: extracted.esopNotes ?? "ESOPs included — details shared during PPT",
        };
      }

      // ── Selection rounds ─────────────────────────────────────────────
      if (extracted.selectionRounds?.length) {
        const validAiRounds = extracted.selectionRounds.filter((r): r is RoundType =>
          (VALID_ROUND_TYPES as readonly string[]).includes(r)
        );
        patch.selectionRounds = buildSelectionRounds(
          validAiRounds,
          currentFormData.selectionRounds
        );
      }

      onFill(patch);
      setMissingFields(missing);
      setStatus("success");
    } catch (e) {
      const msg =
        e instanceof Error
          ? e.message
          : "Could not parse JD. Please fill the form manually.";
      setErrorMsg(msg);
      setStatus("error");
    }
  };

  const reset = () => {
    setStatus("idle");
    setErrorMsg(null);
    setMissingFields([]);
  };

  return { status, errorMsg, missingFields, parseAndFill, reset };
}

// ─────────────────────────────────────────────────────────────────────────────
// INF variant — same endpoint, different field mapping
// ─────────────────────────────────────────────────────────────────────────────

/** Minimal shape of InfFormData fields we patch (avoids circular import) */
interface InfFormDataPatch {
  internshipTitle?: string;
  internshipDesignation?: string;
  internshipLocation?: string;
  workMode?: "onsite" | "remote" | "hybrid";
  expectedHires?: string;
  joiningMonth?: string;
  internshipDescription?: string;
  skills?: string[];
  currency?: "INR" | "USD" | "EUR" | "GBP";
  programmeStipends?: ProgrammeStipend[];
  selectionRounds?: SelectionRound[];
  teamMembers?: string;
  roomsRequired?: string;
}

/**
 * Identical to useJdAutofill but maps extracted fields onto InfFormData.
 * internshipTitle  ← jobTitle
 * internshipDescription ← jobDescription
 * baseStipend (monthly) ← stipendMonthly (or ctcAnnual ÷ 12)
 */
export function useInfAutofill(
  onFill: (patch: InfFormDataPatch) => void
) {
  const [status, setStatus] = useState<AutofillStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [missingFields, setMissingFields] = useState<string[]>([]);

  const parseAndFill = async (
    file: File,
    currentProgrammeStipends: ProgrammeStipend[],
    currentSelectionRounds: SelectionRound[]
  ) => {
    setStatus("loading");
    setErrorMsg(null);
    setMissingFields([]);

    try {
      const session = await getSession();
      const token = session?.accessToken;
      if (!token) throw new Error("Not authenticated.");

      const isServer = typeof window === "undefined";
      const apiBase = isServer
        ? (process.env.INTERNAL_API_URL ?? "http://127.0.0.1:8000/api")
        : (process.env.NEXT_PUBLIC_API_URL ?? "/api/backend");

      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch(`${apiBase}/company/jd-parse`, {
        method: "POST",
        body: fd,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errPayload = await res.json().catch(() => ({}));
        throw new Error(
          (errPayload as { message?: string }).message ??
            "Could not parse JD. Please fill the form manually."
        );
      }

      const { extracted }: { extracted: JdExtracted } = await res.json();

      // ── Build INF patch ───────────────────────────────────────────────
      const patch: InfFormDataPatch = {};
      const missing: string[] = [];

      if (extracted.jobTitle)       patch.internshipTitle       = extracted.jobTitle;
      if (extracted.jobDesignation) patch.internshipDesignation = extracted.jobDesignation;
      if (extracted.jobLocation)    patch.internshipLocation    = extracted.jobLocation;
      if (extracted.workMode)       patch.workMode              = extracted.workMode;
      if (extracted.expectedHires != null)
        patch.expectedHires = String(extracted.expectedHires);
      if (extracted.joiningMonth)   patch.joiningMonth          = extracted.joiningMonth;
      if (extracted.jobDescription) patch.internshipDescription = extracted.jobDescription;
      if (extracted.skills?.length) patch.skills                = extracted.skills;
      if (extracted.currency)       patch.currency              = extracted.currency;
      if (extracted.teamMembers != null)
        patch.teamMembers   = String(extracted.teamMembers);
      if (extracted.roomsRequired != null)
        patch.roomsRequired = String(extracted.roomsRequired);

      // Track missing fields
      if (!extracted.jobDesignation)    missing.push("Internship Designation");
      if (!extracted.jobLocation)       missing.push("Place of Posting");
      if (!extracted.workMode)          missing.push("Work Mode");
      if (extracted.expectedHires == null) missing.push("Expected Interns");
      if (!extracted.joiningMonth)      missing.push("Start Month");

      // ── Stipend: monthly stipend → baseStipend on first enabled row ───
      const monthlyStipend =
        extracted.stipendMonthly ??
        (extracted.ctcAnnual ? Math.round(extracted.ctcAnnual / 12) : null);

      if (monthlyStipend != null) {
        patch.programmeStipends = currentProgrammeStipends.map((ps, idx) =>
          idx === 0
            ? {
                ...ps,
                enabled: true,
                baseStipend: String(monthlyStipend),
                total: String(monthlyStipend),
              }
            : ps
        );
      } else {
        missing.push("Stipend / Compensation");
      }

      // ── Selection rounds ─────────────────────────────────────────────
      if (extracted.selectionRounds?.length) {
        const validAiRounds = extracted.selectionRounds.filter((r): r is RoundType =>
          (VALID_ROUND_TYPES as readonly string[]).includes(r)
        );
        patch.selectionRounds = buildSelectionRounds(validAiRounds, currentSelectionRounds);
      }

      onFill(patch);
      setMissingFields(missing);
      setStatus("success");
    } catch (e) {
      const msg =
        e instanceof Error
          ? e.message
          : "Could not parse JD. Please fill the form manually.";
      setErrorMsg(msg);
      setStatus("error");
    }
  };

  const reset = () => {
    setStatus("idle");
    setErrorMsg(null);
    setMissingFields([]);
  };

  return { status, errorMsg, missingFields, parseAndFill, reset };
}
