"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import SchoolIcon from "@mui/icons-material/School";
import LockResetIcon from "@mui/icons-material/LockReset";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8000/api";

type ResetPasswordFormValues = { password: string; password_confirmation: string };

const schema = yup.object({
  password: yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords do not match")
    .required("Please confirm your password"),
});

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") ?? "";
  const hasValidQuery = useMemo(() => token.length > 0 && email.length > 0, [token, email]);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<ResetPasswordFormValues>({ resolver: yupResolver(schema) });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    setError(null); setSuccess(null);
    if (!hasValidQuery) { setError("Invalid or missing reset token. Please request a new reset link."); return; }
    const response = await fetch(`${apiBase}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ token, email, password: values.password, password_confirmation: values.password_confirmation }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) { setError(data.message ?? "Unable to reset password. The link may have expired."); return; }
    setSuccess(data.message ?? "Password reset successful.");
    setTimeout(() => { router.replace("/auth/login"); }, 1200);
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
          maxWidth: 460,
          bgcolor: "white",
          border: "1px solid #e2e8f0",
          borderRadius: "16px",
          p: { xs: 3, sm: 4.5 },
          boxShadow: "0 4px 24px -6px rgba(0,0,0,0.08)",
        }}
      >
        <Box
          sx={{
            width: 52, height: 52, borderRadius: "12px", bgcolor: "primary.main",
            display: "flex", alignItems: "center", justifyContent: "center", mb: 2.5,
          }}
        >
          <LockResetIcon sx={{ fontSize: 26, color: "white" }} />
        </Box>

        <Typography variant="h4" fontWeight={700} mb={0.75} sx={{ fontSize: { xs: "1.3rem", sm: "1.5rem" } }}>
          Set New Password
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3.5} lineHeight={1.7}>
          Choose a strong new password for{" "}
          <Box component="span" fontWeight={600} color="text.primary">{email || "your account"}</Box>.
        </Typography>

        {!hasValidQuery && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            Invalid or expired reset link. Please request a new link.
          </Alert>
        )}
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2.5}>
            <TextField
              label="New Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              placeholder="At least 8 characters"
              {...register("password")}
              error={Boolean(errors.password)}
              helperText={errors.password?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                      {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Confirm New Password"
              type={showConfirmPassword ? "text" : "password"}
              fullWidth
              placeholder="Re-enter your new password"
              {...register("password_confirmation")}
              error={Boolean(errors.password_confirmation)}
              helperText={errors.password_confirmation?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end" size="small">
                      {showConfirmPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isSubmitting || !hasValidQuery}
              fullWidth
              sx={{ py: 1.4, fontWeight: 700 }}
            >
              {isSubmitting ? "Updating password…" : "Reset Password"}
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
