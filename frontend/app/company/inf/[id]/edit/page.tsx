"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Alert, Box, Button, Chip, CircularProgress, Paper, Stack, Typography } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import EditOffIcon from "@mui/icons-material/EditOff";
import InfFormPro from "@/components/forms/InfFormPro";
import { companyApi } from "@/lib/companyApi";

type InfFull = {
  id: number;
  internship_title: string;
  internship_description: string;
  internship_location: string | null;
  stipend: number | null;
  internship_duration_weeks: number | null;
  vacancies: number | null;
  application_deadline: string | null;
  admin_remarks: string | null;
  status: string;
  has_edited_once: boolean;
  form_data?: string | object | null;
};

function isDirectlyEditable(inf: InfFull): boolean {
  if (inf.status === "draft") return true;
  if (inf.status === "submitted" && !inf.has_edited_once) return true;
  return false;
}

const parseFormData = (data: string | object | null | undefined) => {
  if (!data) return null;
  if (typeof data === "string") {
    try { return JSON.parse(data); } catch { return null; }
  }
  return data;
};

export default function EditInfPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [inf, setInf] = useState<InfFull | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      try {
        const response = await companyApi<{ inf: InfFull }>(`/company/infs/${id}`);
        setInf(response.inf);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load INF.");
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
  if (inf && !isDirectlyEditable(inf)) {
    return (
      <Box sx={{ maxWidth: 600, mx: "auto", textAlign: "center", py: 8 }}>
        <Typography variant="h5" color="error" gutterBottom>
          This INF cannot be edited
        </Typography>
        <Typography color="text.secondary" mb={3}>
          {inf.status === "edit_requested"
            ? "Your edit request is pending admin approval."
            : "This form has already used its one-time post-submission edit. Use \"Request to Edit\" to ask the CDC admin for permission."}
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button variant="outlined" onClick={() => router.push(`/company/inf/${inf.id}`)}>
            View INF
          </Button>
          <Button variant="contained" onClick={() => router.push("/company")}>
            Go to Dashboard
          </Button>
        </Stack>
      </Box>
    );
  }

  const parsedFormData = parseFormData(inf?.form_data);
  const initialData = parsedFormData
    ? { ...parsedFormData, id: inf?.id }
    : {
        id: inf?.id,
        internshipTitle: inf?.internship_title ?? "",
        internshipDescription: inf?.internship_description ?? "",
        internshipLocation: inf?.internship_location ?? "",
        duration: inf?.internship_duration_weeks?.toString() ?? "",
        expectedHires: inf?.vacancies?.toString() ?? "",
      };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {inf?.status === "submitted" && !inf.has_edited_once && (
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
                This INF has already been submitted. You are allowed to make <u>exactly one</u> set of changes.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                After you save, this form will be permanently locked. Any further changes will require you to submit a
                formal <strong>"Request to Edit"</strong> to the CDC Admin for approval.
              </Typography>
            </Box>
          </Box>
        </Paper>
      )}
      {inf && (
        <InfFormPro
          initialData={initialData}
          onSaved={(savedId) => router.push(`/company/inf/${savedId}`)}
        />
      )}
    </Box>
  );
}
