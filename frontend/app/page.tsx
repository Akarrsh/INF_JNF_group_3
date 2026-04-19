"use client";

import Link from "next/link";
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid2,
  Paper,
  Stack,
  Toolbar,
  Typography,
  alpha,
} from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import SchoolIcon from "@mui/icons-material/School";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import GroupsIcon from "@mui/icons-material/Groups";
import VerifiedIcon from "@mui/icons-material/Verified";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import EngineeringIcon from "@mui/icons-material/Engineering";
import WorkIcon from "@mui/icons-material/Work";

const stats = [
  { label: "Years of Excellence", value: "99+", icon: <SchoolIcon /> },
  { label: "Companies Recruited", value: "500+", icon: <BusinessIcon /> },
  { label: "Students Placed", value: "10,000+", icon: <GroupsIcon /> },
  { label: "Avg. Package (LPA)", value: "18+", icon: <TrendingUpIcon /> },
];

const recruiters = [
  "Google", "Microsoft", "Amazon", "Goldman Sachs", "McKinsey",
  "Tata Steel", "ONGC", "Reliance", "L&T", "Infosys",
  "Schlumberger", "Shell", "Vedanta", "Coal India", "NTPC",
];

const programmes = [
  "B.Tech (4 Year)",
  "Dual Degree (5 Year)",
  "Integrated M.Tech (5 Year)",
  "M.Tech (2 Year)",
  "MBA (2 Year)",
  "M.Sc / M.Sc.Tech",
  "Ph.D",
];

