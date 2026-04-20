"use client";

import { ReactNode } from "react";
import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";

interface FormSectionProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
  required?: boolean;
  accentColor?: string;
}

export default function FormSection({
  title,
  subtitle,
  icon,
  children,
  required,
  accentColor,
}: FormSectionProps) {
  return (
    <Card
      elevation={0}
      sx={{
        mb: 3,
        border: "1px solid #e2e8f0",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      {/* Section header */}
      <Box
        sx={{
          px: { xs: 2.5, md: 3.5 },
          py: 2.5,
          bgcolor: "#f8fafc",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          {icon && (
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                bgcolor: accentColor ? alpha(accentColor, 0.12) : alpha("#1a3a5c", 0.1),
                color: accentColor ?? "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                "& svg": { fontSize: "1.2rem" },
              }}
            >
              {icon}
            </Box>
          )}
          <Box sx={{ flex: 1 }}>
            <Stack direction="row" alignItems="center" spacing={0.75}>
              <Typography variant="subtitle1" fontWeight={700} color="text.primary">
                {title}
              </Typography>
              {required && (
                <Typography color="error.main" component="span" fontWeight={700} fontSize="1rem" lineHeight={1}>
                  *
                </Typography>
              )}
            </Stack>
            {subtitle && (
              <Typography variant="body2" color="text.secondary" mt={0.25}>
                {subtitle}
              </Typography>
            )}
          </Box>
        </Stack>
      </Box>

      {/* Section body */}
      <CardContent sx={{ p: { xs: 2.5, md: 3.5 }, "&:last-child": { pb: { xs: 2.5, md: 3.5 } } }}>
        {children}
      </CardContent>
    </Card>
  );
}
