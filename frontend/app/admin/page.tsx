"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid2,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  alpha,
} from "@mui/material";
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

const getStatusColor = (status: string) => {
  switch (status) {
    case "accepted": return "success";
    case "submitted": return "warning";
    case "under_review": return "info";
    case "rejected": return "error";
    default: return "default";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "accepted": return <CheckCircleIcon fontSize="small" />;
    case "submitted": return <HourglassEmptyIcon fontSize="small" />;
    case "under_review": return <PendingIcon fontSize="small" />;
    case "rejected": return <CancelIcon fontSize="small" />;
    default: return null;
  }
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
      <Box sx={{ py: 4 }}>
        <LinearProgress />
        <Typography textAlign="center" mt={2}>Loading dashboard...</Typography>
      </Box>
    );
  }

  const stats = data?.stats;

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Welcome Header */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          background: (theme) =>
            `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
          color: "white",
          borderRadius: 2,
        }}
      >
        <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ md: "center" }} spacing={2}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ width: 56, height: 56, bgcolor: "white", color: "primary.main" }}>
              <AssignmentIcon fontSize="large" />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight={700}>
                Admin Dashboard
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                IIT (ISM) Dhanbad — Career Development Centre
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={2}>
            <Button
              component={Link}
              href="/admin/jnfs"
              variant="contained"
              startIcon={<WorkIcon />}
              sx={{ bgcolor: "white", color: "primary.main", "&:hover": { bgcolor: "grey.100" } }}
            >
              Review JNFs
            </Button>
            <Button
              component={Link}
              href="/admin/infs"
              variant="outlined"
              startIcon={<SchoolIcon />}
              sx={{ color: "white", borderColor: "white", "&:hover": { borderColor: "white", bgcolor: alpha("#fff", 0.1) } }}
            >
              Review INFs
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Pending Alert */}
      {(stats?.pending_reviews ?? 0) > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <strong>{stats?.pending_reviews} submissions</strong> are pending review. Please review them at your earliest.
        </Alert>
      )}

      {/* Quick Stats */}
      <Grid2 container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: "Total Companies", value: stats?.companies_total ?? 0, icon: <BusinessIcon />, color: "primary.main" },
          { label: "Pending Reviews", value: stats?.pending_reviews ?? 0, icon: <HourglassEmptyIcon />, color: "warning.main" },
          { label: "JNFs Submitted", value: stats?.jnf_submitted ?? 0, icon: <WorkIcon />, color: "info.main" },
          { label: "INFs Submitted", value: stats?.inf_submitted ?? 0, icon: <SchoolIcon />, color: "secondary.main" },
          { label: "JNFs Accepted", value: stats?.jnf_accepted ?? 0, icon: <CheckCircleIcon />, color: "success.main" },
          { label: "INFs Accepted", value: stats?.inf_accepted ?? 0, icon: <CheckCircleIcon />, color: "success.main" },
        ].map((item) => (
          <Grid2 key={item.label} size={{ xs: 6, md: 2 }}>
            <Card sx={{ height: "100%" }}>
              <CardContent sx={{ py: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontSize={10}>
                      {item.label}
                    </Typography>
                    <Typography variant="h4" fontWeight={700} sx={{ color: item.color }}>
                      {item.value}
                    </Typography>
                  </Box>
                  <Box sx={{ color: item.color, opacity: 0.3 }}>{item.icon}</Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid2>
        ))}
      </Grid2>

      {/* Quick Actions */}
      <Paper sx={{ p: 2, mb: 3, bgcolor: alpha("#1976d2", 0.05), border: "1px solid", borderColor: "primary.light" }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1" fontWeight={600}>
            🎯 Quick Actions
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Button component={Link} href="/admin/jnfs?status=submitted" size="small" startIcon={<WorkIcon />}>
              Pending JNFs ({stats?.jnf_submitted ?? 0})
            </Button>
            <Button component={Link} href="/admin/infs?status=submitted" size="small" startIcon={<SchoolIcon />}>
              Pending INFs ({stats?.inf_submitted ?? 0})
            </Button>
            <Button component={Link} href="/admin/companies" size="small" startIcon={<BusinessIcon />}>
              Manage Companies
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <Grid2 container spacing={3}>
        {/* Recent JNF Submissions */}
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <WorkIcon color="primary" />
                  <Typography variant="h6" fontWeight={600}>
                    Recent JNF Submissions
                  </Typography>
                </Stack>
                <Button component={Link} href="/admin/jnfs" size="small">
                  View All
                </Button>
              </Stack>

              {data?.recent_submissions.jnfs && data.recent_submissions.jnfs.length > 0 ? (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Job Title</TableCell>
                        <TableCell>Company</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.recent_submissions.jnfs.map((jnf) => (
                        <TableRow key={jnf.id} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight={500} noWrap sx={{ maxWidth: 150 }}>
                              {jnf.job_title}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 100 }}>
                              {jnf.company?.name ?? "-"}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              icon={getStatusIcon(jnf.status) || undefined}
                              label={jnf.status.replace("_", " ")}
                              size="small"
                              color={getStatusColor(jnf.status) as "success" | "warning" | "info" | "error" | "default"}
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Tooltip title="Review">
                              <IconButton component={Link} href={`/admin/jnfs/${jnf.id}`} size="small" color="primary">
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
                <Box textAlign="center" py={4}>
                  <Typography color="text.secondary">No recent JNF submissions</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid2>

        {/* Recent INF Submissions */}
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <SchoolIcon color="secondary" />
                  <Typography variant="h6" fontWeight={600}>
                    Recent INF Submissions
                  </Typography>
                </Stack>
                <Button component={Link} href="/admin/infs" size="small">
                  View All
                </Button>
              </Stack>

              {data?.recent_submissions.infs && data.recent_submissions.infs.length > 0 ? (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Internship Title</TableCell>
                        <TableCell>Company</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.recent_submissions.infs.map((inf) => (
                        <TableRow key={inf.id} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight={500} noWrap sx={{ maxWidth: 150 }}>
                              {inf.internship_title}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 100 }}>
                              {inf.company?.name ?? "-"}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              icon={getStatusIcon(inf.status) || undefined}
                              label={inf.status.replace("_", " ")}
                              size="small"
                              color={getStatusColor(inf.status) as "success" | "warning" | "info" | "error" | "default"}
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Tooltip title="Review">
                              <IconButton component={Link} href={`/admin/infs/${inf.id}`} size="small" color="secondary">
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
                <Box textAlign="center" py={4}>
                  <Typography color="text.secondary">No recent INF submissions</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
    </Box>
  );
}
