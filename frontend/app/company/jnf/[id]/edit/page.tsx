"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Alert, Box, CircularProgress, Stack } from "@mui/material";
import JnfFormPro from "@/components/forms/JnfFormPro";
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
  admin_remarks: string | null;
  form_data?: string | null;
};

export default function EditJnfPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [jnf, setJnf] = useState<Jnf | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      try {
        const response = await companyApi<{ jnf: Jnf }>(
          `/company/jnfs/${id}`,
        );
        setJnf(response.jnf);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load JNF.");
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

  const parsedFormData = parseFormData(jnf?.form_data);
  const initialData = parsedFormData
    ? { ...parsedFormData, id: jnf?.id }
    : {
        id: jnf?.id,
        jobTitle: jnf?.job_title ?? "",
        jobDescription: jnf?.job_description ?? "",
        jobLocation: jnf?.job_location ?? "",
        expectedHires: jnf?.vacancies?.toString() ?? "",
      };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {jnf && (
        <JnfFormPro
          initialData={initialData}
          onSaved={(id) => router.push(`/company/jnf/${id}`)}
        />
      )}
    </Box>
  );
}
