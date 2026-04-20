"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { companyApi } from "@/lib/companyApi";

type NotificationItem = {
  id: number;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read_at: string | null;
  created_at: string;
};

export default function CompanyNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await companyApi<{
          notifications: NotificationItem[];
        }>("/auth/notifications");
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
      await companyApi(`/auth/notifications/${id}/read`, { method: "PATCH" });
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
      await companyApi("/auth/notifications/read-all", { method: "PATCH" });
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

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", pb: 6 }}>
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "stretch", sm: "flex-end" }} spacing={2} sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "text.primary", mb: 0.5, letterSpacing: "-0.02em" }}>
            Notifications
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            Stay updated on your JNF and INF submissions.
          </Typography>
        </Box>
        {notifications.some(n => !n.read_at) && (
          <Button
            variant="outlined"
            onClick={() => void markAllAsRead()}
            sx={{ alignSelf: { xs: "stretch", sm: "auto" }, borderRadius: 2, fontWeight: 600, px: 3 }}
          >
            Mark All Read
          </Button>
        )}
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

      <Stack spacing={2}>
        {loading && Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={`company-notification-skeleton-${index}`} variant="rounded" height={80} sx={{ borderRadius: 3 }} />
        ))}

        {!loading && notifications.length === 0 && (
          <Box textAlign="center" py={8} px={2} sx={{ border: "1px dashed #e2e8f0", borderRadius: 4, bgcolor: "#f8fafc" }}>
            <Typography variant="h6" fontWeight={700} color="text.secondary" mb={1}>You&apos;re All Caught Up!</Typography>
            <Typography variant="body2" color="text.disabled">
              You have no new notifications right now.
            </Typography>
          </Box>
        )}

        {!loading && notifications.map((item) => (
          <Card
            key={item.id}
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: item.read_at ? "#e2e8f0" : "primary.light",
              borderRadius: 3,
              bgcolor: item.read_at ? "transparent" : alpha("#1a3a5c", 0.02),
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.05)" },
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 3 }, "&:last-child": { pb: { xs: 2, sm: 3 } } }}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Stack direction="row" spacing={1.5} alignItems="center" mb={0.5}>
                    {!item.read_at && (
                      <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "primary.main", flexShrink: 0 }} />
                    )}
                    <Typography variant="subtitle1" fontWeight={item.read_at ? 600 : 700} color="text.primary">
                      {item.title}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ wordBreak: "break-word", mb: 2, ml: item.read_at ? 0 : 2.5 }}>
                    {item.message}
                  </Typography>
                  <Typography variant="caption" color="text.disabled" sx={{ ml: item.read_at ? 0 : 2.5, fontWeight: 500 }}>
                    {new Date(item.created_at).toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                  </Typography>
                </Box>

                {!item.read_at && (
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => void markAsRead(item.id)}
                    sx={{ fontWeight: 600, mt: { xs: 1, sm: 0 }, alignSelf: { xs: "flex-end", sm: "auto" } }}
                  >
                    Mark Read
                  </Button>
                )}
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}