"use client";

import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from "@mui/material";

export type Currency = "INR" | "USD" | "EUR" | "GBP";

interface CurrencySelectorProps {
  value: Currency;
  onChange: (currency: Currency) => void;
  label?: string;
  size?: "small" | "medium";
}

const currencies: { code: Currency; symbol: string; name: string }[] = [
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
];

export function getCurrencySymbol(currency: Currency): string {
  return currencies.find((c) => c.code === currency)?.symbol ?? "₹";
}

export default function CurrencySelector({
  value,
  onChange,
  label = "Currency",
  size = "small",
}: CurrencySelectorProps) {
  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value as Currency);
  };

  return (
    <FormControl size={size} sx={{ minWidth: 120 }}>
      <InputLabel>{label}</InputLabel>
      <Select value={value} label={label} onChange={handleChange}>
        {currencies.map((currency) => (
          <MenuItem key={currency.code} value={currency.code}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography fontWeight={600}>{currency.symbol}</Typography>
              <Typography>{currency.code}</Typography>
            </Stack>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
