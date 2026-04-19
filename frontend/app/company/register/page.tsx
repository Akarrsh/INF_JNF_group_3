"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid2,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  Step,
  StepButton,
  Stepper,
  TextField,
  Typography,
  alpha,
} from "@mui/material";
import { useForm, useWatch } from "react-hook-form";
import * as yup from "yup";
import SchoolIcon from "@mui/icons-material/School";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import BusinessIcon from "@mui/icons-material/Business";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LanguageIcon from "@mui/icons-material/Language";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import ApartmentIcon from "@mui/icons-material/Apartment";
import EditNoteIcon from "@mui/icons-material/EditNote";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import HowToRegIcon from "@mui/icons-material/HowToReg";

type RegisterFormValues = {
  company_name: string;
  website: string;
  postal_address: string;
  employee_count: string;
  sector: string;

  recruiter_name: string;
  recruiter_designation: string;
  hr_email: string;
  hr_phone: string;
  hr_alt_phone: string;

  head_name: string;
  head_designation: string;
  head_email: string;
  head_mobile: string;
  head_landline: string;

  poc2_name: string;
  poc2_designation: string;
  poc2_email: string;
  poc2_mobile: string;
  poc2_landline: string;

  company_logo: FileList;

  password: string;
  password_confirmation: string;
};

const schema = yup.object({
  company_name: yup.string().required("Company name is required"),
  website: yup
    .string()
    .url("Enter a valid URL")
    .required("Website link is required"),
  postal_address: yup.string().default(""),
  employee_count: yup
    .string()
    .default("")
    .test("employee-count", "Enter a valid number", (value) => {
      if (!value) {
        return true;
      }

      const parsed = Number(value);
      return Number.isInteger(parsed) && parsed > 0;
    }),
  sector: yup.string().required("Sector is required"),

  recruiter_name: yup.string().required("Full name of recruiter is required"),
  recruiter_designation: yup.string().required("Designation is required"),
  hr_email: yup
    .string()
    .email("Enter a valid email")
    .required("Company email address is required"),
  hr_phone: yup.string().required("Contact number is required"),
  hr_alt_phone: yup.string().default(""),

  head_name: yup.string().required("Head Talent Acquisition full name is required"),
  head_designation: yup.string().required("Head Talent Acquisition designation is required"),
  head_email: yup
    .string()
    .email("Enter a valid email")
    .required("Head Talent Acquisition email is required"),
  head_mobile: yup.string().required("Head Talent Acquisition mobile is required"),
  head_landline: yup.string().default(""),

  poc2_name: yup.string().default(""),
  poc2_designation: yup.string().default(""),
  poc2_email: yup
    .string()
    .default("")
    .test("optional-email", "Enter a valid email", (value) => {
      if (!value) {
        return true;
      }
      return yup.string().email().isValidSync(value);
    }),
  poc2_mobile: yup.string().default(""),
  poc2_landline: yup.string().default(""),

  company_logo: yup
    .mixed<FileList>()
    .required("Company logo is required")
    .test("file-required", "Company logo is required", (value) => {
      return value instanceof FileList && value.length > 0;
    })
    .test("file-size", "Logo must be less than 2MB", (value) => {
      if (!(value instanceof FileList) || value.length === 0) {
        return true;
      }
      return value[0].size <= 2 * 1024 * 1024;
    }),

  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords do not match")
    .required("Please confirm password"),
});

const steps = ["Registration Details", "Company Profile", "Contact & HR Details"];

