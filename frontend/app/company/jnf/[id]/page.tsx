"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  Alert,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import { companyApi } from "@/lib/companyApi";

type Jnf = {
  id: number;
  job_title: string;
  job_description: string;
  job_location: string | null;
  ctc_min: number | null;
  ctc_max: number | null;
  vacancies: number | null;
  application_deadline: string | null;
  status: string;
};

export default function ViewJnfPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [jnf, setJnf] = useState<Jnf | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const response = await companyApi<{ jnf: Jnf }>(
          `/company/jnfs/${id}`,
        );
        setJnf(response.jnf);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load JNF.");
      }
    };

    void run();
  }, [id]);

  return (
    <Stack spacing={2.5}>
      <Typography variant="h4" color="primary.main">
        JNF Details
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {jnf && (
        <Card>
          <CardContent>
            <Stack spacing={1.5}>
              <Typography>
                <strong>Title:</strong> {jnf.job_title}
              </Typography>
              <Typography>
                <strong>Description:</strong> {jnf.job_description}
              </Typography>
              <Typography>
                <strong>Location:</strong> {jnf.job_location ?? "-"}
              </Typography>
              <Typography>
                <strong>CTC:</strong> {jnf.ctc_min ?? "-"} -{" "}
                {jnf.ctc_max ?? "-"}
              </Typography>
              <Typography>
                <strong>Vacancies:</strong> {jnf.vacancies ?? "-"}
              </Typography>
              <Typography>
                <strong>Deadline:</strong> {jnf.application_deadline ?? "-"}
              </Typography>
              <Typography>
                <strong>Status:</strong> {jnf.status}
              </Typography>
              <Button
                component={Link}
                href={`/company/jnf/${jnf.id}/edit`}
                variant="contained"
                sx={{ width: "fit-content" }}
              >
                Edit JNF
              </Button>
            </Stack>
          </CardContent>
        </Card>
      )}
    </Stack>
  );
}
