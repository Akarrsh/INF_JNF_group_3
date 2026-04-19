"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  TextField,
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

import {
  FormSection,
  SkillsTagInput,
  EligibilityGrid,
  SelectionProcessBuilder,
  SalaryGrid,
  DeclarationChecklist,
  JnfPreview,
  defaultProgrammes,
  defaultRounds,
  defaultProgrammeSalaries,
  defaultSalaryComponents,
  mergeCustomBranchesIntoProgrammes,
} from "./shared";
import type {
  Currency,
  ProgrammeEligibility,
  ProgrammeBranchGroup,
  ProgrammeBranchStateGroup,
  SelectionRound,
  ProgrammeSalary,
  SalaryComponents,
} from "./shared";
import { companyApi, companyFileUpload } from "@/lib/companyApi";

interface JnfFormData {
  // Job Details
  jobTitle: string;
  jobDesignation: string;
  jobLocation: string;
  workMode: "onsite" | "remote" | "hybrid";
  expectedHires: string;
  minimumHires: string;
  joiningMonth: string;
  skills: string[];
  jobDescription: string;
  additionalInfo: string;
  registrationLink: string;

  // Eligibility
  eligibility: ProgrammeEligibility[];
  globalCgpa: string;
  globalBacklogs: boolean;
  genderFilter: "all" | "male" | "female";
  slpRequirement: string;

