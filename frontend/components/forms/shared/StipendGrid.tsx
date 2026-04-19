"use client";

import {
  Box,
  InputAdornment,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  Switch,
  Divider,
  alpha,
} from "@mui/material";
import CurrencySelector, { Currency, getCurrencySymbol } from "./CurrencySelector";

export interface ProgrammeStipend {
  programme: string;
  baseStipend: string;
  hra: string;
  otherPerks: string;
  total: string;
  enabled: boolean;
}

interface StipendGridProps {
  currency: Currency;
  onCurrencyChange: (currency: Currency) => void;
  sameForAll: boolean;
  onSameForAllChange: (same: boolean) => void;
  programmeStipends: ProgrammeStipend[];
  onProgrammeStipendsChange: (stipends: ProgrammeStipend[]) => void;
  ppoProvision: boolean;
  onPpoProvisionChange: (provision: boolean) => void;
  ppoCtc: string;
  onPpoCtcChange: (ctc: string) => void;
}

const defaultProgrammeStipends: ProgrammeStipend[] = [
  { programme: "B.Tech / Dual / Int. M.Tech", baseStipend: "", hra: "", otherPerks: "", total: "", enabled: true },
  { programme: "M.Tech", baseStipend: "", hra: "", otherPerks: "", total: "", enabled: false },
  { programme: "MBA", baseStipend: "", hra: "", otherPerks: "", total: "", enabled: false },
  { programme: "M.Sc / M.Sc.Tech", baseStipend: "", hra: "", otherPerks: "", total: "", enabled: false },
  { programme: "Ph.D", baseStipend: "", hra: "", otherPerks: "", total: "", enabled: false },
];

export { defaultProgrammeStipends };

export default function StipendGrid({
  currency,
  onCurrencyChange,
  sameForAll,
  onSameForAllChange,
  programmeStipends,
  onProgrammeStipendsChange,
  ppoProvision,
  onPpoProvisionChange,
  ppoCtc,
  onPpoCtcChange,
}: StipendGridProps) {
  const stipends = programmeStipends.length > 0 ? programmeStipends : defaultProgrammeStipends;
  const symbol = getCurrencySymbol(currency);

  const updateStipend = (index: number, field: keyof ProgrammeStipend, value: string | boolean) => {
    const updated = [...stipends];
    updated[index] = { ...updated[index], [field]: value };

    // Auto-calculate total
    if (typeof value === "string" && (field === "baseStipend" || field === "hra" || field === "otherPerks")) {
      const base = parseFloat(updated[index].baseStipend) || 0;
      const hra = parseFloat(updated[index].hra) || 0;
      const perks = parseFloat(updated[index].otherPerks) || 0;
      updated[index].total = (base + hra + perks).toString();
    }

    // If sameForAll is true and we're updating the first row, propagate to all enabled rows
    if (sameForAll && index === 0 && typeof value === "string") {
      updated.forEach((s, i) => {
        if (i > 0 && s.enabled) {
          updated[i] = { ...updated[i], [field]: value };
          // Recalculate total for propagated rows
          const base = parseFloat(updated[i].baseStipend) || 0;
          const hra = parseFloat(updated[i].hra) || 0;
          const perks = parseFloat(updated[i].otherPerks) || 0;
          updated[i].total = (base + hra + perks).toString();
        }
      });
    }

    onProgrammeStipendsChange(updated);
  };

  return (
    <Box>
      {/* Currency and Global Toggle */}
      <Paper
        sx={{
          p: 2,
          mb: 3,
          background: (theme) => alpha(theme.palette.primary.main, 0.05),
          border: "1px solid",
          borderColor: "primary.light",
        }}
      >
        <Stack direction={{ xs: "column", md: "row" }} spacing={3} alignItems={{ md: "center" }}>
          <CurrencySelector value={currency} onChange={onCurrencyChange} />
          <FormControlLabel
            control={
              <Switch
                checked={sameForAll}
                onChange={(e) => onSameForAllChange(e.target.checked)}
                color="primary"
              />
            }
            label={
              <Typography variant="body2" fontWeight={500}>
                Same stipend structure for all programmes
              </Typography>
            }
          />
        </Stack>
      </Paper>

      {/* Programme-wise Stipend Grid */}
      <Typography variant="subtitle2" fontWeight={600} mb={2}>
        Programme-wise Stipend (Monthly - {symbol})
      </Typography>
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: "grey.100" }}>
              <TableCell padding="checkbox" />
              <TableCell sx={{ fontWeight: 600, minWidth: 180 }}>Programme</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Base Stipend</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>HRA/Housing</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Other Perks</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stipends.map((stipend, index) => (
              <TableRow
                key={stipend.programme}
                sx={{
                  bgcolor: stipend.enabled ? alpha("#1976d2", 0.04) : "transparent",
                  opacity: stipend.enabled ? 1 : 0.6,
                }}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={stipend.enabled}
                    onChange={(e) => updateStipend(index, "enabled", e.target.checked)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight={stipend.enabled ? 500 : 400}>
                    {stipend.programme}
                  </Typography>
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={stipend.baseStipend}
                    onChange={(e) => updateStipend(index, "baseStipend", e.target.value)}
                    disabled={!stipend.enabled || (sameForAll && index > 0)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">{symbol}</InputAdornment>,
                    }}
                    sx={{ width: 130 }}
                    placeholder="50000"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={stipend.hra}
                    onChange={(e) => updateStipend(index, "hra", e.target.value)}
                    disabled={!stipend.enabled || (sameForAll && index > 0)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">{symbol}</InputAdornment>,
                    }}
                    sx={{ width: 130 }}
                    placeholder="10000"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={stipend.otherPerks}
                    onChange={(e) => updateStipend(index, "otherPerks", e.target.value)}
                    disabled={!stipend.enabled || (sameForAll && index > 0)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">{symbol}</InputAdornment>,
                    }}
                    sx={{ width: 130 }}
                    placeholder="5000"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight={600} color="primary">
                    {stipend.total ? `${symbol}${parseInt(stipend.total).toLocaleString()}` : "-"}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* PPO Section */}
      <Paper
        sx={{
          p: 2,
          background: (theme) => alpha(theme.palette.success.main, 0.05),
          border: "1px solid",
          borderColor: "success.light",
        }}
      >
        <Typography variant="subtitle2" fontWeight={600} mb={2} color="success.dark">
          🎯 Pre-Placement Offer (PPO) Provision
        </Typography>
        <Stack direction={{ xs: "column", md: "row" }} spacing={3} alignItems={{ md: "center" }}>
          <FormControlLabel
            control={
              <Switch
                checked={ppoProvision}
                onChange={(e) => onPpoProvisionChange(e.target.checked)}
                color="success"
              />
            }
            label={
              <Typography variant="body2" fontWeight={500}>
                PPO available based on performance
              </Typography>
            }
          />
          {ppoProvision && (
            <TextField
              size="small"
              label="Expected PPO CTC (Annual)"
              value={ppoCtc}
              onChange={(e) => onPpoCtcChange(e.target.value)}
              type="number"
              InputProps={{
                startAdornment: <InputAdornment position="start">{symbol}</InputAdornment>,
              }}
              sx={{ width: 200 }}
              placeholder="1200000"
            />
          )}
        </Stack>
      </Paper>
    </Box>
  );
}
