"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Alert,
  AppBar,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Snackbar,
  Stack,
  TextField,
  Toolbar,
  Typography,
  alpha,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import PeopleIcon from "@mui/icons-material/People";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import SendIcon from "@mui/icons-material/Send";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const DEGREES = [
  { value: "be_btech_barch", label: "BE / BTech / BArch" },
  { value: "me_mtech_march", label: "ME / MTech / MArch" },
  { value: "integrated_dual", label: "Integrated Dual Degree" },
  { value: "msc", label: "MSc / MSc.Tech" },
  { value: "mba", label: "MBA" },
  { value: "phd", label: "PhD" },
  { value: "other", label: "Other" },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api/backend";

export default function AlumniOutreachPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone_number: "",
    completion_year: "",
    degree: "",
    degree_other: "",
    branch: "",
    current_job: "",
    areas_of_interest: "",
    linkedin_profile: "",
    general_comments: "",
    willing_to_visit: "",
    current_location: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  });

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!form.email.trim()) newErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Please enter a valid email address.";
    if (!form.phone_number.trim()) newErrors.phone_number = "Phone number is required.";
    else if (!/^\+[1-9]\d{6,14}$/.test(form.phone_number.replace(/[\s\-]/g, "")))
      newErrors.phone_number = "Please enter a full international number, e.g. +91-12345-12345";
    if (!form.completion_year) newErrors.completion_year = "Year of degree completion is required.";
    else if (isNaN(Number(form.completion_year)) || Number(form.completion_year) < 1900)
      newErrors.completion_year = "Please enter a valid year (e.g. 1997).";
    if (!form.degree) newErrors.degree = "Degree is required.";
    if (form.degree === "other" && !form.degree_other?.trim()) newErrors.degree_other = "Please specify your degree.";
    if (!form.branch.trim()) newErrors.branch = "Branch is required.";
    if (!form.current_job.trim()) newErrors.current_job = "Current job is required.";
    if (!form.areas_of_interest.trim()) newErrors.areas_of_interest = "Areas of interest are required.";
    if (!form.linkedin_profile.trim()) newErrors.linkedin_profile = "LinkedIn profile URL is required.";
    else if (!/^https?:\/\/(www\.)?linkedin\.com\//.test(form.linkedin_profile))
      newErrors.linkedin_profile = "Please enter a valid LinkedIn profile URL (e.g. https://linkedin.com/in/yourprofile).";
    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/alumni-outreach`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          completion_year: parseInt(form.completion_year),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        if (data?.errors) {
          const mapped: Record<string, string> = {};
          for (const [key, msgs] of Object.entries(data.errors)) {
            mapped[key] = (msgs as string[])[0];
          }
          setErrors(mapped);
          return;
        }
        throw new Error(data?.message ?? "Submission failed.");
      }

      setSubmitted(true);
    } catch (e) {
      setSnackbar({ open: true, message: e instanceof Error ? e.message : "Something went wrong.", severity: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "grey.50", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Paper sx={{ p: 6, textAlign: "center", maxWidth: 480, mx: "auto", borderRadius: 3 }}>
          <CheckCircleIcon sx={{ fontSize: 72, color: "success.main", mb: 2 }} />
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Thank You!
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            Your Alumni Outreach submission has been received. We'll be in touch with you soon about mentorship opportunities.
          </Typography>
          <Button component={Link} href="/" variant="contained" size="large">
            Back to Home
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50" }}>
      {/* Navbar */}
      <AppBar position="fixed" color="inherit" elevation={0} sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
        <Container maxWidth="lg">
          <Toolbar sx={{ px: { xs: 0 } }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ flexGrow: 1 }}>
              <SchoolIcon color="primary" sx={{ fontSize: 32 }} />
              <Box>
                <Typography variant="h6" fontWeight={700} color="primary" lineHeight={1.2}>
                  IIT (ISM) Dhanbad
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Career Development Centre
                </Typography>
              </Box>
            </Stack>
            <Button component={Link} href="/" variant="outlined" size="small">
              Back to Home
            </Button>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Hero */}
      <Box
        sx={{
          pt: 14,
          pb: 6,
          background: (theme) =>
            `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 60%, ${alpha(theme.palette.secondary.main, 0.7)} 100%)`,
          color: "white",
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <PeopleIcon sx={{ fontSize: 52, mb: 1, opacity: 0.9 }} />
          <Typography variant="h3" fontWeight={700} gutterBottom>
            Alumni Outreach Program
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.85, maxWidth: 600, mx: "auto" }}>
            Connect with current students at IIT (ISM) Dhanbad as a mentor. Share your experience and guide the next generation.
          </Typography>
        </Container>
      </Box>

      {/* Form */}
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 3 }}>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Register as a Mentor
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={4}>
            Fields marked with <Box component="span" color="error.main">*</Box> are required.
          </Typography>

          <Stack spacing={3}>
            {/* Personal Details */}
            <Typography variant="subtitle1" fontWeight={700} color="primary">
              Personal Details
            </Typography>

            <TextField
              id="alumni-name"
              label="Name"
              required
              fullWidth
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
            />

            <TextField
              id="alumni-email"
              label="Email"
              type="email"
              required
              fullWidth
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
            />

            <TextField
              id="alumni-phone"
              label="Phone Number"
              required
              fullWidth
              value={form.phone_number}
              onChange={(e) => update("phone_number", e.target.value)}
              placeholder="+91-12345-12345"
              error={!!errors.phone_number}
              helperText={errors.phone_number || "Will not be shared publicly. Please enter a full international number, e.g. +91-12345-12345"}
            />

            <Divider />

            {/* Academic Details */}
            <Typography variant="subtitle1" fontWeight={700} color="primary">
              Academic Background
            </Typography>

            <TextField
              id="alumni-year"
              label="Year of Degree Completion"
              required
              fullWidth
              value={form.completion_year}
              onChange={(e) => update("completion_year", e.target.value)}
              placeholder="e.g. 1997"
              type="number"
              inputProps={{ min: 1900, max: new Date().getFullYear() + 10, step: 1 }}
              error={!!errors.completion_year}
              helperText={errors.completion_year}
            />

            <FormControl required error={!!errors.degree} fullWidth>
              <InputLabel id="degree-label">Degree at IIT (ISM)</InputLabel>
              <Select
                labelId="degree-label"
                id="alumni-degree"
                value={form.degree}
                label="Degree at IIT (ISM)"
                onChange={(e) => update("degree", e.target.value)}
              >
                {DEGREES.map((d) => (
                  <MenuItem key={d.value} value={d.value}>
                    {d.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.degree && <FormHelperText>{errors.degree}</FormHelperText>}
            </FormControl>

            {form.degree === "other" && (
              <TextField
                id="alumni-degree-other"
                label="Please specify your degree"
                required
                fullWidth
                value={form.degree_other}
                onChange={(e) => update("degree_other", e.target.value)}
                error={!!errors.degree_other}
                helperText={errors.degree_other}
              />
            )}

            <TextField
              id="alumni-branch"
              label="Branch / Department"
              required
              fullWidth
              value={form.branch}
              onChange={(e) => update("branch", e.target.value)}
              placeholder="e.g. Computer Science and Engineering"
              error={!!errors.branch}
              helperText={errors.branch}
            />

            <Divider />

            {/* Professional Details */}
            <Typography variant="subtitle1" fontWeight={700} color="primary">
              Professional Details
            </Typography>

            <TextField
              id="alumni-job"
              label="Current Job / Role"
              required
              fullWidth
              value={form.current_job}
              onChange={(e) => update("current_job", e.target.value)}
              placeholder="e.g. Senior Software Engineer at Google"
              error={!!errors.current_job}
              helperText={errors.current_job}
            />

            <TextField
              id="alumni-location"
              label="Current Location"
              fullWidth
              value={form.current_location}
              onChange={(e) => update("current_location", e.target.value)}
              placeholder="e.g. Bangalore, India"
            />

            <TextField
              id="alumni-interests"
              label="Areas of Interest"
              required
              fullWidth
              multiline
              rows={3}
              value={form.areas_of_interest}
              onChange={(e) => update("areas_of_interest", e.target.value)}
              placeholder="e.g. Entrepreneurship, Career Guidance, Life Skills, Research, Civil Engineering, Robotics, Finance..."
              helperText={errors.areas_of_interest || "Will be used to match with mentees. Use words that students can relate to."}
              error={!!errors.areas_of_interest}
            />

            <TextField
              id="alumni-linkedin"
              label="LinkedIn Profile Link"
              required
              fullWidth
              value={form.linkedin_profile}
              onChange={(e) => update("linkedin_profile", e.target.value)}
              placeholder="https://linkedin.com/in/yourprofile"
              InputProps={{ startAdornment: <LinkedInIcon sx={{ color: "#0077b5", mr: 1 }} /> }}
              error={!!errors.linkedin_profile}
              helperText={errors.linkedin_profile}
            />

            <Divider />

            {/* Misc */}
            <Typography variant="subtitle1" fontWeight={700} color="primary">
              Additional Information
            </Typography>

            <FormControl>
              <FormLabel id="visit-label">Are you willing to come to campus?</FormLabel>
              <RadioGroup
                aria-labelledby="visit-label"
                row
                value={form.willing_to_visit}
                onChange={(e) => update("willing_to_visit", e.target.value)}
              >
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
                <FormControlLabel value="maybe" control={<Radio />} label="Maybe" />
              </RadioGroup>
            </FormControl>

            <TextField
              id="alumni-comments"
              label="General Comments"
              fullWidth
              multiline
              rows={4}
              value={form.general_comments}
              onChange={(e) => update("general_comments", e.target.value)}
              placeholder="Any additional information you'd like to share..."
            />

            <Button
              id="alumni-submit"
              variant="contained"
              size="large"
              onClick={handleSubmit}
              disabled={submitting}
              startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <SendIcon />}
              sx={{ py: 1.5 }}
            >
              {submitting ? "Submitting..." : "Submit Application"}
            </Button>

            <Typography variant="body2" color="text.secondary" textAlign="center">
              Having trouble filling this form? Please email{" "}
              <Box
                component="a"
                href="mailto:iitismcdc@gmail.com"
                sx={{ color: "primary.main", textDecoration: "none", fontWeight: 600 }}
              >
                iitismcdc@gmail.com
              </Box>
            </Typography>
          </Stack>
        </Paper>
      </Container>

      <Snackbar open={snackbar.open} autoHideDuration={5000} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
