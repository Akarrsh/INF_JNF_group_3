"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid2,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
  alpha,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BusinessIcon from "@mui/icons-material/Business";
import SchoolIcon from "@mui/icons-material/School";
import PaidIcon from "@mui/icons-material/Paid";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import CancelIcon from "@mui/icons-material/Cancel";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import WorkIcon from "@mui/icons-material/Work";
import EditIcon from "@mui/icons-material/Edit";
import { adminApi } from "@/lib/adminApi";
import InfFormPro from "@/components/forms/InfFormPro";

type FormData = {
  internshipTitle?: string;
  internshipDesignation?: string;
  internshipLocation?: string;
  workMode?: "remote" | "hybrid" | "onsite";
  expectedHires?: string;
  duration?: string;
  joiningMonth?: string;
  skills?: string[];
  internshipDescription?: string;
  additionalInfo?: string;
  registrationLink?: string;
  eligibility?: Array<{
    programme: string;
    expanded: boolean;
    branches: Array<{ branch: string; selected: boolean; cgpa: string; backlogsAllowed: boolean }>;
  }>;
  globalCgpa?: string;
  globalBacklogs?: boolean;
  currency?: any;
  programmeStipends?: Array<{
    programme: string;
    enabled: boolean;
    baseStipend: string;
    hra: string;
    otherAllowances: string;
    total: string;
  }>;
  ppoProvision?: boolean;
  ppoCtc?: string;
  selectionRounds?: Array<{
    id: string;
    type: string;
    enabled: boolean;
    mode: string;
    duration: string;
    details: string;
  }>;
  teamMembers?: string;
  roomsRequired?: string;
  declarations?: Record<string, boolean>;
  signatory?: {
    name: string;
    designation: string;
    date: string;
  };
};

type Inf = {
  id: number;
  internship_title: string;
  internship_description: string;
  internship_location: string | null;
  stipend: number | null;
  internship_duration_weeks: number | null;
  vacancies: number | null;
  application_deadline: string | null;
  status: string;
  admin_remarks: string | null;
  form_data?: FormData | string | null;
  created_at: string;
  updated_at: string;
  company?: { 
    name: string; 
    hr_name: string; 
    hr_email: string;
    website?: string;
    industry?: string;
    address?: string;
  };
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "accepted": return "success";
    case "submitted": return "warning";
    case "under_review": return "info";
    case "rejected": return "error";
    default: return "default";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "accepted": return <CheckCircleIcon />;
    case "submitted": return <HourglassEmptyIcon />;
    case "under_review": return <PendingIcon />;
    case "rejected": return <CancelIcon />;
    default: return null;
  }
};

const getCurrencySymbol = (currency?: string) => {
  switch (currency) {
    case "USD": return "$";
    case "EUR": return "€";
    case "GBP": return "£";
    default: return "₹";
  }
};

function SectionCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Card sx={{ mb: 2 }}>
      <Box sx={{ px: 2, py: 1.5, bgcolor: alpha("#9c27b0", 0.05), borderBottom: "1px solid", borderColor: "divider" }}>
        <Stack direction="row" spacing={1} alignItems="center">
          {icon}
          <Typography variant="subtitle1" fontWeight={600}>{title}</Typography>
        </Stack>
      </Box>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function DataRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
      <Typography variant="caption" color="text.secondary" display="block">{label}</Typography>
      <Typography variant="body2" fontWeight={500}>{value || "-"}</Typography>
    </Grid2>
  );
}

