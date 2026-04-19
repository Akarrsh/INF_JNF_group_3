"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Alert, Box, CircularProgress } from "@mui/material";
import InfFormPro from "@/components/forms/InfFormPro";
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
  admin_remarks: string | null;
  form_data?: string | null;
};

export default function EditInfPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [inf, setInf] = useState<Inf | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      try {
        const response = await companyApi<{ inf: Inf }>(
          `/company/infs/${id}`,
        );
        setInf(response.inf);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load INF.");
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
      </Box>
    );
  }

  // Parse form_data if available, otherwise use legacy fields
  // form_data may already be parsed by Laravel's cast or still be a string
  const parseFormData = (data: string | object | null | undefined) => {
    if (!data) return null;
    if (typeof data === "string") {
      try {
        return JSON.parse(data);
      } catch {
        return null;
      }
    }
    return data;
  };

  const parsedFormData = parseFormData(inf?.form_data);
  const initialData = parsedFormData
    ? { ...parsedFormData, id: inf?.id }
    : {
        id: inf?.id,
        internshipTitle: inf?.internship_title ?? "",
        internshipDescription: inf?.internship_description ?? "",
        internshipLocation: inf?.internship_location ?? "",
        duration: inf?.internship_duration_weeks?.toString() ?? "",
        expectedHires: inf?.vacancies?.toString() ?? "",
      };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {inf && (
        <InfFormPro
          initialData={initialData}
          onSaved={(id) => router.push(`/company/inf/${id}`)}
        />
      )}
    </Box>
  );
}
