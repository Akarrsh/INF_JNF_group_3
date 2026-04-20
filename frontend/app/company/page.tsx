"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid2,
  IconButton,
  LinearProgress,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import WorkIcon from "@mui/icons-material/Work";
import SchoolIcon from "@mui/icons-material/School";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import CancelIcon from "@mui/icons-material/Cancel";
import DraftsIcon from "@mui/icons-material/Drafts";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import BusinessIcon from "@mui/icons-material/Business";
import EditNotificationsIcon from "@mui/icons-material/EditNotifications";
import { companyApi } from "@/lib/companyApi";

type DashboardResponse = {
  stats: {
    jnf_total: number;
    jnf_submitted: number;
    jnf_accepted: number;
    jnf_rejected: number;
    jnf_draft: number;
    inf_total: number;
    inf_submitted: number;
    inf_accepted: number;
    inf_rejected: number;
    inf_draft: number;
  };
  company?: {
    name: string;
    logo?: string;
  };
  recent_jnfs?: Array<{
    id: number;
    job_title: string;
    status: string;
    has_edited_once: boolean;
    updated_at: string;
  }>;
  recent_infs?: Array<{
    id: number;
    internship_title: string;
    status: string;
    has_edited_once: boolean;
    updated_at: string;
  }>;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "accepted": return "success";
    case "submitted": case "under_review": return "info";
    case "rejected": return "error";
    case "draft": return "default";
    default: return "default";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "accepted": return <CheckCircleIcon fontSize="small" />;
    case "submitted": case "under_review": return <PendingIcon fontSize="small" />;
    case "rejected": return <CancelIcon fontSize="small" />;
    case "draft": return <DraftsIcon fontSize="small" />;
    default: return null;
  }
};

