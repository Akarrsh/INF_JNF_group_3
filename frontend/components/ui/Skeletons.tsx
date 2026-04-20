"use client";

import { Box, Card, CardContent, Skeleton, Stack } from "@mui/material";

// ── Table skeleton ─────────────────────────────────────────────────────
export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <Box>
      {/* Header row */}
      <Box sx={{ px: 2.5, py: 1.5, bgcolor: "#f8fafc", borderBottom: "2px solid #e2e8f0", display: "flex", gap: 3 }}>
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} variant="text" width={i === 0 ? 160 : 100} height={16} sx={{ borderRadius: 1 }} />
        ))}
      </Box>
      {/* Data rows */}
      {Array.from({ length: rows }).map((_, r) => (
        <Box key={r} sx={{ px: 2.5, py: 1.75, borderBottom: "1px solid #f1f5f9", display: "flex", gap: 3, alignItems: "center" }}>
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} variant="text" width={c === 0 ? 160 : c === cols - 1 ? 80 : 110} height={14} sx={{ borderRadius: 1 }} />
          ))}
        </Box>
      ))}
    </Box>
  );
}

// ── Card grid skeleton ─────────────────────────────────────────────────
export function CardGridSkeleton({ cards = 6 }: { cards?: number }) {
  return (
    <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 2 }}>
      {Array.from({ length: cards }).map((_, i) => (
        <Card key={i} elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 3 }}>
          <CardContent>
            <Stack spacing={1.5}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Skeleton variant="circular" width={40} height={40} />
                <Box flex={1}>
                  <Skeleton variant="text" width="70%" height={18} />
                  <Skeleton variant="text" width="45%" height={14} />
                </Box>
              </Stack>
              <Skeleton variant="text" width="90%" height={14} />
              <Skeleton variant="text" width="60%" height={14} />
              <Stack direction="row" spacing={1} mt={0.5}>
                <Skeleton variant="rounded" width={60} height={22} sx={{ borderRadius: 1 }} />
                <Skeleton variant="rounded" width={50} height={22} sx={{ borderRadius: 1 }} />
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

// ── List skeleton ──────────────────────────────────────────────────────
export function ListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <Stack divider={<Box sx={{ borderBottom: "1px solid #f1f5f9" }} />}>
      {Array.from({ length: rows }).map((_, i) => (
        <Box key={i} sx={{ px: 3, py: 2.5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box flex={1}>
            <Skeleton variant="text" width="55%" height={18} sx={{ mb: 0.75 }} />
            <Stack direction="row" spacing={1}>
              <Skeleton variant="rounded" width={70} height={20} sx={{ borderRadius: 1 }} />
              <Skeleton variant="text" width={90} height={14} />
            </Stack>
          </Box>
          <Stack direction="row" spacing={1}>
            <Skeleton variant="rounded" width={56} height={30} sx={{ borderRadius: 1.5 }} />
            <Skeleton variant="rounded" width={72} height={30} sx={{ borderRadius: 1.5 }} />
          </Stack>
        </Box>
      ))}
    </Stack>
  );
}

// ── Detail page skeleton ───────────────────────────────────────────────
export function DetailPageSkeleton() {
  return (
    <Box>
      {/* Page header */}
      <Box sx={{ mb: 3 }}>
        <Skeleton variant="text" width={120} height={16} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="40%" height={32} />
        <Skeleton variant="text" width="25%" height={18} sx={{ mt: 0.5 }} />
      </Box>
      <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
        {/* Main content */}
        <Box flex={1}>
          {[1, 2, 3].map((n) => (
            <Card key={n} elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 3, mb: 2.5, overflow: "hidden" }}>
              <Box sx={{ px: 3, py: 2, bgcolor: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Skeleton variant="circular" width={20} height={20} />
                  <Skeleton variant="text" width={140} height={20} />
                </Stack>
              </Box>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Box key={i}>
                      <Skeleton variant="text" width="60%" height={12} sx={{ mb: 0.5 }} />
                      <Skeleton variant="text" width="80%" height={18} />
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
        {/* Sidebar */}
        <Box sx={{ width: { xs: "100%", md: 300 }, flexShrink: 0 }}>
          <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 3, overflow: "hidden" }}>
            <Box sx={{ px: 3, py: 2, bgcolor: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
              <Skeleton variant="text" width={120} height={20} />
            </Box>
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Skeleton variant="rounded" height={48} sx={{ borderRadius: 2 }} />
                <Skeleton variant="rounded" height={80} sx={{ borderRadius: 2 }} />
                <Skeleton variant="rounded" height={40} sx={{ borderRadius: 2 }} />
                <Skeleton variant="rounded" height={40} sx={{ borderRadius: 2 }} />
                <Skeleton variant="rounded" height={40} sx={{ borderRadius: 2 }} />
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Stack>
    </Box>
  );
}

// ── Dashboard skeleton ─────────────────────────────────────────────────
export function DashboardSkeleton() {
  return (
    <Box>
      <Skeleton variant="text" width="30%" height={36} sx={{ mb: 0.5 }} />
      <Skeleton variant="text" width="45%" height={20} sx={{ mb: 3 }} />
      {/* KPI row */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 2, mb: 3 }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 3 }}>
            <CardContent>
              <Skeleton variant="text" width="50%" height={14} />
              <Skeleton variant="text" width="40%" height={36} sx={{ my: 0.5 }} />
              <Skeleton variant="text" width="70%" height={14} />
            </CardContent>
          </Card>
        ))}
      </Box>
      {/* Content area */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" }, gap: 3 }}>
        <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 3 }}>
          <CardContent><ListSkeleton rows={3} /></CardContent>
        </Card>
        <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 3 }}>
          <CardContent>
            <Stack spacing={1.5}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Stack key={i} direction="row" spacing={1.5} alignItems="center">
                  <Skeleton variant="circular" width={32} height={32} />
                  <Box flex={1}>
                    <Skeleton variant="text" width="70%" height={15} />
                    <Skeleton variant="text" width="40%" height={12} />
                  </Box>
                </Stack>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
