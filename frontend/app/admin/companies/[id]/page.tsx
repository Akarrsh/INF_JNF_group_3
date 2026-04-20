"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid2,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import BusinessIcon from "@mui/icons-material/Business";
import WorkIcon from "@mui/icons-material/Work";
import SchoolIcon from "@mui/icons-material/School";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import CancelIcon from "@mui/icons-material/Cancel";
import { adminApi } from "@/lib/adminApi";

type Company = {
  id: number;
  name: string;
  industry: string | null;
  website: string | null;
  hr_name: string;
  hr_email: string;
  hr_phone: string | null;
};

type CompanySummary = {
  jnf_total: number;
  jnf_pending: number;
  jnf_accepted: number;
  jnf_rejected: number;
  inf_total: number;
  inf_pending: number;
  inf_accepted: number;
  inf_rejected: number;
};

export default function AdminCompanyDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [company, setCompany] = useState<Company | null>(null);
  const [summary, setSummary] = useState<CompanySummary | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const response = await adminApi<{
          company: Company;
          summary: CompanySummary;
        }>(`/admin/companies/${params.id}`);
        setCompany(response.company);
        setSummary(response.summary);
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "Failed to load company details.",
        );
      }
    };

    void run();
  }, [params.id]);

  const onSave = async () => {
    if (!company) {
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await adminApi<{ company: Company }>(
        `/admin/companies/${params.id}`,
        {
          method: "PUT",
          body: JSON.stringify(company),
        },
      );
      setCompany(response.company);
      setSuccess("Company profile updated successfully.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update company.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ pb: 6, maxWidth: 900, mx: "auto" }}>
      {/* Header */}
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} spacing={2} sx={{ mb: 4 }}>
        <Box>
          <Stack direction="row" spacing={1.5} alignItems="center" mb={0.5}>
            <BusinessIcon color="primary" />
            <Typography variant="h4" fontWeight={800} color="text.primary" letterSpacing="-0.02em">
              {company?.name ?? "Company Details"}
            </Typography>
          </Stack>
          <Typography variant="body1" color="text.secondary">
            {company?.industry ?? "Manage company profile and submission history"}
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push("/admin/companies")}
          sx={{ borderRadius: 2, fontWeight: 700, whiteSpace: "nowrap", alignSelf: { xs: "flex-start", sm: "auto" } }}
        >
          Back to Companies
        </Button>
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>{success}</Alert>}

      {/* Summary KPI cards */}
      {summary && (
        <Grid2 container spacing={2.5} sx={{ mb: 4 }}>
          {[
            { label: "JNF Total",    value: summary.jnf_total,    color: "primary.main",  icon: <WorkIcon /> },
            { label: "JNF Pending",  value: summary.jnf_pending,  color: "warning.main",  icon: <PendingIcon /> },
            { label: "JNF Accepted", value: summary.jnf_accepted, color: "success.main",  icon: <CheckCircleIcon /> },
            { label: "JNF Rejected", value: summary.jnf_rejected, color: "error.main",    icon: <CancelIcon /> },
            { label: "INF Total",    value: summary.inf_total,    color: "secondary.main", icon: <SchoolIcon /> },
            { label: "INF Pending",  value: summary.inf_pending,  color: "warning.main",  icon: <PendingIcon /> },
            { label: "INF Accepted", value: summary.inf_accepted, color: "success.main",  icon: <CheckCircleIcon /> },
            { label: "INF Rejected", value: summary.inf_rejected, color: "error.main",    icon: <CancelIcon /> },
          ].map(({ label, value, color, icon }) => (
            <Grid2 key={label} size={{ xs: 6, sm: 3 }}>
              <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 2.5 }}>
                <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase" fontSize="0.65rem" letterSpacing="0.07em" display="block">
                        {label}
                      </Typography>
                      <Typography variant="h4" fontWeight={800} color={color} lineHeight={1.2} mt={0.5}>
                        {value}
                      </Typography>
                    </Box>
                    <Box sx={{ color, opacity: 0.25, "& svg": { fontSize: 28 } }}>{icon}</Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid2>
          ))}
        </Grid2>
      )}

      {/* Edit form */}
      {company && (
        <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 3 }}>
          <Box sx={{ px: 3, py: 2.5, borderBottom: "1px solid #f1f5f9", bgcolor: "#f8fafc", borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <BusinessIcon fontSize="small" color="primary" />
              <Typography variant="subtitle1" fontWeight={700}>Company Profile</Typography>
              <Chip label="Editable" size="small" color="primary" variant="outlined" sx={{ fontWeight: 600, fontSize: "0.7rem" }} />
            </Stack>
          </Box>
          <CardContent sx={{ p: 3 }}>
            <Grid2 container spacing={3}>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Company Name"
                  value={company.name}
                  onChange={(e) =>
                    setCompany((prev) =>
                      prev ? { ...prev, name: e.target.value } : prev,
                    )
                  }
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Industry"
                  value={company.industry ?? ""}
                  onChange={(e) =>
                    setCompany((prev) =>
                      prev ? { ...prev, industry: e.target.value } : prev,
                    )
                  }
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
              </Grid2>
              <Grid2 size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Website"
                  value={company.website ?? ""}
                  onChange={(e) =>
                    setCompany((prev) =>
                      prev ? { ...prev, website: e.target.value } : prev,
                    )
                  }
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
              </Grid2>

              {/* Divider section */}
              <Grid2 size={{ xs: 12 }}>
                <Typography variant="overline" color="text.secondary" fontWeight={700} letterSpacing="0.1em">
                  HR Contact
                </Typography>
              </Grid2>

              <Grid2 size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label="HR Name"
                  value={company.hr_name}
                  onChange={(e) =>
                    setCompany((prev) =>
                      prev ? { ...prev, hr_name: e.target.value } : prev,
                    )
                  }
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  type="email"
                  label="HR Email"
                  value={company.hr_email}
                  onChange={(e) =>
                    setCompany((prev) =>
                      prev ? { ...prev, hr_email: e.target.value } : prev,
                    )
                  }
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label="HR Phone"
                  value={company.hr_phone ?? ""}
                  onChange={(e) =>
                    setCompany((prev) =>
                      prev ? { ...prev, hr_phone: e.target.value } : prev,
                    )
                  }
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
              </Grid2>
            </Grid2>

            <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<SaveIcon />}
                onClick={() => void onSave()}
                disabled={saving}
                sx={{
                  borderRadius: 2,
                  px: 5,
                  fontWeight: 700,
                  boxShadow: "0 4px 14px rgba(26,58,92,0.2)",
                  "&:hover": { boxShadow: "0 6px 20px rgba(26,58,92,0.3)" },
                }}
              >
                {saving ? "Saving…" : "Save Changes"}
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
