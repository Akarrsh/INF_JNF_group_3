"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  ButtonBase,
  Chip,
  CircularProgress,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
  alpha,
  Radio,
  RadioGroup,
} from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import SchoolIcon from "@mui/icons-material/School";
import PaidIcon from "@mui/icons-material/Paid";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DescriptionIcon from "@mui/icons-material/Description";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SaveIcon from "@mui/icons-material/Save";
import SendIcon from "@mui/icons-material/Send";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";

import {
  FormSection,
  SkillsTagInput,
  EligibilityGrid,
  SelectionProcessBuilder,
  StipendGrid,
  DeclarationChecklist,
  InfPreview,
  defaultProgrammes,
  defaultRounds,
  defaultProgrammeStipends,
  mergeCustomBranchesIntoProgrammes,
} from "./shared";
import type {
  Currency,
  ProgrammeEligibility,
  ProgrammeBranchGroup,
  ProgrammeBranchStateGroup,
  SelectionRound,
  ProgrammeStipend,
} from "./shared";
import { companyApi, companyFileUpload } from "@/lib/companyApi";
import { useInfAutofill } from "@/lib/useJdAutofill";

interface InfFormData {
  // Internship Details
  internshipTitle: string;
  internshipDesignation: string;
  internshipLocation: string;
  workMode: "onsite" | "remote" | "hybrid";
  expectedHires: string;
  minimumHires: string;
  duration: string;
  joiningMonth: string;
  skills: string[];
  internshipDescription: string;
  additionalInfo: string;
  registrationLink: string;

  // Eligibility
  eligibility: ProgrammeEligibility[];
  globalCgpa: string;
  globalBacklogs: boolean;
  genderFilter: "all" | "male" | "female";
  slpRequirement: string;

  // Stipend
  currency: Currency;
  stipendSameForAll: boolean;
  programmeStipends: ProgrammeStipend[];
  ppoProvision: boolean;
  ppoCtc: string;

  // Selection Process
  selectionRounds: SelectionRound[];
  teamMembers: string;
  roomsRequired: string;

  // Declaration
  declarations: {
    aipc: boolean;
    shortlistCriteria: boolean;
    infoVerified: boolean;
    consentLogo: boolean;
    confirmAccuracy: boolean;
    resultsViaCdc: boolean;
  };
  signatory: {
    name: string;
    designation: string;
    date: string;
  };
}

const initialFormData: InfFormData = {
  internshipTitle: "",
  internshipDesignation: "",
  internshipLocation: "",
  workMode: "onsite",
  expectedHires: "",
  minimumHires: "",
  duration: "",
  joiningMonth: "",
  skills: [],
  internshipDescription: "",
  additionalInfo: "",
  registrationLink: "",
  eligibility: defaultProgrammes,
  globalCgpa: "7.0",
  globalBacklogs: false,
  genderFilter: "all",
  slpRequirement: "",
  currency: "INR",
  stipendSameForAll: true,
  programmeStipends: defaultProgrammeStipends,
  ppoProvision: false,
  ppoCtc: "",
  selectionRounds: defaultRounds,
  teamMembers: "",
  roomsRequired: "",
  declarations: {
    aipc: false,
    shortlistCriteria: false,
    infoVerified: false,
    consentLogo: false,
    confirmAccuracy: false,
    resultsViaCdc: false,
  },
  signatory: {
    name: "",
    designation: "",
    date: new Date().toISOString().split("T")[0],
  },
};

const tabs = [
  { label: "Internship Details", icon: <WorkIcon /> },
  { label: "Eligibility", icon: <SchoolIcon /> },
  { label: "Stipend", icon: <PaidIcon /> },
  { label: "Selection", icon: <AssignmentIcon /> },
  { label: "Declaration", icon: <DescriptionIcon /> },
  { label: "Preview & Submit", icon: <CheckCircleIcon /> },
];

type InfFormProProps = {
  initialData?: Partial<InfFormData> & { id?: number };
  onSaved?: (id: number) => void;
  isAdminMode?: boolean;
  onAdminSave?: (payload: any) => Promise<void>;
};

