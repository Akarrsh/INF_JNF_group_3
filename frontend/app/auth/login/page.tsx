"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSession, signIn } from "next-auth/react";
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
  alpha,
} from "@mui/material";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import SchoolIcon from "@mui/icons-material/School";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import LoginIcon from "@mui/icons-material/Login";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const apiBase =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8000/api";

type LoginFormValues = { email: string; password: string };

const schema = yup.object({
  email: yup.string().email("Enter a valid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: yupResolver(schema) });

  const onSubmit = async (values: LoginFormValues) => {
    setError(null);
    const result = await signIn("credentials", { email: values.email, password: values.password, redirect: false });
    if (!result || result.error) { setError("Invalid email or password."); return; }
    const session = await getSession();
    router.replace(session?.user?.role === "admin" ? "/admin" : "/company");
  };

  const handleForgotPassword = async () => {
    setResetError(null); setResetMessage(null);
    const email = watch("email")?.trim();
    if (!email) { setResetError("Enter your registered email above first."); return; }
    setIsSendingReset(true);
    try {
      const res = await fetch(`${apiBase}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setResetError(data.message ?? "Unable to send reset link. Please try again."); return; }
      setResetMessage("A time-limited password reset link has been sent to your email.");
    } catch { setResetError("Network error. Please try again."); }
    finally { setIsSendingReset(false); }
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
      {/* Brand mark */}
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
            width: 40,
            height: 40,
            borderRadius: "10px",
            bgcolor: "primary.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
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
        <Typography variant="h4" fontWeight={700} mb={0.75} sx={{ fontSize: { xs: "1.4rem", sm: "1.6rem" } }}>
          Sign In
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3.5}>
          Enter your credentials to access your dashboard.
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        {resetError && <Alert severity="warning" sx={{ mb: 3 }}>{resetError}</Alert>}
        {resetMessage && <Alert severity="success" sx={{ mb: 3 }}>{resetMessage}</Alert>}

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
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              placeholder="••••••••"
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

            <Box sx={{ textAlign: "right", mt: -1 }}>
              <Button
                type="button"
                variant="text"
                size="small"
                onClick={handleForgotPassword}
                disabled={isSendingReset || isSubmitting}
                sx={{ fontSize: "0.8rem", p: 0, color: "primary.main" }}
              >
                {isSendingReset ? "Sending…" : "Forgot password?"}
              </Button>
            </Box>

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isSubmitting}
              startIcon={<LoginIcon />}
              fullWidth
              sx={{ py: 1.4, fontWeight: 700, fontSize: "0.95rem" }}
            >
              {isSubmitting ? "Signing in…" : "Sign In"}
            </Button>
          </Stack>
        </Box>

        {/* Divider */}
        <Box sx={{ display: "flex", alignItems: "center", my: 3, gap: 2 }}>
          <Box sx={{ flex: 1, height: "1px", bgcolor: "divider" }} />
          <Typography variant="caption" color="text.secondary">New to the portal?</Typography>
          <Box sx={{ flex: 1, height: "1px", bgcolor: "divider" }} />
        </Box>

        <Button
          component={Link}
          href="/company/register"
          variant="outlined"
          size="large"
          fullWidth
          endIcon={<ArrowForwardIcon />}
          sx={{ py: 1.3, fontWeight: 600, borderColor: "#cbd5e1", color: "text.primary", "&:hover": { borderColor: "primary.main", color: "primary.main" } }}
        >
          Register Your Company
        </Button>
      </Box>

      <Typography variant="caption" color="text.secondary" sx={{ mt: 4, opacity: 0.6 }}>
        © 2026 IIT (ISM) Dhanbad. All rights reserved.
      </Typography>
    </Box>
  );
}
