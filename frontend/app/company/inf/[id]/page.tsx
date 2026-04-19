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
  has_edited_once: boolean;
};

/** Returns which action button to show */
function getEditAction(inf: Inf): "edit" | "request" | "pending" {
  if (inf.status === "draft") return "edit";
  if (inf.status === "submitted" && !inf.has_edited_once) return "edit";
  if (inf.status === "edit_requested") return "pending";
  return "request";
}

export default function ViewInfPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [inf, setInf] = useState<Inf | null>(null);
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
        const response = await companyApi<{ inf: Inf }>(`/company/infs/${id}`);
        setInf(response.inf);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load INF.");
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
    if (!inf) return;
    setSubmitting(true);
    try {
      await companyApi(`/company/infs/${inf.id}/request-edit`, {
        method: "POST",
        body: JSON.stringify({ reason: reason.trim(), comments: comments.trim() }),
      });
      setInf({ ...inf, status: "edit_requested" });
      setModalOpen(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to submit request.");
    } finally {
      setSubmitting(false);
    }
  };

  const action = inf ? getEditAction(inf) : null;

  return (
    <Stack spacing={2.5}>
      <Typography variant="h4" color="primary.main">
        INF Details
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {inf && (
        <Card>
          <CardContent>
            <Stack spacing={1.5}>
              <Typography>
                <strong>Title:</strong> {inf.internship_title}
              </Typography>
              <Typography>
                <strong>Description:</strong> {inf.internship_description}
              </Typography>
              <Typography>
                <strong>Location:</strong> {inf.internship_location ?? "-"}
              </Typography>
              <Typography>
                <strong>Stipend:</strong> {inf.stipend ?? "-"}
              </Typography>
              <Typography>
                <strong>Duration (weeks):</strong> {inf.internship_duration_weeks ?? "-"}
              </Typography>
              <Typography>
                <strong>Vacancies:</strong> {inf.vacancies ?? "-"}
              </Typography>
              <Typography>
                <strong>Deadline:</strong> {inf.application_deadline ?? "-"}
              </Typography>
              <Typography>
                <strong>Status:</strong>{" "}
                {inf.status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                {inf.status === "submitted" && inf.has_edited_once && (
                  <Typography component="span" variant="caption" color="warning.main" sx={{ ml: 1 }}>
                    (one-time edit used)
                  </Typography>
                )}
              </Typography>

              {action === "edit" && (
                <Button
                  component={Link}
                  href={`/company/inf/${inf.id}/edit`}
                  variant="contained"
                  sx={{ width: "fit-content" }}
                >
                  Edit INF
                </Button>
              )}
              {action === "request" && (
                <Button
                  variant="outlined"
                  color="warning"
                  sx={{ width: "fit-content" }}
                  onClick={handleOpenModal}
                >
                  Request to Edit INF
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
        <DialogTitle>Request to Edit INF</DialogTitle>
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
              helperText={reasonError || "Briefly explain why you need to modify this INF."}
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
