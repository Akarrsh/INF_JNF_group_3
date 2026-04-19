"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Alert, Box, Button, Chip, CircularProgress, Paper, Stack, Typography } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import EditOffIcon from "@mui/icons-material/EditOff";
import JnfFormPro from "@/components/forms/JnfFormPro";
import { companyApi } from "@/lib/companyApi";

type JnfFull = {
  id: number;
  job_title: string;
  job_description: string;
  job_location: string | null;
  ctc_min: number | null;
  ctc_max: number | null;
  vacancies: number | null;
  application_deadline: string | null;
  admin_remarks: string | null;
  status: string;
  has_edited_once: boolean;
  form_data?: string | object | null;
};

function isDirectlyEditable(jnf: JnfFull): boolean {
  if (jnf.status === "draft") return true;
  if (jnf.status === "submitted" && !jnf.has_edited_once) return true;
  return false;
}

const parseFormData = (data: string | object | null | undefined) => {
  if (!data) return null;
  if (typeof data === "string") {
    try { return JSON.parse(data); } catch { return null; }
  }
  return data;
};

export default function EditJnfPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [jnf, setJnf] = useState<JnfFull | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      try {
        const response = await companyApi<{ jnf: JnfFull }>(`/company/jnfs/${id}`);
        setJnf(response.jnf);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load JNF.");
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
      </Box>
    );
  }

  // Access guard — block if the form is not directly editable
  if (jnf && !isDirectlyEditable(jnf)) {
    return (
      <Box sx={{ maxWidth: 600, mx: "auto", textAlign: "center", py: 8 }}>
        <Typography variant="h5" color="error" gutterBottom>
          This JNF cannot be edited
        </Typography>
        <Typography color="text.secondary" mb={3}>
          {jnf.status === "edit_requested"
            ? "Your edit request is pending admin approval."
            : "This form has already used its one-time post-submission edit. Use \"Request to Edit\" to ask the CDC admin for permission."}
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button variant="outlined" onClick={() => router.push(`/company/jnf/${jnf.id}`)}>
            View JNF
          </Button>
          <Button variant="contained" onClick={() => router.push("/company")}>
            Go to Dashboard
          </Button>
        </Stack>
      </Box>
    );
  }

  const parsedFormData = parseFormData(jnf?.form_data);
  const initialData = parsedFormData
    ? { ...parsedFormData, id: jnf?.id }
    : {
        id: jnf?.id,
        jobTitle: jnf?.job_title ?? "",
        jobDescription: jnf?.job_description ?? "",
        jobLocation: jnf?.job_location ?? "",
        expectedHires: jnf?.vacancies?.toString() ?? "",
      };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {jnf?.status === "submitted" && !jnf.has_edited_once && (
        <Paper
          elevation={0}
          sx={{
            mb: 3,
            p: 0,
            border: "2px solid",
            borderColor: "warning.main",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          {/* Header strip */}
          <Box
            sx={{
              bgcolor: "warning.main",
              px: 3,
              py: 1.5,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <WarningAmberIcon sx={{ color: "warning.contrastText", fontSize: 22 }} />
            <Typography variant="subtitle1" fontWeight={700} color="warning.contrastText">
              ONE-TIME EDIT — USE CAREFULLY
            </Typography>
            <Chip
              label="1 edit remaining"
              size="small"
              sx={{
                ml: "auto",
                bgcolor: "warning.contrastText",
                color: "warning.main",
                fontWeight: 700,
                fontSize: "0.75rem",
              }}
            />
          </Box>

          {/* Body */}
          <Box sx={{ px: 3, py: 2, bgcolor: "warning.50", display: "flex", gap: 2, alignItems: "flex-start" }}>
            <EditOffIcon sx={{ color: "warning.dark", mt: 0.3, flexShrink: 0 }} />
            <Box>
              <Typography variant="body2" color="warning.dark" fontWeight={600} mb={0.5}>
                This JNF has already been submitted. You are allowed to make <u>exactly one</u> set of changes.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                After you save, this form will be permanently locked. Any further changes will require you to submit a
                formal <strong>"Request to Edit"</strong> to the CDC Admin for approval.
              </Typography>
            </Box>
          </Box>
        </Paper>
      )}
      {jnf && (
        <JnfFormPro
          initialData={initialData}
          onSaved={(savedId) => router.push(`/company/jnf/${savedId}`)}
        />
      )}
    </Box>
  );
}