export default function InfFormPro({ initialData, onSaved, isAdminMode, onAdminSave }: InfFormProProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState<InfFormData>(() => ({
    ...initialFormData,
    ...initialData,
  }));
  const [draftId, setDraftId] = useState<number | undefined>(initialData?.id);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" | "info" }>({
    open: false,
    message: "",
    severity: "info",
  });
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; url: string }>>([]);

  const { status: aiStatus, errorMsg: aiError, missingFields, parseAndFill } = useInfAutofill(
    (patch) => setFormData((prev) => ({ ...prev, ...patch }))
  );

  // Auto-save debounce
  const autoSave = useCallback(async () => {
    if (!formData.internshipTitle) return;

    setSaving(true);
    try {
      const payload = {
        id: draftId,
        internship_title: formData.internshipTitle,
        internship_description: formData.internshipDescription,
        internship_location: formData.internshipLocation,
        form_data: JSON.stringify(formData),
        status: "draft",
      };

      const response = await companyApi<{ inf: { id: number } }>(
        "/company/infs/autosave",
        { method: "POST", body: JSON.stringify(payload) }
      );
      setDraftId(response.inf.id);
      setSnackbar({ open: true, message: "Draft saved", severity: "info" });
    } catch (e) {
      console.error("Auto-save failed:", e);
    } finally {
      setSaving(false);
    }
  }, [formData, draftId]);

  // Debounced auto-save
  useEffect(() => {
    if (isAdminMode) return;
    const timer = setTimeout(autoSave, 3000);
    return () => clearTimeout(timer);
  }, [formData, autoSave, isAdminMode]);

  useEffect(() => {
    const fetchCustomBranches = async () => {
      try {
        const response = await companyApi<{
          programme_branches: ProgrammeBranchGroup[];
          branch_states: ProgrammeBranchStateGroup[];
        }>("/programme-branches");

        setFormData((prev) => ({
          ...prev,
          eligibility: mergeCustomBranchesIntoProgrammes(
            prev.eligibility.length > 0 ? prev.eligibility : defaultProgrammes,
            response.programme_branches ?? [],
            response.branch_states ?? []
          ),
        }));
      } catch (e) {
        console.error("Failed to load custom eligibility branches:", e);
      }
    };

    fetchCustomBranches();
  }, []);

  const updateFormData = <K extends keyof InfFormData>(field: K, value: InfFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (file: File) => {
    try {
      const response = await companyFileUpload(file);
      setUploadedFiles((prev) => [...prev, { name: response.file.name, url: response.file.url }]);
      setSnackbar({ open: true, message: "File uploaded successfully", severity: "success" });
    } catch (e) {
      setSnackbar({ open: true, message: "File upload failed", severity: "error" });
    }
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.internshipTitle || !formData.internshipDescription) {
      setError("Please fill in all required fields");
      setActiveTab(0);
      return;
    }

    const allDeclarations = Object.values(formData.declarations).every(Boolean);
    if (!allDeclarations) {
      setError("Please accept all declarations");
      setActiveTab(4);
      return;
    }

    if (!formData.signatory.name) {
      setError("Please provide signatory details");
      setActiveTab(4);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        internship_title: formData.internshipTitle,
        internship_description: formData.internshipDescription,
        internship_location: formData.internshipLocation,
        stipend: formData.programmeStipends.find((s) => s.enabled)?.baseStipend
          ? parseInt(formData.programmeStipends.find((s) => s.enabled)!.baseStipend)
          : null,
        internship_duration_weeks: formData.duration ? parseInt(formData.duration) : null,
        vacancies: formData.expectedHires ? parseInt(formData.expectedHires) : null,
        form_data: JSON.stringify(formData),
        status: isAdminMode ? undefined : "submitted",
      };

      if (isAdminMode && onAdminSave) {
        await onAdminSave(payload);
        setSnackbar({ open: true, message: "Changes saved successfully!", severity: "success" });
        return;
      }

      const path = draftId ? `/company/infs/${draftId}` : "/company/infs";
      const method = draftId ? "PUT" : "POST";

      const response = await companyApi<{ inf: { id: number } }>(path, {
        method,
        body: JSON.stringify(payload),
      });

      setDraftId(response.inf.id);
      setSnackbar({ open: true, message: "INF submitted successfully!", severity: "success" });
      onSaved?.(response.inf.id);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Submission failed";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const canProceed = useMemo(() => {
    switch (activeTab) {
      case 0:
        return !!formData.internshipTitle && !!formData.internshipDescription;
      case 1:
        return (
          formData.eligibility.some((p) => p.branches.some((b) => b.selected)) &&
          formData.eligibility
            .filter((p) => p.branches.some((b) => b.selected) && !/ph\.?d/i.test(p.programme))
            .every((p) => !!p.graduatingBatch)
        );
      case 2:
        return formData.programmeStipends.some((s) => s.enabled && s.baseStipend);
      case 3:
        return formData.selectionRounds.some((r) => r.enabled);
      case 4:
        return Object.values(formData.declarations).every(Boolean) && !!formData.signatory.name;
      default:
        return true;
    }
  }, [activeTab, formData]);

  return (
    <Box sx={{ pb: 2 }}>
      {/* Compact header */}
      <Box sx={{ mb: 3 }}>
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} spacing={1.5}>
          <Box>
            <Typography variant="h5" fontWeight={800} color="text.primary" letterSpacing="-0.01em">
              Internship Notification Form
            </Typography>
            <Typography variant="body2" color="text.secondary">
              IIT (ISM) Dhanbad — Career Development Centre
            </Typography>
          </Box>
          <Stack direction="row" spacing={1.5} alignItems="center">
            {saving && (
              <Stack direction="row" spacing={1} alignItems="center">
                <CircularProgress size={14} color="secondary" />
                <Typography variant="caption" color="text.secondary">Saving draft…</Typography>
              </Stack>
            )}
            {draftId && (
              <Chip
                label={`Draft #${draftId}`}
                size="small"
                color="secondary"
                variant="outlined"
                sx={{ fontWeight: 700, fontSize: "0.72rem" }}
              />
            )}
          </Stack>
        </Stack>
      </Box>

      {/* Step navigation */}
      <Paper
        elevation={0}
        sx={{
          mb: 3,
          border: "1px solid #e2e8f0",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        {/* Progress bar */}
        <Box sx={{ height: 3, bgcolor: "#e2e8f0" }}>
          <Box
            sx={{
              height: "100%",
              width: `${((activeTab + 1) / tabs.length) * 100}%`,
              bgcolor: "secondary.main",
              transition: "width 0.35s ease",
            }}
          />
        </Box>

        {/* Step pills */}
        <Box
          sx={{
            display: "flex",
            overflowX: "auto",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {tabs.map((tab, idx) => {
            const isActive = activeTab === idx;
            const isDone = activeTab > idx;
            return (
              <ButtonBase
                key={tab.label}
                onClick={() => setActiveTab(idx)}
                sx={{
                  flex: "0 0 auto",
                  px: { xs: 2, md: 3 },
                  py: 1.75,
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 1,
                  borderRight: "1px solid #f1f5f9",
                  bgcolor: isActive ? alpha("#ff6f00", 0.05) : "transparent",
                  borderBottom: isActive ? "2px solid" : "2px solid transparent",
                  borderBottomColor: isActive ? "secondary.main" : "transparent",
                  transition: "all 0.2s",
                  "&:hover": { bgcolor: alpha("#ff6f00", 0.04) },
                  minWidth: { xs: 130, md: "auto" },
                }}
              >
                <Box
                  sx={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    bgcolor: isDone ? "success.main" : isActive ? "secondary.main" : "#e2e8f0",
                    color: isDone || isActive ? "white" : "text.secondary",
                    fontSize: "0.7rem",
                    fontWeight: 800,
                  }}
                >
                  {isDone ? "✓" : idx + 1}
                </Box>
                <Typography
                  variant="caption"
                  fontWeight={isActive ? 700 : 500}
                  color={isActive ? "secondary.main" : isDone ? "success.dark" : "text.secondary"}
                  whiteSpace="nowrap"
                >
                  {tab.label}
                </Typography>
              </ButtonBase>
            );
          })}
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* AI missing-fields guidance banner */}
      {aiStatus === "success" && missingFields.length > 0 && (
        <Alert
          severity="warning"
          sx={{ mb: 3, borderRadius: 2 }}
          onClose={() => {}}
        >
          <strong>Not found in JD — please fill manually:</strong>{" "}
          {missingFields.join(" · ")}
        </Alert>
      )}

      {/* Tab Content */}
      <Box sx={{ minHeight: 400 }}>
        {/* Tab 0: Internship Details */}
        {activeTab === 0 && (
          <Stack spacing={3}>
            <FormSection title="Basic Internship Information" icon={<WorkIcon />} required>
              <Stack spacing={3}>
                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                  <TextField
                    fullWidth
                    label="Internship Title / Profile Name"
                    value={formData.internshipTitle}
                    onChange={(e) => updateFormData("internshipTitle", e.target.value)}
                    required
                    placeholder="e.g., Software Development Intern"
                    helperText="This will be displayed to students"
                  />
                  <TextField
                    fullWidth
                    label="Designation (Formal)"
                    value={formData.internshipDesignation}
                    onChange={(e) => updateFormData("internshipDesignation", e.target.value)}
                    placeholder="e.g., Summer Intern, Research Intern"
                  />
                </Stack>

                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                  <TextField
                    fullWidth
                    label="Place of Posting"
                    value={formData.internshipLocation}
                    onChange={(e) => updateFormData("internshipLocation", e.target.value)}
                    placeholder="e.g., Bangalore, Mumbai, Remote"
                  />
                  <FormControl fullWidth>
                    <InputLabel>Work Mode</InputLabel>
                    <Select
                      value={formData.workMode}
                      label="Work Mode"
                      onChange={(e) => updateFormData("workMode", e.target.value as "onsite" | "remote" | "hybrid")}
                    >
                      <MenuItem value="onsite">On-site / Office</MenuItem>
                      <MenuItem value="remote">Remote / Work from Home</MenuItem>
                      <MenuItem value="hybrid">Hybrid</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>

                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Expected Interns"
                    value={formData.expectedHires}
                    onChange={(e) => updateFormData("expectedHires", e.target.value)}
                    placeholder="e.g., 10"
                  />
                  <TextField
                    fullWidth
                    type="number"
                    label="Internship Duration (weeks)"
                    value={formData.duration}
                    onChange={(e) => updateFormData("duration", e.target.value)}
                    placeholder="e.g., 8"
                    helperText="Duration in weeks"
                  />
                  <TextField
                    fullWidth
                    type="month"
                    label="Tentative Start Month"
                    value={formData.joiningMonth}
                    onChange={(e) => updateFormData("joiningMonth", e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Stack>
              </Stack>
            </FormSection>

            <FormSection title="Internship Description & Requirements" icon={<DescriptionIcon />} required>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  multiline
                  rows={8}
                  label="Internship Description"
                  value={formData.internshipDescription}
                  onChange={(e) => updateFormData("internshipDescription", e.target.value)}
                  required
                  placeholder="Describe the internship role, projects, learning opportunities..."
                  helperText={`${formData.internshipDescription.length}/5000 characters`}
                />

                <SkillsTagInput
                  value={formData.skills}
                  onChange={(skills) => updateFormData("skills", skills)}
                  label="Required Skills"
                />

                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Additional Information"
                  value={formData.additionalInfo}
                  onChange={(e) => updateFormData("additionalInfo", e.target.value)}
                  placeholder="Any other relevant details about the internship..."
                />

                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                  <TextField
                    fullWidth
                    label="Company Registration Link (if any)"
                    value={formData.registrationLink}
                    onChange={(e) => updateFormData("registrationLink", e.target.value)}
                    placeholder="https://..."
                  />

                  {/* ── AI-powered JD upload ── */}
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                    <Button
                      id="inf-jd-ai-upload-btn"
                      variant="outlined"
                      component="label"
                      disabled={aiStatus === "loading"}
                      startIcon={
                        aiStatus === "loading" ? (
                          <CircularProgress size={16} />
                        ) : aiStatus === "success" ? (
                          <CheckCircleIcon />
                        ) : (
                          <AutoFixHighIcon />
                        )
                      }
                      color={
                        aiStatus === "success"
                          ? "success"
                          : aiStatus === "error"
                          ? "error"
                          : "secondary"
                      }
                      sx={{
                        height: 56,
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                        borderRadius: 2,
                        px: 2.5,
                        transition: "all 0.2s",
                      }}
                    >
                      {aiStatus === "loading"
                        ? "AI Parsing…"
                        : aiStatus === "success"
                        ? "✓ AI Filled!"
                        : "Upload JD + AI Fill"}
                      <input
                        type="file"
                        hidden
                        accept=".pdf"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          await Promise.allSettled([
                            handleFileUpload(file),
                            parseAndFill(
                              file,
                              formData.programmeStipends,
                              formData.selectionRounds
                            ),
                          ]);
                          e.target.value = "";
                        }}
                      />
                    </Button>

                    {/* Status captions */}
                    {aiStatus === "success" && (
                      <Typography variant="caption" color="success.main">
                        ✨ Form auto-filled — please review &amp; adjust
                      </Typography>
                    )}
                    {aiStatus === "error" && aiError && (
                      <Typography variant="caption" color="error">
                        ⚠️ {aiError}
                      </Typography>
                    )}

                    {/* Uploaded file list */}
                    {uploadedFiles.map((f) => (
                      <Typography key={f.url} variant="caption" color="text.secondary" display="block">
                        📎 {f.name}
                      </Typography>
                    ))}
                  </Box>
                </Stack>
              </Stack>
            </FormSection>
          </Stack>
        )}

        {/* Tab 1: Eligibility */}
        {activeTab === 1 && (
          <FormSection
            title="Eligibility Criteria"
            subtitle="Select eligible programmes and branches, set CGPA requirements"
            icon={<SchoolIcon />}
            required
          >
            <Stack spacing={3}>
              {/* Gender Filter */}
              <Paper elevation={0} sx={{ p: 2.5, bgcolor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 2 }}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }}>
                  <Typography variant="subtitle2" fontWeight={700} color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
                    Gender Preference
                  </Typography>
                  <RadioGroup
                    row
                    value={formData.genderFilter}
                    onChange={(e) => updateFormData("genderFilter", e.target.value as "all" | "male" | "female")}
                  >
                    <FormControlLabel value="all" control={<Radio size="small" />} label="All Genders" />
                    <FormControlLabel value="male" control={<Radio size="small" />} label="Male Only" />
                    <FormControlLabel value="female" control={<Radio size="small" />} label="Female Only" />
                  </RadioGroup>
                </Stack>
              </Paper>

              <EligibilityGrid
                value={formData.eligibility}
                onChange={(v) => updateFormData("eligibility", v)}
                globalCgpa={formData.globalCgpa}
                onGlobalCgpaChange={(v) => updateFormData("globalCgpa", v)}
                globalBacklogs={formData.globalBacklogs}
                onGlobalBacklogsChange={(v) => updateFormData("globalBacklogs", v)}
              />

              <TextField
                fullWidth
                multiline
                rows={2}
                label="Any Specific Requirements related to SLP (Skill-based Learning Program)"
                value={formData.slpRequirement}
                onChange={(e) => updateFormData("slpRequirement", e.target.value)}
                placeholder="Mention any specific skill or certification requirements..."
              />
            </Stack>
          </FormSection>
        )}

        {/* Tab 2: Stipend */}
        {activeTab === 2 && (
          <FormSection
            title="Stipend Details"
            subtitle="Provide stipend breakdown and PPO information"
            icon={<PaidIcon />}
            required
          >
            <StipendGrid
              currency={formData.currency}
              onCurrencyChange={(v) => updateFormData("currency", v)}
              sameForAll={formData.stipendSameForAll}
              onSameForAllChange={(v) => updateFormData("stipendSameForAll", v)}
              programmeStipends={formData.programmeStipends}
              onProgrammeStipendsChange={(v) => updateFormData("programmeStipends", v)}
              ppoProvision={formData.ppoProvision}
              onPpoProvisionChange={(v) => updateFormData("ppoProvision", v)}
              ppoCtc={formData.ppoCtc}
              onPpoCtcChange={(v) => updateFormData("ppoCtc", v)}
            />
          </FormSection>
        )}

        {/* Tab 3: Selection Process */}
        {activeTab === 3 && (
          <FormSection
            title="Selection Process"
            subtitle="Configure your selection process - tests, interviews, and rounds"
            icon={<AssignmentIcon />}
            required
          >
            <SelectionProcessBuilder
              value={formData.selectionRounds}
              onChange={(v) => updateFormData("selectionRounds", v)}
              teamMembers={formData.teamMembers}
              onTeamMembersChange={(v) => updateFormData("teamMembers", v)}
              roomsRequired={formData.roomsRequired}
              onRoomsRequiredChange={(v) => updateFormData("roomsRequired", v)}
            />
          </FormSection>
        )}

        {/* Tab 4: Declaration */}
        {activeTab === 4 && (
          <FormSection
            title="Declaration & Agreement"
            subtitle="Review and accept the terms before submission"
            icon={<DescriptionIcon />}
            required
          >
            <DeclarationChecklist
              declarations={formData.declarations}
              onDeclarationsChange={(v) => updateFormData("declarations", v)}
              signatory={formData.signatory}
              onSignatoryChange={(v) => updateFormData("signatory", v)}
            />
          </FormSection>
        )}

        {/* Tab 5: Preview & Submit */}
        {activeTab === 5 && (
          <InfPreview
            internshipDetails={{
              title: formData.internshipTitle,
              designation: formData.internshipDesignation,
              location: formData.internshipLocation,
              workMode: formData.workMode,
              expectedHires: formData.expectedHires,
              duration: formData.duration,
              joiningMonth: formData.joiningMonth,
              skills: formData.skills,
              description: formData.internshipDescription,
              registrationLink: formData.registrationLink,
            }}
            eligibility={formData.eligibility}
            stipend={{
              currency: formData.currency,
              programmeStipends: formData.programmeStipends,
              ppoProvision: formData.ppoProvision,
              ppoCtc: formData.ppoCtc,
            }}
            selectionProcess={{
              rounds: formData.selectionRounds,
              teamMembers: formData.teamMembers,
              roomsRequired: formData.roomsRequired,
            }}
            declarations={formData.declarations}
            signatory={formData.signatory}
            onNavigateToTab={setActiveTab}
          />
        )}
      </Box>

      {/* Sticky Navigation Footer */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 2.5 },
          mt: 3,
          position: "sticky",
          bottom: 0,
          zIndex: 10,
          border: "1px solid #e2e8f0",
          borderRadius: 3,
          bgcolor: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(8px)",
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
          <Button
            variant="outlined"
            disabled={activeTab === 0}
            onClick={() => setActiveTab((t) => t - 1)}
            sx={{ borderRadius: 2, fontWeight: 700, px: 3 }}
          >
            ← Previous
          </Button>

          <Typography variant="caption" color="text.secondary" sx={{ display: { xs: "none", sm: "block" } }}>
            Step {activeTab + 1} of {tabs.length}
          </Typography>

          <Stack direction="row" spacing={1.5}>
            {!isAdminMode && (
              <Tooltip title="Auto-saves every 3 seconds">
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={saving ? <CircularProgress size={14} color="secondary" /> : <SaveIcon />}
                  onClick={autoSave}
                  disabled={saving}
                  sx={{ borderRadius: 2, fontWeight: 600, display: { xs: "none", sm: "flex" } }}
                >
                  Save Draft
                </Button>
              </Tooltip>
            )}

            {isAdminMode ? (
              <Button
                variant="contained"
                color="primary"
                startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : <CheckCircleIcon />}
                onClick={handleSubmit}
                disabled={submitting}
                sx={{ borderRadius: 2, fontWeight: 700, px: 4 }}
              >
                {submitting ? "Saving…" : "Save Changes"}
              </Button>
            ) : activeTab < 5 ? (
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setActiveTab((t) => t + 1)}
                disabled={!canProceed}
                sx={{ borderRadius: 2, fontWeight: 700, px: 4 }}
              >
                Next →
              </Button>
            ) : (
              <Button
                variant="contained"
                color="success"
                startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
                onClick={handleSubmit}
                disabled={submitting}
                sx={{ borderRadius: 2, fontWeight: 700, px: 4 }}
              >
                {submitting ? "Submitting…" : "Submit INF"}
              </Button>
            )}
          </Stack>
        </Stack>
      </Paper>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
