"use client";

import { Box, Button, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import SearchOffOutlinedIcon from "@mui/icons-material/SearchOffOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

interface EmptyStateProps {
  variant?: "default" | "search" | "error";
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

const presets = {
  default: {
    icon: <InboxOutlinedIcon sx={{ fontSize: 48, color: "text.disabled" }} />,
    title: "Nothing here yet",
    description: "Items you create or receive will appear here.",
  },
  search: {
    icon: <SearchOffOutlinedIcon sx={{ fontSize: 48, color: "text.disabled" }} />,
    title: "No results found",
    description: "Try adjusting your search or filters.",
  },
  error: {
    icon: <ErrorOutlineIcon sx={{ fontSize: 48, color: "error.light" }} />,
    title: "Something went wrong",
    description: "We couldn't load this content. Please try again.",
  },
};

export default function EmptyState({
  variant = "default",
  title,
  description,
  actionLabel,
  onAction,
  icon,
}: EmptyStateProps) {
  const preset = presets[variant];

  return (
    <Box
      sx={{
        py: { xs: 5, md: 8 },
        px: 3,
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1.5,
      }}
    >
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          bgcolor: alpha("#94a3b8", 0.1),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 1,
        }}
      >
        {icon ?? preset.icon}
      </Box>

      <Typography variant="subtitle1" fontWeight={700} color="text.secondary">
        {title ?? preset.title}
      </Typography>

      <Typography variant="body2" color="text.disabled" sx={{ maxWidth: 320 }}>
        {description ?? preset.description}
      </Typography>

      {actionLabel && onAction && (
        <Button
          variant="outlined"
          size="small"
          startIcon={<AddCircleOutlineIcon />}
          onClick={onAction}
          sx={{ mt: 1, borderRadius: 2, fontWeight: 600 }}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}
