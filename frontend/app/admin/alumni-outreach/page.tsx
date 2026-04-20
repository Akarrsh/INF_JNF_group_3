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
  InputAdornment,
  LinearProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import PeopleIcon from "@mui/icons-material/People";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import CancelIcon from "@mui/icons-material/Cancel";
import { adminApi } from "@/lib/adminApi";

type AlumniOutreach = {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  completion_year: number;
  degree: string;
  branch: string;
  current_job: string;
  areas_of_interest: string;
  linkedin_profile: string;
  current_location: string | null;
  willing_to_visit: string | null;
  general_comments: string | null;
  created_at: string;
};

const DEGREE_LABELS: Record<string, string> = {
  be_btech_barch: "BE / BTech / BArch",
  me_mtech_march: "ME / MTech / MArch",
  integrated_dual: "Integrated Dual Degree",
  msc: "MSc / MSc.Tech",
  mba: "MBA",
  phd: "PhD",
};

const WillVisitChip = ({ value }: { value: string | null }) => {
  if (value === "yes")   return <Chip icon={<CheckCircleIcon />} label="Yes"   size="small" color="success" sx={{ fontWeight: 700 }} />;
  if (value === "maybe") return <Chip icon={<HelpOutlineIcon />} label="Maybe" size="small" color="warning" sx={{ fontWeight: 700 }} />;
  if (value === "no")    return <Chip icon={<CancelIcon />}      label="No"    size="small" color="error"   sx={{ fontWeight: 700 }} />;
  return <Chip label="—" size="small" variant="outlined" sx={{ fontWeight: 600 }} />;
};

export default function AdminAlumniOutreachPage() {
  const [items, setItems] = useState<AlumniOutreach[]>([]);
  const [filtered, setFiltered] = useState<AlumniOutreach[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await adminApi<{ alumni_outreaches: AlumniOutreach[] }>("/admin/alumni-outreach");
        setItems(res.alumni_outreaches);
        setFiltered(res.alumni_outreaches);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load submissions.");
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      items.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q) ||
          a.branch.toLowerCase().includes(q) ||
          a.current_job.toLowerCase().includes(q) ||
          a.areas_of_interest.toLowerCase().includes(q) ||
          String(a.completion_year).includes(q)
      )
    );
  }, [search, items]);

  return (
    <Box sx={{ pb: 6, maxWidth: 1400, mx: "auto" }}>
      {/* Page header */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" spacing={1.5} alignItems="center" mb={0.5}>
          <PeopleIcon color="primary" />
          <Typography variant="h4" fontWeight={800} color="text.primary" letterSpacing="-0.02em">
            Alumni Outreach Submissions
          </Typography>
        </Stack>
        <Typography variant="body1" color="text.secondary">
          Registered alumni mentors from the IIT ISM outreach program
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

      {/* Search + stats bar */}
      <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 3, mb: 3 }}>
        <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }} justifyContent="space-between">
            <TextField
              id="alumni-search"
              fullWidth
              size="small"
              placeholder="Search by name, email, branch, job, year, or areas of interest…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 }, maxWidth: 520 }}
            />
            <Stack direction="row" spacing={1} alignItems="center" flexShrink={0}>
              {search && (
                <Chip
                  label={`${filtered.length} of ${items.length} shown`}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ fontWeight: 700 }}
                />
              )}
              {!search && (
                <Chip
                  label={`${items.length} submission${items.length !== 1 ? "s" : ""}`}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ fontWeight: 700 }}
                />
              )}
              <Button component={Link} href="/admin" size="small" variant="outlined" sx={{ borderRadius: 2, fontWeight: 600, whiteSpace: "nowrap" }}>
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
          <Typography textAlign="center" color="text.secondary">Loading alumni submissions…</Typography>
        </Box>
      ) : (
        <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 3 }}>
          {filtered.length === 0 ? (
            <CardContent sx={{ textAlign: "center", py: 8 }}>
              <PeopleIcon sx={{ fontSize: 56, color: "text.disabled", mb: 2 }} />
              <Typography variant="h6" color="text.secondary" fontWeight={600}>
                {search ? "No results found" : "No submissions yet"}
              </Typography>
              <Typography variant="body2" color="text.disabled" mt={1}>
                {search ? "Try different search terms." : "Alumni outreach submissions will appear here once received."}
              </Typography>
            </CardContent>
          ) : (
            <TableContainer sx={{ overflowX: "auto" }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#f8fafc" }}>
                    {["#", "Alumni", "Degree / Branch", "Year", "Current Role", "Visit Campus", "LinkedIn", "Submitted", ""].map((h) => (
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
                  {filtered.map((a) => (
                    <TableRow key={a.id} hover sx={{ "&:last-child td": { border: 0 } }}>
                      <TableCell sx={{ py: 2 }}>
                        <Typography variant="caption" color="text.disabled" fontWeight={600}>#{a.id}</Typography>
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar sx={{ width: 34, height: 34, fontWeight: 700, fontSize: "0.85rem", bgcolor: alpha("#1a3a5c", 0.1), color: "primary.main" }}>
                            {a.name.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={700}>{a.name}</Typography>
                            <Typography variant="caption" color="text.secondary">{a.email}</Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Typography variant="body2" fontWeight={600}>{DEGREE_LABELS[a.degree] ?? a.degree}</Typography>
                        <Typography variant="caption" color="text.secondary">{a.branch}</Typography>
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Chip label={a.completion_year} size="small" variant="outlined" sx={{ fontWeight: 700 }} />
                      </TableCell>
                      <TableCell sx={{ py: 2, maxWidth: 180 }}>
                        <Typography variant="body2" noWrap title={a.current_job}>{a.current_job}</Typography>
                        {a.current_location && (
                          <Typography variant="caption" color="text.secondary">📍 {a.current_location}</Typography>
                        )}
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <WillVisitChip value={a.willing_to_visit} />
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Tooltip title="Open LinkedIn profile">
                          <Button
                            component="a"
                            href={a.linkedin_profile}
                            target="_blank"
                            rel="noopener noreferrer"
                            size="small"
                            startIcon={<LinkedInIcon sx={{ color: "#0077b5" }} />}
                            endIcon={<OpenInNewIcon fontSize="small" />}
                            sx={{ color: "#0077b5", textTransform: "none", fontWeight: 600, p: "4px 8px", border: "1px solid #bfdbfe", borderRadius: 1.5 }}
                          >
                            LinkedIn
                          </Button>
                        </Tooltip>
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={500}>
                          {new Date(a.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                        </Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ py: 2 }}>
                        <Button
                          component={Link}
                          href={`/admin/alumni-outreach/${a.id}`}
                          size="small"
                          variant="contained"
                          startIcon={<VisibilityIcon />}
                          sx={{ borderRadius: 1.5, fontWeight: 700, whiteSpace: "nowrap" }}
                        >
                          View
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
