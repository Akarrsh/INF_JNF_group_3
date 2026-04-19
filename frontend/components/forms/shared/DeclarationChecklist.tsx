"use client";

import {
  Box,
  Checkbox,
  FormControlLabel,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
  alpha,
  Divider,
} from "@mui/material";

interface DeclarationChecklistProps {
  declarations: {
    aipc: boolean;
    shortlistCriteria: boolean;
    infoVerified: boolean;
    consentLogo: boolean;
    confirmAccuracy: boolean;
    resultsViaCdc: boolean;
  };
  onDeclarationsChange: (declarations: DeclarationChecklistProps["declarations"]) => void;
  signatory: {
    name: string;
    designation: string;
    date: string;
  };
  onSignatoryChange: (signatory: DeclarationChecklistProps["signatory"]) => void;
}

const declarationTexts = {
  aipc: "I have thoroughly read the AIPC guidelines and agree to abide by them during the entire placement/internship process.",
  shortlistCriteria: "Shortlisting criteria will be provided and final shortlist will be shared within 24–48 hours after the written test.",
  infoVerified: "The information provided in this form is verified and correct. No new clauses will be added in the final offer letter.",
  consentLogo: "I consent to share company name, logo, and email with national ranking agencies (NIRF) and media for promotional purposes.",
  confirmAccuracy: "I confirm the accuracy of the job/internship profile and agree to adhere to all Terms & Conditions. Strict action may be taken in case of any discrepancy.",
  resultsViaCdc: "Results and communication will be shared through CDC and not directly to students.",
};

export default function DeclarationChecklist({
  declarations,
  onDeclarationsChange,
  signatory,
  onSignatoryChange,
}: DeclarationChecklistProps) {
  const toggleDeclaration = (key: keyof typeof declarations) => {
    onDeclarationsChange({ ...declarations, [key]: !declarations[key] });
  };

  const updateSignatory = (field: keyof typeof signatory, value: string) => {
    onSignatoryChange({ ...signatory, [field]: value });
  };

  const allChecked = Object.values(declarations).every(Boolean);

  return (
    <Box>
      {/* Declaration Checkboxes */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" fontWeight={600} mb={2} color="primary">
          📋 Declaration & Agreement
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Please read and agree to the following declarations before submitting your form.
        </Typography>

        <Stack spacing={2}>
          {Object.entries(declarationTexts).map(([key, text]) => (
            <FormControlLabel
              key={key}
              control={
                <Checkbox
                  checked={declarations[key as keyof typeof declarations]}
                  onChange={() => toggleDeclaration(key as keyof typeof declarations)}
                  color="primary"
                />
              }
              label={
                <Typography variant="body2" color="text.primary">
                  {text}
                </Typography>
              }
              sx={{
                alignItems: "flex-start",
                bgcolor: declarations[key as keyof typeof declarations]
                  ? alpha("#1976d2", 0.05)
                  : "transparent",
                borderRadius: 1,
                p: 1,
                m: 0,
                border: "1px solid",
                borderColor: declarations[key as keyof typeof declarations]
                  ? "primary.light"
                  : "divider",
              }}
            />
          ))}
        </Stack>

        {/* Policy Links */}
        <Stack direction="row" spacing={2} mt={3}>
          <Link
            href="https://www.iitism.ac.in/placement-cell"
            target="_blank"
            rel="noopener"
            variant="body2"
          >
            📄 IIT (ISM) CDC Policy
          </Link>
          <Link
            href="https://www.placements-iitism.in"
            target="_blank"
            rel="noopener"
            variant="body2"
          >
            📄 AIPC Guidelines
          </Link>
        </Stack>

        {!allChecked && (
          <Typography variant="caption" color="error" mt={2} display="block">
            * All declarations must be accepted to submit the form
          </Typography>
        )}
      </Paper>

      <Divider sx={{ my: 3 }} />

      {/* Self-Declaration / Signatory */}
      <Paper
        sx={{
          p: 3,
          background: (theme) => alpha(theme.palette.secondary.main, 0.05),
          border: "1px solid",
          borderColor: "secondary.light",
        }}
      >
        <Typography variant="subtitle1" fontWeight={600} mb={2} color="secondary.dark">
          ✍️ Authorised Signatory
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Please provide details of the authorised representative submitting this form.
        </Typography>

        <Stack spacing={2}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              fullWidth
              label="Full Name of Signatory"
              value={signatory.name}
              onChange={(e) => updateSignatory("name", e.target.value)}
              required
              placeholder="Enter full name"
            />
            <TextField
              fullWidth
              label="Designation"
              value={signatory.designation}
              onChange={(e) => updateSignatory("designation", e.target.value)}
              required
              placeholder="e.g., HR Manager, Campus Recruiter"
            />
          </Stack>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              type="date"
              label="Date"
              value={signatory.date}
              onChange={(e) => updateSignatory("date", e.target.value)}
              InputLabelProps={{ shrink: true }}
              required
              sx={{ width: { xs: "100%", md: 200 } }}
            />
          </Stack>
        </Stack>

        <Typography variant="caption" color="text.secondary" mt={2} display="block">
          By submitting this form, you confirm that you are authorised to represent your organisation
          and that all information provided is accurate to the best of your knowledge.
        </Typography>
      </Paper>
    </Box>
  );
}
