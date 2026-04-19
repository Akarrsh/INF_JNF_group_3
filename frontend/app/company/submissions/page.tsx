"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Alert,
  Button,
  Card,
  CardContent,
  Grid2,
  Stack,
  Typography,
} from "@mui/material";
import { companyApi } from "@/lib/companyApi";

type JnfItem = {
  id: number;
  job_title: string;
  status: string;
  updated_at: string;
};
type InfItem = {
  id: number;
  internship_title: string;
  status: string;
  updated_at: string;
};

export default function SubmissionsPage() {
  const [jnfs, setJnfs] = useState<JnfItem[]>([]);
  const [infs, setInfs] = useState<InfItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const [jnfData, infData] = await Promise.all([
          companyApi<{ jnfs: JnfItem[] }>("/company/jnfs"),
          companyApi<{ infs: InfItem[] }>("/company/infs"),
        ]);
        setJnfs(jnfData.jnfs);
        setInfs(infData.infs);
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "Failed to load submissions.",
        );
      }
    };

    void run();
  }, []);

  return (
    <Stack spacing={2.5}>
      <Typography variant="h4" color="primary.main">
        My Submissions
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}

      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                JNF Submissions
              </Typography>
              <Stack spacing={1}>
                {jnfs.map((item) => (
                  <Stack
                    key={item.id}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="body2">
                      {item.job_title} ({item.status})
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <Button
                        component={Link}
                        href={`/company/jnf/${item.id}`}
                        size="small"
                      >
                        View
                      </Button>
                      <Button
                        component={Link}
                        href={`/company/jnf/${item.id}/edit`}
                        size="small"
                      >
                        Edit
                      </Button>
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid2>

        <Grid2 size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                INF Submissions
              </Typography>
              <Stack spacing={1}>
                {infs.map((item) => (
                  <Stack
                    key={item.id}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="body2">
                      {item.internship_title} ({item.status})
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <Button
                        component={Link}
                        href={`/company/inf/${item.id}`}
                        size="small"
                      >
                        View
                      </Button>
                      <Button
                        component={Link}
                        href={`/company/inf/${item.id}/edit`}
                        size="small"
                      >
                        Edit
                      </Button>
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
    </Stack>
  );
}
