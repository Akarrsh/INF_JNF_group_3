"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Alert,
  Button,
  Card,
  CardContent,
  Grid2,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
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
      setSuccess("Company profile updated.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update company.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Stack spacing={2.5}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" color="primary.main">
          Company Details
        </Typography>
        <Button
          variant="outlined"
          onClick={() => router.push("/admin/companies")}
        >
          Back to Companies
        </Button>
      </Stack>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      {summary && (
        <Card>
          <CardContent>
            <Grid2 container spacing={2}>
              {[
                ["JNF Total", summary.jnf_total],
                ["JNF Pending", summary.jnf_pending],
                ["JNF Accepted", summary.jnf_accepted],
                ["JNF Rejected", summary.jnf_rejected],
                ["INF Total", summary.inf_total],
                ["INF Pending", summary.inf_pending],
                ["INF Accepted", summary.inf_accepted],
                ["INF Rejected", summary.inf_rejected],
              ].map(([label, value]) => (
                <Grid2 key={label} size={{ xs: 6, md: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    {label}
                  </Typography>
                  <Typography variant="h6">{value}</Typography>
                </Grid2>
              ))}
            </Grid2>
          </CardContent>
        </Card>
      )}

      {company && (
        <Card>
          <CardContent>
            <Grid2 container spacing={2}>
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
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Website"
                  value={company.website ?? ""}
                  onChange={(e) =>
                    setCompany((prev) =>
                      prev ? { ...prev, website: e.target.value } : prev,
                    )
                  }
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="HR Name"
                  value={company.hr_name}
                  onChange={(e) =>
                    setCompany((prev) =>
                      prev ? { ...prev, hr_name: e.target.value } : prev,
                    )
                  }
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6 }}>
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
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="HR Phone"
                  value={company.hr_phone ?? ""}
                  onChange={(e) =>
                    setCompany((prev) =>
                      prev ? { ...prev, hr_phone: e.target.value } : prev,
                    )
                  }
                />
              </Grid2>
            </Grid2>

            <Button
              sx={{ mt: 2 }}
              variant="contained"
              onClick={() => void onSave()}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </CardContent>
        </Card>
      )}
    </Stack>
  );
}
