"use client";

import {
  Box,
  Checkbox,
  Chip,
  FormControlLabel,
  LinearProgress,
  Link,
  Stack,
  TextField,
  Typography,
  alpha,
  Divider,
  Card,
  CardContent,
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
  const checkedCount = Object.values(declarations).filter(Boolean).length;
  const totalCount = Object.keys(declarations).length;

  return (
    <Box>
      {/* Declaration Checkboxes */}
      <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 3, mb: 3, overflow: "hidden" }}>
        {/* Header */}
        <Box sx={{ px: 3, py: 2.5, bgcolor: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1.5}>
            <Typography variant="subtitle1" fontWeight={700} color="text.primary">
              Declaration &amp; Agreement
            </Typography>
            <Chip
              label={`${checkedCount} / ${totalCount} accepted`}
              size="small"
              color={allChecked ? "success" : "default"}
              variant={allChecked ? "filled" : "outlined"}
              sx={{ fontWeight: 700, fontSize: "0.7rem" }}
            />
          </Stack>
          <LinearProgress
            variant="determinate"
            value={(checkedCount / totalCount) * 100}
            color={allChecked ? "success" : "primary"}
            sx={{ borderRadius: 1, height: 5 }}
          />
          <Typography variant="body2" color="text.secondary" mt={1.5}>
            Please read and accept all declarations before submitting your form.
          </Typography>
        </Box>

        <CardContent sx={{ p: 3 }}>
          <Stack spacing={1.5}>
            {Object.entries(declarationTexts).map(([key, text], index) => {
              const checked = declarations[key as keyof typeof declarations];
              return (
                <Box
                  key={key}
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 1.5,
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: checked ? "success.light" : "#e2e8f0",
                    bgcolor: checked ? alpha("#16a34a", 0.04) : "white",
                    transition: "all 0.2s",
                    cursor: "pointer",
                  }}
                  onClick={() => toggleDeclaration(key as keyof typeof declarations)}
                >
                  <Checkbox
                    checked={checked}
                    onChange={() => toggleDeclaration(key as keyof typeof declarations)}
                    color="success"
                    size="small"
                    sx={{ p: 0, mt: 0.1, flexShrink: 0 }}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Stack direction="row" spacing={1} alignItems="flex-start">
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 800,
                          color: checked ? "success.dark" : "text.disabled",
                          flexShrink: 0,
                          lineHeight: 1.6,
                        }}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </Typography>
                      <Typography
                        variant="body2"
                        color={checked ? "text.primary" : "text.secondary"}
                        sx={{ lineHeight: 1.6, textDecoration: checked ? "none" : "none" }}
                      >
                        {text}
                      </Typography>
                    </Stack>
                  </Box>
                </Box>
              );
            })}
          </Stack>

          {/* Policy Links */}
          <Stack direction="row" spacing={3} mt={3} pt={2} sx={{ borderTop: "1px solid #f1f5f9" }}>
            <Link
              href="https://www.iitism.ac.in/placement-cell"
              target="_blank"
              rel="noopener"
              variant="body2"
              sx={{ fontWeight: 600 }}
            >
              📄 IIT (ISM) CDC Policy
            </Link>
            <Link
              href="https://www.placements-iitism.in"
              target="_blank"
              rel="noopener"
              variant="body2"
              sx={{ fontWeight: 600 }}
            >
              📄 AIPC Guidelines
            </Link>
          </Stack>

          {!allChecked && (
            <Typography variant="caption" color="error.main" mt={1.5} display="block" fontWeight={600}>
              ⚠ All {totalCount} declarations must be accepted before submitting
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Signatory section */}
      <Card
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "primary.light",
          borderRadius: 3,
          overflow: "hidden",
          bgcolor: alpha("#1a3a5c", 0.02),
        }}
      >
        <Box sx={{ px: 3, py: 2.5, bgcolor: alpha("#1a3a5c", 0.05), borderBottom: "1px solid", borderBottomColor: "primary.light" }}>
          <Typography variant="subtitle1" fontWeight={700} color="primary.dark">
            ✍️ Authorised Signatory
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Please provide details of the authorised representative submitting this form.
          </Typography>
        </Box>
        <CardContent sx={{ p: 3 }}>
          <Stack spacing={2.5}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <TextField
                fullWidth
                label="Full Name"
                value={signatory.name}
                onChange={(e) => updateSignatory("name", e.target.value)}
                required
                placeholder="Enter full name"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
              <TextField
                fullWidth
                label="Designation"
                value={signatory.designation}
                onChange={(e) => updateSignatory("designation", e.target.value)}
                required
                placeholder="e.g., HR Manager, Campus Recruiter"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
              <TextField
                type="date"
                label="Date"
                value={signatory.date}
                onChange={(e) => updateSignatory("date", e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
                sx={{ minWidth: 180, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Stack>
            <Typography variant="caption" color="text.secondary" display="block">
              By submitting this form, you confirm that you are authorised to represent your organisation
              and that all information provided is accurate to the best of your knowledge.
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
