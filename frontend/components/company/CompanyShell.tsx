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
  { label: "Dashboard", href: "/company" },
  { label: "Profile", href: "/company/profile" },
  { label: "JNF Form", href: "/company/jnf/new" },
  { label: "INF Form", href: "/company/inf/new" },
  { label: "Submissions", href: "/company/submissions" },
  { label: "Notifications", href: "/company/notifications" },
];

export default function CompanyShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideNavigation = pathname === "/company/register";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(140deg, #edf4ff 0%, #fff8ee 100%)",
      }}
    >
      {!hideNavigation && (
        <AppBar
          position="sticky"
          color="inherit"
          elevation={0}
          sx={{ borderBottom: "1px solid #dbe5f1" }}
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
                IIT ISM CDC - Company Portal
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
      )}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {children}
      </Container>
    </Box>
  );
}
