"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Alert,
  Button,
  Card,
  CardContent,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
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
    <Stack spacing={2.5}>
      <Typography variant="h4" color="primary.main">
        Company Management
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
        <TextField
          size="small"
          label="Search company / HR"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: { xs: "100%", sm: 280 } }}
        />
        <Button
          variant="contained"
          onClick={() => void runSearch(search)}
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          Search
        </Button>
      </Stack>

      <Card>
        <CardContent>
          <Stack spacing={1.5}>
            {loading &&
              Array.from({ length: 4 }).map((_, index) => (
                <Skeleton
                  key={`company-skeleton-${index}`}
                  variant="rounded"
                  height={40}
                />
              ))}

            {!loading && companies.length === 0 && (
              <Typography color="text.secondary">
                No companies found for the current search.
              </Typography>
            )}

            {!loading &&
              companies.map((item) => (
                <Stack
                  key={item.id}
                  direction={{ xs: "column", sm: "row" }}
                  justifyContent="space-between"
                  alignItems={{ xs: "flex-start", sm: "center" }}
                  spacing={1}
                >
                  <Typography sx={{ wordBreak: "break-word" }}>
                    {item.name} ({item.hr_name}) - JNFs: {item.jnfs_count},
                    INFs: {item.infs_count}
                  </Typography>
                  <Button
                    component={Link}
                    href={`/admin/companies/${item.id}`}
                    size="small"
                    variant="contained"
                    sx={{ alignSelf: { xs: "stretch", sm: "auto" } }}
                  >
                    Manage
                  </Button>
                </Stack>
              ))}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
