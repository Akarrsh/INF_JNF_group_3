"use client";

import Link from "next/link";
import {
  AppBar,
  Box,
  Button,
  Container,
  Grid2,
  Stack,
  Toolbar,
  Typography,
  alpha,
  Chip,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import GroupsIcon from "@mui/icons-material/Groups";
import BusinessIcon from "@mui/icons-material/Business";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import VerifiedIcon from "@mui/icons-material/Verified";
import EngineeringIcon from "@mui/icons-material/Engineering";
import WorkIcon from "@mui/icons-material/Work";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const NAV_LINKS = [
  { label: "Alumni Outreach", href: "/alumni-outreach" },
  { label: "Login", href: "/auth/login" },
];

const stats = [
  { value: "99+", label: "Years of Excellence", icon: <SchoolIcon sx={{ fontSize: 22 }} /> },
  { value: "500+", label: "Companies Recruited", icon: <BusinessIcon sx={{ fontSize: 22 }} /> },
  { value: "10,000+", label: "Students Placed", icon: <GroupsIcon sx={{ fontSize: 22 }} /> },
  { value: "₹18+ LPA", label: "Average Package", icon: <TrendingUpIcon sx={{ fontSize: 22 }} /> },
];

const whyRecruit = [
  {
    icon: <VerifiedIcon sx={{ fontSize: 36 }} />,
    title: "99+ Years of Excellence",
    desc: "Established in 1926, IIT (ISM) is among India's oldest and most respected technical institutions.",
  },
  {
    icon: <EngineeringIcon sx={{ fontSize: 36 }} />,
    title: "Unique Talent Pool",
    desc: "Specialised programmes in Mining, Petroleum, Geology & Geophysics — talent unavailable anywhere else.",
  },
  {
    icon: <WorkIcon sx={{ fontSize: 36 }} />,
    title: "Industry-Ready Graduates",
    desc: "Rigorous curriculum backed by internships, live projects and research exposure.",
  },
  {
    icon: <GroupsIcon sx={{ fontSize: 36 }} />,
    title: "18 Departments",
    desc: "From B.Tech to Ph.D across 18 disciplines — find the right fit for every role in your organisation.",
  },
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

const recruiters = [
  "Google", "Microsoft", "Amazon", "Goldman Sachs", "McKinsey",
  "Tata Steel", "ONGC", "Reliance", "L&T", "Infosys",
  "Schlumberger", "Shell", "Vedanta", "Coal India", "NTPC",
];

const placementCalendar = [
  { date: "Aug 2026", event: "Pre-Placement Talks Begin" },
  { date: "Sep 2026", event: "JNF / INF Submissions Open" },
  { date: "Dec 2026", event: "Phase 1 Placements" },
  { date: "Jan 2027", event: "Phase 2 Placements" },
  { date: "May 2027", event: "Summer Internships" },
];

export default function Home() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc" }}>

      {/* ── Navbar ─────────────────────────────────────────────── */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #e2e8f0",
          color: "text.primary",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ px: { xs: 0 }, minHeight: { xs: 56, sm: 64 } }}>
            {/* Brand */}
            <Stack
              component={Link}
              href="/"
              direction="row"
              alignItems="center"
              spacing={1.5}
              sx={{ flexGrow: 1, textDecoration: "none" }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "9px",
                  bgcolor: "primary.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <SchoolIcon sx={{ fontSize: 20, color: "white" }} />
              </Box>
              <Box>
                <Typography
                  variant="subtitle2"
                  fontWeight={700}
                  color="primary.main"
                  lineHeight={1.1}
                  fontSize={{ xs: "0.8rem", sm: "0.9rem" }}
                >
                  IIT (ISM) Dhanbad
                </Typography>
                <Typography
                  sx={{ fontSize: "0.6rem", color: "text.secondary", letterSpacing: "0.05em", textTransform: "uppercase" }}
                >
                  Career Development Centre
                </Typography>
              </Box>
            </Stack>

            {/* Desktop Nav */}
            <Stack direction="row" spacing={1} alignItems="center" sx={{ display: { xs: "none", sm: "flex" } }}>
              <Button
                component={Link}
                href="/alumni-outreach"
                variant="text"
                size="small"
                sx={{ color: "text.secondary", fontSize: "0.85rem" }}
              >
                Alumni Outreach
              </Button>
              <Button
                component={Link}
                href="/auth/login"
                variant="outlined"
                size="small"
                sx={{ borderColor: "#cbd5e1", color: "text.primary", fontSize: "0.85rem" }}
              >
                Recruiter Login
              </Button>
              <Button
                component={Link}
                href="/company/register"
                variant="contained"
                size="small"
                sx={{ fontSize: "0.85rem" }}
              >
                Register Now
              </Button>
            </Stack>

            {/* Mobile Menu */}
            <IconButton
              onClick={() => setDrawerOpen(true)}
              sx={{ display: { sm: "none" } }}
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)} PaperProps={{ sx: { width: 260, p: 3 } }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography fontWeight={700} color="primary.main">Menu</Typography>
          <IconButton size="small" onClick={() => setDrawerOpen(false)}><CloseIcon /></IconButton>
        </Box>
        <Stack spacing={1.5}>
          <Button fullWidth variant="text" component={Link} href="/alumni-outreach" onClick={() => setDrawerOpen(false)} sx={{ justifyContent: "flex-start" }}>Alumni Outreach</Button>
          <Button fullWidth variant="outlined" component={Link} href="/auth/login" onClick={() => setDrawerOpen(false)}>Recruiter Login</Button>
          <Button fullWidth variant="contained" component={Link} href="/company/register" onClick={() => setDrawerOpen(false)}>Register Now</Button>
        </Stack>
      </Drawer>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <Box
        sx={{
          pt: { xs: 12, md: 16 },
          pb: { xs: 8, md: 12 },
          background: "linear-gradient(135deg, #0f2340 0%, #1a3a5c 55%, #1e4976 100%)",
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle texture */}
        <Box
          sx={{
            position: "absolute", inset: 0, opacity: 0.04,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Grid2 container spacing={{ xs: 4, md: 8 }} alignItems="center">
            {/* Left: Copy */}
            <Grid2 size={{ xs: 12, md: 7 }}>
              <Chip
                label="PLACEMENTS 2026–27 · OPEN FOR REGISTRATION"
                size="small"
                sx={{
                  mb: 3,
                  bgcolor: alpha("#c47c2a", 0.2),
                  color: "#f0c070",
                  fontWeight: 600,
                  fontSize: "0.7rem",
                  letterSpacing: "0.06em",
                  border: "1px solid",
                  borderColor: alpha("#c47c2a", 0.4),
                }}
              />
              <Typography
                variant="h1"
                fontWeight={700}
                sx={{
                  mb: 2.5,
                  fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                  lineHeight: 1.15,
                  letterSpacing: "-0.02em",
                }}
              >
                Recruit India&apos;s Best{" "}
                <Box component="span" sx={{ color: "#f0c070" }}>
                  Engineering Talent
                </Box>
              </Typography>
              <Typography
                variant="body1"
                color="inherit"
                sx={{ opacity: 0.85, mb: 4, maxWidth: 520, fontSize: { xs: "1rem", md: "1.1rem" }, lineHeight: 1.75 }}
              >
                Join 500+ leading companies hiring from IIT (ISM) Dhanbad —
                India&apos;s premier institute for Mining, Energy, and Technology.
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button
                  component={Link}
                  href="/company/register"
                  variant="contained"
                  size="large"
                  startIcon={<RocketLaunchIcon />}
                  sx={{
                    bgcolor: "#c47c2a",
                    "&:hover": { bgcolor: "#d4952f" },
                    px: 3.5,
                    py: 1.4,
                    fontSize: "0.95rem",
                  }}
                >
                  Start Recruiting
                </Button>
                <Button
                  component={Link}
                  href="/auth/login"
                  variant="outlined"
                  size="large"
                  sx={{
                    color: "white",
                    borderColor: "rgba(255,255,255,0.4)",
                    px: 3.5,
                    py: 1.4,
                    fontSize: "0.95rem",
                    "&:hover": { borderColor: "white", bgcolor: "rgba(255,255,255,0.08)" },
                  }}
                >
                  Already Registered?
                </Button>
              </Stack>
            </Grid2>

            {/* Right: Placement Calendar */}
            <Grid2 size={{ xs: 12, md: 5 }}>
              <Box
                sx={{
                  bgcolor: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "16px",
                  p: 3,
                  backdropFilter: "blur(10px)",
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center" mb={2.5}>
                  <CalendarMonthIcon sx={{ fontSize: 20, color: "#f0c070" }} />
                  <Typography variant="subtitle1" fontWeight={700}>
                    Placement Calendar 2026–27
                  </Typography>
                </Stack>
                <Stack spacing={1.5}>
                  {placementCalendar.map((item) => (
                    <Stack key={item.event} direction="row" spacing={2} alignItems="center">
                      <Box
                        sx={{
                          bgcolor: alpha("#c47c2a", 0.25),
                          border: "1px solid",
                          borderColor: alpha("#c47c2a", 0.4),
                          borderRadius: "6px",
                          px: 1.5,
                          py: 0.5,
                          minWidth: 88,
                          textAlign: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Typography sx={{ fontSize: "0.72rem", fontWeight: 700, color: "#f0c070" }}>
                          {item.date}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="inherit" sx={{ opacity: 0.85 }}>
                        {item.event}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Box>
            </Grid2>
          </Grid2>
        </Container>
      </Box>

      {/* ── Stats ──────────────────────────────────────────────── */}
      <Box sx={{ bgcolor: "white", borderBottom: "1px solid #e2e8f0" }}>
        <Container maxWidth="lg">
          <Grid2 container>
            {stats.map((stat, i) => (
              <Grid2
                key={stat.label}
                size={{ xs: 6, md: 3 }}
                sx={{
                  py: { xs: 3, md: 4 },
                  px: 3,
                  textAlign: "center",
                  borderRight: i < 3 ? "1px solid #e2e8f0" : "none",
                  borderBottom: { xs: i < 2 ? "1px solid #e2e8f0" : "none", md: "none" },
                }}
              >
                <Box sx={{ color: "primary.main", mb: 1 }}>{stat.icon}</Box>
                <Typography
                  variant="h4"
                  fontWeight={700}
                  color="primary.main"
                  sx={{ fontSize: { xs: "1.4rem", md: "1.75rem" } }}
                >
                  {stat.value}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {stat.label}
                </Typography>
              </Grid2>
            ))}
          </Grid2>
        </Container>
      </Box>

      {/* ── Why Recruit ────────────────────────────────────────── */}
      <Container maxWidth="lg" sx={{ py: { xs: 7, md: 10 } }}>
        <Box sx={{ textAlign: "center", mb: { xs: 5, md: 7 } }}>
          <Typography
            variant="overline"
            sx={{ color: "primary.main", fontWeight: 700, letterSpacing: "0.1em", fontSize: "0.72rem" }}
          >
            WHY RECRUIT HERE
          </Typography>
          <Typography variant="h2" fontWeight={700} mt={1} mb={2} sx={{ fontSize: { xs: "1.6rem", md: "2rem" } }}>
            Why Recruit at IIT (ISM) Dhanbad?
          </Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 580, mx: "auto", lineHeight: 1.8 }}>
            India&apos;s oldest and most prestigious technical institute with a unique focus on
            Mining, Energy, and Earth Sciences.
          </Typography>
        </Box>

        <Grid2 container spacing={3}>
          {whyRecruit.map((item) => (
            <Grid2 key={item.title} size={{ xs: 12, sm: 6, md: 3 }}>
              <Box
                sx={{
                  p: 3,
                  height: "100%",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  bgcolor: "white",
                  transition: "box-shadow 0.2s, border-color 0.2s",
                  "&:hover": {
                    boxShadow: "0 8px 24px -4px rgba(26,58,92,0.1)",
                    borderColor: "#94a3b8",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: "12px",
                    bgcolor: alpha("#1a3a5c", 0.07),
                    color: "primary.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2.5,
                  }}
                >
                  {item.icon}
                </Box>
                <Typography variant="subtitle1" fontWeight={700} mb={1}>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" lineHeight={1.75}>
                  {item.desc}
                </Typography>
              </Box>
            </Grid2>
          ))}
        </Grid2>
      </Container>

      {/* ── Programmes ─────────────────────────────────────────── */}
      <Box sx={{ bgcolor: "white", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0", py: { xs: 7, md: 9 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 5 }}>
            <Typography
              variant="overline"
              sx={{ color: "primary.main", fontWeight: 700, letterSpacing: "0.1em", fontSize: "0.72rem" }}
            >
              ACADEMIC PROGRAMMES
            </Typography>
            <Typography variant="h2" fontWeight={700} mt={1} mb={1} sx={{ fontSize: { xs: "1.6rem", md: "2rem" } }}>
              Recruit Across All Programmes
            </Typography>
            <Typography color="text.secondary">
              From undergraduate to doctoral — find the right level of expertise.
            </Typography>
          </Box>
          <Stack direction="row" flexWrap="wrap" justifyContent="center" gap={1.5}>
            {programmes.map((prog) => (
              <Box
                key={prog}
                sx={{
                  px: 2.5,
                  py: 1.2,
                  border: "1.5px solid",
                  borderColor: alpha("#1a3a5c", 0.2),
                  borderRadius: "8px",
                  bgcolor: alpha("#1a3a5c", 0.04),
                  color: "primary.main",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  transition: "all 0.15s",
                  "&:hover": {
                    bgcolor: alpha("#1a3a5c", 0.1),
                    borderColor: "primary.main",
                  },
                }}
              >
                {prog}
              </Box>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* ── Past Recruiters ────────────────────────────────────── */}
      <Container maxWidth="lg" sx={{ py: { xs: 7, md: 9 } }}>
        <Box sx={{ textAlign: "center", mb: 5 }}>
          <Typography
            variant="overline"
            sx={{ color: "primary.main", fontWeight: 700, letterSpacing: "0.1em", fontSize: "0.72rem" }}
          >
            TRUSTED BY INDUSTRY LEADERS
          </Typography>
          <Typography variant="h2" fontWeight={700} mt={1} mb={1} sx={{ fontSize: { xs: "1.6rem", md: "2rem" } }}>
            Our Esteemed Recruiters
          </Typography>
          <Typography color="text.secondary">
            Join 500+ companies that trust IIT (ISM) for their campus hiring needs.
          </Typography>
        </Box>
        <Stack direction="row" flexWrap="wrap" justifyContent="center" gap={1.5}>
          {recruiters.map((company) => (
            <Box
              key={company}
              sx={{
                px: 2.5,
                py: 1.2,
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                bgcolor: "white",
                color: "text.secondary",
                fontWeight: 600,
                fontSize: "0.875rem",
                transition: "all 0.15s",
                "&:hover": { borderColor: "#94a3b8", color: "text.primary", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" },
              }}
            >
              {company}
            </Box>
          ))}
        </Stack>
      </Container>

      {/* ── CTA Banner ─────────────────────────────────────────── */}
      <Box
        sx={{
          bgcolor: "#0f2340",
          color: "white",
          py: { xs: 7, md: 9 },
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: "center" }}>
          <Typography variant="h2" fontWeight={700} mb={2} sx={{ fontSize: { xs: "1.6rem", md: "2.1rem" } }}>
            Ready to Hire the Best Engineers?
          </Typography>
          <Typography sx={{ opacity: 0.8, mb: 4, fontSize: "1.05rem", lineHeight: 1.8 }}>
            Register now to submit Job and Internship Notification Forms for IIT (ISM) Dhanbad.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
            <Button
              component={Link}
              href="/company/register"
              variant="contained"
              size="large"
              startIcon={<RocketLaunchIcon />}
              sx={{ bgcolor: "#c47c2a", "&:hover": { bgcolor: "#d4952f" }, px: 3.5, py: 1.4 }}
            >
              Register as Recruiter
            </Button>
            <Button
              component={Link}
              href="/auth/login"
              variant="outlined"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{ color: "white", borderColor: "rgba(255,255,255,0.4)", px: 3.5, py: 1.4, "&:hover": { borderColor: "white", bgcolor: "rgba(255,255,255,0.08)" } }}
            >
              Already Registered?
            </Button>
          </Stack>
          <Stack direction="row" flexWrap="wrap" justifyContent="center" gap={3} mt={5} sx={{ opacity: 0.65 }}>
            {["No setup fee", "Fast approval", "Dedicated CDC support", "Real-time status updates"].map((item) => (
              <Stack key={item} direction="row" spacing={0.75} alignItems="center">
                <CheckCircleOutlineIcon sx={{ fontSize: 16, color: "#f0c070" }} />
                <Typography variant="body2" color="inherit">{item}</Typography>
              </Stack>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <Box sx={{ bgcolor: "#070f1a", color: "#94a3b8", py: { xs: 5, md: 6 } }}>
        <Container maxWidth="lg">
          <Grid2 container spacing={4} mb={4}>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
                <Box
                  sx={{
                    width: 32, height: 32, borderRadius: "8px", bgcolor: "primary.main",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <SchoolIcon sx={{ fontSize: 18, color: "white" }} />
                </Box>
                <Typography variant="subtitle2" fontWeight={700} color="white">IIT (ISM) Dhanbad</Typography>
              </Stack>
              <Typography variant="body2" color="inherit" lineHeight={1.8}>
                Career Development Centre<br />
                Dhanbad – 826004, Jharkhand, India
              </Typography>
            </Grid2>
            <Grid2 size={{ xs: 6, md: 4 }}>
              <Typography variant="subtitle2" color="white" fontWeight={700} mb={2}>Contact</Typography>
              <Stack spacing={0.5}>
                <Typography variant="body2" color="inherit">cdc@iitism.ac.in</Typography>
                <Typography variant="body2" color="inherit">+91-326-223-5555</Typography>
              </Stack>
            </Grid2>
            <Grid2 size={{ xs: 6, md: 4 }}>
              <Typography variant="subtitle2" color="white" fontWeight={700} mb={2}>Quick Links</Typography>
              <Stack spacing={0.75}>
                {[
                  { label: "Register Company", href: "/company/register" },
                  { label: "Recruiter Login", href: "/auth/login" },
                  { label: "Alumni Outreach", href: "/alumni-outreach" },
                ].map((link) => (
                  <Link key={link.href} href={link.href} style={{ color: "inherit", textDecoration: "none" }}>
                    <Typography variant="body2" color="inherit" sx={{ "&:hover": { color: "white" }, transition: "color 0.15s" }}>
                      {link.label}
                    </Typography>
                  </Link>
                ))}
              </Stack>
            </Grid2>
          </Grid2>
          <Box sx={{ borderTop: "1px solid rgba(255,255,255,0.07)", pt: 3, textAlign: "center" }}>
            <Typography variant="caption" color="inherit" sx={{ opacity: 0.5 }}>
              © 2026 IIT (ISM) Dhanbad — Career Development Centre. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
