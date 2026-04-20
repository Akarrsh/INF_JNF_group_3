"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid2,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { companyApi } from "@/lib/companyApi";

type ContactBlock = {
  name?: string | null;
  designation?: string | null;
  email?: string | null;
  mobile?: string | null;
  landline?: string | null;
};

type CompanyProfileResponse = {
  name: string;
  industry: string | null;
  sector: string | null;
  website: string | null;
  postal_address: string | null;
  employee_count: number | null;
  hr_name: string;
  hr_designation: string | null;
  hr_email: string;
  hr_phone: string | null;
  hr_alt_phone: string | null;
  head_talent_contact: ContactBlock | null;
  primary_contact: ContactBlock | null;
  secondary_contact: ContactBlock | null;
  category_org_type: string | null;
  date_of_establishment: string | null;
  annual_turnover: string | null;
  linkedin_url: string | null;
  industry_sector_tags: string[] | null;
  mnc_hq_country_city: string | null;
  nature_of_business: string | null;
  company_description: string | null;
};

type CompanyProfileForm = {
  name: string;
  sector: string;
  industry: string;
  website: string;
  postal_address: string;
  employee_count: string;
  hr_name: string;
  hr_designation: string;
  hr_email: string;
  hr_phone: string;
  hr_alt_phone: string;
  head_name: string;
  head_designation: string;
  head_email: string;
  head_mobile: string;
  head_landline: string;
  poc1_name: string;
  poc1_designation: string;
  poc1_email: string;
  poc1_mobile: string;
  poc1_landline: string;
  poc2_name: string;
  poc2_designation: string;
  poc2_email: string;
  poc2_mobile: string;
  poc2_landline: string;
  category_org_type: string;
  date_of_establishment: string;
  annual_turnover: string;
  linkedin_url: string;
  industry_sector_tags: string;
  mnc_hq_country_city: string;
  nature_of_business: string;
  company_description: string;
};

function contactValue(value?: string | null): string {
  return value ?? "";
}