export default function CompanyRegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailVerificationRequested, setEmailVerificationRequested] = useState(false);
  const [sendingVerificationLink, setSendingVerificationLink] = useState(false);
  const [verificationCooldown, setVerificationCooldown] = useState(0);
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);
  const [processedVerificationQuery, setProcessedVerificationQuery] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      recruiter_name: "",
      recruiter_designation: "",
      hr_email: "",
      hr_phone: "",
      hr_alt_phone: "",

      company_name: "",
      website: "",
      postal_address: "",
      employee_count: "",
      sector: "",

      head_name: "",
      head_designation: "",
      head_email: "",
      head_mobile: "",
      head_landline: "",

      poc2_name: "",
      poc2_designation: "",
      poc2_email: "",
      poc2_mobile: "",
      poc2_landline: "",

      password: "",
      password_confirmation: "",
    },
  });

  const recruiterName = useWatch({ control, name: "recruiter_name" });
  const recruiterDesignation = useWatch({ control, name: "recruiter_designation" });
  const recruiterEmail = useWatch({ control, name: "hr_email" });
  const recruiterMobile = useWatch({ control, name: "hr_phone" });
  const recruiterAlt = useWatch({ control, name: "hr_alt_phone" });
  const logoFiles = useWatch({ control, name: "company_logo" });

  const normalizedRecruiterEmail = useMemo(
    () => (recruiterEmail ?? "").trim().toLowerCase(),
    [recruiterEmail]
  );

  const isRecruiterEmailVerified =
    verifiedEmail !== null && verifiedEmail === normalizedRecruiterEmail;

  const checkRecruiterEmailVerificationStatus = async (emailArg?: string) => {
    const email = (emailArg ?? normalizedRecruiterEmail).trim().toLowerCase();

    if (!email || verifiedEmail === email) {
      return;
    }

    const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

    try {
      const response = await fetch(
        `${apiBase}/auth/company/recruiter-email/verification-status?email=${encodeURIComponent(email)}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        return;
      }

      const payload = (await response.json()) as { verified?: boolean; email?: string };
      if (payload.verified) {
        const verified = (payload.email ?? email).trim().toLowerCase();
        setVerifiedEmail(verified);
        setValue("hr_email", verified, { shouldValidate: true });
        setError(null);
        setSuccess("Recruiter email verified successfully.");
      }
    } catch {
      // Silent fail: status checks should not block form usage.
    }
  };

  useEffect(() => {
    if (processedVerificationQuery) {
      return;
    }

    const status = searchParams.get("verify_status");
    const message = searchParams.get("verify_message");
    const verifiedEmailParam = searchParams.get("verified_email");

    if (!status) {
      setProcessedVerificationQuery(true);
      return;
    }

    if (status === "success" && verifiedEmailParam) {
      const normalized = verifiedEmailParam.trim().toLowerCase();
      setValue("hr_email", normalized, { shouldValidate: true });
      setVerifiedEmail(normalized);
      setSuccess(message ?? "Recruiter email verified successfully.");
      setError(null);
    } else if (status === "failed") {
      setError(message ?? "Email verification failed. Please request a new link.");
    }

    setProcessedVerificationQuery(true);
  }, [processedVerificationQuery, searchParams, setValue]);

  useEffect(() => {
    if (verificationCooldown <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setVerificationCooldown((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [verificationCooldown]);

  useEffect(() => {
    const onWindowFocus = () => {
      void checkRecruiterEmailVerificationStatus();
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void checkRecruiterEmailVerificationStatus();
      }
    };

    window.addEventListener("focus", onWindowFocus);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("focus", onWindowFocus);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [normalizedRecruiterEmail, verifiedEmail]);

  const handleSendVerificationLink = async () => {
    setSuccess(null);
    setError(null);

    if (verificationCooldown > 0) {
      setError(`Please wait ${verificationCooldown}s before resending the verification link.`);
      return;
    }

    const valid = await trigger("hr_email");
    if (!valid) {
      return;
    }

    const email = (getValues("hr_email") ?? "").trim().toLowerCase();
    const name = (getValues("recruiter_name") ?? "").trim();

    if (!email) {
      setError("Please enter a valid recruiter email first.");
      return;
    }

    if (verifiedEmail === email) {
      setSuccess("This recruiter email is already verified.");
      return;
    }

    const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";
    setSendingVerificationLink(true);

    try {
      const response = await fetch(`${apiBase}/auth/company/recruiter-email/verification-link`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email,
          name,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        setError(payload.message ?? "Unable to send verification link.");
        return;
      }

      setEmailVerificationRequested(true);
      setVerificationCooldown(60);
      setSuccess("Verification link sent. Please check your recruiter email inbox.");
      void checkRecruiterEmailVerificationStatus(email);
    } catch {
      setError("Unable to send verification link right now. Please try again.");
    } finally {
      setSendingVerificationLink(false);
    }
  };

  const validateStep = async (step: number) => {
    switch (step) {
      case 0:
        return trigger([
          "recruiter_name",
          "recruiter_designation",
          "hr_email",
          "hr_phone",
          "password",
          "password_confirmation",
        ]);
      case 1:
        return trigger([
          "company_name",
          "website",
          "postal_address",
          "employee_count",
          "sector",
          "company_logo",
        ]);
      case 2:
        return trigger([
          "head_name",
          "head_designation",
          "head_email",
          "head_mobile",
          "head_landline",
          "poc2_name",
          "poc2_designation",
          "poc2_email",
          "poc2_mobile",
          "poc2_landline",
        ]);
      default:
        return true;
    }
  };

  const handleNext = async () => {
    const isValid = await validateStep(activeStep);
    if (!isValid) {
      return;
    }

    if (activeStep === 0 && !isRecruiterEmailVerified) {
      setError("Please verify the recruiter email before proceeding.");
      return;
    }

    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleStepClick = async (targetStep: number) => {
    if (targetStep <= activeStep) {
      setActiveStep(targetStep);
      return;
    }

    for (let step = 0; step < targetStep; step += 1) {
      const isValid = await validateStep(step);
      if (!isValid) {
        setActiveStep(step);
        return;
      }

      if (step === 0 && !isRecruiterEmailVerified) {
        setError("Please verify the recruiter email before proceeding.");
        setActiveStep(0);
        return;
      }
    }

    setError(null);
    setActiveStep(targetStep);
  };

  const onSubmit = async (values: RegisterFormValues) => {
    setSuccess(null);
    setError(null);

    if (!isRecruiterEmailVerified) {
      setError("Please verify the recruiter email before completing registration.");
      return;
    }

    const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";
    const formData = new FormData();

    formData.append("recruiter_name", values.recruiter_name);
    formData.append("recruiter_designation", values.recruiter_designation);
    formData.append("hr_email", values.hr_email);
    formData.append("hr_phone", values.hr_phone);
    formData.append("hr_alt_phone", values.hr_alt_phone ?? "");
    formData.append("password", values.password);
    formData.append("password_confirmation", values.password_confirmation);

    formData.append("company_name", values.company_name);
    formData.append("website", values.website);
    formData.append("postal_address", values.postal_address ?? "");
    formData.append("employee_count", values.employee_count ?? "");
    formData.append("sector", values.sector);

    formData.append("head_name", values.head_name);
    formData.append("head_designation", values.head_designation);
    formData.append("head_email", values.head_email);
    formData.append("head_mobile", values.head_mobile);
    formData.append("head_landline", values.head_landline ?? "");

    formData.append("poc1_name", values.recruiter_name);
    formData.append("poc1_designation", values.recruiter_designation);
    formData.append("poc1_email", values.hr_email);
    formData.append("poc1_mobile", values.hr_phone);
    formData.append("poc1_landline", values.hr_alt_phone ?? "");

    formData.append("poc2_name", values.poc2_name ?? "");
    formData.append("poc2_designation", values.poc2_designation ?? "");
    formData.append("poc2_email", values.poc2_email ?? "");
    formData.append("poc2_mobile", values.poc2_mobile ?? "");
    formData.append("poc2_landline", values.poc2_landline ?? "");

    if (values.company_logo && values.company_logo.length > 0) {
      formData.append("company_logo", values.company_logo[0]);
    }

    const response = await fetch(`${apiBase}/auth/company/register`, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      setError(payload.message ?? "Unable to register company.");
      return;
    }

    setSuccess("Registration successful! Redirecting to login...");
    setTimeout(() => {
      router.push("/auth/login");
    }, 1500);
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex" }}>
      {/* Left Panel - Branding */}
      <Box
        sx={{
          display: { xs: "none", lg: "flex" },
          width: "40%",
          background: (theme) =>
            `linear-gradient(135deg, ${theme.palette.secondary.dark} 0%, ${theme.palette.secondary.main} 50%, ${alpha(theme.palette.primary.main, 0.8)} 100%)`,
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
                <SchoolIcon sx={{ fontSize: 36, color: "secondary.main" }} />
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
              Join Our
              <br />
              Recruitment Network
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 400 }}>
              Register your company to access India&apos;s top engineering talent. 
              Submit JNFs and INFs for campus placements and internships.
            </Typography>
          </Box>

          <Divider sx={{ borderColor: "rgba(255,255,255,0.2)", my: 2 }} />

          {/* Benefits */}
          <Stack spacing={2}>
            <Typography variant="subtitle1" fontWeight={600}>
              Why Register?
            </Typography>
            {[
              "Access to 2000+ students across 18 departments",
              "Streamlined JNF/INF submission process",
              "Direct communication with CDC team",
              "Track application status in real-time",
              "Schedule pre-placement talks easily",
            ].map((benefit) => (
              <Stack key={benefit} direction="row" spacing={1.5} alignItems="center">
                <CheckCircleIcon sx={{ fontSize: 20, color: "primary.light" }} />
                <Typography variant="body2">{benefit}</Typography>
              </Stack>
            ))}
          </Stack>

          {/* Stats */}
          <Stack direction="row" spacing={4} sx={{ mt: 4 }}>
            {[
              { value: "18", label: "Departments" },
              { value: "2000+", label: "Students" },
              { value: "100%", label: "Placement" },
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

      {/* Right Panel - Registration Form */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          p: { xs: 2, sm: 4 },
          bgcolor: "grey.50",
          overflowY: "auto",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 560,
            p: { xs: 3, sm: 5 },
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            my: 2,
          }}
        >
          <Stack spacing={4}>
            {/* Mobile Logo */}
            <Box sx={{ display: { xs: "block", lg: "none" }, textAlign: "center" }}>
              <Stack
                component={Link}
                href="/"
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent="center"
                sx={{ textDecoration: "none" }}
              >
                <SchoolIcon color="secondary" sx={{ fontSize: 32 }} />
                <Typography variant="h6" fontWeight={700} color="secondary">
                  IIT ISM CDC Portal
                </Typography>
              </Stack>
            </Box>

            <Box>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Company Registration
              </Typography>
              <Typography color="text.secondary">
                Create your account to start recruiting
              </Typography>
            </Box>

            {/* Stepper */}
            <Stepper activeStep={activeStep} alternativeLabel nonLinear>
              {steps.map((label, index) => (
                <Step key={label} completed={activeStep > index}>
                  <StepButton
                    onClick={() => {
                      void handleStepClick(index);
                    }}
                    sx={{
                      ".MuiStepLabel-label": {
                        fontWeight: 600,
                      },
                      ".MuiStepIcon-root.Mui-completed": {
                        color: "success.main",
                      },
                      ".MuiStepIcon-root.Mui-active": {
                        color: "secondary.main",
                      },
                    }}
                  >
                    {label}
                  </StepButton>
                </Step>
              ))}
            </Stepper>

            {success && (
              <Alert
                severity="success"
                sx={{ borderRadius: 2 }}
                icon={<CheckCircleIcon />}
              >
                {success}
              </Alert>
            )}
            {error && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
              {/* Step 1: Company Info */}
              {activeStep === 0 && (
                <Stack spacing={3}>
                  <TextField
                    label="Full Name of Recruiter"
                    fullWidth
                    placeholder="e.g., Rohit Singh"
                    {...register("recruiter_name")}
                    error={Boolean(errors.recruiter_name)}
                    helperText={errors.recruiter_name?.message}
                    InputProps={{
                      sx: { borderRadius: 2 },
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    label="Designation"
                    fullWidth
                    placeholder="e.g., Talent Acquisition Manager"
                    {...register("recruiter_designation")}
                    error={Boolean(errors.recruiter_designation)}
                    helperText={errors.recruiter_designation?.message}
                    InputProps={{
                      sx: { borderRadius: 2 },
                      startAdornment: (
                        <InputAdornment position="start">
                          <BusinessIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    label="Company Email Address"
                    type="email"
                    fullWidth
                    placeholder="recruiter@company.com"
                    {...register("hr_email")}
                    error={Boolean(errors.hr_email)}
                    helperText={errors.hr_email?.message}
                    InputProps={{
                      sx: { borderRadius: 2 },
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems={{ sm: "center" }}>
                    <Button
                      variant="outlined"
                      color={isRecruiterEmailVerified ? "success" : "secondary"}
                      onClick={handleSendVerificationLink}
                      disabled={sendingVerificationLink || isRecruiterEmailVerified || verificationCooldown > 0}
                      startIcon={<EmailIcon />}
                      sx={{ borderRadius: 2, textTransform: "none" }}
                    >
                      {sendingVerificationLink
                        ? "Sending verification link..."
                        : isRecruiterEmailVerified
                          ? "Email Verified"
                          : verificationCooldown > 0
                            ? `Resend in ${verificationCooldown}s`
                            : "Verify Mail"}
                    </Button>
                    <Typography variant="body2" color={isRecruiterEmailVerified ? "success.main" : "text.secondary"}>
                      {isRecruiterEmailVerified
                        ? "Recruiter email is verified."
                        : "Please verify this email before moving to the next step."}
                    </Typography>
                  </Stack>

                  <TextField
                    label="Contact Number"
                    fullWidth
                    placeholder="+91 98765 43210"
                    {...register("hr_phone")}
                    error={Boolean(errors.hr_phone)}
                    helperText={errors.hr_phone?.message}
                    InputProps={{
                      sx: { borderRadius: 2 },
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    label="Landline (Optional)"
                    fullWidth
                    placeholder="Optional"
                    {...register("hr_alt_phone")}
                    error={Boolean(errors.hr_alt_phone)}
                    helperText={errors.hr_alt_phone?.message || "Optional"}
                    InputProps={{
                      sx: { borderRadius: 2 },
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Divider />

                  <TextField
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    placeholder="Minimum 8 characters"
                    {...register("password")}
                    error={Boolean(errors.password)}
                    helperText={errors.password?.message}
                    InputProps={{
                      sx: { borderRadius: 2 },
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    label="Confirm Password"
                    type={showConfirmPassword ? "text" : "password"}
                    fullWidth
                    placeholder="Re-enter your password"
                    {...register("password_confirmation")}
                    error={Boolean(errors.password_confirmation)}
                    helperText={errors.password_confirmation?.message}
                    InputProps={{
                      sx: { borderRadius: 2 },
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                          >
                            {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Stack>
              )}

              {/* Step 2: Contact Details */}
              {activeStep === 1 && (
                <Stack spacing={3}>
                  <TextField
                    label="Company Name"
                    fullWidth
                    placeholder="e.g., Acme Technologies Pvt Ltd"
                    {...register("company_name")}
                    error={Boolean(errors.company_name)}
                    helperText={errors.company_name?.message}
                    InputProps={{
                      sx: { borderRadius: 2 },
                      startAdornment: (
                        <InputAdornment position="start">
                          <ApartmentIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    label="Website Link"
                    fullWidth
                    placeholder="https://www.company.com"
                    {...register("website")}
                    error={Boolean(errors.website)}
                    helperText={errors.website?.message}
                    InputProps={{
                      sx: { borderRadius: 2 },
                      startAdornment: (
                        <InputAdornment position="start">
                          <LanguageIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    label="Postal Address"
                    multiline
                    minRows={3}
                    fullWidth
                    placeholder="Optional"
                    {...register("postal_address")}
                    error={Boolean(errors.postal_address)}
                    helperText={errors.postal_address?.message || "Optional"}
                    InputProps={{ sx: { borderRadius: 2 } }}
                  />

                  <TextField
                    label="Number of Employees"
                    fullWidth
                    placeholder="Optional"
                    {...register("employee_count")}
                    error={Boolean(errors.employee_count)}
                    helperText={errors.employee_count?.message || "Optional"}
                    InputProps={{
                      sx: { borderRadius: 2 },
                      startAdornment: (
                        <InputAdornment position="start">
                          <BusinessIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    label="Sector"
                    fullWidth
                    placeholder="e.g., Information Technology"
                    {...register("sector")}
                    error={Boolean(errors.sector)}
                    helperText={errors.sector?.message}
                    InputProps={{ sx: { borderRadius: 2 } }}
                  />

                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<UploadFileIcon />}
                    sx={{ borderRadius: 2, justifyContent: "flex-start", py: 1.2 }}
                  >
                    {logoFiles && logoFiles.length > 0
                      ? `Logo selected: ${logoFiles[0].name}`
                      : "Upload Company Logo"}
                    <input
                      hidden
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,.svg"
                      {...register("company_logo")}
                    />
                  </Button>
                  {errors.company_logo && (
                    <Typography variant="caption" color="error">
                      {errors.company_logo.message as string}
                    </Typography>
                  )}
                </Stack>
              )}

              {/* Step 3: Contact & HR Details */}
              {activeStep === 2 && (
                <Stack spacing={3}>
                  <Alert severity="info" sx={{ borderRadius: 2 }}>
                    PoC 1 is auto-filled from Step 1 and is locked. Use the edit button below if you need to make changes.
                  </Alert>

                  <Stack spacing={2.5}>
                    <Card
                      variant="outlined"
                      sx={{
                        borderRadius: 2,
                        overflow: "hidden",
                        boxShadow: "0 6px 20px rgba(0,0,0,0.04)",
                      }}
                    >
                      <Box sx={{ bgcolor: "primary.dark", color: "primary.contrastText", px: 2, py: 1.2 }}>
                        <Typography variant="subtitle1" fontWeight={700}>
                          Head Talent Acquisition
                        </Typography>
                      </Box>
                      <CardContent>
                        <Grid2 container spacing={2}>
                          <Grid2 size={{ xs: 12, md: 6 }}>
                            <TextField label="Full Name" fullWidth {...register("head_name")} error={Boolean(errors.head_name)} helperText={errors.head_name?.message} />
                          </Grid2>
                          <Grid2 size={{ xs: 12, md: 6 }}>
                            <TextField label="Designation" fullWidth {...register("head_designation")} error={Boolean(errors.head_designation)} helperText={errors.head_designation?.message} />
                          </Grid2>
                          <Grid2 size={{ xs: 12, md: 6 }}>
                            <TextField label="Email Address" fullWidth {...register("head_email")} error={Boolean(errors.head_email)} helperText={errors.head_email?.message} />
                          </Grid2>
                          <Grid2 size={{ xs: 12, md: 6 }}>
                            <TextField label="Mobile Number" placeholder="+91 98765 43210" fullWidth {...register("head_mobile")} error={Boolean(errors.head_mobile)} helperText={errors.head_mobile?.message} />
                          </Grid2>
                          <Grid2 size={{ xs: 12, md: 6 }}>
                            <TextField label="Landline (Optional)" fullWidth {...register("head_landline")} error={Boolean(errors.head_landline)} helperText={errors.head_landline?.message || "Optional"} />
                          </Grid2>
                        </Grid2>
                      </CardContent>
                    </Card>

                    <Card
                      variant="outlined"
                      sx={{
                        borderRadius: 2,
                        overflow: "hidden",
                        boxShadow: "0 6px 20px rgba(0,0,0,0.04)",
                      }}
                    >
                      <Box sx={{ bgcolor: "secondary.dark", color: "secondary.contrastText", px: 2, py: 1.2 }}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                          <Typography variant="subtitle1" fontWeight={700}>
                            Primary Contact (PoC 1)
                          </Typography>
                          <Button
                            size="small"
                            variant="outlined"
                            color="inherit"
                            startIcon={<EditNoteIcon />}
                            onClick={() => setActiveStep(0)}
                            sx={{ borderColor: "currentColor", textTransform: "none" }}
                          >
                            Edit Registration Details
                          </Button>
                        </Stack>
                      </Box>
                      <CardContent>
                        <Grid2 container spacing={2}>
                          <Grid2 size={{ xs: 12, md: 6 }}>
                            <TextField label="Full Name" fullWidth value={recruiterName || ""} disabled />
                          </Grid2>
                          <Grid2 size={{ xs: 12, md: 6 }}>
                            <TextField label="Designation" fullWidth value={recruiterDesignation || ""} disabled />
                          </Grid2>
                          <Grid2 size={{ xs: 12, md: 6 }}>
                            <TextField label="Email Address" fullWidth value={recruiterEmail || ""} disabled />
                          </Grid2>
                          <Grid2 size={{ xs: 12, md: 6 }}>
                            <TextField label="Mobile Number" placeholder="+91 98765 43210" fullWidth value={recruiterMobile || ""} disabled />
                          </Grid2>
                          <Grid2 size={{ xs: 12, md: 6 }}>
                            <TextField label="Landline (Optional)" fullWidth value={recruiterAlt || ""} disabled />
                          </Grid2>
                        </Grid2>
                      </CardContent>
                    </Card>

                    <Card
                      variant="outlined"
                      sx={{
                        borderRadius: 2,
                        overflow: "hidden",
                        boxShadow: "0 6px 20px rgba(0,0,0,0.04)",
                      }}
                    >
                      <Box sx={{ bgcolor: "grey.800", color: "common.white", px: 2, py: 1.2 }}>
                        <Typography variant="subtitle1" fontWeight={700}>
                          Secondary Contact (PoC 2) (Optional)
                        </Typography>
                      </Box>
                      <CardContent>
                        <Grid2 container spacing={2}>
                          <Grid2 size={{ xs: 12, md: 6 }}>
                            <TextField label="Full Name" fullWidth {...register("poc2_name")} error={Boolean(errors.poc2_name)} helperText={errors.poc2_name?.message || "Optional"} />
                          </Grid2>
                          <Grid2 size={{ xs: 12, md: 6 }}>
                            <TextField label="Designation" fullWidth {...register("poc2_designation")} error={Boolean(errors.poc2_designation)} helperText={errors.poc2_designation?.message || "Optional"} />
                          </Grid2>
                          <Grid2 size={{ xs: 12, md: 6 }}>
                            <TextField label="Email Address" fullWidth {...register("poc2_email")} error={Boolean(errors.poc2_email)} helperText={errors.poc2_email?.message || "Optional"} />
                          </Grid2>
                          <Grid2 size={{ xs: 12, md: 6 }}>
                            <TextField label="Mobile Number" placeholder="+91 98765 43210" fullWidth {...register("poc2_mobile")} error={Boolean(errors.poc2_mobile)} helperText={errors.poc2_mobile?.message || "Optional"} />
                          </Grid2>
                          <Grid2 size={{ xs: 12, md: 6 }}>
                            <TextField label="Landline (Optional)" fullWidth {...register("poc2_landline")} error={Boolean(errors.poc2_landline)} helperText={errors.poc2_landline?.message || "Optional"} />
                          </Grid2>
                        </Grid2>
                      </CardContent>
                    </Card>
                  </Stack>
                </Stack>
              )}

              {/* Navigation Buttons */}
              <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
                {activeStep > 0 && (
                  <Button
                    variant="outlined"
                    onClick={handleBack}
                    startIcon={<ArrowBackIcon />}
                    sx={{ borderRadius: 2, px: 3 }}
                  >
                    Back
                  </Button>
                )}
                <Box sx={{ flex: 1 }} />
                {activeStep < steps.length - 1 ? (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleNext}
                    endIcon={<ArrowForwardIcon />}
                    sx={{ borderRadius: 2, px: 4 }}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    disabled={isSubmitting}
                    startIcon={<HowToRegIcon />}
                    sx={{ borderRadius: 2, px: 4, py: 1.5 }}
                  >
                    {isSubmitting ? "Registering..." : "Complete Registration"}
                  </Button>
                )}
              </Stack>
            </Box>

            <Divider>
              <Typography variant="caption" color="text.secondary">
                Already have an account?
              </Typography>
            </Divider>

            <Button
              component={Link}
              href="/auth/login"
              variant="outlined"
              size="large"
              fullWidth
              sx={{ borderRadius: 2, fontWeight: 600 }}
            >
              Sign In Instead
            </Button>
          </Stack>
        </Paper>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 2, mb: 2 }}
        >
          © 2026 IIT (ISM) Dhanbad. All rights reserved.
        </Typography>
      </Box>

      <Dialog open={emailVerificationRequested} onClose={() => setEmailVerificationRequested(false)}>
        <DialogTitle>Verification Link Sent</DialogTitle>
        <DialogContent>
          <Typography>
            A time-limited verification link has been sent to the provided recruiter email address.
            Please confirm by clicking the link in your inbox, then return here to continue registration.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEmailVerificationRequested(false)} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
