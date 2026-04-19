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

type Inf = {
  id: number;
  internship_title: string;
  internship_description: string;
  internship_location: string | null;
  stipend: number | null;
  internship_duration_weeks: number | null;
  vacancies: number | null;
  application_deadline: string | null;
  status: string;
};

export default function ViewInfPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [inf, setInf] = useState<Inf | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const response = await companyApi<{ inf: Inf }>(
          `/company/infs/${id}`,
        );
        setInf(response.inf);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load INF.");
      }
    };

    void run();
  }, [id]);

  return (
    <Stack spacing={2.5}>
      <Typography variant="h4" color="primary.main">
        INF Details
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {inf && (
        <Card>
          <CardContent>
            <Stack spacing={1.5}>
              <Typography>
                <strong>Title:</strong> {inf.internship_title}
              </Typography>
              <Typography>
                <strong>Description:</strong> {inf.internship_description}
              </Typography>
              <Typography>
                <strong>Location:</strong> {inf.internship_location ?? "-"}
              </Typography>
              <Typography>
                <strong>Stipend:</strong> {inf.stipend ?? "-"}
              </Typography>
              <Typography>
                <strong>Duration (weeks):</strong>{" "}
                {inf.internship_duration_weeks ?? "-"}
              </Typography>
              <Typography>
                <strong>Vacancies:</strong> {inf.vacancies ?? "-"}
              </Typography>
              <Typography>
                <strong>Deadline:</strong> {inf.application_deadline ?? "-"}
              </Typography>
              <Typography>
                <strong>Status:</strong> {inf.status}
              </Typography>
              <Button
                component={Link}
                href={`/company/inf/${inf.id}/edit`}
                variant="contained"
                sx={{ width: "fit-content" }}
              >
                Edit INF
              </Button>
            </Stack>
          </CardContent>
        </Card>
      )}
    </Stack>
  );
}
