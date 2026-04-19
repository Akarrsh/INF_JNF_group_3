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
  LinearProgress,
  Paper,
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
  alpha,
  InputAdornment,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
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

  const willLabel = (v: string | null) => {
    if (v === "yes") return { label: "Yes", color: "success" as const };
    if (v === "maybe") return { label: "Maybe", color: "warning" as const };
    if (v === "no") return { label: "No", color: "error" as const };
    return { label: "—", color: "default" as const };
  };

  return (
    <Box>
      {/* Header */}
      <Paper
        sx={{
          p: 2,
          mb: 3,
          background: (theme) =>
            `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: "white",
          borderRadius: 2,
        }}
      >
        <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ md: "center" }} spacing={2}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ width: 48, height: 48, bgcolor: "white", color: "primary.main" }}>
              <PeopleIcon />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight={700}>
                Alumni Outreach Submissions
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Registered alumni mentors from the outreach program
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              label={`${filtered.length} / ${items.length} entries`}
              sx={{ bgcolor: alpha("#fff", 0.2), color: "white", fontWeight: 600 }}
            />
            <Button
              component={Link}
              href="/admin"
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              sx={{ color: "white", borderColor: "white", "&:hover": { borderColor: "white", bgcolor: alpha("#fff", 0.1) } }}
            >
              Back to Dashboard
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Search */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          id="alumni-search"
          fullWidth
          variant="outlined"
          size="small"
          placeholder="Search by name, email, branch, job, year, or areas of interest..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ py: 4 }}>
          <LinearProgress />
          <Typography textAlign="center" mt={2}>Loading alumni submissions...</Typography>
        </Box>
      ) : (
        <Card>
          <CardContent sx={{ p: 0 }}>
            {filtered.length === 0 ? (
              <Box textAlign="center" py={6}>
                <PeopleIcon sx={{ fontSize: 56, color: "text.disabled", mb: 2 }} />
                <Typography color="text.secondary">
                  {search ? "No submissions match your search." : "No alumni outreach submissions yet."}
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "grey.50" }}>
                      <TableCell sx={{ fontWeight: 700 }}>#</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Name & Email</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Degree / Branch</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Year</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Current Role</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Campus Visit</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>LinkedIn</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Submitted</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>Details</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filtered.map((a) => (
                      <TableRow key={a.id} hover>
                        <TableCell>
                          <Typography variant="caption" color="text.secondary">#{a.id}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>{a.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{a.email}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>
                            {DEGREE_LABELS[a.degree] ?? a.degree}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">{a.branch}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={a.completion_year} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ maxWidth: 180 }} noWrap title={a.current_job}>
                            {a.current_job}
                          </Typography>
                          {a.current_location && (
                            <Typography variant="caption" color="text.secondary">
                              📍 {a.current_location}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip {...willLabel(a.willing_to_visit)} size="small" />
                        </TableCell>
                        <TableCell>
                          <Tooltip title={a.linkedin_profile}>
                            <Button
                              component="a"
                              href={a.linkedin_profile}
                              target="_blank"
                              rel="noopener noreferrer"
                              size="small"
                              startIcon={<LinkedInIcon />}
                              sx={{ color: "#0077b5", textTransform: "none", p: 0, minWidth: 0 }}
                            >
                              View
                            </Button>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(a.created_at).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            component={Link}
                            href={`/admin/alumni-outreach/${a.id}`}
                            size="small"
                            variant="contained"
                            startIcon={<VisibilityIcon />}
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
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
