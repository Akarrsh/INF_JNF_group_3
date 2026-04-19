"use client";

import { useEffect, useState, use } from "react";
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
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { companyApi } from "@/lib/companyApi";

type Jnf = {
  id: number;
  job_title: string;
  job_description: string;
  job_location: string | null;
  ctc_min: number | null;
  ctc_max: number | null;
  vacancies: number | null;
  application_deadline: string | null;
  status: string;
  has_edited_once: boolean;
};

/** Returns which action button to show and whether it's enabled */
function getEditAction(jnf: Jnf): "edit" | "request" | "pending" {
  if (jnf.status === "draft") return "edit";
  if (jnf.status === "submitted" && !jnf.has_edited_once) return "edit";
  if (jnf.status === "edit_requested") return "pending";
  return "request";
}

export default function ViewJnfPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [jnf, setJnf] = useState<Jnf | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [comments, setComments] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reasonError, setReasonError] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        const response = await companyApi<{ jnf: Jnf }>(`/company/jnfs/${id}`);
        setJnf(response.jnf);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load JNF.");
      }
    };
    void run();
  }, [id]);

  const handleOpenModal = () => {
    setReason("");
    setComments("");
    setReasonError("");
    setModalOpen(true);
  };

  const handleSubmitRequest = async () => {
    if (!reason.trim()) {
      setReasonError("Reason is required.");
      return;
    }
    if (!jnf) return;
    setSubmitting(true);
    try {
      await companyApi(`/company/jnfs/${jnf.id}/request-edit`, {
        method: "POST",
        body: JSON.stringify({ reason: reason.trim(), comments: comments.trim() }),
      });
      setJnf({ ...jnf, status: "edit_requested" });
      setModalOpen(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to submit request.");
    } finally {
      setSubmitting(false);
    }
  };

  const action = jnf ? getEditAction(jnf) : null;

  return (
    <Stack spacing={2.5}>
      <Typography variant="h4" color="primary.main">
        JNF Details
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {jnf && (
        <Card>
          <CardContent>
            <Stack spacing={1.5}>
              <Typography>
                <strong>Title:</strong> {jnf.job_title}
              </Typography>
              <Typography>
                <strong>Description:</strong> {jnf.job_description}
              </Typography>
              <Typography>
                <strong>Location:</strong> {jnf.job_location ?? "-"}
              </Typography>
              <Typography>
                <strong>CTC:</strong> {jnf.ctc_min ?? "-"} –{" "}
                {jnf.ctc_max ?? "-"}
              </Typography>
              <Typography>
                <strong>Vacancies:</strong> {jnf.vacancies ?? "-"}
              </Typography>
              <Typography>
                <strong>Deadline:</strong> {jnf.application_deadline ?? "-"}
              </Typography>
              <Typography>
                <strong>Status:</strong>{" "}
                {jnf.status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                {jnf.status === "submitted" && jnf.has_edited_once && (
                  <Typography component="span" variant="caption" color="warning.main" sx={{ ml: 1 }}>
                    (one-time edit used)
                  </Typography>
                )}
              </Typography>

              {action === "edit" && (
                <Button
                  component={Link}
                  href={`/company/jnf/${jnf.id}/edit`}
                  variant="contained"
                  sx={{ width: "fit-content" }}
                >
                  Edit JNF
                </Button>
              )}
              {action === "request" && (
                <Button
                  variant="outlined"
                  color="warning"
                  sx={{ width: "fit-content" }}
                  onClick={handleOpenModal}
                >
                  Request to Edit JNF
                </Button>
              )}
              {action === "pending" && (
                <Button variant="outlined" disabled sx={{ width: "fit-content" }}>
                  Edit Request Pending
                </Button>
              )}
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Request Edit Modal */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Request to Edit JNF</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Your form has already been submitted. Please provide a reason for needing to edit it.
            The CDC admin will review and approve or reject your request.
          </DialogContentText>
          <Stack spacing={2}>
            <TextField
              label="Reason for Edit *"
              value={reason}
              onChange={(e) => { setReason(e.target.value); setReasonError(""); }}
              error={!!reasonError}
              helperText={reasonError || "Briefly explain why you need to modify this JNF."}
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
          <Button onClick={() => setModalOpen(false)} disabled={submitting}>
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
