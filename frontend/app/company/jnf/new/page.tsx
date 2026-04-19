"use client";

import { useRouter } from "next/navigation";
import { Box } from "@mui/material";
import JnfFormPro from "@/components/forms/JnfFormPro";

export default function NewJnfPage() {
  const router = useRouter();

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      <JnfFormPro onSaved={(id) => router.push(`/company/jnf/${id}`)} />
    </Box>
  );
}
