"use client";

import {
  Box,
  Card,
  CardContent,
  Chip,
  InputAdornment,
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
  Grid2,
} from "@mui/material";
import CurrencySelector, { Currency, getCurrencySymbol } from "./CurrencySelector";

export interface ProgrammeSalary {
  programme: string;
  ctcAnnual: string;
  baseSalary: string;
  takeHome: string;
  enabled: boolean;
}

export interface SalaryComponents {
  joiningBonus: string;
  retentionBonus: string;
  performanceBonus: string;
  esops: string;
  vestPeriod: string;
  relocationAllowance: string;
  medicalAllowance: string;
  deductions: string;
  bondAmount: string;
  bondDuration: string;
  stocks: string;
  ctcBreakup: string;
}

interface SalaryGridProps {
  currency: Currency;
  onCurrencyChange: (currency: Currency) => void;
  sameForAll: boolean;
  onSameForAllChange: (same: boolean) => void;
  programmeSalaries: ProgrammeSalary[];
  onProgrammeSalariesChange: (salaries: ProgrammeSalary[]) => void;
  salaryComponents: SalaryComponents;
  onSalaryComponentsChange: (components: SalaryComponents) => void;
}

const defaultProgrammeSalaries: ProgrammeSalary[] = [
  { programme: "B.Tech / Dual / Int. M.Tech", ctcAnnual: "", baseSalary: "", takeHome: "", enabled: true },
  { programme: "M.Tech", ctcAnnual: "", baseSalary: "", takeHome: "", enabled: false },
  { programme: "MBA", ctcAnnual: "", baseSalary: "", takeHome: "", enabled: false },
  { programme: "M.Sc / M.Sc.Tech", ctcAnnual: "", baseSalary: "", takeHome: "", enabled: false },
  { programme: "Ph.D", ctcAnnual: "", baseSalary: "", takeHome: "", enabled: false },
];

const defaultSalaryComponents: SalaryComponents = {
  joiningBonus: "",
  retentionBonus: "",
  performanceBonus: "",
  esops: "",
  vestPeriod: "",
  relocationAllowance: "",
  medicalAllowance: "",
  deductions: "",
  bondAmount: "",
  bondDuration: "",
  stocks: "",
  ctcBreakup: "",
};

export { defaultProgrammeSalaries, defaultSalaryComponents };

