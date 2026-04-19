"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  alpha,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

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
  { value: "ppt", label: "Pre-Placement Talk", icon: "🎤" },
  { value: "resume", label: "Resume Shortlisting", icon: "📄" },
  { value: "written_test", label: "Written Test", icon: "✍️" },
  { value: "aptitude_test", label: "Aptitude Test", icon: "🧠" },
  { value: "technical_test", label: "Technical Test", icon: "💻" },
  { value: "group_discussion", label: "Group Discussion", icon: "👥" },
  { value: "hr_interview", label: "HR Interview", icon: "🤝" },
  { value: "technical_interview", label: "Technical Interview", icon: "⚙️" },
  { value: "psychometric", label: "Psychometric Test", icon: "🧪" },
  { value: "medical", label: "Medical Test", icon: "🏥" },
  { value: "other", label: "Other", icon: "📋" },
];

const modeOptions = [
  { value: "online", label: "Online", color: "info" },
  { value: "offline", label: "Offline / On-campus", color: "success" },
  { value: "hybrid", label: "Hybrid", color: "warning" },
];

const defaultRounds: SelectionRound[] = [
  { id: "1", type: "ppt", mode: "offline", enabled: true },
  { id: "2", type: "resume", mode: "online", enabled: true },
  { id: "3", type: "aptitude_test", mode: "online", duration: 60, enabled: false },
  { id: "4", type: "technical_test", mode: "online", duration: 90, enabled: false },
  { id: "5", type: "group_discussion", mode: "offline", duration: 30, enabled: false },
  { id: "6", type: "technical_interview", mode: "offline", duration: 45, enabled: true },
  { id: "7", type: "hr_interview", mode: "offline", duration: 30, enabled: true },
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
    const updated = rounds.map((r) =>
      r.id === id ? { ...r, enabled: !r.enabled } : r
    );
    onChange(updated);
  };

  const updateRound = (id: string, field: keyof SelectionRound, val: unknown) => {
    const updated = rounds.map((r) =>
      r.id === id ? { ...r, [field]: val } : r
    );
    onChange(updated);
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
      {/* Quick Toggle Section */}
      <Paper sx={{ p: 2, mb: 3, bgcolor: "grey.50" }}>
        <Typography variant="subtitle2" fontWeight={600} mb={2}>
          Quick Selection (check to include in selection process)
        </Typography>
        <Stack direction="row" flexWrap="wrap" gap={1}>
          {rounds.map((round) => {
            const typeInfo = roundTypes.find((t) => t.value === round.type);
            return (
              <FormControlLabel
                key={round.id}
                control={
                  <Checkbox
                    checked={round.enabled}
                    onChange={() => toggleRound(round.id)}
                    size="small"
                  />
                }
                label={
                  <Typography variant="body2">
                    {typeInfo?.icon} {typeInfo?.label || round.description}
                  </Typography>
                }
                sx={{
                  bgcolor: round.enabled ? alpha("#1976d2", 0.1) : "transparent",
                  borderRadius: 1,
                  px: 1,
                  m: 0,
                  border: "1px solid",
                  borderColor: round.enabled ? "primary.main" : "divider",
                }}
              />
            );
          })}
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1} mt={2}>
          <Chip
            label={`${enabledCount} rounds selected`}
            color={enabledCount > 0 ? "primary" : "default"}
            size="small"
          />
        </Stack>
      </Paper>

      {/* Detailed Configuration */}
      <Typography variant="subtitle2" fontWeight={600} mb={2}>
        Round Details (configure mode & duration for enabled rounds)
      </Typography>
      <Stack spacing={2}>
        {rounds
          .filter((r) => r.enabled)
          .map((round, index) => {
            const typeInfo = roundTypes.find((t) => t.value === round.type);
            const modeInfo = modeOptions.find((m) => m.value === round.mode);

            return (
              <Paper
                key={round.id}
                sx={{
                  p: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  "&:hover": { borderColor: "primary.light" },
                }}
              >
                <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ md: "center" }}>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 200 }}>
                    <DragIndicatorIcon sx={{ color: "text.disabled", cursor: "grab" }} />
                    <Chip
                      label={`Round ${index + 1}`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    <Typography fontWeight={500}>
                      {typeInfo?.icon} {typeInfo?.label}
                    </Typography>
                  </Stack>

                  <FormControl size="small" sx={{ minWidth: 160 }}>
                    <InputLabel>Mode</InputLabel>
                    <Select
                      value={round.mode}
                      label="Mode"
                      onChange={(e) => updateRound(round.id, "mode", e.target.value)}
                    >
                      {modeOptions.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {round.type !== "ppt" && round.type !== "resume" && (
                    <TextField
                      size="small"
                      type="number"
                      label="Duration (mins)"
                      value={round.duration ?? ""}
                      onChange={(e) =>
                        updateRound(round.id, "duration", e.target.value ? parseInt(e.target.value) : undefined)
                      }
                      sx={{ width: 130 }}
                    />
                  )}

                  {round.type === "other" && (
                    <TextField
                      size="small"
                      label="Description"
                      value={round.description ?? ""}
                      onChange={(e) => updateRound(round.id, "description", e.target.value)}
                      sx={{ flexGrow: 1 }}
                    />
                  )}

                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => removeRound(round.id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Paper>
            );
          })}
      </Stack>

      <Button
        startIcon={<AddIcon />}
        onClick={addCustomRound}
        sx={{ mt: 2 }}
        variant="outlined"
        size="small"
      >
        Add Custom Round
      </Button>

      {/* Infrastructure Requirements */}
      <Paper sx={{ p: 2, mt: 3, bgcolor: alpha("#ff6f00", 0.05), border: "1px solid", borderColor: "secondary.light" }}>
        <Typography variant="subtitle2" fontWeight={600} mb={2} color="secondary.dark">
          🏢 Infrastructure Requirements (for on-campus rounds)
        </Typography>
        <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
          <TextField
            size="small"
            type="number"
            label="Team Members Visiting Campus"
            value={teamMembers}
            onChange={(e) => onTeamMembersChange(e.target.value)}
            helperText="Number of recruiters visiting"
            sx={{ width: 220 }}
          />
          <TextField
            size="small"
            type="number"
            label="Rooms/Labs Required"
            value={roomsRequired}
            onChange={(e) => onRoomsRequiredChange(e.target.value)}
            helperText="For tests/interviews"
            sx={{ width: 220 }}
          />
        </Stack>
      </Paper>
    </Box>
  );
}
