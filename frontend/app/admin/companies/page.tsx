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
  InputAdornment,
  LinearProgress,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import BusinessIcon from "@mui/icons-material/Business";
import SearchIcon from "@mui/icons-material/Search";
import WorkIcon from "@mui/icons-material/Work";
import SchoolIcon from "@mui/icons-material/School";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { adminApi } from "@/lib/adminApi";

type CompanyItem = {
  id: number;
  name: string;
  industry: string | null;
  hr_name: string;
  hr_email: string;
  jnfs_count: number;
  infs_count: number;
};

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<CompanyItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const runSearch = async (query?: string) => {
    setLoading(true);
    setError(null);

    try {
      const suffix = query ? `?q=${encodeURIComponent(query)}` : "";
      const response = await adminApi<{ companies: CompanyItem[] }>(
        `/admin/companies${suffix}`,
      );
      setCompanies(response.companies);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load companies.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void runSearch();
  }, []);

  return (
    <Box sx={{ pb: 6, maxWidth: 1200, mx: "auto" }}>
      {/* Page header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={800} color="text.primary" letterSpacing="-0.02em" mb={0.5}>
          Company Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Search, view, and manage registered company accounts
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

      {/* Search bar */}
      <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 3, mb: 3 }}>
        <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by company name or HR contact…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && void runSearch(search)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
            <Button
              variant="contained"
              onClick={() => void runSearch(search)}
              sx={{ borderRadius: 2, px: 4, fontWeight: 700, whiteSpace: "nowrap", height: 40 }}
            >
              Search
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Results count */}
      {!loading && (
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Showing <strong>{companies.length}</strong> {companies.length === 1 ? "company" : "companies"}
          </Typography>
        </Stack>
      )}

      {/* Companies grid */}
      {loading ? (
        <Grid2 container spacing={2.5}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Grid2 key={i} size={{ xs: 12, sm: 6, lg: 4 }}>
              <Skeleton variant="rounded" height={160} sx={{ borderRadius: 3 }} />
            </Grid2>
          ))}
        </Grid2>
      ) : companies.length === 0 ? (
        <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 3 }}>
          <CardContent sx={{ textAlign: "center", py: 8 }}>
            <BusinessIcon sx={{ fontSize: 56, color: "text.disabled", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" fontWeight={600}>No companies found</Typography>
            <Typography variant="body2" color="text.disabled" mt={1}>
              Try a different search term or clear the filter.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid2 container spacing={2.5}>
          {companies.map((item) => (
            <Grid2 key={item.id} size={{ xs: 12, sm: 6, lg: 4 }}>
              <Card
                elevation={0}
                sx={{
                  border: "1px solid #e2e8f0",
                  borderRadius: 3,
                  height: "100%",
                  transition: "all 0.2s",
                  "&:hover": {
                    borderColor: "primary.main",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" spacing={2} alignItems="flex-start" mb={2}>
                    <Avatar
                      sx={{
                        bgcolor: alpha("#1a3a5c", 0.1),
                        color: "primary.main",
                        width: 44,
                        height: 44,
                        fontWeight: 800,
                        fontSize: "1rem",
                        flexShrink: 0,
                      }}
                    >
                      {item.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="subtitle1" fontWeight={700} noWrap>
                        {item.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block" noWrap>
                        {item.industry ?? "Industry not specified"}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack spacing={0.5} sx={{ mb: 2.5 }}>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      <strong>HR:</strong> {item.hr_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {item.hr_email}
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={1} sx={{ mb: 2.5 }}>
                    <Chip
                      icon={<WorkIcon fontSize="small" />}
                      label={`${item.jnfs_count} JNF${item.jnfs_count !== 1 ? "s" : ""}`}
                      size="small"
                      variant="outlined"
                      color="primary"
                      sx={{ fontWeight: 600 }}
                    />
                    <Chip
                      icon={<SchoolIcon fontSize="small" />}
                      label={`${item.infs_count} INF${item.infs_count !== 1 ? "s" : ""}`}
                      size="small"
                      variant="outlined"
                      color="secondary"
                      sx={{ fontWeight: 600 }}
                    />
                  </Stack>

                  <Button
                    component={Link}
                    href={`/admin/companies/${item.id}`}
                    fullWidth
                    variant="outlined"
                    endIcon={<ArrowForwardIcon />}
                    sx={{ borderRadius: 2, fontWeight: 700 }}
                  >
                    Manage Company
                  </Button>
                </CardContent>
              </Card>
            </Grid2>
          ))}
        </Grid2>
      )}
    </Box>
  );
}
