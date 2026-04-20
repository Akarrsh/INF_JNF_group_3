"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
  Divider,
  alpha,
  Avatar,
} from "@mui/material";

// Icons
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import BusinessIcon from "@mui/icons-material/Business";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import ConnectWithoutContactIcon from "@mui/icons-material/ConnectWithoutContact";
import NotificationsIcon from "@mui/icons-material/Notifications";

const DRAWER_WIDTH = 280;

const navItems = [
  { label: "Dashboard",       href: "/admin",                   icon: <DashboardIcon /> },
  { label: "JNF Reviews",     href: "/admin/jnfs",              icon: <FactCheckIcon /> },
  { label: "INF Reviews",     href: "/admin/infs",              icon: <AssignmentTurnedInIcon /> },
  { label: "Companies",       href: "/admin/companies",         icon: <BusinessIcon /> },
  { label: "Branch Manager",  href: "/admin/programme-branches",icon: <AccountTreeIcon /> },
  { label: "Alumni Outreach", href: "/admin/alumni-outreach",   icon: <ConnectWithoutContactIcon /> },
  { label: "Notifications",   href: "/admin/notifications",     icon: <NotificationsIcon /> },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = () => signOut({ callbackUrl: "/auth/login" });

  const currentNav = navItems.find((item) =>
    item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href)
  );
  const pageTitle = currentNav ? currentNav.label : "Admin Operations";

  // Sidebar content
  const drawerContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Brand Header */}
      <Toolbar sx={{ px: 3, py: 2, minHeight: { xs: 70, md: 80 } }}>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ textDecoration: "none", color: "inherit" }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "10px",
              bgcolor: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 2px 8px rgba(26, 58, 92, 0.2)",
            }}
          >
            <AdminPanelSettingsIcon sx={{ fontSize: 20, color: "white" }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight={800} color="primary.main" lineHeight={1.1}>
              IIT ISM CDC
            </Typography>
            <Typography sx={{ fontSize: "0.65rem", color: "text.secondary", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>
              Admin Operations
            </Typography>
          </Box>
        </Stack>
      </Toolbar>

      <Divider sx={{ mx: 2, mb: 2, borderColor: alpha("#1a3a5c", 0.08) }} />

      {/* Navigation List */}
      <List sx={{ px: 2, flex: 1, overflowY: "auto" }}>
        {navItems.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <ListItem key={item.href} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                sx={{
                  borderRadius: "10px",
                  py: 1.2,
                  px: 2,
                  bgcolor: active ? alpha("#1a3a5c", 0.08) : "transparent",
                  color: active ? "primary.main" : "text.secondary",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: active ? alpha("#1a3a5c", 0.12) : alpha("#1a3a5c", 0.04),
                    color: "primary.main",
                  },
                  position: "relative",
                  ...(active && {
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      left: -16,
                      top: "15%",
                      height: "70%",
                      width: 4,
                      borderRadius: "0 4px 4px 0",
                      bgcolor: "primary.main",
                    },
                  }),
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 36,
                    color: active ? "primary.main" : "inherit",
                    "& svg": { fontSize: 20 },
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: "0.9rem",
                    fontWeight: active ? 700 : 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Bottom Profile / Logout Action */}
      <Box sx={{ p: 2 }}>
        <Divider sx={{ mb: 2, borderColor: alpha("#1a3a5c", 0.08) }} />
        <Button
          fullWidth
          variant="text"
          color="inherit"
          onClick={handleSignOut}
          startIcon={<LogoutIcon sx={{ fontSize: 18 }} />}
          sx={{
            justifyContent: "flex-start",
            color: "text.secondary",
            px: 2,
            py: 1.2,
            borderRadius: "10px",
            fontWeight: 600,
            fontSize: "0.85rem",
            "&:hover": {
              bgcolor: alpha("#c0392b", 0.06),
              color: "error.main",
            },
          }}
        >
          Sign Out
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8fafc" }}>
      {/* ── Header (App Bar) ─────────────────────────── */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          bgcolor: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid",
          borderColor: "divider",
          color: "text.primary",
        }}
      >
        <Toolbar sx={{ px: { xs: 2, sm: 3, md: 4 }, minHeight: { xs: 60, md: 70 } }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={() => setMobileOpen(true)}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" fontWeight={700} sx={{ flexGrow: 1, fontSize: { xs: "1.1rem", md: "1.25rem" } }}>
            {pageTitle}
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", gap: 1.5, pl: 2, borderLeft: "1px solid", borderColor: "divider" }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.dark", fontSize: "0.85rem", fontWeight: 700 }}>
                A
              </Avatar>
              <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                Administrator
              </Typography>
            </Box>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* ── Sidebar (Drawer) ─────────────────────────── */}
      <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
        {/* Mobile Temporary Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }} // Better open performance on mobile
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: DRAWER_WIDTH,
              borderRight: "none",
              boxShadow: "4px 0 24px rgba(0,0,0,0.05)",
            },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Desktop Permanent Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: DRAWER_WIDTH,
              bgcolor: "white",
              borderRight: "1px solid",
              borderColor: "divider",
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* ── Main Content Area ────────────────────────── */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { xs: "100%", md: `calc(100% - ${DRAWER_WIDTH}px)` },
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 60, md: 70 } }} /> {/* Spacer for fixed AppBar */}
        <Box sx={{ flexGrow: 1, p: { xs: 2, sm: 3, md: 4 }, overflowX: "hidden" }}>
          <Container maxWidth="xl" disableGutters>
            {children}
          </Container>
        </Box>
      </Box>
    </Box>
  );
}
