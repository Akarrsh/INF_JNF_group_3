"use client";

import { Suspense, useEffect, useState, type ReactElement } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  LinearProgress,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import CancelIcon from "@mui/icons-material/Cancel";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import FilterListIcon from "@mui/icons-material/FilterList";
import TuneIcon from "@mui/icons-material/Tune";
import { adminApi } from "@/lib/adminApi";

type JnfItem = {
  id: number;
  job_title: string;
  status: string;
  updated_at: string;
  created_at: string;
  company?: { name: string };
};

const STATUS_CONFIG: Record<string, { color: "success" | "warning" | "info" | "error" | "default"; label: string; icon: ReactElement | null }> = {
  accepted:     { color: "success", label: "Accepted",     icon: <CheckCircleIcon fontSize="small" /> },
  submitted:    { color: "warning", label: "Submitted",    icon: <HourglassEmptyIcon fontSize="small" /> },
  under_review: { color: "info",    label: "Under Review", icon: <PendingIcon fontSize="small" /> },
  rejected:     { color: "error",   label: "Rejected",     icon: <CancelIcon fontSize="small" /> },
  draft:        { color: "default", label: "Draft",        icon: null },
};

const StatusChip = ({ status }: { status: string }) => {
  const cfg = STATUS_CONFIG[status] ?? { color: "default" as const, label: status, icon: null };
  return (
    <Chip
      icon={cfg.icon ?? undefined}
      label={cfg.label}
      size="small"
      color={cfg.color}
      sx={{ fontWeight: 700, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.04em" }}
    />
  );
};

const FILTER_OPTIONS = [
  { value: "pending", label: "Pending Queue", desc: "submitted + under review" },
  { value: "submitted", label: "Submitted" },
  { value: "under_review", label: "Under Review" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
  { value: "draft", label: "Drafts" },
];

function JnfQueueContent() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get("status") || "pending";
  const [jnfs, setJnfs] = useState<JnfItem[]>([]);
  const [status, setStatus] = useState<string>(initialStatus);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);

      const query = status === "pending" ? "" : `?status=${encodeURIComponent(status)}`;

      try {
        const response = await adminApi<{ jnfs: JnfItem[] }>(`/admin/jnfs${query}`);
        setJnfs(response.jnfs);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load JNF queue.");
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, [status]);

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    setStatus(event.target.value);
  };

  const currentFilter = FILTER_OPTIONS.find((f) => f.value === status);

  return (
    <Box sx={{ pb: 6, maxWidth: 1200, mx: "auto" }}>
      {/* Page header */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={1.5} mb={0.5}>
          <WorkIcon color="primary" />
          <Typography variant="h4" fontWeight={800} color="text.primary" letterSpacing="-0.02em">
            JNF Review Queue
          </Typography>
        </Stack>
        <Typography variant="body1" color="text.secondary">
          Review, approve, and manage Job Notification Form submissions
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

      {/* Filter bar */}
      <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 3, mb: 3 }}>
        <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }} justifyContent="space-between">
            <Stack direction="row" spacing={1.5} alignItems="center">
              <TuneIcon color="primary" fontSize="small" />
              <Typography variant="subtitle2" fontWeight={700} color="text.secondary">
                Filter by Status
              </Typography>
              <FormControl size="small" sx={{ minWidth: 220 }}>
                <Select value={status} onChange={handleStatusChange} displayEmpty sx={{ borderRadius: 2 }}>
                  {FILTER_OPTIONS.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}{opt.desc ? <Box component="span" sx={{ color: "text.secondary", ml: 1, fontSize: "0.8em" }}>({opt.desc})</Box> : null}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                label={loading ? "Loading…" : `${jnfs.length} result${jnfs.length !== 1 ? "s" : ""}`}
                color="primary"
                variant="outlined"
                sx={{ fontWeight: 700 }}
              />
              <Button component={Link} href="/admin" size="small" variant="outlined" sx={{ borderRadius: 2, fontWeight: 600 }}>
                Dashboard
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Table */}
      {loading ? (
        <Box sx={{ py: 6 }}>
          <LinearProgress sx={{ borderRadius: 1, mb: 3 }} />
          <Typography textAlign="center" color="text.secondary">Loading JNFs…</Typography>
        </Box>
      ) : (
        <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 3 }}>
          {jnfs.length === 0 ? (
            <CardContent sx={{ textAlign: "center", py: 8 }}>
              <WorkIcon sx={{ fontSize: 56, color: "text.disabled", mb: 2 }} />
              <Typography variant="h6" color="text.secondary" fontWeight={600}>
                No JNFs found
              </Typography>
              <Typography variant="body2" color="text.disabled" mt={1}>
                No submissions match the selected filter: <strong>{currentFilter?.label}</strong>
              </Typography>
            </CardContent>
          ) : (
            <TableContainer sx={{ overflowX: "auto" }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#f8fafc" }}>
                    {["Job Title", "Company", "Status", "Submitted", "Last Updated", ""].map((h) => (
                      <TableCell
                        key={h}
                        align={h === "" ? "right" : "left"}
                        sx={{
                          fontWeight: 700,
                          color: "text.secondary",
                          fontSize: "0.72rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                          py: 1.75,
                          borderBottom: "2px solid #e2e8f0",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {jnfs.map((jnf) => (
                    <TableRow key={jnf.id} hover sx={{ "&:last-child td": { border: 0 }, cursor: "pointer" }}>
                      <TableCell sx={{ py: 2 }}>
                        <Typography variant="body2" fontWeight={700} sx={{ maxWidth: 200 }}>
                          {jnf.job_title}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 160 }} noWrap>
                          {jnf.company?.name ?? "—"}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <StatusChip status={jnf.status} />
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={500}>
                          {jnf.created_at ? new Date(jnf.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={500}>
                          {new Date(jnf.updated_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                        </Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ py: 2 }}>
                        <Button
                          component={Link}
                          href={`/admin/jnfs/${jnf.id}`}
                          size="small"
                          variant="contained"
                          startIcon={<VisibilityIcon />}
                          sx={{ borderRadius: 1.5, fontWeight: 700, whiteSpace: "nowrap" }}
                        >
                          Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Card>
      )}
    </Box>
  );
}

export default function AdminJnfQueuePage() {
  return (
    <Suspense fallback={
      <Box sx={{ py: 6 }}>
        <LinearProgress sx={{ borderRadius: 1, mb: 3 }} />
        <Typography textAlign="center" color="text.secondary">Loading…</Typography>
      </Box>
    }>
      <JnfQueueContent />
    </Suspense>
  );
}
