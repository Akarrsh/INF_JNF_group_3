"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid2,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { companyApi } from "@/lib/companyApi";
import EmptyState from "@/components/ui/EmptyState";

type JnfItem = {
  id: number;
  job_title: string;
  status: string;
  has_edited_once: boolean;
  updated_at: string;
};
type InfItem = {
  id: number;
  internship_title: string;
  status: string;
  has_edited_once: boolean;
  updated_at: string;
};

function getEditAction(status: string, hasEditedOnce: boolean): "edit" | "request" | "pending" {
  if (status === "draft") return "edit";
  if (status === "submitted" && !hasEditedOnce) return "edit";
  if (status === "edit_requested") return "pending";
  return "request";
}

type RequestTarget = { type: "jnf" | "inf"; id: number; title: string };

export default function SubmissionsPage() {
  const [jnfs, setJnfs] = useState<JnfItem[]>([]);
  const [infs, setInfs] = useState<InfItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Request edit modal
  const [modalTarget, setModalTarget] = useState<RequestTarget | null>(null);
  const [reason, setReason] = useState("");
  const [comments, setComments] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reasonError, setReasonError] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        const [jnfData, infData] = await Promise.all([
          companyApi<{ jnfs: JnfItem[] }>("/company/jnfs"),
          companyApi<{ infs: InfItem[] }>("/company/infs"),
        ]);
        setJnfs(jnfData.jnfs);
        setInfs(infData.infs);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load submissions.");
      }
    };
    void run();
  }, []);

  const openModal = (target: RequestTarget) => {
    setModalTarget(target);
    setReason("");
    setComments("");
    setReasonError("");
  };

  const handleSubmitRequest = async () => {
    if (!reason.trim()) {
      setReasonError("Reason is required.");
      return;
    }
    if (!modalTarget) return;
    setSubmitting(true);
    try {
      const endpoint =
        modalTarget.type === "jnf"
          ? `/company/jnfs/${modalTarget.id}/request-edit`
          : `/company/infs/${modalTarget.id}/request-edit`;
      await companyApi(endpoint, {
        method: "POST",
        body: JSON.stringify({ reason: reason.trim(), comments: comments.trim() }),
      });
      if (modalTarget.type === "jnf") {
        setJnfs((prev) =>
          prev.map((j) => (j.id === modalTarget.id ? { ...j, status: "edit_requested" } : j))
        );
      } else {
        setInfs((prev) =>
          prev.map((i) => (i.id === modalTarget.id ? { ...i, status: "edit_requested" } : i))
        );
      }
      setModalTarget(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to submit request.");
    } finally {
      setSubmitting(false);
    }
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

  return (
    <Box sx={{ pb: 6, maxWidth: 1200, mx: "auto" }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: "text.primary", mb: 0.5, letterSpacing: "-0.02em" }}>
          My Submissions
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          Track and manage your Job and Internship Notification Forms.
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

      <Grid2 container spacing={4}>
        {/* JNF List */}
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 3, overflow: "visible", height: "100%" }}>
            <Box sx={{ borderBottom: "1px solid #e2e8f0", px: 3, py: 2, bgcolor: "#f8fafc", borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
              <Typography variant="h6" fontWeight={700} color="primary.main">
                Job Notification Forms (JNF)
              </Typography>
            </Box>
            <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
              <Stack divider={<Box sx={{ borderBottom: "1px solid #f1f5f9" }} />}>
                {jnfs.map((item) => {
                  const action = getEditAction(item.status, item.has_edited_once);
                  return (
                    <Box key={item.id} sx={{ p: 3, transition: "background-color 0.2s", "&:hover": { bgcolor: "#f8fafc" } }}>
                      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} spacing={2}>
                        <Box>
                          <Typography variant="subtitle1" fontWeight={700} color="text.primary" mb={0.5}>
                            {item.job_title}
                          </Typography>
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <Box sx={{
                              px: 1, py: 0.25, borderRadius: 1, fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em",
                              bgcolor: `var(--mui-palette-${getStatusColor(item.status)}-light)`,
                              color: `var(--mui-palette-${getStatusColor(item.status)}-dark)`,
                              border: "1px solid", borderColor: `var(--mui-palette-${getStatusColor(item.status)}-main)`
                            }}>
                              {item.status.replace(/_/g, " ")}
                            </Box>
                            <Typography variant="caption" color="text.secondary" fontWeight={500}>
                              Updated {new Date(item.updated_at).toLocaleDateString()}
                            </Typography>
                          </Stack>
                        </Box>

                        <Stack direction="row" spacing={1}>
                          <Button component={Link} href={`/company/jnf/${item.id}`} size="small" variant="text" sx={{ fontWeight: 600 }}>
                            View
                          </Button>
                          {action === "edit" && (
                            <Button component={Link} href={`/company/jnf/${item.id}/edit`} size="small" variant="outlined" sx={{ borderRadius: 1.5, fontWeight: 600 }}>
                              Edit
                            </Button>
                          )}
                          {action === "request" && (
                            <Button size="small" color="warning" variant="outlined" sx={{ borderRadius: 1.5, fontWeight: 600 }} onClick={() => openModal({ type: "jnf", id: item.id, title: item.job_title })}>
                              Request Edit
                            </Button>
                          )}
                          {action === "pending" && (
                            <Button size="small" disabled variant="outlined" sx={{ borderRadius: 1.5, fontWeight: 600 }}>
                              Pending
                            </Button>
                          )}
                        </Stack>
                      </Stack>
                    </Box>
                  );
                })}
                {jnfs.length === 0 && (
                  <EmptyState
                    variant="default"
                    title="No JNFs submitted yet"
                    description="Submit a Job Notification Form to get started with campus recruitment."
                  />
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid2>

        {/* INF List */}
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 3, overflow: "visible", height: "100%" }}>
            <Box sx={{ borderBottom: "1px solid #e2e8f0", px: 3, py: 2, bgcolor: "#f8fafc", borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
              <Typography variant="h6" fontWeight={700} color="secondary.main">
                Internship Notification Forms (INF)
              </Typography>
            </Box>
            <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
              <Stack divider={<Box sx={{ borderBottom: "1px solid #f1f5f9" }} />}>
                {infs.map((item) => {
                  const action = getEditAction(item.status, item.has_edited_once);
                  return (
                    <Box key={item.id} sx={{ p: 3, transition: "background-color 0.2s", "&:hover": { bgcolor: "#f8fafc" } }}>
                      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} spacing={2}>
                        <Box>
                          <Typography variant="subtitle1" fontWeight={700} color="text.primary" mb={0.5}>
                            {item.internship_title}
                          </Typography>
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <Box sx={{
                              px: 1, py: 0.25, borderRadius: 1, fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em",
                              bgcolor: `var(--mui-palette-${getStatusColor(item.status)}-light)`,
                              color: `var(--mui-palette-${getStatusColor(item.status)}-dark)`,
                              border: "1px solid", borderColor: `var(--mui-palette-${getStatusColor(item.status)}-main)`
                            }}>
                              {item.status.replace(/_/g, " ")}
                            </Box>
                            <Typography variant="caption" color="text.secondary" fontWeight={500}>
                              Updated {new Date(item.updated_at).toLocaleDateString()}
                            </Typography>
                          </Stack>
                        </Box>

                        <Stack direction="row" spacing={1}>
                          <Button component={Link} href={`/company/inf/${item.id}`} size="small" color="secondary" variant="text" sx={{ fontWeight: 600 }}>
                            View
                          </Button>
                          {action === "edit" && (
                            <Button component={Link} href={`/company/inf/${item.id}/edit`} size="small" color="secondary" variant="outlined" sx={{ borderRadius: 1.5, fontWeight: 600 }}>
                              Edit
                            </Button>
                          )}
                          {action === "request" && (
                            <Button size="small" color="warning" variant="outlined" sx={{ borderRadius: 1.5, fontWeight: 600 }} onClick={() => openModal({ type: "inf", id: item.id, title: item.internship_title })}>
                              Request Edit
                            </Button>
                          )}
                          {action === "pending" && (
                            <Button size="small" disabled variant="outlined" sx={{ borderRadius: 1.5, fontWeight: 600 }}>
                              Pending
                            </Button>
                          )}
                        </Stack>
                      </Stack>
                    </Box>
                  );
                })}
                {infs.length === 0 && (
                  <EmptyState
                    variant="default"
                    title="No INFs submitted yet"
                    description="Submit an Internship Notification Form to begin your internship drive."
                  />
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>

      {/* Request Edit Modal */}
      <Dialog open={!!modalTarget} onClose={() => setModalTarget(null)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Request Edit Access</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 3 }}>
            You are requesting to edit <strong>{modalTarget?.title}</strong>. Please provide a clear reason. The CDC admin will review and approve or reject your request.
          </DialogContentText>
          <Stack spacing={2.5}>
            <TextField
              label="Reason for Edit *"
              value={reason}
              onChange={(e) => { setReason(e.target.value); setReasonError(""); }}
              error={!!reasonError}
              helperText={reasonError || "Briefly explain why you need to modify this form."}
              fullWidth
              multiline
              rows={3}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
            <TextField
              label="Additional Comments (Optional)"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              fullWidth
              multiline
              rows={2}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalTarget(null)} disabled={submitting} color="inherit" sx={{ fontWeight: 600, borderRadius: 2 }}>
            Cancel
          </Button>
          <Button onClick={() => void handleSubmitRequest()} variant="contained" disabled={submitting} sx={{ borderRadius: 2, px: 3, fontWeight: 700, minWidth: 140 }}>
            {submitting ? "Submitting…" : "Submit Request"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}