export default function CompanyDashboard() {
  const router = useRouter();
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuAnchor, setMenuAnchor] = useState<{ el: HTMLElement | null; type: "jnf" | "inf"; id: number } | null>(null);
  const [duplicateDialog, setDuplicateDialog] = useState<{ open: boolean; type: "jnf" | "inf"; id: number; title: string } | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; type: "jnf" | "inf"; id: number; title: string } | null>(null);
  const [requestEditTarget, setRequestEditTarget] = useState<{ type: "jnf" | "inf"; id: number; title: string } | null>(null);
  const [editReason, setEditReason] = useState("");
  const [editComments, setEditComments] = useState("");
  const [editReasonError, setEditReasonError] = useState("");
  const [submitingRequest, setSubmittingRequest] = useState(false);

  const fetchDashboard = async () => {
    try {
      const response = await companyApi<DashboardResponse>("/company/dashboard");
      setData(response);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchDashboard();
  }, []);


  const handleDuplicate = async () => {
    if (!duplicateDialog) return;
    
    try {
      const endpoint = duplicateDialog.type === "jnf" 
        ? `/company/jnfs/${duplicateDialog.id}/duplicate`
        : `/company/infs/${duplicateDialog.id}/duplicate`;
      
      const response = await companyApi<{ id: number }>(endpoint, { method: "POST" });
      setDuplicateDialog(null);
      router.push(`/company/${duplicateDialog.type}/${response.id}/edit`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to duplicate.");
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog) return;
    
    try {
      const endpoint = deleteDialog.type === "jnf" 
        ? `/company/jnfs/${deleteDialog.id}`
        : `/company/infs/${deleteDialog.id}`;
      
      await companyApi(endpoint, { method: "DELETE" });
      setDeleteDialog(null);
      await fetchDashboard();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete.");
    }
  };

  const openRequestEditModal = (type: "jnf" | "inf", id: number, title: string) => {
    setRequestEditTarget({ type, id, title });
    setEditReason("");
    setEditComments("");
    setEditReasonError("");
  };

  const handleSubmitEditRequest = async () => {
    if (!editReason.trim()) { setEditReasonError("Reason is required."); return; }
    if (!requestEditTarget) return;
    setSubmittingRequest(true);
    try {
      const endpoint = requestEditTarget.type === "jnf"
        ? `/company/jnfs/${requestEditTarget.id}/request-edit`
        : `/company/infs/${requestEditTarget.id}/request-edit`;
      await companyApi(endpoint, {
        method: "POST",
        body: JSON.stringify({ reason: editReason.trim(), comments: editComments.trim() }),
      });
      setRequestEditTarget(null);
      await fetchDashboard();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to submit request.");
    } finally {
      setSubmittingRequest(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ py: 4 }}>
        <LinearProgress />
        <Typography textAlign="center" mt={2}>Loading dashboard...</Typography>
      </Box>
    );
  }

  const stats = data?.stats || {
    jnf_total: 0, jnf_submitted: 0, jnf_accepted: 0, jnf_rejected: 0, jnf_draft: 0,
    inf_total: 0, inf_submitted: 0, inf_accepted: 0, inf_rejected: 0, inf_draft: 0,
  };

  return (
    <Box sx={{ pb: 6 }}>
      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

      {/* Welcome Header */}
      <Box
        sx={{
          mb: 4,
          p: { xs: 3, md: 4 },
          borderRadius: 4,
          background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
          color: "white",
          boxShadow: "0 12px 32px -8px rgba(26,58,92,0.4)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box sx={{ position: "absolute", top: 0, right: 0, bottom: 0, opacity: 0.1, backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />

        <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ md: "center" }} spacing={3} sx={{ position: "relative", zIndex: 1 }}>
          <Stack direction="row" spacing={2.5} alignItems="center">
            <Avatar sx={{ width: 64, height: 64, bgcolor: "white", color: "primary.main", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
              <BusinessIcon sx={{ fontSize: 32 }} />
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight={800} mb={0.5} sx={{ color: "white", letterSpacing: "-0.02em" }}>
                Welcome back{data?.company?.name ? `, ${data.company.name}` : ""}!
              </Typography>
              <Typography variant="body1" sx={{ color: "white", opacity: 0.85, fontWeight: 500 }}>
                Manage your recruitment process and submissions efficiently.
              </Typography>
            </Box>
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <Button
              component={Link}
              href="/company/jnf/new"
              variant="contained"
              startIcon={<WorkIcon />}
              sx={{ bgcolor: "white", color: "primary.main", fontWeight: 700, px: 3, py: 1.2, borderRadius: 2, "&:hover": { bgcolor: "grey.100" } }}
            >
              Post a JNF
            </Button>
            <Button
              component={Link}
              href="/company/inf/new"
              variant="outlined"
              startIcon={<SchoolIcon />}
              sx={{ color: "white", borderColor: "rgba(255,255,255,0.5)", fontWeight: 600, px: 3, py: 1.2, borderRadius: 2, "&:hover": { borderColor: "white", bgcolor: "rgba(255,255,255,0.1)" } }}
            >
              Post an INF
            </Button>
          </Stack>
        </Stack>
      </Box>

      {/* Quick Stats */}
      <Typography variant="h6" fontWeight={700} color="text.primary" mb={2}>Overview</Typography>
      <Grid2 container spacing={3} sx={{ mb: 5 }}>
        {[
          { label: "Total JNFs", value: stats.jnf_total, icon: <WorkIcon />, color: "#1a3a5c" },
          { label: "JNFs Accepted", value: stats.jnf_accepted, icon: <CheckCircleIcon />, color: "#16a34a" },
          { label: "Total INFs", value: stats.inf_total, icon: <SchoolIcon />, color: "#c47c2a" },
          { label: "INFs Accepted", value: stats.inf_accepted, icon: <CheckCircleIcon />, color: "#16a34a" },
        ].map((item) => (
          <Grid2 key={item.label} size={{ xs: 6, md: 3 }}>
            <Card
              elevation={0}
              sx={{
                height: "100%",
                border: "1px solid #e2e8f0",
                borderRadius: 3,
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                "&:hover": { transform: "translateY(-4px)", boxShadow: "0 12px 24px -10px rgba(0,0,0,0.1)" },
              }}
            >
              <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="overline" color="text.secondary" fontWeight={700} sx={{ letterSpacing: "0.08em" }}>
                      {item.label}
                    </Typography>
                    <Typography variant="h3" fontWeight={800} mt={0.5} sx={{ color: item.color }}>
                      {item.value}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: alpha(item.color, 0.1),
                      color: item.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {item.icon}
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid2>
        ))}
      </Grid2>

      {/* JNF Submissions Table */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box sx={{ width: 32, height: 32, borderRadius: 1.5, bgcolor: alpha("#1a3a5c", 0.1), color: "primary.main", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <WorkIcon fontSize="small" />
          </Box>
          <Typography variant="h6" fontWeight={700}>Job Notification Forms (JNF)</Typography>
          <Chip label={stats.jnf_total} size="small" sx={{ bgcolor: alpha("#1a3a5c", 0.1), color: "primary.main", fontWeight: 700 }} />
        </Stack>
        <Button component={Link} href="/company/submissions" size="small" endIcon={<MoreVertIcon />} sx={{ fontWeight: 600 }}>
          View All
        </Button>
      </Stack>

      <Card elevation={0} sx={{ mb: 5, border: "1px solid #e2e8f0", borderRadius: 3 }}>
        {data?.recent_jnfs && data.recent_jnfs.length > 0 ? (
          <TableContainer>
            <Table sx={{ minWidth: 600 }}>
              <TableHead sx={{ bgcolor: "#f8fafc" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, color: "text.secondary", py: 2 }}>Profile Title</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "text.secondary", py: 2 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "text.secondary", py: 2 }}>Last Updated</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, color: "text.secondary", py: 2 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.recent_jnfs.map((jnf) => (
                  <TableRow key={jnf.id} hover sx={{ "&:last-child td": { borderBottom: 0 } }}>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={700} color="text.primary">{jnf.job_title}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(jnf.status) || undefined}
                        label={jnf.status.replace("_", " ").toUpperCase()}
                        size="small"
                        color={getStatusColor(jnf.status) as "success" | "info" | "error" | "default"}
                        sx={{ fontWeight: 700, fontSize: "0.7rem", letterSpacing: "0.05em" }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary" fontWeight={500}>
                        {new Date(jnf.updated_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="View Details">
                          <IconButton component={Link} href={`/company/jnf/${jnf.id}`} size="small" sx={{ color: "primary.main", bgcolor: alpha("#1a3a5c", 0.05) }}>
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {(jnf.status === "draft" || (jnf.status === "submitted" && !jnf.has_edited_once)) ? (
                          <Tooltip title="Edit Form">
                            <IconButton component={Link} href={`/company/jnf/${jnf.id}/edit`} size="small" sx={{ color: "#c47c2a", bgcolor: alpha("#c47c2a", 0.08) }}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        ) : jnf.status === "edit_requested" ? (
                          <Tooltip title="Edit Request Pending">
                            <span>
                              <IconButton size="small" disabled sx={{ bgcolor: "grey.100" }}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </span>
                          </Tooltip>
                        ) : (
                          <Tooltip title="Request Edit Access">
                            <IconButton
                              size="small"
                              onClick={() => openRequestEditModal("jnf", jnf.id, jnf.job_title)}
                              sx={{ color: "warning.dark", bgcolor: alpha("#ea580c", 0.08) }}
                            >
                              <EditNotificationsIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Duplicate as Draft">
                          <IconButton
                            size="small"
                            onClick={() => setDuplicateDialog({ open: true, type: "jnf", id: jnf.id, title: jnf.job_title })}
                            sx={{ color: "text.secondary", bgcolor: "grey.100" }}
                          >
                            <ContentCopyIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {jnf.status === "draft" && (
                          <Tooltip title="Delete Draft">
                            <IconButton
                              size="small"
                              onClick={() => setDeleteDialog({ open: true, type: "jnf", id: jnf.id, title: jnf.job_title })}
                              sx={{ color: "error.main", bgcolor: alpha("#ef4444", 0.08) }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box textAlign="center" py={8} px={2}>
            <Box sx={{ width: 64, height: 64, borderRadius: "50%", bgcolor: alpha("#1a3a5c", 0.05), display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 2 }}>
              <WorkIcon sx={{ color: "primary.main", fontSize: 32, opacity: 0.5 }} />
            </Box>
            <Typography variant="h6" fontWeight={700} color="text.primary" mb={1}>No JNFs Created Yet</Typography>
            <Typography variant="body2" color="text.secondary" mb={3} maxWidth={400} mx="auto">
              Start your hiring process by submitting a new Job Notification Form for full-time roles.
            </Typography>
            <Button component={Link} href="/company/jnf/new" variant="contained" startIcon={<AddIcon />} sx={{ px: 3, borderRadius: 2 }}>
              Create JNF
            </Button>
          </Box>
        )}
      </Card>

      {/* INF Submissions Table */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box sx={{ width: 32, height: 32, borderRadius: 1.5, bgcolor: alpha("#c47c2a", 0.1), color: "secondary.main", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <SchoolIcon fontSize="small" />
          </Box>
          <Typography variant="h6" fontWeight={700}>Internship Notification Forms (INF)</Typography>
          <Chip label={stats.inf_total} size="small" sx={{ bgcolor: alpha("#c47c2a", 0.1), color: "secondary.main", fontWeight: 700 }} />
        </Stack>
        <Button component={Link} href="/company/submissions" size="small" endIcon={<MoreVertIcon />} color="secondary" sx={{ fontWeight: 600 }}>
          View All
        </Button>
      </Stack>

      <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 3 }}>
        {data?.recent_infs && data.recent_infs.length > 0 ? (
          <TableContainer>
            <Table sx={{ minWidth: 600 }}>
              <TableHead sx={{ bgcolor: "#f8fafc" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, color: "text.secondary", py: 2 }}>Profile Title</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "text.secondary", py: 2 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "text.secondary", py: 2 }}>Last Updated</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, color: "text.secondary", py: 2 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.recent_infs.map((inf) => (
                  <TableRow key={inf.id} hover sx={{ "&:last-child td": { borderBottom: 0 } }}>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={700} color="text.primary">{inf.internship_title}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(inf.status) || undefined}
                        label={inf.status.replace("_", " ").toUpperCase()}
                        size="small"
                        color={getStatusColor(inf.status) as "success" | "info" | "error" | "default"}
                        sx={{ fontWeight: 700, fontSize: "0.7rem", letterSpacing: "0.05em" }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary" fontWeight={500}>
                        {new Date(inf.updated_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="View Details">
                          <IconButton component={Link} href={`/company/inf/${inf.id}`} size="small" sx={{ color: "primary.main", bgcolor: alpha("#1a3a5c", 0.05) }}>
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {(inf.status === "draft" || (inf.status === "submitted" && !inf.has_edited_once)) ? (
                          <Tooltip title="Edit Form">
                            <IconButton component={Link} href={`/company/inf/${inf.id}/edit`} size="small" sx={{ color: "#c47c2a", bgcolor: alpha("#c47c2a", 0.08) }}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        ) : inf.status === "edit_requested" ? (
                          <Tooltip title="Edit Request Pending">
                            <span>
                              <IconButton size="small" disabled sx={{ bgcolor: "grey.100" }}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </span>
                          </Tooltip>
                        ) : (
                          <Tooltip title="Request Edit Access">
                            <IconButton
                              size="small"
                              onClick={() => openRequestEditModal("inf", inf.id, inf.internship_title)}
                              sx={{ color: "warning.dark", bgcolor: alpha("#ea580c", 0.08) }}
                            >
                              <EditNotificationsIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Duplicate as Draft">
                          <IconButton
                            size="small"
                            onClick={() => setDuplicateDialog({ open: true, type: "inf", id: inf.id, title: inf.internship_title })}
                            sx={{ color: "text.secondary", bgcolor: "grey.100" }}
                          >
                            <ContentCopyIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {inf.status === "draft" && (
                          <Tooltip title="Delete Draft">
                            <IconButton
                              size="small"
                              onClick={() => setDeleteDialog({ open: true, type: "inf", id: inf.id, title: inf.internship_title })}
                              sx={{ color: "error.main", bgcolor: alpha("#ef4444", 0.08) }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box textAlign="center" py={8} px={2}>
            <Box sx={{ width: 64, height: 64, borderRadius: "50%", bgcolor: alpha("#c47c2a", 0.05), display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 2 }}>
              <SchoolIcon sx={{ color: "secondary.main", fontSize: 32, opacity: 0.5 }} />
            </Box>
            <Typography variant="h6" fontWeight={700} color="text.primary" mb={1}>No INFs Created Yet</Typography>
            <Typography variant="body2" color="text.secondary" mb={3} maxWidth={400} mx="auto">
              Ready to hire interns? Submit your first Internship Notification Form here.
            </Typography>
            <Button component={Link} href="/company/inf/new" variant="contained" color="secondary" startIcon={<AddIcon />} sx={{ px: 3, borderRadius: 2 }}>
              Create INF
            </Button>
          </Box>
        )}
      </Card>

      {/* Modals remain structurally the same, just slightly polished */}
      <Dialog open={!!requestEditTarget} onClose={() => setRequestEditTarget(null)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Request Edit Access</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 3 }}>
            You are requesting to edit <strong>{requestEditTarget?.title}</strong>. Please provide a clear reason for the admin to review.
          </DialogContentText>
          <Stack spacing={2.5}>
            <TextField
              label="Reason for Edit *"
              value={editReason}
              onChange={(e) => { setEditReason(e.target.value); setEditReasonError(""); }}
              error={!!editReasonError}
              helperText={editReasonError}
              fullWidth
              multiline
              rows={3}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
            <TextField
              label="Additional Comments (Optional)"
              value={editComments}
              onChange={(e) => setEditComments(e.target.value)}
              fullWidth
              multiline
              rows={2}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={() => setRequestEditTarget(null)} disabled={submitingRequest} sx={{ fontWeight: 600 }}>Cancel</Button>
          <Button onClick={() => void handleSubmitEditRequest()} variant="contained" disabled={submitingRequest} sx={{ borderRadius: 2, px: 3, fontWeight: 600 }}>
            {submitingRequest ? "Submitting..." : "Submit Request"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={duplicateDialog?.open || false} onClose={() => setDuplicateDialog(null)} PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Duplicate {duplicateDialog?.type?.toUpperCase()}?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This creates an exact copy of <strong>&quot;{duplicateDialog?.title}&quot;</strong> as a new draft. You can easily modify it for a similar role.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setDuplicateDialog(null)} sx={{ fontWeight: 600 }}>Cancel</Button>
          <Button onClick={handleDuplicate} variant="contained" startIcon={<ContentCopyIcon />} sx={{ borderRadius: 2, fontWeight: 600 }}>
            Duplicate as Draft
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialog?.open || false} onClose={() => setDeleteDialog(null)} PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Draft?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to permanently delete <strong>&quot;{deleteDialog?.title}&quot;</strong>? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setDeleteDialog(null)} sx={{ fontWeight: 600 }}>Cancel</Button>
          <Button onClick={handleDelete} variant="contained" color="error" startIcon={<DeleteIcon />} sx={{ borderRadius: 2, fontWeight: 600 }}>
            Delete Draft
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}