export default function Home() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Navigation */}
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
            <Stack direction="row" spacing={2} alignItems="center">
              <Button
                component={Link}
                href="/alumni-outreach"
                variant="text"
                color="primary"
                startIcon={<GroupsIcon />}
              >
                Alumni Outreach
              </Button>
              <Button component={Link} href="/auth/login" variant="outlined">
                Recruiter Login
              </Button>
              <Button component={Link} href="/company/register" variant="contained" color="secondary">
                Register Now
              </Button>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          pt: 16,
          pb: 10,
          background: (theme) =>
            `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%, ${alpha(theme.palette.secondary.main, 0.8)} 100%)`,
          color: "white",
        }}
      >
        <Container maxWidth="lg">
          <Grid2 container spacing={4} alignItems="center">
            <Grid2 size={{ xs: 12, md: 7 }}>
              <Typography variant="overline" sx={{ opacity: 0.9, letterSpacing: 2 }}>
                PLACEMENTS 2026-27
              </Typography>
              <Typography variant="h2" fontWeight={700} sx={{ mb: 2, lineHeight: 1.2 }}>
                Recruit India&apos;s Best
                <br />
                <Box component="span" sx={{ color: "secondary.light" }}>Engineering Talent</Box>
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, mb: 4, maxWidth: 500 }}>
                Join 500+ leading companies hiring from IIT (ISM) Dhanbad —
                India&apos;s premier institute for Mining, Energy, and Technology.
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button
                  component={Link}
                  href="/company/register"
                  variant="contained"
                  color="secondary"
                  size="large"
                  startIcon={<RocketLaunchIcon />}
                  sx={{ px: 4, py: 1.5 }}
                >
                  Start Recruiting
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    color: "white",
                    borderColor: "rgba(255,255,255,0.5)",
                    "&:hover": { borderColor: "white", bgcolor: "rgba(255,255,255,0.1)" }
                  }}
                >
                  Download Brochure
                </Button>
              </Stack>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 5 }}>
              <Paper
                sx={{
                  p: 3,
                  bgcolor: "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(10px)",
                  borderRadius: 3,
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  🗓️ Placement Calendar 2026-27
                </Typography>
                <Stack spacing={2} mt={2}>
                  {[
                    { date: "Aug 2026", event: "Pre-Placement Talks Begin" },
                    { date: "Sep 2026", event: "JNF/INF Submissions Open" },
                    { date: "Dec 2026", event: "Phase 1 Placements" },
                    { date: "Jan 2027", event: "Phase 2 Placements" },
                    { date: "May 2027", event: "Summer Internships" },
                  ].map((item) => (
                    <Stack key={item.event} direction="row" spacing={2} alignItems="center">
                      <Typography
                        variant="caption"
                        sx={{
                          bgcolor: "secondary.main",
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          fontWeight: 600,
                          minWidth: 80,
                          textAlign: "center",
                        }}
                      >
                        {item.date}
                      </Typography>
                      <Typography variant="body2">{item.event}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </Paper>
            </Grid2>
          </Grid2>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ mt: -5, position: "relative", zIndex: 10 }}>
        <Grid2 container spacing={2}>
          {stats.map((stat) => (
            <Grid2 key={stat.label} size={{ xs: 6, md: 3 }}>
              <Card sx={{ textAlign: "center", py: 3 }}>
                <CardContent>
                  <Box sx={{ color: "primary.main", mb: 1 }}>{stat.icon}</Box>
                  <Typography variant="h3" fontWeight={700} color="primary">
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid2>
          ))}
        </Grid2>
      </Container>

      {/* Why Recruit Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" fontWeight={700} textAlign="center" gutterBottom>
          Why Recruit at IIT (ISM) Dhanbad?
        </Typography>
        <Typography variant="body1" color="text.secondary" textAlign="center" mb={5} maxWidth={600} mx="auto">
          India&apos;s oldest and most prestigious technical institute with a unique focus on Mining, Energy, and Earth Sciences.
        </Typography>
        <Grid2 container spacing={3}>
          {[
            {
              icon: <VerifiedIcon sx={{ fontSize: 40 }} />,
              title: "99+ Years of Excellence",
              desc: "Established in 1926, we are among India's oldest and most respected engineering institutions.",
            },
            {
              icon: <EngineeringIcon sx={{ fontSize: 40 }} />,
              title: "Unique Talent Pool",
              desc: "Specialized programmes in Mining, Petroleum, Geology, and Geophysics — talent you won't find elsewhere.",
            },
            {
              icon: <WorkIcon sx={{ fontSize: 40 }} />,
              title: "Industry-Ready Graduates",
              desc: "Rigorous curriculum with industry internships, projects, and research exposure.",
            },
            {
              icon: <GroupsIcon sx={{ fontSize: 40 }} />,
              title: "Diverse Programmes",
              desc: "From B.Tech to Ph.D across 18 departments — find the right fit for every role.",
            },
          ].map((item) => (
            <Grid2 key={item.title} size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ height: "100%", textAlign: "center", p: 2 }}>
                <CardContent>
                  <Box sx={{ color: "secondary.main", mb: 2 }}>{item.icon}</Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid2>
          ))}
        </Grid2>
      </Container>

      {/* Programmes Section */}
      <Box sx={{ bgcolor: "grey.50", py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight={700} textAlign="center" gutterBottom>
            Programmes Available
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center" mb={4}>
            Recruit from our diverse range of academic programmes
          </Typography>
          <Stack direction="row" flexWrap="wrap" justifyContent="center" gap={2}>
            {programmes.map((prog) => (
              <Paper
                key={prog}
                sx={{
                  px: 3,
                  py: 1.5,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "primary.light",
                  bgcolor: "white",
                }}
              >
                <Typography variant="body1" fontWeight={500}>
                  {prog}
                </Typography>
              </Paper>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* Past Recruiters */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" fontWeight={700} textAlign="center" gutterBottom>
          Our Esteemed Recruiters
        </Typography>
        <Typography variant="body1" color="text.secondary" textAlign="center" mb={4}>
          Join the league of 500+ companies that trust IIT (ISM) for their talent needs
        </Typography>
        <Stack direction="row" flexWrap="wrap" justifyContent="center" gap={2}>
          {recruiters.map((company) => (
            <Paper
              key={company}
              sx={{
                px: 3,
                py: 2,
                minWidth: 120,
                textAlign: "center",
                bgcolor: "grey.100",
                borderRadius: 2,
              }}
            >
              <Typography variant="body2" fontWeight={500}>
                {company}
              </Typography>
            </Paper>
          ))}
        </Stack>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          py: 8,
          background: (theme) =>
            `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
          color: "white",
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Ready to Hire the Best?
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9, mb: 4 }}>
            Register now and start filling your Job/Internship Notification Forms
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              component={Link}
              href="/company/register"
              variant="contained"
              size="large"
              sx={{ bgcolor: "white", color: "secondary.main", "&:hover": { bgcolor: "grey.100" } }}
            >
              Register as Recruiter
            </Button>
            <Button
              component={Link}
              href="/auth/login"
              variant="outlined"
              size="large"
              sx={{ color: "white", borderColor: "white" }}
            >
              Already Registered? Login
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: "grey.900", color: "grey.400", py: 4 }}>
        <Container maxWidth="lg">
          <Grid2 container spacing={4}>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <Typography variant="h6" color="white" gutterBottom>
                Career Development Centre
              </Typography>
              <Typography variant="body2">
                IIT (Indian School of Mines) Dhanbad
                <br />
                Dhanbad - 826004, Jharkhand, India
              </Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <Typography variant="h6" color="white" gutterBottom>
                Contact
              </Typography>
              <Typography variant="body2">
                Email: cdc@iitism.ac.in
                <br />
                Phone: +91-326-223-5555
              </Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <Typography variant="h6" color="white" gutterBottom>
                Quick Links
              </Typography>
              <Stack spacing={0.5}>
                <Link href="/company/register" style={{ color: "inherit", textDecoration: "none" }}>
                  <Typography variant="body2">Register</Typography>
                </Link>
                <Link href="/auth/login" style={{ color: "inherit", textDecoration: "none" }}>
                  <Typography variant="body2">Login</Typography>
                </Link>
                <Link href="/alumni-outreach" style={{ color: "inherit", textDecoration: "none" }}>
                  <Typography variant="body2">Alumni Outreach</Typography>
                </Link>
              </Stack>
            </Grid2>
          </Grid2>
          <Typography variant="body2" textAlign="center" mt={4} pt={3} borderTop="1px solid" sx={{ borderColor: "grey.800" }}>
            © 2026 IIT (ISM) Dhanbad. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
