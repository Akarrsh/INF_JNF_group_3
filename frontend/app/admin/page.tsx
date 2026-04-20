"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid2,
  IconButton,
  LinearProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import BusinessIcon from "@mui/icons-material/Business";
import WorkIcon from "@mui/icons-material/Work";
import SchoolIcon from "@mui/icons-material/School";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import CancelIcon from "@mui/icons-material/Cancel";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import VisibilityIcon from "@mui/icons-material/Visibility";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AssignmentIcon from "@mui/icons-material/Assignment";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { adminApi } from "@/lib/adminApi";

type DashboardData = {
  stats: {
    companies_total: number;
    companies_with_submissions: number;
    jnf_total: number;
    jnf_submitted: number;
    jnf_under_review: number;
    jnf_accepted: number;
    jnf_rejected: number;
    inf_total: number;
    inf_submitted: number;
    inf_under_review: number;
    inf_accepted: number;
    inf_rejected: number;
    pending_reviews: number;
  };
  recent_submissions: {
    jnfs: Array<{
      id: number;
      job_title: string;
      status: string;
      updated_at: string;
      company?: { name: string };
    }>;
    infs: Array<{
      id: number;
      internship_title: string;
      status: string;
      updated_at: string;
      company?: { name: string };
    }>;
  };
};

const STATUS_CONFIG: Record<string, { color: "success" | "warning" | "info" | "error" | "default"; label: string }> = {
  accepted:     { color: "success", label: "Accepted" },
  submitted:    { color: "warning", label: "Submitted" },
  under_review: { color: "info",    label: "Under Review" },
  rejected:     { color: "error",   label: "Rejected" },
  draft:        { color: "default", label: "Draft" },
};

