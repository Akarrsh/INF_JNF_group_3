"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  AppBar,
  Box,
  Button,
  Container,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";

const navItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "JNF Reviews", href: "/admin/jnfs" },
  { label: "INF Reviews", href: "/admin/infs" },
  { label: "Companies", href: "/admin/companies" },
  { label: "Branch Manager", href: "/admin/programme-branches" },
  { label: "Alumni Outreach", href: "/admin/alumni-outreach" },
  { label: "Notifications", href: "/admin/notifications" },
];

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(145deg, #f4f7fb 0%, #fef6ed 100%)",
      }}
    >
      <AppBar
        position="sticky"
        color="inherit"
        elevation={0}
        sx={{ borderBottom: "1px solid #dce4ee" }}
      >
        <Toolbar>
          <Container
            maxWidth="xl"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: "0 !important",
            }}
          >
            <Typography variant="h6" color="primary.main" fontWeight={700} sx={{ ml: 6 }}>
              IIT ISM CDC - Admin Portal
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              flexWrap="wrap"
              justifyContent="flex-end"
            >
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Button
                    key={item.href}
                    component={Link}
                    href={item.href}
                    variant={active ? "contained" : "text"}
                    color={active ? "primary" : "inherit"}
                    size="small"
                  >
                    {item.label}
                  </Button>
                );
              })}

              <Button
                color="secondary"
                variant="contained"
                size="small"
                onClick={() => signOut({ callbackUrl: "/auth/login" })}
              >
                Sign Out
              </Button>
            </Stack>
          </Container>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {children}
      </Container>
    </Box>
  );
}
