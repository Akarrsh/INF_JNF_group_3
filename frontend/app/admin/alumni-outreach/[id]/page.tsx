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
  Paper,
  Stack,
  Typography,
  alpha,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PeopleIcon from "@mui/icons-material/People";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WorkIcon from "@mui/icons-material/Work";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import SchoolIcon from "@mui/icons-material/School";
import { adminApi } from "@/lib/adminApi";

type AlumniOutreach = {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  completion_year: number;
  degree: string;
  degree_other: string | null;
  branch: string;
  current_job: string;
  areas_of_interest: string;
  linkedin_profile: string;
  current_location: string | null;
  willing_to_visit: string | null;
  general_comments: string | null;
  created_at: string;
  updated_at: string;
};

const DEGREE_LABELS: Record<string, string> = {
  be_btech_barch: "BE / BTech / BArch",
  me_mtech_march: "ME / MTech / MArch",
  integrated_dual: "Integrated Dual Degree",
  msc: "MSc / MSc.Tech",
  mba: "MBA",
  phd: "PhD",
};

function InfoRow({ label, value, icon }: { label: string; value: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <Grid2 size={{ xs: 12, sm: 6 }}>
      <Stack direction="row" spacing={1} alignItems="flex-start">
        {icon && <Box sx={{ color: "primary.main", mt: 0.3 }}>{icon}</Box>}
        <Box>
          <Typography variant="caption" color="text.secondary" display="block">{label}</Typography>
          <Typography variant="body2" fontWeight={500}>{value || "—"}</Typography>
        </Box>
      </Stack>
    </Grid2>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card sx={{ mb: 2 }}>
      <Box sx={{ px: 2.5, py: 1.5, bgcolor: alpha("#1565c0", 0.05), borderBottom: "1px solid", borderColor: "divider" }}>
        <Typography variant="subtitle1" fontWeight={700} color="primary">{title}</Typography>
      </Box>
      <CardContent>
        <Grid2 container spacing={2.5}>
          {children}
        </Grid2>
      </CardContent>
    </Card>
  );
}

export default function AdminAlumniOutreachDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [alumni, setAlumni] = useState<AlumniOutreach | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await adminApi<{ alumni_outreach: AlumniOutreach }>(`/admin/alumni-outreach/${params.id}`);
        setAlumni(res.alumni_outreach);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load submission.");
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, [params.id]);

  if (loading) {
    return (
      <Box sx={{ py: 4 }}>
        <LinearProgress />
        <Typography textAlign="center" mt={2}>Loading alumni details...</Typography>
      </Box>
    );
  }

  if (error || !alumni) {
    return <Alert severity="error">{error ?? "Submission not found."}</Alert>;
  }

  const degreeLabel = DEGREE_LABELS[alumni.degree] ?? alumni.degree_other ?? alumni.degree;
  const visitChip = {
    yes: { label: "✅ Yes – Willing to Visit", color: "success" as const },
    no: { label: "❌ Not Willing to Visit", color: "error" as const },
    maybe: { label: "🤔 Maybe", color: "warning" as const },
  }[alumni.willing_to_visit ?? ""] ?? { label: "Not specified", color: "default" as const };

  return (
    <Box>
      {/* Header */}
      <Paper
        sx={{
          p: 2,
          mb: 3,
          background: (theme) =>
            `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
          color: "white",
          borderRadius: 2,
        }}
      >
        <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ md: "center" }} spacing={2}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ width: 52, height: 52, bgcolor: "white", color: "primary.main", fontSize: 22, fontWeight: 700 }}>
              {alumni.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight={700}>{alumni.name}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {degreeLabel} • {alumni.branch} • Class of {alumni.completion_year}
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip {...visitChip} sx={{ fontWeight: 600 }} />
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => router.push("/admin/alumni-outreach")}
              sx={{ color: "white", borderColor: "white", "&:hover": { borderColor: "white", bgcolor: alpha("#fff", 0.1) } }}
            >
              Back
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <Grid2 container spacing={3}>
        {/* Main */}
        <Grid2 size={{ xs: 12, md: 8 }}>
          <Section title="Contact Information">
            <InfoRow label="Email" value={<a href={`mailto:${alumni.email}`} style={{ color: "#1565c0" }}>{alumni.email}</a>} icon={<EmailIcon fontSize="small" />} />
            <InfoRow label="Phone Number" value={alumni.phone_number} icon={<PhoneIcon fontSize="small" />} />
            <InfoRow label="Current Location" value={alumni.current_location} icon={<LocationOnIcon fontSize="small" />} />
          </Section>

          <Section title="Academic Background">
            <InfoRow label="Degree" value={degreeLabel} icon={<SchoolIcon fontSize="small" />} />
            <InfoRow label="Branch / Department" value={alumni.branch} />
            <InfoRow label="Year of Completion" value={alumni.completion_year} />
          </Section>

          <Section title="Professional Details">
            <InfoRow label="Current Job" value={alumni.current_job} icon={<WorkIcon fontSize="small" />} />
            <Grid2 size={12}>
              <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>Areas of Interest</Typography>
              <Paper variant="outlined" sx={{ p: 2, bgcolor: "grey.50" }}>
                <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>{alumni.areas_of_interest}</Typography>
              </Paper>
            </Grid2>
            <Grid2 size={12}>
              <Stack direction="row" spacing={1} alignItems="center">
                <LinkedInIcon sx={{ color: "#0077b5" }} />
                <Button
                  component="a"
                  href={alumni.linkedin_profile}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outlined"
                  size="small"
                  sx={{ borderColor: "#0077b5", color: "#0077b5", textTransform: "none" }}
                >
                  {alumni.linkedin_profile}
                </Button>
              </Stack>
            </Grid2>
          </Section>

          {alumni.general_comments && (
            <Section title="General Comments">
              <Grid2 size={12}>
                <Paper variant="outlined" sx={{ p: 2, bgcolor: "grey.50" }}>
                  <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>{alumni.general_comments}</Typography>
                </Paper>
              </Grid2>
            </Section>
          )}
        </Grid2>

        {/* Sidebar */}
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Card sx={{ position: "sticky", top: 16 }}>
            <Box sx={{ px: 2, py: 1.5, bgcolor: "primary.main", color: "white" }}>
              <Typography variant="subtitle1" fontWeight={600}>Quick Overview</Typography>
            </Box>
            <CardContent>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Submitted On</Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {new Date(alumni.created_at).toLocaleString()}
                  </Typography>
                </Box>
                <Divider />
                <Box>
                  <Typography variant="caption" color="text.secondary">Willing to Visit Campus</Typography>
                  <Box mt={0.5}><Chip {...visitChip} size="small" /></Box>
                </Box>
                <Divider />
                <Button
                  component="a"
                  href={`mailto:${alumni.email}`}
                  variant="contained"
                  startIcon={<EmailIcon />}
                  fullWidth
                >
                  Email This Alumni
                </Button>
                <Button
                  component="a"
                  href={alumni.linkedin_profile}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outlined"
                  startIcon={<LinkedInIcon sx={{ color: "#0077b5" }} />}
                  fullWidth
                  sx={{ borderColor: "#0077b5", color: "#0077b5" }}
                >
                  View on LinkedIn
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
    </Box>
  );
}
