"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import MeetingRoomOutlinedIcon from "@mui/icons-material/MeetingRoomOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

export interface SelectionRound {
  id: string;
  type: "ppt" | "resume" | "written_test" | "aptitude_test" | "technical_test" | "group_discussion" | "hr_interview" | "technical_interview" | "psychometric" | "medical" | "other";
  mode: "online" | "offline" | "hybrid";
  duration?: number;
  description?: string;
  enabled: boolean;
}

interface SelectionProcessBuilderProps {
  value: SelectionRound[];
  onChange: (rounds: SelectionRound[]) => void;
  teamMembers: string;
  onTeamMembersChange: (value: string) => void;
  roomsRequired: string;
  onRoomsRequiredChange: (value: string) => void;
}

const roundTypes = [
  { value: "ppt",                 label: "Pre-Placement Talk",  icon: "🎤", color: "#7c3aed" },
  { value: "resume",              label: "Resume Shortlist",    icon: "📄", color: "#1d4ed8" },
  { value: "written_test",        label: "Written Test",        icon: "✍️", color: "#0369a1" },
  { value: "aptitude_test",       label: "Aptitude Test",       icon: "🧠", color: "#0f766e" },
  { value: "technical_test",      label: "Technical Test",      icon: "💻", color: "#15803d" },
  { value: "group_discussion",    label: "Group Discussion",    icon: "👥", color: "#b45309" },
  { value: "hr_interview",        label: "HR Interview",        icon: "🤝", color: "#c2410c" },
  { value: "technical_interview", label: "Technical Interview", icon: "⚙️", color: "#9f1239" },
  { value: "psychometric",        label: "Psychometric",        icon: "🧪", color: "#6d28d9" },
  { value: "medical",             label: "Medical",             icon: "🏥", color: "#0e7490" },
  { value: "other",               label: "Other",               icon: "📋", color: "#374151" },
];

const modeOptions = [
  { value: "online",  label: "Online",          chipColor: "info"    as const },
  { value: "offline", label: "Offline / Campus", chipColor: "success" as const },
  { value: "hybrid",  label: "Hybrid",           chipColor: "warning" as const },
];

const defaultRounds: SelectionRound[] = [
  { id: "1", type: "ppt",                 mode: "offline", enabled: true },
  { id: "2", type: "resume",              mode: "online",  enabled: true },
  { id: "3", type: "aptitude_test",       mode: "online",  duration: 60,  enabled: false },
  { id: "4", type: "technical_test",      mode: "online",  duration: 90,  enabled: false },
  { id: "5", type: "group_discussion",    mode: "offline", duration: 30,  enabled: false },
  { id: "6", type: "technical_interview", mode: "offline", duration: 45,  enabled: true },
  { id: "7", type: "hr_interview",        mode: "offline", duration: 30,  enabled: true },
];

export { defaultRounds };