export default function CompanyProfilePage() {
  const [form, setForm] = useState<CompanyProfileForm>({
    name: "",
    sector: "",
    industry: "",
    website: "",
    postal_address: "",
    employee_count: "",
    hr_name: "",
    hr_designation: "",
    hr_email: "",
    hr_phone: "",
    hr_alt_phone: "",
    head_name: "",
    head_designation: "",
    head_email: "",
    head_mobile: "",
    head_landline: "",
    poc1_name: "",
    poc1_designation: "",
    poc1_email: "",
    poc1_mobile: "",
    poc1_landline: "",
    poc2_name: "",
    poc2_designation: "",
    poc2_email: "",
    poc2_mobile: "",
    poc2_landline: "",
    category_org_type: "",
    date_of_establishment: "",
    annual_turnover: "",
    linkedin_url: "",
    industry_sector_tags: "",
    mnc_hq_country_city: "",
    nature_of_business: "",
    company_description: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const response = await companyApi<{ company: CompanyProfileResponse }>(
          "/company/profile",
        );

        const head = response.company.head_talent_contact ?? {};
        const poc1 = response.company.primary_contact ?? {};
        const poc2 = response.company.secondary_contact ?? {};

        setForm({
          name: response.company.name,
          sector: response.company.sector ?? "",
          industry: response.company.industry ?? response.company.sector ?? "",
          website: response.company.website ?? "",
          postal_address: response.company.postal_address ?? "",
          employee_count:
            response.company.employee_count !== null
              ? String(response.company.employee_count)
              : "",
          hr_name: response.company.hr_name,
          hr_designation: response.company.hr_designation ?? "",
          hr_email: response.company.hr_email,
          hr_phone: response.company.hr_phone ?? "",
          hr_alt_phone: response.company.hr_alt_phone ?? "",
          head_name: contactValue(head.name),
          head_designation: contactValue(head.designation),
          head_email: contactValue(head.email),
          head_mobile: contactValue(head.mobile),
          head_landline: contactValue(head.landline),
          poc1_name: contactValue(poc1.name),
          poc1_designation: contactValue(poc1.designation),
          poc1_email: contactValue(poc1.email),
          poc1_mobile: contactValue(poc1.mobile),
          poc1_landline: contactValue(poc1.landline),
          poc2_name: contactValue(poc2.name),
          poc2_designation: contactValue(poc2.designation),
          poc2_email: contactValue(poc2.email),
          poc2_mobile: contactValue(poc2.mobile),
          poc2_landline: contactValue(poc2.landline),
          category_org_type: response.company.category_org_type ?? "",
          date_of_establishment: response.company.date_of_establishment ?? "",
          annual_turnover: response.company.annual_turnover ?? "",
          linkedin_url: response.company.linkedin_url ?? "",
          industry_sector_tags: response.company.industry_sector_tags?.join(", ") ?? "",
          mnc_hq_country_city: response.company.mnc_hq_country_city ?? "",
          nature_of_business: response.company.nature_of_business ?? "",
          company_description: response.company.company_description ?? "",
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, []);

  const onSubmit = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await companyApi<{ message: string }>("/company/profile", {
        method: "PUT",
        body: JSON.stringify({
          name: form.name,
          sector: form.sector,
          industry: form.industry,
          website: form.website,
          postal_address: form.postal_address,
          employee_count: form.employee_count ? Number(form.employee_count) : null,
          hr_name: form.hr_name,
          hr_designation: form.hr_designation,
          hr_email: form.hr_email,
          hr_phone: form.hr_phone,
          hr_alt_phone: form.hr_alt_phone,
          head_name: form.head_name,
          head_designation: form.head_designation,
          head_email: form.head_email,
          head_mobile: form.head_mobile,
          head_landline: form.head_landline,
          poc1_name: form.poc1_name,
          poc1_designation: form.poc1_designation,
          poc1_email: form.poc1_email,
          poc1_mobile: form.poc1_mobile,
          poc1_landline: form.poc1_landline,
          poc2_name: form.poc2_name,
          poc2_designation: form.poc2_designation,
          poc2_email: form.poc2_email,
          poc2_mobile: form.poc2_mobile,
          poc2_landline: form.poc2_landline,
          category_org_type: form.category_org_type || null,
          date_of_establishment: form.date_of_establishment || null,
          annual_turnover: form.annual_turnover || null,
          linkedin_url: form.linkedin_url || null,
          industry_sector_tags: form.industry_sector_tags ? form.industry_sector_tags.split(",").map(tag => tag.trim()) : null,
          mnc_hq_country_city: form.mnc_hq_country_city || null,
          nature_of_business: form.nature_of_business || null,
          company_description: form.company_description || null,
        }),
      });
      setSuccess("Profile updated successfully.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ pb: 6, maxWidth: 1000, mx: "auto" }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: "text.primary", mb: 1, letterSpacing: "-0.02em" }}>
          Company Profile
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          Manage your organizational details and contact information.
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>{success}</Alert>}

      <Stack spacing={4}>
        {/* Core Company Details */}
        <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 3, overflow: "visible" }}>
          <Box sx={{ borderBottom: "1px solid #e2e8f0", px: 4, py: 2.5, bgcolor: "#f8fafc", borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
            <Typography variant="h6" fontWeight={700} color="primary.main">Core Details</Typography>
          </Box>
          <CardContent sx={{ p: 4 }}>
            <Grid2 container spacing={3}>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField fullWidth label="Company Name *" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} disabled={loading} variant="outlined" sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField fullWidth label="Sector / Industry *" value={form.sector} onChange={(e) => setForm((p) => ({ ...p, sector: e.target.value, industry: e.target.value }))} disabled={loading} variant="outlined" sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField fullWidth label="Website URL" placeholder="https://example.com" value={form.website} onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))} disabled={loading} variant="outlined" sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField fullWidth label="Number of Employees" placeholder="e.g., 500+" value={form.employee_count} onChange={(e) => setForm((p) => ({ ...p, employee_count: e.target.value }))} disabled={loading} variant="outlined" sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
              </Grid2>
              <Grid2 size={{ xs: 12 }}>
                <TextField fullWidth label="Registered Postal Address" multiline minRows={3} value={form.postal_address} onChange={(e) => setForm((p) => ({ ...p, postal_address: e.target.value }))} disabled={loading} variant="outlined" sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
              </Grid2>
            </Grid2>
          </CardContent>
        </Card>

        {/* Extended Profile */}
        <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 3, overflow: "visible" }}>
          <Box sx={{ borderBottom: "1px solid #e2e8f0", px: 4, py: 2.5, bgcolor: "#f8fafc", borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
            <Typography variant="h6" fontWeight={700} color="secondary.main">Extended Profile Info</Typography>
          </Box>
          <CardContent sx={{ p: 4 }}>
            <Grid2 container spacing={3}>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField fullWidth label="Organization Type" placeholder="e.g. Private, Public, Govt, NGO" value={form.category_org_type} onChange={(e) => setForm((p) => ({ ...p, category_org_type: e.target.value }))} disabled={loading} variant="outlined" sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField fullWidth label="Date of Establishment" type="date" value={form.date_of_establishment} onChange={(e) => setForm((p) => ({ ...p, date_of_establishment: e.target.value }))} disabled={loading} InputLabelProps={{ shrink: true }} variant="outlined" sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField fullWidth label="Annual Turnover (NIRF)" placeholder="e.g., $5M - $10M" value={form.annual_turnover} onChange={(e) => setForm((p) => ({ ...p, annual_turnover: e.target.value }))} disabled={loading} variant="outlined" sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField fullWidth label="LinkedIn URL" placeholder="https://linkedin.com/company/..." value={form.linkedin_url} onChange={(e) => setForm((p) => ({ ...p, linkedin_url: e.target.value }))} disabled={loading} variant="outlined" sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField fullWidth label="Industry Tags" value={form.industry_sector_tags} onChange={(e) => setForm((p) => ({ ...p, industry_sector_tags: e.target.value }))} disabled={loading} placeholder="Technology, Finance, Healthcare" helperText="Separate with commas" variant="outlined" sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField fullWidth label="If MNC — HQ Country/City" value={form.mnc_hq_country_city} onChange={(e) => setForm((p) => ({ ...p, mnc_hq_country_city: e.target.value }))} disabled={loading} variant="outlined" sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField fullWidth label="Nature of Business" value={form.nature_of_business} onChange={(e) => setForm((p) => ({ ...p, nature_of_business: e.target.value }))} disabled={loading} variant="outlined" sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
              </Grid2>
              <Grid2 size={{ xs: 12 }}>
                <TextField fullWidth label="Company Description" multiline minRows={4} value={form.company_description} onChange={(e) => setForm((p) => ({ ...p, company_description: e.target.value }))} disabled={loading} placeholder="Tell us about your company culture, mission, and achievements..." variant="outlined" sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
              </Grid2>
            </Grid2>
          </CardContent>
        </Card>

        {/* Head Talent Acquisition */}
        <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 3, overflow: "visible" }}>
          <Box sx={{ borderBottom: "1px solid #e2e8f0", px: 4, py: 2.5, bgcolor: "#f8fafc", borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
            <Typography variant="h6" fontWeight={700} color="primary.main">Head Talent Acquisition</Typography>
          </Box>
          <CardContent sx={{ p: 4 }}>
            <Grid2 container spacing={3}>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField fullWidth label="Full Name" value={form.head_name} onChange={(e) => setForm((p) => ({ ...p, head_name: e.target.value }))} disabled={loading} variant="outlined" sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField fullWidth label="Designation" value={form.head_designation} onChange={(e) => setForm((p) => ({ ...p, head_designation: e.target.value }))} disabled={loading} variant="outlined" sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField fullWidth label="Email Address" value={form.head_email} onChange={(e) => setForm((p) => ({ ...p, head_email: e.target.value }))} disabled={loading} variant="outlined" sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField fullWidth label="Mobile Number" placeholder="+91 98765 43210" value={form.head_mobile} onChange={(e) => setForm((p) => ({ ...p, head_mobile: e.target.value }))} disabled={loading} variant="outlined" sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField fullWidth label="Landline (Optional)" value={form.head_landline} onChange={(e) => setForm((p) => ({ ...p, head_landline: e.target.value }))} disabled={loading} variant="outlined" sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
              </Grid2>
            </Grid2>
          </CardContent>
        </Card>

        {/* Primary Contact (PoC 1) */}
        <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 3, overflow: "visible" }}>
          <Box sx={{ borderBottom: "1px solid #e2e8f0", px: 4, py: 2.5, bgcolor: "#f8fafc", borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
            <Typography variant="h6" fontWeight={700} color="secondary.main">Primary Contact (PoC 1)</Typography>
          </Box>
          <CardContent sx={{ p: 4 }}>
            <Grid2 container spacing={3}>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField fullWidth label="Full Name" value={form.poc1_name} onChange={(e) => setForm((p) => ({ ...p, poc1_name: e.target.value, hr_name: e.target.value }))} disabled={loading} variant="outlined" sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField fullWidth label="Designation" value={form.poc1_designation} onChange={(e) => setForm((p) => ({ ...p, poc1_designation: e.target.value, hr_designation: e.target.value }))} disabled={loading} variant="outlined" sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField fullWidth label="Email Address" value={form.poc1_email} onChange={(e) => setForm((p) => ({ ...p, poc1_email: e.target.value, hr_email: e.target.value }))} disabled={loading} variant="outlined" sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField fullWidth label="Mobile Number" placeholder="+91 98765 43210" value={form.poc1_mobile} onChange={(e) => setForm((p) => ({ ...p, poc1_mobile: e.target.value, hr_phone: e.target.value }))} disabled={loading} variant="outlined" sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField fullWidth label="Landline (Optional)" value={form.poc1_landline} onChange={(e) => setForm((p) => ({ ...p, poc1_landline: e.target.value, hr_alt_phone: e.target.value }))} disabled={loading} variant="outlined" sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
              </Grid2>
            </Grid2>
          </CardContent>
        </Card>

        {/* Secondary Contact (PoC 2) */}
        <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 3, overflow: "visible" }}>
          <Box sx={{ borderBottom: "1px solid #e2e8f0", px: 4, py: 2.5, bgcolor: "#f8fafc", borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
            <Typography variant="h6" fontWeight={700} color="text.secondary">Secondary Contact (PoC 2) — Optional</Typography>
          </Box>
          <CardContent sx={{ p: 4 }}>
            <Grid2 container spacing={3}>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField fullWidth label="Full Name" value={form.poc2_name} onChange={(e) => setForm((p) => ({ ...p, poc2_name: e.target.value }))} disabled={loading} variant="outlined" sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField fullWidth label="Designation" value={form.poc2_designation} onChange={(e) => setForm((p) => ({ ...p, poc2_designation: e.target.value }))} disabled={loading} variant="outlined" sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField fullWidth label="Email Address" value={form.poc2_email} onChange={(e) => setForm((p) => ({ ...p, poc2_email: e.target.value }))} disabled={loading} variant="outlined" sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField fullWidth label="Mobile Number" placeholder="+91 98765 43210" value={form.poc2_mobile} onChange={(e) => setForm((p) => ({ ...p, poc2_mobile: e.target.value }))} disabled={loading} variant="outlined" sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField fullWidth label="Landline (Optional)" value={form.poc2_landline} onChange={(e) => setForm((p) => ({ ...p, poc2_landline: e.target.value }))} disabled={loading} variant="outlined" sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
              </Grid2>
            </Grid2>
          </CardContent>
        </Card>
      </Stack>

      <Box sx={{ mt: 5, display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          size="large"
          onClick={onSubmit}
          disabled={saving || loading}
          sx={{
            py: 1.5,
            px: 6,
            fontWeight: 700,
            fontSize: "1rem",
            borderRadius: 2,
            boxShadow: "0 8px 16px rgba(26,58,92,0.15)",
            "&:hover": { boxShadow: "0 12px 24px rgba(26,58,92,0.2)" },
          }}
        >
          {saving ? "Saving Changes..." : "Save Profile"}
        </Button>
      </Box>
    </Box>
  );
}