const StatusChip = ({ status }: { status: string }) => {
  const cfg = STATUS_CONFIG[status] ?? { color: "default" as const, label: status };
  return (
    <Chip
      label={cfg.label}
      size="small"
      color={cfg.color}
      sx={{ fontWeight: 600, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.04em" }}
    />
  );
};

export default function AdminPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const response = await adminApi<DashboardData>("/admin/dashboard");
        setData(response);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load admin dashboard.");
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, []);

  if (loading) {
    return (
      <Box sx={{ py: 6 }}>
        <LinearProgress sx={{ borderRadius: 1, mb: 3 }} />
        <Typography textAlign="center" color="text.secondary">Loading dashboard…</Typography>
      </Box>
    );
  }

  const stats = data?.stats;

  const kpiCards = [
    {
      label: "Total Companies",
      value: stats?.companies_total ?? 0,
      sub: `${stats?.companies_with_submissions ?? 0} with submissions`,
      icon: <BusinessIcon />,
      iconBg: "#1a3a5c",
      href: "/admin/companies",
    },
    {
      label: "Pending Reviews",
      value: stats?.pending_reviews ?? 0,
      sub: "Needs attention",
      icon: <NotificationsActiveIcon />,
      iconBg: "#b45309",
      href: "/admin/jnfs?status=submitted",
      urgent: (stats?.pending_reviews ?? 0) > 0,
    },
    {
      label: "JNFs",
      value: stats?.jnf_total ?? 0,
      sub: `${stats?.jnf_accepted ?? 0} accepted · ${stats?.jnf_submitted ?? 0} pending`,
      icon: <WorkIcon />,
      iconBg: "#1e40af",
      href: "/admin/jnfs",
    },
    {
      label: "INFs",
      value: stats?.inf_total ?? 0,
      sub: `${stats?.inf_accepted ?? 0} accepted · ${stats?.inf_submitted ?? 0} pending`,
      icon: <SchoolIcon />,
      iconBg: "#5b21b6",
      href: "/admin/infs",
    },
  ];

  return (
    <Box sx={{ pb: 6, maxWidth: 1400, mx: "auto" }}>
      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

      {/* Page header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={800} color="text.primary" letterSpacing="-0.02em" mb={0.5}>
          Admin Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          IIT (ISM) Dhanbad — Career Development Centre Operations
        </Typography>
      </Box>

      {/* Urgent pending alert */}
      {(stats?.pending_reviews ?? 0) > 0 && (
        <Alert
          severity="warning"
          sx={{ mb: 3, borderRadius: 2, fontWeight: 500 }}
          action={
            <Button component={Link} href="/admin/jnfs?status=submitted" size="small" color="warning" variant="outlined" sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>
              Review Now
            </Button>
          }
        >
          <strong>{stats?.pending_reviews} submissions</strong> are pending review — please act at your earliest.
        </Alert>
      )}

      {/* KPI Cards */}
      <Grid2 container spacing={3} sx={{ mb: 4 }}>
        {kpiCards.map((card) => (
          <Grid2 key={card.label} size={{ xs: 12, sm: 6, lg: 3 }}>
            <Card
              component={Link}
              href={card.href}
              elevation={0}
              sx={{
                border: "1px solid",
                borderColor: card.urgent ? "warning.main" : "#e2e8f0",
                borderRadius: 3,
                p: 0.5,
                height: "100%",
                cursor: "pointer",
                transition: "all 0.2s ease",
                bgcolor: card.urgent ? alpha("#f59e0b", 0.05) : "white",
                textDecoration: "none",
                display: "block",
                "&:hover": {
                  borderColor: card.urgent ? "warning.dark" : "primary.main",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase" letterSpacing="0.08em" fontSize="0.7rem">
                      {card.label}
                    </Typography>
                    <Typography variant="h3" fontWeight={800} color={card.urgent ? "warning.dark" : "text.primary"} lineHeight={1.1} mt={0.5}>
                      {card.value}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" mt={0.5} display="block">
                      {card.sub}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: card.iconBg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      flexShrink: 0,
                    }}
                  >
                    {card.icon}
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid2>
        ))}
      </Grid2>

      {/* Breakdown row */}
      <Grid2 container spacing={3} sx={{ mb: 4 }}>
        {/* JNF breakdown */}
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 3, height: "100%" }}>
            <Box sx={{ px: 3, py: 2, borderBottom: "1px solid #f1f5f9", bgcolor: "#f8fafc", borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack direction="row" spacing={1} alignItems="center">
                  <WorkIcon fontSize="small" color="primary" />
                  <Typography variant="subtitle1" fontWeight={700}>JNF Status Breakdown</Typography>
                </Stack>
                <Button component={Link} href="/admin/jnfs" size="small" endIcon={<ArrowForwardIcon />} sx={{ fontWeight: 600 }}>
                  View Queue
                </Button>
              </Stack>
            </Box>
            <CardContent sx={{ p: 3 }}>
              <Grid2 container spacing={2}>
                {[
                  { label: "Submitted", value: stats?.jnf_submitted ?? 0, color: "warning.main" },
                  { label: "Under Review", value: stats?.jnf_under_review ?? 0, color: "info.main" },
                  { label: "Accepted", value: stats?.jnf_accepted ?? 0, color: "success.main" },
                  { label: "Rejected", value: stats?.jnf_rejected ?? 0, color: "error.main" },
                ].map((s) => (
                  <Grid2 key={s.label} size={{ xs: 6 }}>
                    <Box sx={{ p: 2, bgcolor: "#f8fafc", borderRadius: 2, border: "1px solid #e2e8f0" }}>
                      <Typography variant="h5" fontWeight={800} color={s.color}>{s.value}</Typography>
                      <Typography variant="caption" color="text.secondary" fontWeight={500}>{s.label}</Typography>
                    </Box>
                  </Grid2>
                ))}
              </Grid2>
            </CardContent>
          </Card>
        </Grid2>

        {/* INF breakdown */}
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 3, height: "100%" }}>
            <Box sx={{ px: 3, py: 2, borderBottom: "1px solid #f1f5f9", bgcolor: "#f8fafc", borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack direction="row" spacing={1} alignItems="center">
                  <SchoolIcon fontSize="small" color="secondary" />
                  <Typography variant="subtitle1" fontWeight={700}>INF Status Breakdown</Typography>
                </Stack>
                <Button component={Link} href="/admin/infs" size="small" color="secondary" endIcon={<ArrowForwardIcon />} sx={{ fontWeight: 600 }}>
                  View Queue
                </Button>
              </Stack>
            </Box>
            <CardContent sx={{ p: 3 }}>
              <Grid2 container spacing={2}>
                {[
                  { label: "Submitted", value: stats?.inf_submitted ?? 0, color: "warning.main" },
                  { label: "Under Review", value: stats?.inf_under_review ?? 0, color: "info.main" },
                  { label: "Accepted", value: stats?.inf_accepted ?? 0, color: "success.main" },
                  { label: "Rejected", value: stats?.inf_rejected ?? 0, color: "error.main" },
                ].map((s) => (
                  <Grid2 key={s.label} size={{ xs: 6 }}>
                    <Box sx={{ p: 2, bgcolor: "#f8fafc", borderRadius: 2, border: "1px solid #e2e8f0" }}>
                      <Typography variant="h5" fontWeight={800} color={s.color}>{s.value}</Typography>
                      <Typography variant="caption" color="text.secondary" fontWeight={500}>{s.label}</Typography>
                    </Box>
                  </Grid2>
                ))}
              </Grid2>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>

      {/* Recent Submissions */}
      <Grid2 container spacing={3}>
        {/* Recent JNFs */}
        <Grid2 size={{ xs: 12, lg: 6 }}>
          <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 3 }}>
            <Box sx={{ px: 3, py: 2, borderBottom: "1px solid #f1f5f9", bgcolor: "#f8fafc", borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack direction="row" spacing={1} alignItems="center">
                  <WorkIcon fontSize="small" color="primary" />
                  <Typography variant="subtitle1" fontWeight={700}>Recent JNF Submissions</Typography>
                </Stack>
                <Button component={Link} href="/admin/jnfs" size="small" endIcon={<ArrowForwardIcon />} sx={{ fontWeight: 600 }}>
                  View All
                </Button>
              </Stack>
            </Box>
            <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
              {data?.recent_submissions.jnfs && data.recent_submissions.jnfs.length > 0 ? (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: "#fafafa" }}>
                        <TableCell sx={{ fontWeight: 700, color: "text.secondary", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.05em", py: 1.5 }}>
                          Job Title
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, color: "text.secondary", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.05em", py: 1.5 }}>
                          Company
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, color: "text.secondary", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.05em", py: 1.5 }}>
                          Status
                        </TableCell>
                        <TableCell align="right" sx={{ py: 1.5 }} />
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.recent_submissions.jnfs.map((jnf) => (
                        <TableRow key={jnf.id} hover sx={{ "&:last-child td": { border: 0 } }}>
                          <TableCell sx={{ py: 1.5 }}>
                            <Typography variant="body2" fontWeight={600} noWrap sx={{ maxWidth: 160 }}>
                              {jnf.job_title}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ py: 1.5 }}>
                            <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 120 }}>
                              {jnf.company?.name ?? "—"}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ py: 1.5 }}>
                            <StatusChip status={jnf.status} />
                          </TableCell>
                          <TableCell align="right" sx={{ py: 1.5 }}>
                            <Tooltip title="Review JNF">
                              <IconButton component={Link} href={`/admin/jnfs/${jnf.id}`} size="small" color="primary"
                                sx={{ border: "1px solid", borderColor: "primary.main", borderRadius: 1.5 }}
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box textAlign="center" py={5}>
                  <WorkIcon sx={{ fontSize: 40, color: "text.disabled", mb: 1 }} />
                  <Typography color="text.secondary" variant="body2">No recent JNF submissions</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid2>

        {/* Recent INFs */}
        <Grid2 size={{ xs: 12, lg: 6 }}>
          <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 3 }}>
            <Box sx={{ px: 3, py: 2, borderBottom: "1px solid #f1f5f9", bgcolor: "#f8fafc", borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack direction="row" spacing={1} alignItems="center">
                  <SchoolIcon fontSize="small" color="secondary" />
                  <Typography variant="subtitle1" fontWeight={700}>Recent INF Submissions</Typography>
                </Stack>
                <Button component={Link} href="/admin/infs" size="small" color="secondary" endIcon={<ArrowForwardIcon />} sx={{ fontWeight: 600 }}>
                  View All
                </Button>
              </Stack>
            </Box>
            <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
              {data?.recent_submissions.infs && data.recent_submissions.infs.length > 0 ? (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: "#fafafa" }}>
                        <TableCell sx={{ fontWeight: 700, color: "text.secondary", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.05em", py: 1.5 }}>
                          Internship Title
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, color: "text.secondary", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.05em", py: 1.5 }}>
                          Company
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, color: "text.secondary", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.05em", py: 1.5 }}>
                          Status
                        </TableCell>
                        <TableCell align="right" sx={{ py: 1.5 }} />
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.recent_submissions.infs.map((inf) => (
                        <TableRow key={inf.id} hover sx={{ "&:last-child td": { border: 0 } }}>
                          <TableCell sx={{ py: 1.5 }}>
                            <Typography variant="body2" fontWeight={600} noWrap sx={{ maxWidth: 160 }}>
                              {inf.internship_title}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ py: 1.5 }}>
                            <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 120 }}>
                              {inf.company?.name ?? "—"}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ py: 1.5 }}>
                            <StatusChip status={inf.status} />
                          </TableCell>
                          <TableCell align="right" sx={{ py: 1.5 }}>
                            <Tooltip title="Review INF">
                              <IconButton component={Link} href={`/admin/infs/${inf.id}`} size="small" color="secondary"
                                sx={{ border: "1px solid", borderColor: "secondary.main", borderRadius: 1.5 }}
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box textAlign="center" py={5}>
                  <SchoolIcon sx={{ fontSize: 40, color: "text.disabled", mb: 1 }} />
                  <Typography color="text.secondary" variant="body2">No recent INF submissions</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
    </Box>
  );
}
