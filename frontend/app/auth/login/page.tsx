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
  Divider,
  Grid2,
  IconButton,
  InputAdornment,
  Paper,
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
import BusinessIcon from "@mui/icons-material/Business";
import SecurityIcon from "@mui/icons-material/Security";
import SpeedIcon from "@mui/icons-material/Speed";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

const apiBase =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
  "http://127.0.0.1:8000/api";

type LoginFormValues = {
  email: string;
  password: string;
};

const schema = yup.object({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

const features = [
  {
    icon: <BusinessIcon sx={{ fontSize: 28 }} />,
    title: "Easy JNF/INF Submission",
    desc: "Streamlined forms for job and internship notifications",
  },
  {
    icon: <SpeedIcon sx={{ fontSize: 28 }} />,
    title: "Quick Processing",
    desc: "Fast review and approval by CDC team",
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 28 }} />,
    title: "Secure Platform",
    desc: "Your data is protected with enterprise security",
  },
  {
    icon: <SupportAgentIcon sx={{ fontSize: 28 }} />,
    title: "24/7 Support",
    desc: "Dedicated support for all your queries",
  },
];

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
  } = useForm<LoginFormValues>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    setError(null);

    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (!result || result.error) {
      setError("Invalid email or password.");
      return;
    }

    const session = await getSession();
    const role = session?.user?.role;

    if (role === "admin") {
      router.replace("/admin");
      return;
    }

    router.replace("/company");
  };

  const handleForgotPassword = async () => {
    setResetError(null);
    setResetMessage(null);

    const email = watch("email")?.trim();

    if (!email) {
      setResetError(
        "Enter your registered email in the Email Address field first."
      );
      return;
    }

    setIsSendingReset(true);

    try {
      const response = await fetch(`${apiBase}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setResetError(
          data.message ??
            "Unable to send reset link right now. Please try again."
        );
        return;
      }

      setResetMessage(
        "We have sent a time-limited password reset link to your registered email address."
      );
    } catch {
      setResetError("Network error while sending reset link. Please try again.");
    } finally {
      setIsSendingReset(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex" }}>
      {/* Left Panel - Branding */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          width: "45%",
          background: (theme) =>
            `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%, ${alpha(theme.palette.secondary.main, 0.8)} 100%)`,
          color: "white",
          flexDirection: "column",
          justifyContent: "center",
          p: 6,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <Stack spacing={4} sx={{ position: "relative", zIndex: 1 }}>
          {/* Logo */}
          <Box
            component={Link}
            href="/"
            sx={{ textDecoration: "none", color: "inherit", width: "fit-content" }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: 2,
                  bgcolor: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <SchoolIcon sx={{ fontSize: 36, color: "primary.main" }} />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight={700}>
                  IIT ISM CDC Portal
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Career Development Centre
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Box>
            <Typography variant="h3" fontWeight={700} sx={{ mb: 2 }}>
              Welcome to the
              <br />
              Recruitment Portal
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 400 }}>
              Connect with India&apos;s premier engineering talent. Submit JNFs
              and INFs seamlessly for campus placements and internships.
            </Typography>
          </Box>

          <Divider sx={{ borderColor: "rgba(255,255,255,0.2)", my: 2 }} />

          {/* Features */}
          <Grid2 container spacing={3}>
            {features.map((feature) => (
              <Grid2 key={feature.title} size={6}>
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                  <Box sx={{ color: "secondary.light" }}>{feature.icon}</Box>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {feature.title}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      {feature.desc}
                    </Typography>
                  </Box>
                </Stack>
              </Grid2>
            ))}
          </Grid2>

          {/* Stats */}
          <Stack direction="row" spacing={4} sx={{ mt: 4 }}>
            {[
              { value: "500+", label: "Companies" },
              { value: "10K+", label: "Students Placed" },
              { value: "99+", label: "Years Legacy" },
            ].map((stat) => (
              <Box key={stat.label}>
                <Typography variant="h4" fontWeight={700}>
                  {stat.value}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  {stat.label}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Stack>
      </Box>

      {/* Right Panel - Login Form */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          p: { xs: 3, sm: 6 },
          bgcolor: "grey.50",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 440,
            p: { xs: 3, sm: 5 },
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Stack spacing={4}>
            {/* Mobile Logo */}
            <Box
              sx={{
                display: { xs: "block", md: "none" },
                textAlign: "center",
                mb: 2,
              }}
            >
              <Stack
                component={Link}
                href="/"
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent="center"
                sx={{ textDecoration: "none" }}
              >
                <SchoolIcon color="primary" sx={{ fontSize: 32 }} />
                <Typography variant="h6" fontWeight={700} color="primary">
                  IIT ISM CDC Portal
                </Typography>
              </Stack>
            </Box>

            <Box>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Sign In
              </Typography>
              <Typography color="text.secondary">
                Enter your credentials to access your dashboard
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            {resetError && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {resetError}
              </Alert>
            )}

            {resetMessage && (
              <Alert severity="success" sx={{ borderRadius: 2 }}>
                {resetMessage}
              </Alert>
            )}

            <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={3}>
                <TextField
                  label="Email Address"
                  type="email"
                  fullWidth
                  placeholder="company@example.com"
                  {...register("email")}
                  error={Boolean(errors.email)}
                  helperText={errors.email?.message}
                  InputProps={{
                    sx: { borderRadius: 2 },
                  }}
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
                    sx: { borderRadius: 2 },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? (
                            <VisibilityOffIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: -1 }}>
                  <Button
                    type="button"
                    variant="text"
                    size="small"
                    onClick={handleForgotPassword}
                    disabled={isSendingReset || isSubmitting}
                    sx={{ textTransform: "none", px: 0 }}
                  >
                    {isSendingReset ? "Sending reset link..." : "Forgot password?"}
                  </Button>
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isSubmitting}
                  startIcon={<LoginIcon />}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    fontSize: "1rem",
                  }}
                >
                  {isSubmitting ? "Signing in..." : "Sign In"}
                </Button>
              </Stack>
            </Box>

            <Divider>
              <Typography variant="caption" color="text.secondary">
                New to the portal?
              </Typography>
            </Divider>

            <Button
              component={Link}
              href="/company/register"
              variant="outlined"
              size="large"
              fullWidth
              sx={{
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
              }}
            >
              Register Your Company
            </Button>

            <Typography
              variant="caption"
              color="text.secondary"
              textAlign="center"
            >
              By signing in, you agree to our Terms of Service and Privacy
              Policy
            </Typography>
          </Stack>
        </Paper>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 4 }}>
          © 2026 IIT (ISM) Dhanbad. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}
