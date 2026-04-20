"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { adminApi } from "@/lib/adminApi";

type NotificationItem = {
  id: number;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read_at: string | null;
  created_at: string;
};

const TYPE_CONFIG = {
  info:    { icon: <InfoOutlinedIcon />,          bg: "#eff6ff", border: "#93c5fd", iconColor: "#1d4ed8" },
  success: { icon: <CheckCircleOutlinedIcon />,   bg: "#f0fdf4", border: "#86efac", iconColor: "#15803d" },
  warning: { icon: <WarningAmberIcon />,          bg: "#fffbeb", border: "#fcd34d", iconColor: "#b45309" },
  error:   { icon: <ErrorOutlineIcon />,          bg: "#fef2f2", border: "#fca5a5", iconColor: "#b91c1c" },
};

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await adminApi<{ notifications: NotificationItem[] }>(
          "/auth/notifications",
        );
        setNotifications(response.notifications);
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "Failed to load notifications.",
        );
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, []);

  const markAsRead = async (id: number) => {
    try {
      await adminApi(`/auth/notifications/${id}/read`, { method: "PATCH" });
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, read_at: new Date().toISOString() } : n,
        ),
      );
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Failed to update notification.",
      );
    }
  };

  const markAllAsRead = async () => {
    try {
      await adminApi("/auth/notifications/read-all", { method: "PATCH" });
      setNotifications((prev) =>
        prev.map((n) => ({
          ...n,
          read_at: n.read_at ?? new Date().toISOString(),
        })),
      );
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Failed to update notifications.",
      );
    }
  };

  const unreadCount = notifications.filter((n) => !n.read_at).length;

  return (
    <Box sx={{ pb: 6, maxWidth: 800, mx: "auto" }}>
      {/* Page header */}
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} spacing={2} sx={{ mb: 4 }}>
        <Box>
          <Stack direction="row" spacing={1.5} alignItems="center" mb={0.5}>
            <NotificationsIcon color="primary" />
            <Typography variant="h4" fontWeight={800} color="text.primary" letterSpacing="-0.02em">
              Notifications
            </Typography>
            {unreadCount > 0 && (
              <Chip label={unreadCount} color="primary" size="small" sx={{ fontWeight: 800, height: 22, fontSize: "0.75rem" }} />
            )}
          </Stack>
          <Typography variant="body1" color="text.secondary">
            System alerts, review outcomes, and activity updates
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<DoneAllIcon />}
          onClick={() => void markAllAsRead()}
          disabled={unreadCount === 0}
          sx={{ borderRadius: 2, fontWeight: 700, whiteSpace: "nowrap", alignSelf: { xs: "flex-start", sm: "auto" } }}
        >
          Mark All Read
        </Button>
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

      {/* Notification list */}
      <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 3, overflow: "hidden" }}>
        {loading ? (
          <Stack divider={<Divider />}>
            {Array.from({ length: 4 }).map((_, i) => (
              <Box key={i} sx={{ p: 3 }}>
                <Skeleton variant="text" width="60%" height={20} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="85%" height={16} />
                <Skeleton variant="text" width="30%" height={14} sx={{ mt: 1 }} />
              </Box>
            ))}
          </Stack>
        ) : notifications.length === 0 ? (
          <Box textAlign="center" py={8}>
            <NotificationsNoneIcon sx={{ fontSize: 56, color: "text.disabled", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" fontWeight={600}>All clear!</Typography>
            <Typography variant="body2" color="text.disabled" mt={1}>
              No notifications to show right now.
            </Typography>
          </Box>
        ) : (
          <Stack divider={<Divider />}>
            {notifications.map((item) => {
              const cfg = TYPE_CONFIG[item.type] ?? TYPE_CONFIG.info;
              return (
                <Box
                  key={item.id}
                  sx={{
                    p: 3,
                    bgcolor: item.read_at ? "white" : alpha(cfg.bg, 0.8),
                    borderLeft: item.read_at ? "3px solid transparent" : `3px solid ${cfg.iconColor}`,
                    transition: "background 0.2s",
                  }}
                >
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "flex-start" }}>
                    {/* Icon */}
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        bgcolor: cfg.bg,
                        border: `1px solid ${cfg.border}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: cfg.iconColor,
                        flexShrink: 0,
                        opacity: item.read_at ? 0.6 : 1,
                        "& svg": { fontSize: "1rem" },
                      }}
                    >
                      {cfg.icon}
                    </Box>

                    {/* Content */}
                    <Box sx={{ flex: 1, minWidth: 0, opacity: item.read_at ? 0.65 : 1 }}>
                      <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                        <Typography variant="subtitle2" fontWeight={700}>
                          {item.title}
                        </Typography>
                        {!item.read_at && (
                          <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: cfg.iconColor, flexShrink: 0 }} />
                        )}
                      </Stack>
                      <Typography variant="body2" color="text.secondary" sx={{ wordBreak: "break-word", lineHeight: 1.6 }}>
                        {item.message}
                      </Typography>
                      <Typography variant="caption" color="text.disabled" mt={0.75} display="block">
                        {new Date(item.created_at).toLocaleString(undefined, {
                          weekday: "short", month: "short", day: "numeric",
                          hour: "numeric", minute: "2-digit",
                        })}
                      </Typography>
                    </Box>

                    {/* Action */}
                    {!item.read_at && (
                      <Button
                        size="small"
                        variant="text"
                        onClick={() => void markAsRead(item.id)}
                        sx={{ fontWeight: 700, whiteSpace: "nowrap", flexShrink: 0, alignSelf: { xs: "flex-end", sm: "flex-start" } }}
                      >
                        Mark Read
                      </Button>
                    )}
                  </Stack>
                </Box>
              );
            })}
          </Stack>
        )}
      </Card>
    </Box>
  );
}