  // Salary
  currency: Currency;
  salarySameForAll: boolean;
  programmeSalaries: ProgrammeSalary[];
  salaryComponents: SalaryComponents;

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

const initialFormData: JnfFormData = {
  jobTitle: "",
  jobDesignation: "",
  jobLocation: "",
  workMode: "onsite",
  expectedHires: "",
  minimumHires: "",
  joiningMonth: "",
  skills: [],
  jobDescription: "",
  additionalInfo: "",
  registrationLink: "",
  eligibility: defaultProgrammes,
  globalCgpa: "7.0",
  globalBacklogs: false,
  genderFilter: "all",
  slpRequirement: "",
  currency: "INR",
  salarySameForAll: true,
  programmeSalaries: defaultProgrammeSalaries,
  salaryComponents: defaultSalaryComponents,
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
  { label: "Job Details", icon: <WorkIcon /> },
  { label: "Eligibility", icon: <SchoolIcon /> },
  { label: "Compensation", icon: <PaidIcon /> },
  { label: "Selection", icon: <AssignmentIcon /> },
  { label: "Declaration", icon: <DescriptionIcon /> },
  { label: "Preview & Submit", icon: <CheckCircleIcon /> },
];

type JnfFormProProps = {
  initialData?: Partial<JnfFormData> & { id?: number };
  onSaved?: (id: number) => void;
  isAdminMode?: boolean;
  onAdminSave?: (payload: any) => Promise<void>;
};

export default function JnfFormPro({ initialData, onSaved, isAdminMode, onAdminSave }: JnfFormProProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState<JnfFormData>(() => ({
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

  // Auto-save debounce
  const autoSave = useCallback(async () => {
    if (!formData.jobTitle) return;

    setSaving(true);
    try {
      const payload = {
        id: draftId,
        job_title: formData.jobTitle,
        job_description: formData.jobDescription,
        job_location: formData.jobLocation,
        form_data: JSON.stringify(formData),
        status: "draft",
      };

      const response = await companyApi<{ jnf: { id: number } }>(
        "/company/jnfs/autosave",
        { method: "POST", body: JSON.stringify(payload) }
      );
      setDraftId(response.jnf.id);
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

  const updateFormData = <K extends keyof JnfFormData>(field: K, value: JnfFormData[K]) => {
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
    if (!formData.jobTitle || !formData.jobDescription) {
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
        job_title: formData.jobTitle,
        job_description: formData.jobDescription,
        job_location: formData.jobLocation,
        ctc_min: formData.programmeSalaries.find((s) => s.enabled)?.ctcAnnual || null,
        ctc_max: formData.programmeSalaries.find((s) => s.enabled)?.ctcAnnual || null,
        vacancies: formData.expectedHires ? parseInt(formData.expectedHires) : null,
        form_data: JSON.stringify(formData),
        status: isAdminMode ? undefined : "submitted",
      };

      if (isAdminMode && onAdminSave) {
        await onAdminSave(payload);
        setSnackbar({ open: true, message: "Changes saved successfully!", severity: "success" });
        return;
      }

      const path = draftId ? `/company/jnfs/${draftId}` : "/company/jnfs";
      const method = draftId ? "PUT" : "POST";

      const response = await companyApi<{ jnf: { id: number } }>(path, {
        method,
        body: JSON.stringify(payload),
      });

      setDraftId(response.jnf.id);
      setSnackbar({ open: true, message: "JNF submitted successfully!", severity: "success" });
      onSaved?.(response.jnf.id);
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
        return !!formData.jobTitle && !!formData.jobDescription;
      case 1:
        return (
          formData.eligibility.some((p) => p.branches.some((b) => b.selected)) &&
          formData.eligibility
            .filter((p) => p.branches.some((b) => b.selected) && !/ph\.?d/i.test(p.programme))
            .every((p) => !!p.graduatingBatch)
        );
      case 2:
        return formData.programmeSalaries.some((s) => s.enabled && s.ctcAnnual);
      case 3:
        return formData.selectionRounds.some((r) => r.enabled);
      case 4:
        return Object.values(formData.declarations).every(Boolean) && !!formData.signatory.name;
      default:
        return true;
    }
  }, [activeTab, formData]);

  return (
    <Box>
      {/* Header */}
      <Paper
        sx={{
          p: 2,
          mb: 3,
          background: (theme) =>
            `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: "white",
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h5" fontWeight={600}>
              Job Notification Form (JNF)
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              IIT (ISM) Dhanbad — Career Development Centre
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} alignItems="center">
            {saving && (
              <Stack direction="row" spacing={1} alignItems="center">
                <CircularProgress size={16} sx={{ color: "white" }} />
                <Typography variant="caption">Saving...</Typography>
              </Stack>
            )}
            {draftId && (
              <Typography variant="caption" sx={{ bgcolor: alpha("#fff", 0.2), px: 1, py: 0.5, borderRadius: 1 }}>
                Draft #{draftId}
              </Typography>
            )}
          </Stack>
        </Stack>
      </Paper>

      {/* Tab Navigation */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            "& .MuiTab-root": {
              minHeight: 64,
              textTransform: "none",
              fontWeight: 500,
            },
          }}
        >
          {tabs.map((tab, idx) => (
            <Tab
              key={tab.label}
              icon={tab.icon}
              label={tab.label}
              iconPosition="start"
              sx={{
                "&.Mui-selected": { bgcolor: alpha("#1976d2", 0.08) },
              }}
            />
          ))}
        </Tabs>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Tab Content */}
      <Box sx={{ minHeight: 400 }}>
        {/* Tab 0: Job Details */}
        {activeTab === 0 && (
          <Stack spacing={3}>
            <FormSection title="Basic Job Information" icon={<WorkIcon />} required>
              <Stack spacing={3}>
                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                  <TextField
                    fullWidth
                    label="Job Title / Profile Name"
                    value={formData.jobTitle}
                    onChange={(e) => updateFormData("jobTitle", e.target.value)}
                    required
                    placeholder="e.g., Software Development Engineer"
                    helperText="This will be displayed to students"
                  />
                  <TextField
                    fullWidth
                    label="Job Designation (Formal)"
                    value={formData.jobDesignation}
                    onChange={(e) => updateFormData("jobDesignation", e.target.value)}
                    placeholder="e.g., SDE-1, Associate Engineer"
                    helperText="Official designation in offer letter"
                  />
                </Stack>

                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                  <TextField
                    fullWidth
                    label="Place of Posting"
                    value={formData.jobLocation}
                    onChange={(e) => updateFormData("jobLocation", e.target.value)}
                    placeholder="e.g., Bangalore, Mumbai, Hybrid"
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
                    label="Expected Hires"
                    value={formData.expectedHires}
                    onChange={(e) => updateFormData("expectedHires", e.target.value)}
                    placeholder="e.g., 10"
                    helperText="Estimated number of hires"
                  />
                  <TextField
                    fullWidth
                    type="number"
                    label="Minimum Hires"
                    value={formData.minimumHires}
                    onChange={(e) => updateFormData("minimumHires", e.target.value)}
                    placeholder="e.g., 5"
                    helperText="Guaranteed minimum hires"
                  />
                  <TextField
                    fullWidth
                    type="month"
                    label="Tentative Joining Month"
                    value={formData.joiningMonth}
                    onChange={(e) => updateFormData("joiningMonth", e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Stack>
              </Stack>
            </FormSection>

            <FormSection title="Job Description & Requirements" icon={<DescriptionIcon />} required>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  multiline
                  rows={8}
                  label="Job Description"
                  value={formData.jobDescription}
                  onChange={(e) => updateFormData("jobDescription", e.target.value)}
                  required
                  placeholder="Describe the role, responsibilities, and expectations..."
                  helperText={`${formData.jobDescription.length}/5000 characters`}
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
                  placeholder="Any other relevant details about the role..."
                  helperText="Optional - Max 1000 characters"
                />

                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                  <TextField
                    fullWidth
                    label="Company Registration Link (if any)"
                    value={formData.registrationLink}
                    onChange={(e) => updateFormData("registrationLink", e.target.value)}
                    placeholder="https://..."
                    helperText="If students need to register on your portal"
                  />
                  <Box>
                    <Button variant="outlined" component="label" sx={{ height: 56 }}>
                      Upload JD (PDF)
                      <input
                        type="file"
                        hidden
                        accept=".pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file);
                        }}
                      />
                    </Button>
                    {uploadedFiles.map((f) => (
                      <Typography key={f.url} variant="caption" display="block">
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
              <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
                <Stack direction={{ xs: "column", md: "row" }} spacing={3} alignItems={{ md: "center" }}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Gender Preference:
                  </Typography>
                  <RadioGroup
                    row
                    value={formData.genderFilter}
                    onChange={(e) => updateFormData("genderFilter", e.target.value as "all" | "male" | "female")}
                  >
                    <FormControlLabel value="all" control={<Radio />} label="All Genders" />
                    <FormControlLabel value="male" control={<Radio />} label="Male Only" />
                    <FormControlLabel value="female" control={<Radio />} label="Female Only" />
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

        {/* Tab 2: Compensation */}
        {activeTab === 2 && (
          <FormSection
            title="Compensation & Salary Details"
            subtitle="Provide CTC breakdown for each programme level"
            icon={<PaidIcon />}
            required
          >
            <SalaryGrid
              currency={formData.currency}
              onCurrencyChange={(v) => updateFormData("currency", v)}
              sameForAll={formData.salarySameForAll}
              onSameForAllChange={(v) => updateFormData("salarySameForAll", v)}
              programmeSalaries={formData.programmeSalaries}
              onProgrammeSalariesChange={(v) => updateFormData("programmeSalaries", v)}
              salaryComponents={formData.salaryComponents}
              onSalaryComponentsChange={(v) => updateFormData("salaryComponents", v)}
            />
          </FormSection>
        )}

        {/* Tab 3: Selection Process */}
        {activeTab === 3 && (
          <FormSection
            title="Selection Process"
            subtitle="Configure your hiring process - tests, interviews, and rounds"
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
          <JnfPreview
            jobDetails={{
              title: formData.jobTitle,
              designation: formData.jobDesignation,
              location: formData.jobLocation,
              workMode: formData.workMode,
              expectedHires: formData.expectedHires,
              minimumHires: formData.minimumHires,
              joiningMonth: formData.joiningMonth,
              skills: formData.skills,
              description: formData.jobDescription,
              registrationLink: formData.registrationLink,
            }}
            eligibility={formData.eligibility}
            salary={{
              currency: formData.currency,
              programmeSalaries: formData.programmeSalaries,
              components: formData.salaryComponents,
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

      {/* Navigation Buttons */}
      <Paper sx={{ p: 2, mt: 3, position: "sticky", bottom: 0, zIndex: 10 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Button
            variant="outlined"
            disabled={activeTab === 0}
            onClick={() => setActiveTab((t) => t - 1)}
          >
            Previous
          </Button>

          <Stack direction="row" spacing={2}>
            {!isAdminMode && (
              <Button
                variant="outlined"
                startIcon={<SaveIcon />}
                onClick={autoSave}
                disabled={saving}
              >
                Save Draft
              </Button>
            )}

            {isAdminMode ? (
              <Button
                variant="contained"
                color="primary"
                startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : <CheckCircleIcon />}
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? "Saving..." : "Save Changes"}
              </Button>
            ) : activeTab < 5 ? (
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setActiveTab((t) => t + 1)}
                disabled={!canProceed}
              >
                Next
              </Button>
            ) : (
              <Button
                variant="contained"
                color="secondary"
                startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit JNF"}
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