export default function SelectionProcessBuilder({
  value,
  onChange,
  teamMembers,
  onTeamMembersChange,
  roomsRequired,
  onRoomsRequiredChange,
}: SelectionProcessBuilderProps) {
  const rounds = value.length > 0 ? value : defaultRounds;

  const toggleRound = (id: string) => {
    onChange(rounds.map((r) => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const updateRound = (id: string, field: keyof SelectionRound, val: unknown) => {
    onChange(rounds.map((r) => r.id === id ? { ...r, [field]: val } : r));
  };

  const addCustomRound = () => {
    const newRound: SelectionRound = {
      id: Date.now().toString(),
      type: "other",
      mode: "offline",
      duration: 30,
      description: "",
      enabled: true,
    };
    onChange([...rounds, newRound]);
  };

  const removeRound = (id: string) => {
    onChange(rounds.filter((r) => r.id !== id));
  };

  const enabledCount = rounds.filter((r) => r.enabled).length;

  return (
    <Box>
      {/* Toggle chips — include/exclude rounds */}
      <Box sx={{ mb: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1.5}>
          <Typography variant="subtitle2" fontWeight={700} color="text.secondary">
            Include in Selection Process
          </Typography>
          <Chip
            label={`${enabledCount} of ${rounds.length} selected`}
            size="small"
            color={enabledCount > 0 ? "primary" : "default"}
            variant={enabledCount > 0 ? "filled" : "outlined"}
            sx={{ fontWeight: 700, fontSize: "0.7rem" }}
          />
        </Stack>
        <Box
          sx={{
            p: 2,
            border: "1px solid #e2e8f0",
            borderRadius: 2.5,
            bgcolor: "#f8fafc",
          }}
        >
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {rounds.map((round) => {
              const info = roundTypes.find((t) => t.value === round.type);
              return (
                <Chip
                  key={round.id}
                  label={`${info?.icon} ${info?.label ?? round.description ?? "Custom"}`}
                  onClick={() => toggleRound(round.id)}
                  icon={round.enabled
                    ? <CheckCircleIcon fontSize="small" />
                    : <RadioButtonUncheckedIcon fontSize="small" />
                  }
                  color={round.enabled ? "primary" : "default"}
                  variant={round.enabled ? "filled" : "outlined"}
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.8rem",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    "&:hover": { opacity: 0.85 },
                  }}
                />
              );
            })}
          </Stack>
        </Box>
      </Box>

      {/* Detailed config for enabled rounds */}
      {enabledCount > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" fontWeight={700} color="text.secondary" mb={1.5}>
            Configure Enabled Rounds
          </Typography>
          <Stack spacing={1.5}>
            {rounds
              .filter((r) => r.enabled)
              .map((round, index) => {
                const info = roundTypes.find((t) => t.value === round.type);
                return (
                  <Box
                    key={round.id}
                    sx={{
                      p: 2,
                      border: "1px solid #e2e8f0",
                      borderRadius: 2.5,
                      bgcolor: "white",
                      borderLeft: `3px solid ${info?.color ?? "#94a3b8"}`,
                      transition: "box-shadow 0.2s",
                      "&:hover": { boxShadow: "0 2px 8px rgba(0,0,0,0.06)" },
                    }}
                  >
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }}>
                      {/* Round label */}
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: { sm: 200 } }}>
                        <Box
                          sx={{
                            width: 28,
                            height: 28,
                            borderRadius: "50%",
                            bgcolor: info?.color ?? "#94a3b8",
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.7rem",
                            fontWeight: 800,
                            flexShrink: 0,
                          }}
                        >
                          {index + 1}
                        </Box>
                        <Typography variant="body2" fontWeight={700} noWrap>
                          {info?.icon} {info?.label ?? "Custom Round"}
                        </Typography>
                      </Stack>

                      {/* Mode select */}
                      <FormControl size="small" sx={{ minWidth: 160 }}>
                        <InputLabel>Mode</InputLabel>
                        <Select
                          value={round.mode}
                          label="Mode"
                          onChange={(e) => updateRound(round.id, "mode", e.target.value)}
                          sx={{ borderRadius: 1.5 }}
                        >
                          {modeOptions.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      {/* Duration */}
                      {round.type !== "ppt" && round.type !== "resume" && (
                        <TextField
                          size="small"
                          type="number"
                          label="Duration (mins)"
                          value={round.duration ?? ""}
                          onChange={(e) =>
                            updateRound(round.id, "duration", e.target.value ? parseInt(e.target.value) : undefined)
                          }
                          sx={{ width: 140, "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
                        />
                      )}

                      {/* Custom description */}
                      {round.type === "other" && (
                        <TextField
                          size="small"
                          label="Description"
                          value={round.description ?? ""}
                          onChange={(e) => updateRound(round.id, "description", e.target.value)}
                          sx={{ flexGrow: 1, "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
                        />
                      )}

                      {/* Mode badge */}
                      <Chip
                        label={modeOptions.find(m => m.value === round.mode)?.label ?? round.mode}
                        size="small"
                        color={modeOptions.find(m => m.value === round.mode)?.chipColor ?? "default"}
                        variant="outlined"
                        sx={{ fontWeight: 600, fontSize: "0.7rem", display: { xs: "none", md: "flex" } }}
                      />

                      {/* Remove */}
                      <Tooltip title="Remove this round">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => removeRound(round.id)}
                          sx={{ ml: "auto", flexShrink: 0 }}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Box>
                );
              })}
          </Stack>
        </Box>
      )}

      {/* Add custom round */}
      <Button
        startIcon={<AddIcon />}
        onClick={addCustomRound}
        variant="outlined"
        size="small"
        sx={{ borderRadius: 2, fontWeight: 600, mb: 3 }}
      >
        Add Custom Round
      </Button>

      {/* Infrastructure Requirements */}
      <Box
        sx={{
          p: 2.5,
          border: "1px solid",
          borderColor: "secondary.light",
          borderRadius: 2.5,
          bgcolor: alpha("#ff6f00", 0.04),
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center" mb={2}>
          <Typography variant="subtitle2" fontWeight={700} color="secondary.dark">
            🏢 Infrastructure Requirements
          </Typography>
          <Typography variant="caption" color="text.secondary">(for on-campus rounds)</Typography>
        </Stack>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            size="small"
            type="number"
            label="Team Members Visiting"
            value={teamMembers}
            onChange={(e) => onTeamMembersChange(e.target.value)}
            helperText="Number of recruiters"
            InputProps={{ startAdornment: <PeopleOutlineIcon fontSize="small" sx={{ color: "text.disabled", mr: 0.5 }} /> }}
            sx={{ flex: 1, "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
          />
          <TextField
            size="small"
            type="number"
            label="Rooms / Labs Required"
            value={roomsRequired}
            onChange={(e) => onRoomsRequiredChange(e.target.value)}
            helperText="For tests & interviews"
            InputProps={{ startAdornment: <MeetingRoomOutlinedIcon fontSize="small" sx={{ color: "text.disabled", mr: 0.5 }} /> }}
            sx={{ flex: 1, "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
          />
        </Stack>
      </Box>
    </Box>
  );
}