export default function AdminInfDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [inf, setInf] = useState<Inf | null>(null);
  const [remarks, setRemarks] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [snackOpen, setSnackOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const run = async () => {
      try {
        const response = await adminApi<{ inf: Inf }>(`/admin/infs/${params.id}`);
        setInf(response.inf);
        setRemarks(response.inf.admin_remarks ?? "");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load INF.");
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, [params.id]);

  const updateStatus = async (status: "under_review" | "accepted" | "rejected") => {
    setError(null);
    setSuccess(null);
    setUpdating(true);

    try {
      const response = await adminApi<{ inf: Inf }>(`/admin/infs/${params.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status, admin_remarks: remarks || null }),
      });
      setInf(response.inf);
      setSuccess(`INF marked as ${status.replace("_", " ")}.`);
      setSnackOpen(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update INF status.");
    } finally {
      setUpdating(false);
    }
  };

  const handleAdminSave = async (payload: any) => {
    setError(null);
    setSuccess(null);
    setUpdating(true);
    try {
      const response = await adminApi<{ inf: Inf }>(`/admin/infs/${params.id}/edit`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      setInf(response.inf);
      setIsEditing(false);
      setSuccess("INF details updated successfully.");
      setSnackOpen(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update INF details.");
      throw e;
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ py: 4 }}>
        <LinearProgress />
        <Typography textAlign="center" mt={2}>Loading INF details...</Typography>
      </Box>
    );
  }

  // Parse form_data
  const formData: FormData = inf?.form_data
    ? typeof inf.form_data === "string"
      ? JSON.parse(inf.form_data)
      : inf.form_data
    : {};

  const symbol = getCurrencySymbol(formData.currency);
  const selectedBranches = (formData.eligibility ?? []).flatMap((p) =>
    p.branches.filter((b) => b.selected).map((b) => `${b.branch} (${p.programme})`)
  );
  const enabledStipends = (formData.programmeStipends ?? []).filter((s) => s.enabled);
  const enabledRounds = (formData.selectionRounds ?? []).filter((r) => r.enabled);

  return (
    <Box>
      {/* Header */}
      <Paper
        sx={{
          p: 2,
          mb: 3,
          background: (theme) =>
            `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
          color: "white",
          borderRadius: 2,
        }}
      >
        <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ md: "center" }} spacing={2}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ width: 48, height: 48, bgcolor: "white", color: "secondary.main" }}>
              <SchoolIcon />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight={700}>
                {formData.internshipTitle || inf?.internship_title || "INF Review"}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {inf?.company?.name ?? "Unknown Company"} • Submitted {inf?.created_at ? new Date(inf.created_at).toLocaleDateString() : "-"}
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              icon={getStatusIcon(inf?.status ?? "") || undefined}
              label={(inf?.status ?? "").replace("_", " ").toUpperCase()}
              color={getStatusColor(inf?.status ?? "") as "success" | "warning" | "info" | "error" | "default"}
              sx={{ color: "white", fontWeight: 600 }}
            />
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => router.push("/admin/infs")}
              sx={{ color: "white", borderColor: "white" }}
            >
              Back
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Grid2 container spacing={3}>
        {/* Main Content */}
        <Grid2 size={{ xs: 12, md: 8 }}>
          {/* Company Info */}
          <SectionCard title="Company Information" icon={<BusinessIcon color="secondary" />}>
            <Grid2 container spacing={2}>
              <DataRow label="Company Name" value={inf?.company?.name} />
              <DataRow label="HR Name" value={inf?.company?.hr_name} />
              <DataRow label="HR Email" value={inf?.company?.hr_email} />
              <DataRow label="Industry" value={inf?.company?.industry} />
              <DataRow label="Website" value={inf?.company?.website} />
            </Grid2>
          </SectionCard>

          {isEditing ? (
            <InfFormPro
              isAdminMode
              initialData={{
                ...formData,
                internshipTitle: formData.internshipTitle || inf?.internship_title || "",
                internshipDescription: formData.internshipDescription || inf?.internship_description || "",
                internshipLocation: formData.internshipLocation || inf?.internship_location || "",
              } as any}
              onAdminSave={handleAdminSave}
            />
          ) : (
            <>
              {/* Internship Details */}
          <SectionCard title="Internship Details" icon={<SchoolIcon color="secondary" />}>
            <Grid2 container spacing={2}>
              <DataRow label="Internship Title" value={formData.internshipTitle || inf?.internship_title} />
              <DataRow label="Designation" value={formData.internshipDesignation} />
              <DataRow label="Location" value={formData.internshipLocation || inf?.internship_location} />
              <DataRow label="Work Mode" value={formData.workMode} />
              <DataRow label="Duration" value={formData.duration ? `${formData.duration} weeks` : (inf?.internship_duration_weeks ? `${inf.internship_duration_weeks} weeks` : null)} />
              <DataRow label="Expected Hires" value={formData.expectedHires || inf?.vacancies} />
              <DataRow label="Joining Month" value={formData.joiningMonth} />
              <DataRow 
                label="Registration Link" 
                value={formData.registrationLink ? (
                  <a href={formData.registrationLink} target="_blank" rel="noopener noreferrer">
                    {formData.registrationLink}
                  </a>
                ) : null} 
              />
              <Grid2 size={12}>
                <Typography variant="caption" color="text.secondary" display="block">Skills Required</Typography>
                <Stack direction="row" flexWrap="wrap" gap={0.5} mt={0.5}>
                  {(formData.skills ?? []).length > 0 ? (
                    formData.skills?.map((skill) => (
                      <Chip key={skill} label={skill} size="small" variant="outlined" />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">Not specified</Typography>
                  )}
                </Stack>
              </Grid2>
              <Grid2 size={12}>
                <Typography variant="caption" color="text.secondary" display="block">Internship Description</Typography>
                <Paper variant="outlined" sx={{ p: 2, mt: 0.5, bgcolor: "grey.50" }}>
                  <Typography variant="body2" whiteSpace="pre-wrap">
                    {formData.internshipDescription || inf?.internship_description || "Not provided"}
                  </Typography>
                </Paper>
              </Grid2>
              {formData.additionalInfo && (
                <Grid2 size={12}>
                  <Typography variant="caption" color="text.secondary" display="block">Additional Information</Typography>
                  <Typography variant="body2" mt={0.5}>{formData.additionalInfo}</Typography>
                </Grid2>
              )}
            </Grid2>
          </SectionCard>

          {/* Eligibility */}
          <SectionCard title="Eligibility Criteria" icon={<WorkIcon color="secondary" />}>
            <Grid2 container spacing={2}>
              <DataRow label="Minimum CGPA" value={formData.globalCgpa} />
              <DataRow label="Backlogs Allowed" value={formData.globalBacklogs ? "Yes" : "No"} />
              <Grid2 size={12}>
                <Typography variant="caption" color="text.secondary" display="block">
                  Eligible Branches ({selectedBranches.length} selected)
                </Typography>
                <Stack direction="row" flexWrap="wrap" gap={0.5} mt={0.5}>
                  {selectedBranches.length > 0 ? (
                    selectedBranches.map((branch) => (
                      <Chip key={branch} label={branch} size="small" color="secondary" variant="outlined" />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">No branches selected</Typography>
                  )}
                </Stack>
              </Grid2>
            </Grid2>
          </SectionCard>

          {/* Stipend */}
          <SectionCard title="Stipend Details" icon={<PaidIcon color="secondary" />}>
            <Grid2 container spacing={2}>
              <DataRow label="Currency" value={formData.currency || "INR"} />
              <DataRow label="PPO Provision" value={formData.ppoProvision ? "Yes" : "No"} />
              {formData.ppoProvision && formData.ppoCtc && (
                <DataRow label="PPO CTC" value={`${symbol}${parseInt(formData.ppoCtc).toLocaleString()}`} />
              )}
              <Grid2 size={12}>
                <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                  Programme-wise Stipend
                </Typography>
                {enabledStipends.length > 0 ? (
                  <List dense disablePadding>
                    {enabledStipends.map((s) => (
                      <ListItem key={s.programme} disablePadding sx={{ py: 0.5 }}>
                        <ListItemText
                          primary={s.programme}
                          secondary={`Base: ${symbol}${s.baseStipend ? parseInt(s.baseStipend).toLocaleString() : "-"}/month | HRA: ${symbol}${s.hra ? parseInt(s.hra).toLocaleString() : "0"} | Total: ${symbol}${s.total ? parseInt(s.total).toLocaleString() : "-"}/month`}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary">No stipend details provided</Typography>
                )}
              </Grid2>
            </Grid2>
          </SectionCard>

          {/* Selection Process */}
          <SectionCard title="Selection Process" icon={<AssignmentIcon color="secondary" />}>
            <Grid2 container spacing={2}>
              <DataRow label="Team Members Required" value={formData.teamMembers} />
              <DataRow label="Rooms Required" value={formData.roomsRequired} />
              <Grid2 size={12}>
                <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                  Selection Rounds ({enabledRounds.length})
                </Typography>
                {enabledRounds.length > 0 ? (
                  <Stack spacing={1}>
                    {enabledRounds.map((round, idx) => (
                      <Paper key={round.id} variant="outlined" sx={{ p: 1.5 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Chip label={`Round ${idx + 1}`} size="small" color="secondary" />
                            <Typography variant="body2" fontWeight={500}>
                              {round.type.replace("_", " ")}
                            </Typography>
                          </Stack>
                          <Stack direction="row" spacing={1}>
                            <Chip label={round.mode} size="small" variant="outlined" />
                            {round.duration && <Chip label={round.duration} size="small" variant="outlined" />}
                          </Stack>
                        </Stack>
                        {round.details && (
                          <Typography variant="body2" color="text.secondary" mt={1}>
                            {round.details}
                          </Typography>
                        )}
                      </Paper>
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary">No selection rounds specified</Typography>
                )}
              </Grid2>
            </Grid2>
          </SectionCard>

          {/* Declaration */}
          {formData.signatory && (
            <SectionCard title="Declaration & Signatory" icon={<CheckCircleIcon color="secondary" />}>
              <Grid2 container spacing={2}>
                <DataRow label="Signatory Name" value={formData.signatory.name} />
                <DataRow label="Designation" value={formData.signatory.designation} />
                <DataRow label="Date" value={formData.signatory.date} />
                <Grid2 size={12}>
                  <Typography variant="caption" color="text.secondary" display="block">Declarations</Typography>
                  <Typography variant="body2" color="success.main" mt={0.5}>
                    ✅ All declarations accepted
                  </Typography>
                </Grid2>
              </Grid2>
            </SectionCard>
          )}
            </>
          )}
        </Grid2>

        {/* Sidebar - Admin Actions */}
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Card sx={{ position: "sticky", top: 16 }}>
            <Box sx={{ px: 2, py: 1.5, bgcolor: "secondary.main", color: "white" }}>
              <Typography variant="subtitle1" fontWeight={600}>Admin Actions</Typography>
            </Box>
            <CardContent>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Current Status</Typography>
                  <Chip
                    icon={getStatusIcon(inf?.status ?? "") || undefined}
                    label={(inf?.status ?? "").replace("_", " ").toUpperCase()}
                    color={getStatusColor(inf?.status ?? "") as "success" | "warning" | "info" | "error" | "default"}
                    sx={{ mt: 0.5, width: "100%" }}
                  />
                </Box>

                <Divider />

                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => setIsEditing(!isEditing)}
                  fullWidth
                  startIcon={<EditIcon />}
                  disabled={updating}
                  sx={{ mb: 1 }}
                >
                  {isEditing ? "Cancel Editing" : "Edit Form Details"}
                </Button>

                <TextField
                  label="Admin Remarks"
                  multiline
                  minRows={4}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Add notes or feedback for the company..."
                  fullWidth
                />

                <Button
                  variant="outlined"
                  onClick={() => void updateStatus("under_review")}
                  disabled={updating || inf?.status === "under_review"}
                  fullWidth
                >
                  Mark Under Review
                </Button>

                <Button
                  variant="contained"
                  color="success"
                  onClick={() => void updateStatus("accepted")}
                  disabled={updating}
                  fullWidth
                  startIcon={<CheckCircleIcon />}
                >
                  Accept INF
                </Button>

                <Button
                  variant="contained"
                  color="error"
                  onClick={() => void updateStatus("rejected")}
                  disabled={updating}
                  fullWidth
                  startIcon={<CancelIcon />}
                >
                  Reject INF
                </Button>

                {updating && <LinearProgress />}

                {success && (
                  <Alert severity="success" sx={{ borderRadius: 2 }}>
                    {success}
                  </Alert>
                )}
                {error && (
                  <Alert severity="error" sx={{ borderRadius: 2 }}>
                    {error}
                  </Alert>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
      {/* Toast notification */}
      <Snackbar
        open={snackOpen}
        autoHideDuration={4000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackOpen(false)}
          severity={error ? "error" : "success"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {error || success}
        </Alert>
      </Snackbar>
    </Box>
  );
}
