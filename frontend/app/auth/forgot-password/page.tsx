"use client";

import { useState } from "react";
import Link from "next/link";
import { yupResolver } from "@hookform/resolvers/yup";
import { Alert, Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import SchoolIcon from "@mui/icons-material/School";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from "@mui/icons-material/Send";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";

const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8000/api";

type ForgotPasswordFormValues = { email: string };

const schema = yup.object({
  email: yup.string().email("Enter a valid email").required("Email is required"),
});

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<ForgotPasswordFormValues>({ resolver: yupResolver(schema) });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setError(null); setSuccess(null);
    const response = await fetch(`${apiBase}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(values),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) { setError(data.message ?? "Could not send reset link. Please try again."); return; }
    setSuccess(data.message ?? "If an account exists for this email, a reset link has been sent.");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f8fafc",
        px: 2,
        py: 6,
      }}
    >
      {/* Brand */}
      <Stack
        component={Link}
        href="/"
        direction="row"
        spacing={1.5}
        alignItems="center"
        mb={4}
        sx={{ textDecoration: "none" }}
      >
        <Box
          sx={{
            width: 40, height: 40, borderRadius: "10px", bgcolor: "primary.main",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <SchoolIcon sx={{ fontSize: 22, color: "white" }} />
        </Box>
        <Box>
          <Typography variant="subtitle2" fontWeight={700} color="primary.main" lineHeight={1.1}>
            IIT (ISM) Dhanbad
          </Typography>
          <Typography sx={{ fontSize: "0.65rem", color: "text.secondary", letterSpacing: "0.05em", textTransform: "uppercase" }}>
            Career Development Centre
          </Typography>
        </Box>
      </Stack>

      {/* Card */}
      <Box
        sx={{
          width: "100%",
          maxWidth: 440,
          bgcolor: "white",
          border: "1px solid #e2e8f0",
          borderRadius: "16px",
          p: { xs: 3, sm: 4.5 },
          boxShadow: "0 4px 24px -6px rgba(0,0,0,0.08)",
        }}
      >
        {/* Icon header */}
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: "12px",
            bgcolor: "primary.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2.5,
          }}
        >
          <MarkEmailReadIcon sx={{ fontSize: 26, color: "white" }} />
        </Box>

        <Typography variant="h4" fontWeight={700} mb={0.75} sx={{ fontSize: { xs: "1.3rem", sm: "1.5rem" } }}>
          Forgot Password?
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3.5} lineHeight={1.7}>
          Enter your registered email and we&apos;ll send a secure, time-limited reset link.
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2.5}>
            <TextField
              label="Email Address"
              type="email"
              fullWidth
              placeholder="recruiter@company.com"
              {...register("email")}
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isSubmitting}
              startIcon={<SendIcon />}
              fullWidth
              sx={{ py: 1.4, fontWeight: 700 }}
            >
              {isSubmitting ? "Sending link…" : "Send Reset Link"}
            </Button>
          </Stack>
        </Box>

        <Box sx={{ textAlign: "center", mt: 3.5 }}>
          <Button
            component={Link}
            href="/auth/login"
            variant="text"
            size="small"
            startIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />}
            sx={{ color: "text.secondary", fontSize: "0.85rem" }}
          >
            Back to Sign In
          </Button>
        </Box>
      </Box>

      <Typography variant="caption" color="text.secondary" sx={{ mt: 4, opacity: 0.6 }}>
        © 2026 IIT (ISM) Dhanbad. All rights reserved.
      </Typography>
    </Box>
  );
}
