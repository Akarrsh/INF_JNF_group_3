"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  FormControl,
  InputLabel,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import SchoolIcon from "@mui/icons-material/School";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import TuneIcon from "@mui/icons-material/Tune";
import { Select } from "@mui/material";

import { adminApi } from "@/lib/adminApi";
import { defaultProgrammes } from "@/components/forms/shared";

type AdminCatalogueResponse = {
  custom_branches: Array<{
    programme: string;
    branches: Array<{
      id: number;
      branch_name: string;
      is_active: boolean;
    }>;
  }>;
  branch_states: Array<{
    programme: string;
    branches: Array<{
      branch_name: string;
      is_active: boolean;
    }>;
  }>;
};

const programmeOptions = defaultProgrammes.map((programme) => programme.programme);

export default function AdminProgrammeBranchesPage() {
  const [view, setView] = useState<"custom" | "existing">("custom");
  const [selectedProgramme, setSelectedProgramme] = useState(programmeOptions[0] ?? "");
  const [branchName, setBranchName] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [customGroups, setCustomGroups] = useState<AdminCatalogueResponse["custom_branches"]>([]);
  const [existingGroups, setExistingGroups] = useState<AdminCatalogueResponse["branch_states"]>([]);

  const customCount = useMemo(
    () =>
      customGroups.reduce(
        (total, group) => total + (Array.isArray(group.branches) ? group.branches.length : 0),
        0
      ),
    [customGroups]
  );

  const existingCount = useMemo(
    () =>
      existingGroups.reduce(
        (total, group) => total + (Array.isArray(group.branches) ? group.branches.length : 0),
        0
      ),
    [existingGroups]
  );

  const loadBranches = async () => {
    setLoading(true);
    try {
      const response = await adminApi<AdminCatalogueResponse>("/admin/programme-branches");
      setCustomGroups(response.custom_branches ?? []);
      setExistingGroups(response.branch_states ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load branch catalogue.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBranches();
  }, []);

  const handleAddBranch = async () => {
    if (!selectedProgramme || !branchName.trim()) {
      setError("Please select a programme and enter a branch name.");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await adminApi("/admin/programme-branches", {
        method: "POST",
        body: JSON.stringify({
          programme_name: selectedProgramme,
          branch_name: branchName.trim(),
        }),
      });
      setSuccess("Custom branch added successfully.");
      setBranchName("");
      await loadBranches();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to add custom branch.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCustomBranch = async (id: number, label: string) => {
    if (!window.confirm(`Delete ${label}?`)) {
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await adminApi(`/admin/programme-branches/${id}`, {
        method: "DELETE",
      });
      setSuccess("Custom branch deleted successfully.");
      await loadBranches();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete custom branch.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleExistingBranch = async (
    programmeName: string,
    branchNameValue: string,
    nextActive: boolean
  ) => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await adminApi("/admin/programme-branches/status", {
        method: "PATCH",
        body: JSON.stringify({
          programme_name: programmeName,
          branch_name: branchNameValue,
          is_active: nextActive,
        }),
      });
      setSuccess(
        `${branchNameValue} marked as ${nextActive ? "active" : "inactive"}.`
      );
      await loadBranches();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update branch status.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ pb: 6, maxWidth: 1000, mx: "auto" }}>
      {/* Page header */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" spacing={1.5} alignItems="center" mb={0.5}>
          <TuneIcon color="primary" />
          <Typography variant="h4" fontWeight={800} color="text.primary" letterSpacing="-0.02em">
            Programme Branch Manager
          </Typography>
        </Stack>
        <Typography variant="body1" color="text.secondary">
          Add custom branches or activate/deactivate built-in branches for eligibility forms
        </Typography>
      </Box>

      {error && <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" onClose={() => setSuccess(null)} sx={{ mb: 3, borderRadius: 2 }}>{success}</Alert>}

      {/* Tab switcher */}
      <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 3, mb: 3 }}>
        <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
            <Button
              fullWidth
              variant={view === "custom" ? "contained" : "outlined"}
              onClick={() => setView("custom")}
              startIcon={<AddCircleOutlineIcon />}
              sx={{ borderRadius: 2, fontWeight: 700, py: 1.25 }}
            >
              Custom Branches
              <Chip label={customCount} size="small" sx={{ ml: 1, height: 20, fontWeight: 800, bgcolor: view === "custom" ? "rgba(255,255,255,0.25)" : undefined }} />
            </Button>
            <Button
              fullWidth
              variant={view === "existing" ? "contained" : "outlined"}
              onClick={() => setView("existing")}
              startIcon={<SchoolIcon />}
              sx={{ borderRadius: 2, fontWeight: 700, py: 1.25 }}
            >
              Existing Branches
              <Chip label={existingCount} size="small" sx={{ ml: 1, height: 20, fontWeight: 800, bgcolor: view === "existing" ? "rgba(255,255,255,0.25)" : undefined }} />
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {view === "custom" ? (
        <Stack spacing={3}>
          {/* Add branch form */}
          <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 3 }}>
            <Box sx={{ px: 3, py: 2.5, borderBottom: "1px solid #f1f5f9", bgcolor: "#f8fafc", borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <PlaylistAddIcon color="primary" fontSize="small" />
                <Typography variant="subtitle1" fontWeight={700}>Add Custom Branch</Typography>
              </Stack>
            </Box>
            <CardContent sx={{ p: 3 }}>
              <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ md: "flex-end" }}>
                <FormControl fullWidth>
                  <InputLabel>Select Programme</InputLabel>
                  <Select
                    value={selectedProgramme}
                    label="Select Programme"
                    onChange={(e) => setSelectedProgramme(String(e.target.value))}
                    sx={{ borderRadius: 2 }}
                  >
                    {programmeOptions.map((programme) => (
                      <MenuItem key={programme} value={programme}>
                        {programme}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Branch Name"
                  placeholder="e.g., Artificial Intelligence and Data Science"
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && void handleAddBranch()}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />

                <Button
                  variant="contained"
                  startIcon={<PlaylistAddIcon />}
                  onClick={handleAddBranch}
                  disabled={saving}
                  sx={{ borderRadius: 2, px: 4, fontWeight: 700, height: 56, whiteSpace: "nowrap" }}
                >
                  {saving ? "Adding…" : "Add Branch"}
                </Button>
              </Stack>
            </CardContent>
          </Card>

          {/* Custom branches list */}
          <Box>
            {loading ? (
              <Typography color="text.secondary" sx={{ py: 3 }}>Loading catalogue…</Typography>
            ) : customGroups.length === 0 ? (
              <Card elevation={0} sx={{ border: "1px dashed #e2e8f0", borderRadius: 3 }}>
                <CardContent sx={{ textAlign: "center", py: 6 }}>
                  <PlaylistAddIcon sx={{ fontSize: 48, color: "text.disabled", mb: 2 }} />
                  <Typography color="text.secondary" fontWeight={600}>No custom branches yet</Typography>
                  <Typography variant="body2" color="text.disabled" mt={0.5}>
                    Use the form above to add your first custom branch.
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              <Stack spacing={2}>
                {customGroups.map((group) => (
                  <Card key={group.programme} elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 3 }}>
                    <CardContent sx={{ p: 3 }}>
                      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                        <SchoolIcon color="primary" fontSize="small" />
                        <Typography fontWeight={700}>{group.programme}</Typography>
                        <Chip label={`${(Array.isArray(group.branches) ? group.branches : []).length} branches`} size="small" color="primary" variant="outlined" sx={{ fontWeight: 600 }} />
                      </Stack>
                      <Stack direction="row" flexWrap="wrap" gap={1}>
                        {(Array.isArray(group.branches) ? group.branches : []).map((branch) => (
                          <Chip
                            key={`${group.programme}-${branch.id}`}
                            label={branch.branch_name}
                            size="small"
                            color={branch.is_active ? "success" : "default"}
                            variant={branch.is_active ? "filled" : "outlined"}
                            onDelete={() =>
                              handleDeleteCustomBranch(
                                branch.id,
                                `${group.programme} - ${branch.branch_name}`
                              )
                            }
                            deleteIcon={
                              <Tooltip title="Delete branch">
                                <DeleteOutlineIcon fontSize="small" />
                              </Tooltip>
                            }
                            sx={{ fontWeight: 600 }}
                          />
                        ))}
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            )}
          </Box>
        </Stack>
      ) : (
        <Stack spacing={2}>
          {loading ? (
            <Typography color="text.secondary" sx={{ py: 3 }}>Loading branch states…</Typography>
          ) : (
            defaultProgrammes.map((programme) => {
              const matchedGroup = existingGroups.find(
                (group) => group.programme === programme.programme
              );
              const stateMap = new Map(
                (Array.isArray(matchedGroup?.branches) ? matchedGroup?.branches : []).map((branch) => [branch.branch_name, branch.is_active])
              );

              return (
                <Card key={programme.programme} elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 3 }}>
                  <Box sx={{ px: 3, py: 2, borderBottom: "1px solid #f1f5f9", bgcolor: "#f8fafc", borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <SchoolIcon color="secondary" fontSize="small" />
                      <Typography fontWeight={700}>{programme.programme}</Typography>
                      <Chip
                        label={`${programme.branches.filter((b) => (stateMap.get(b.branch) ?? true)).length} active`}
                        size="small"
                        color="success"
                        variant="outlined"
                        sx={{ fontWeight: 600 }}
                      />
                    </Stack>
                  </Box>
                  <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" flexWrap="wrap" gap={1}>
                      {programme.branches.map((branch) => {
                        const isActive = stateMap.get(branch.branch) ?? true;

                        return (
                          <Tooltip
                            key={`${programme.programme}-${branch.branch}`}
                            title={isActive ? "Click to deactivate" : "Click to activate"}
                          >
                            <Chip
                              label={branch.branch}
                              color={isActive ? "success" : "default"}
                              variant={isActive ? "filled" : "outlined"}
                              icon={isActive ? <ToggleOnIcon /> : <ToggleOffIcon />}
                              onClick={() =>
                                handleToggleExistingBranch(
                                  programme.programme,
                                  branch.branch,
                                  !isActive
                                )
                              }
                              sx={{ cursor: "pointer", fontWeight: 600, transition: "all 0.2s", "&:hover": { opacity: 0.8 } }}
                            />
                          </Tooltip>
                        );
                      })}
                    </Stack>
                  </CardContent>
                </Card>
              );
            })
          )}
        </Stack>
      )}
    </Box>
  );
}
