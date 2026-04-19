"use client";

import { usePathname, useRouter } from "next/navigation";
import { IconButton, Tooltip } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function GlobalBackButton() {
  const router = useRouter();
  const pathname = usePathname();

  // Hide on landing page and main dashboards since they are entry/home points.
  // We want to show it on /auth/login and other sub-pages.
  if (pathname === "/" || pathname === "/admin" || pathname === "/company") {
    return null;
  }

  return (
    <Tooltip title="Go Back">
      <IconButton
        onClick={() => router.back()}
        sx={{
          position: "fixed",
          top: 16,
          left: 16,
          zIndex: 9999,
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(4px)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          width: 36,
          height: 36,
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 1)",
            transform: "translateY(-1px)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          },
          transition: "all 0.2s ease-in-out",
        }}
        size="small"
      >
        <ArrowBackIcon color="action" fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}