export default function SalaryGrid({
  currency,
  onCurrencyChange,
  sameForAll,
  onSameForAllChange,
  programmeSalaries,
  onProgrammeSalariesChange,
  salaryComponents,
  onSalaryComponentsChange,
}: SalaryGridProps) {
  const salaries = programmeSalaries.length > 0 ? programmeSalaries : defaultProgrammeSalaries;
  const components = { ...defaultSalaryComponents, ...salaryComponents };
  const symbol = getCurrencySymbol(currency);

  const updateSalary = (index: number, field: keyof ProgrammeSalary, value: string | boolean) => {
    const updated = [...salaries];
    updated[index] = { ...updated[index], [field]: value };
    
    // If sameForAll is true and we're updating the first row, propagate to all enabled rows
    if (sameForAll && index === 0 && typeof value === "string") {
      updated.forEach((s, i) => {
        if (i > 0 && s.enabled) {
          updated[i] = { ...updated[i], [field]: value };
        }
      });
    }
    
    onProgrammeSalariesChange(updated);
  };

  const updateComponent = (field: keyof SalaryComponents, value: string) => {
    onSalaryComponentsChange({ ...components, [field]: value });
  };

  return (
    <Box>
      {/* Currency & toggle bar */}
      <Box
        sx={{
          p: 2.5,
          mb: 3,
          border: "1px solid",
          borderColor: "primary.light",
          borderRadius: 2.5,
          bgcolor: alpha("#1a3a5c", 0.03),
        }}
      >
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5} alignItems={{ sm: "center" }} justifyContent="space-between">
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="subtitle2" fontWeight={700} color="text.secondary">
              Currency
            </Typography>
            <CurrencySelector value={currency} onChange={onCurrencyChange} />
          </Stack>
          <FormControlLabel
            control={
              <Switch
                checked={sameForAll}
                onChange={(e) => onSameForAllChange(e.target.checked)}
                color="primary"
                size="small"
              />
            }
            label={
              <Typography variant="body2" fontWeight={600} color="text.secondary">
                Same structure for all programmes
              </Typography>
            }
          />
        </Stack>
      </Box>

      {/* Programme salary table */}
      <Box sx={{ mb: 1.5 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1.5}>
          <Typography variant="subtitle2" fontWeight={700} color="text.secondary">
            Programme-wise Compensation ({symbol})
          </Typography>
          <Typography variant="caption" color="text.disabled">
            Check to enable a programme
          </Typography>
        </Stack>
      </Box>
      <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 2.5, mb: 3, overflow: "hidden" }}>
        <TableContainer sx={{ overflowX: "auto" }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "#f8fafc" }}>
                <TableCell padding="checkbox" sx={{ borderBottom: "2px solid #e2e8f0" }} />
                <TableCell sx={{ fontWeight: 700, color: "text.secondary", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "2px solid #e2e8f0", minWidth: 180, whiteSpace: "nowrap" }}>
                  Programme
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "text.secondary", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "2px solid #e2e8f0", whiteSpace: "nowrap" }}>
                  CTC Annual
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "text.secondary", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "2px solid #e2e8f0", whiteSpace: "nowrap" }}>
                  Base / Fixed
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "text.secondary", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "2px solid #e2e8f0", whiteSpace: "nowrap" }}>
                  Monthly Take-home
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {salaries.map((salary, index) => (
                <TableRow
                  key={salary.programme}
                  sx={{
                    bgcolor: salary.enabled ? alpha("#1a3a5c", 0.03) : "transparent",
                    opacity: salary.enabled ? 1 : 0.5,
                    "&:last-child td": { border: 0 },
                    transition: "opacity 0.15s",
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={salary.enabled}
                      onChange={(e) => updateSalary(index, "enabled", e.target.checked)}
                      size="small"
                      color="primary"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={salary.enabled ? 700 : 400} color={salary.enabled ? "text.primary" : "text.disabled"}>
                      {salary.programme}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      type="number"
                      value={salary.ctcAnnual}
                      onChange={(e) => updateSalary(index, "ctcAnnual", e.target.value)}
                      disabled={!salary.enabled || (sameForAll && index > 0)}
                      InputProps={{ startAdornment: <InputAdornment position="start">{symbol}</InputAdornment> }}
                      sx={{ width: 140, "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
                      placeholder="e.g. 1200000"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      type="number"
                      value={salary.baseSalary}
                      onChange={(e) => updateSalary(index, "baseSalary", e.target.value)}
                      disabled={!salary.enabled || (sameForAll && index > 0)}
                      InputProps={{ startAdornment: <InputAdornment position="start">{symbol}</InputAdornment> }}
                      sx={{ width: 140, "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
                      placeholder="e.g. 800000"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      type="number"
                      value={salary.takeHome}
                      onChange={(e) => updateSalary(index, "takeHome", e.target.value)}
                      disabled={!salary.enabled || (sameForAll && index > 0)}
                      InputProps={{ startAdornment: <InputAdornment position="start">{symbol}</InputAdornment> }}
                      sx={{ width: 140, "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
                      placeholder="e.g. 65000"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Additional components */}
      <Typography variant="subtitle2" fontWeight={700} color="text.secondary" mb={1.5}>
        Additional Compensation Components
      </Typography>
      <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 2.5 }}>
        <CardContent sx={{ p: 3 }}>
          <Stack spacing={3}>
            {/* Bonuses */}
            <Box>
              <Typography variant="overline" color="text.disabled" fontWeight={700} letterSpacing="0.1em" mb={1.5} display="block">
                Bonuses
              </Typography>
              <Grid2 container spacing={2}>
                <Grid2 size={{ xs: 12, sm: 4 }}>
                  <TextField size="small" fullWidth label="Joining Bonus" value={components.joiningBonus}
                    onChange={(e) => updateComponent("joiningBonus", e.target.value)}
                    InputProps={{ startAdornment: <InputAdornment position="start">{symbol}</InputAdornment> }}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 4 }}>
                  <TextField size="small" fullWidth label="Retention Bonus" value={components.retentionBonus}
                    onChange={(e) => updateComponent("retentionBonus", e.target.value)}
                    InputProps={{ startAdornment: <InputAdornment position="start">{symbol}</InputAdornment> }}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 4 }}>
                  <TextField size="small" fullWidth label="Performance Bonus" value={components.performanceBonus}
                    onChange={(e) => updateComponent("performanceBonus", e.target.value)}
                    InputProps={{ startAdornment: <InputAdornment position="start">{symbol}</InputAdornment> }}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
                  />
                </Grid2>
              </Grid2>
            </Box>

            <Divider />

            {/* Equity */}
            <Box>
              <Typography variant="overline" color="text.disabled" fontWeight={700} letterSpacing="0.1em" mb={1.5} display="block">
                Equity &amp; Stock
              </Typography>
              <Grid2 container spacing={2}>
                <Grid2 size={{ xs: 12, sm: 4 }}>
                  <TextField size="small" fullWidth label="ESOPs / Stock Options" value={components.esops}
                    onChange={(e) => updateComponent("esops", e.target.value)}
                    helperText="No. of options or value"
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 4 }}>
                  <TextField size="small" fullWidth label="Vesting Period" value={components.vestPeriod}
                    onChange={(e) => updateComponent("vestPeriod", e.target.value)}
                    helperText="e.g., 4 yrs with 1-yr cliff"
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 4 }}>
                  <TextField size="small" fullWidth label="Stocks / RSUs" value={components.stocks}
                    onChange={(e) => updateComponent("stocks", e.target.value)}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
                  />
                </Grid2>
              </Grid2>
            </Box>

            <Divider />

            {/* Allowances */}
            <Box>
              <Typography variant="overline" color="text.disabled" fontWeight={700} letterSpacing="0.1em" mb={1.5} display="block">
                Allowances &amp; Deductions
              </Typography>
              <Grid2 container spacing={2}>
                <Grid2 size={{ xs: 12, sm: 4 }}>
                  <TextField size="small" fullWidth label="Relocation Allowance" value={components.relocationAllowance}
                    onChange={(e) => updateComponent("relocationAllowance", e.target.value)}
                    InputProps={{ startAdornment: <InputAdornment position="start">{symbol}</InputAdornment> }}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 4 }}>
                  <TextField size="small" fullWidth label="Medical / Insurance" value={components.medicalAllowance}
                    onChange={(e) => updateComponent("medicalAllowance", e.target.value)}
                    InputProps={{ startAdornment: <InputAdornment position="start">{symbol}</InputAdornment> }}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 4 }}>
                  <TextField size="small" fullWidth label="Deductions (PF, Tax)" value={components.deductions}
                    onChange={(e) => updateComponent("deductions", e.target.value)}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
                  />
                </Grid2>
              </Grid2>
            </Box>

            <Divider />

            {/* Bond */}
            <Box>
              <Typography variant="overline" color="text.disabled" fontWeight={700} letterSpacing="0.1em" mb={1.5} display="block">
                Bond (if applicable)
              </Typography>
              <Grid2 container spacing={2}>
                <Grid2 size={{ xs: 12, sm: 4 }}>
                  <TextField size="small" fullWidth label="Bond Amount" value={components.bondAmount}
                    onChange={(e) => updateComponent("bondAmount", e.target.value)}
                    InputProps={{ startAdornment: <InputAdornment position="start">{symbol}</InputAdornment> }}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 4 }}>
                  <TextField size="small" fullWidth label="Bond Duration" value={components.bondDuration}
                    onChange={(e) => updateComponent("bondDuration", e.target.value)}
                    helperText="e.g., 2 years"
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
                  />
                </Grid2>
              </Grid2>
            </Box>

            <Divider />

            {/* CTC Breakup */}
            <Box>
              <Typography variant="overline" color="text.disabled" fontWeight={700} letterSpacing="0.1em" mb={1.5} display="block">
                Detailed CTC Breakup
              </Typography>
              <TextField
                label="CTC Breakup (Optional)"
                value={components.ctcBreakup}
                onChange={(e) => updateComponent("ctcBreakup", e.target.value)}
                multiline
                rows={3}
                fullWidth
                helperText="Provide any additional salary breakup or notes"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
              />
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

