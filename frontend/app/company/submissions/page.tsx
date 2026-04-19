"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Alert,
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
import { companyApi } from "@/lib/companyApi";

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

  return (
    <Stack spacing={2.5}>
      <Typography variant="h4" color="primary.main">
        My Submissions
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}

      <Grid2 container spacing={2}>
        {/* JNF List */}
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                JNF Submissions
              </Typography>
              <Stack spacing={1}>
                {jnfs.map((item) => {
                  const action = getEditAction(item.status, item.has_edited_once);
                  return (
                    <Stack
                      key={item.id}
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="body2">
                        {item.job_title}{" "}
                        <Typography component="span" variant="caption" color="text.secondary">
                          ({item.status.replace(/_/g, " ")})
                        </Typography>
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        <Button
                          component={Link}
                          href={`/company/jnf/${item.id}`}
                          size="small"
                        >
                          View
                        </Button>
                        {action === "edit" && (
                          <Button
                            component={Link}
                            href={`/company/jnf/${item.id}/edit`}
                            size="small"
                            variant="outlined"
                          >
                            Edit
                          </Button>
                        )}
                        {action === "request" && (
                          <Button
                            size="small"
                            color="warning"
                            variant="outlined"
                            onClick={() =>
                              openModal({ type: "jnf", id: item.id, title: item.job_title })
                            }
                          >
                            Request Edit
                          </Button>
                        )}
                        {action === "pending" && (
                          <Button size="small" disabled>
                            Edit Requested
                          </Button>
                        )}
                      </Stack>
                    </Stack>
                  );
                })}
                {jnfs.length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    No JNFs submitted yet.
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid2>

        {/* INF List */}
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                INF Submissions
              </Typography>
              <Stack spacing={1}>
                {infs.map((item) => {
                  const action = getEditAction(item.status, item.has_edited_once);
                  return (
                    <Stack
                      key={item.id}
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="body2">
                        {item.internship_title}{" "}
                        <Typography component="span" variant="caption" color="text.secondary">
                          ({item.status.replace(/_/g, " ")})
                        </Typography>
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        <Button
                          component={Link}
                          href={`/company/inf/${item.id}`}
                          size="small"
                        >
                          View
                        </Button>
                        {action === "edit" && (
                          <Button
                            component={Link}
                            href={`/company/inf/${item.id}/edit`}
                            size="small"
                            variant="outlined"
                          >
                            Edit
                          </Button>
                        )}
                        {action === "request" && (
                          <Button
                            size="small"
                            color="warning"
                            variant="outlined"
                            onClick={() =>
                              openModal({ type: "inf", id: item.id, title: item.internship_title })
                            }
                          >
                            Request Edit
                          </Button>
                        )}
                        {action === "pending" && (
                          <Button size="small" disabled>
                            Edit Requested
                          </Button>
                        )}
                      </Stack>
                    </Stack>
                  );
                })}
                {infs.length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    No INFs submitted yet.
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>

      {/* Request Edit Modal */}
      <Dialog open={!!modalTarget} onClose={() => setModalTarget(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Request to Edit — {modalTarget?.title}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Your form has already been submitted. Please provide a reason. The CDC admin will
            review and approve or reject your request.
          </DialogContentText>
          <Stack spacing={2}>
            <TextField
              label="Reason for Edit *"
              value={reason}
              onChange={(e) => { setReason(e.target.value); setReasonError(""); }}
              error={!!reasonError}
              helperText={reasonError || "Briefly explain why you need to modify this form."}
              fullWidth
              multiline
              rows={3}
            />
            <TextField
              label="Additional Comments (Optional)"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              fullWidth
              multiline
              rows={2}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalTarget(null)} disabled={submitting}>
            Cancel
          </Button>
          <Button
            onClick={() => void handleSubmitRequest()}
            variant="contained"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Request"}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
