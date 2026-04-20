'use client';

import { createTheme, alpha } from '@mui/material/styles';

// IIT ISM Dhanbad — Premium Institutional Design System
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1a3a5c',       // Deep navy — authority & trust
      light: '#2c5282',
      dark: '#0f2340',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#c47c2a',       // Refined amber-gold — premium accent
      light: '#d4952f',
      dark: '#9e6222',
      contrastText: '#ffffff',
    },
    error: {
      main: '#c0392b',
      light: '#e74c3c',
      dark: '#922b21',
    },
    warning: {
      main: '#d68910',
      light: '#f0a500',
      dark: '#b7770d',
    },
    info: {
      main: '#1a6fa0',
      light: '#2e86c1',
      dark: '#154360',
    },
    success: {
      main: '#1e6b45',
      light: '#27ae60',
      dark: '#145a32',
    },
    grey: {
      50:  '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    background: {
      default: '#f8fafc',
      paper:   '#ffffff',
    },
    text: {
      primary:   '#1e293b',
      secondary: '#475569',
      disabled:  '#94a3b8',
    },
    divider: '#e2e8f0',
  },

  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      'sans-serif',
    ].join(','),
    h1: { fontSize: '2.25rem', fontWeight: 700, lineHeight: 1.25, letterSpacing: '-0.02em' },
    h2: { fontSize: '1.875rem', fontWeight: 700, lineHeight: 1.3,  letterSpacing: '-0.015em' },
    h3: { fontSize: '1.5rem',  fontWeight: 600, lineHeight: 1.35, letterSpacing: '-0.01em' },
    h4: { fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.4  },
    h5: { fontSize: '1.1rem',  fontWeight: 600, lineHeight: 1.45 },
    h6: { fontSize: '0.975rem',fontWeight: 600, lineHeight: 1.5  },
    subtitle1: { fontSize: '0.9375rem', fontWeight: 500, lineHeight: 1.5 },
    subtitle2: { fontSize: '0.875rem',  fontWeight: 600, lineHeight: 1.5, color: '#475569' },
    body1: { fontSize: '0.9375rem', lineHeight: 1.65, color: '#1e293b' },
    body2: { fontSize: '0.875rem',  lineHeight: 1.6,  color: '#334155' },
    caption: { fontSize: '0.75rem', lineHeight: 1.5, color: '#64748b', letterSpacing: '0.01em' },
    overline: { fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' },
    button: { fontWeight: 600, letterSpacing: '0.01em' },
  },

  shape: { borderRadius: 10 },

  spacing: 8,

  shadows: [
    'none',
    '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    '0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.08)',
    '0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.07)',
    '0 6px 10px -2px rgb(0 0 0 / 0.08), 0 3px 6px -3px rgb(0 0 0 / 0.08)',
    '0 10px 15px -3px rgb(0 0 0 / 0.07), 0 4px 6px -4px rgb(0 0 0 / 0.07)',
    '0 12px 20px -4px rgb(0 0 0 / 0.08), 0 4px 8px -4px rgb(0 0 0 / 0.07)',
    '0 16px 24px -4px rgb(0 0 0 / 0.08), 0 6px 10px -4px rgb(0 0 0 / 0.07)',
    '0 20px 28px -5px rgb(0 0 0 / 0.09)',
    '0 24px 32px -6px rgb(0 0 0 / 0.09)',
    '0 28px 36px -6px rgb(0 0 0 / 0.1)',
    '0 32px 40px -7px rgb(0 0 0 / 0.1)',
    '0 36px 44px -7px rgb(0 0 0 / 0.1)',
    '0 40px 48px -8px rgb(0 0 0 / 0.11)',
    '0 44px 52px -8px rgb(0 0 0 / 0.11)',
    '0 48px 56px -9px rgb(0 0 0 / 0.11)',
    '0 52px 60px -9px rgb(0 0 0 / 0.12)',
    '0 56px 64px -9px rgb(0 0 0 / 0.12)',
    '0 60px 68px -10px rgb(0 0 0 / 0.12)',
    '0 64px 72px -10px rgb(0 0 0 / 0.13)',
    '0 68px 76px -10px rgb(0 0 0 / 0.13)',
    '0 72px 80px -11px rgb(0 0 0 / 0.13)',
    '0 76px 84px -11px rgb(0 0 0 / 0.14)',
    '0 80px 88px -12px rgb(0 0 0 / 0.14)',
    '0 84px 92px -12px rgb(0 0 0 / 0.15)',
  ],

  components: {
    // ── AppBar ──────────────────────────────────────────────
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#1e293b',
          boxShadow: 'none',
          borderBottom: '1px solid #e2e8f0',
        },
      },
    },

    // ── Button ──────────────────────────────────────────────
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          letterSpacing: '0.01em',
          transition: 'all 0.18s ease',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgb(0 0 0 / 0.15)',
            transform: 'translateY(-1px)',
          },
          '&:active': { transform: 'translateY(0)' },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': { borderWidth: '1.5px', backgroundColor: alpha('#1a3a5c', 0.04) },
        },
        text: {
          '&:hover': { backgroundColor: alpha('#1a3a5c', 0.06) },
        },
        sizeLarge: { padding: '10px 24px', fontSize: '0.9375rem' },
        sizeMedium: { padding: '8px 20px', fontSize: '0.875rem' },
        sizeSmall: { padding: '5px 14px', fontSize: '0.8125rem' },
      },
    },

    // ── Card ────────────────────────────────────────────────
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          border: '1px solid #e2e8f0',
          borderRadius: 12,
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.06)',
          transition: 'box-shadow 0.2s ease, transform 0.2s ease',
          '&:hover': {
            boxShadow: '0 6px 16px -4px rgb(0 0 0 / 0.1)',
          },
        },
      },
    },

    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '20px 24px',
          '&:last-child': { paddingBottom: '20px' },
        },
      },
    },

    // ── Paper ───────────────────────────────────────────────
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        rounded: { borderRadius: 12 },
        outlined: { borderColor: '#e2e8f0' },
      },
    },

    // ── TextField / Input ───────────────────────────────────
    MuiTextField: {
      defaultProps: { variant: 'outlined' },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: '#ffffff',
            fontSize: '0.9375rem',
            transition: 'box-shadow 0.18s ease',
            '& fieldset': { borderColor: '#cbd5e1', borderWidth: '1.5px' },
            '&:hover fieldset': { borderColor: '#94a3b8' },
            '&.Mui-focused': {
              boxShadow: `0 0 0 3px ${alpha('#1a3a5c', 0.12)}`,
            },
            '&.Mui-focused fieldset': { borderColor: '#1a3a5c', borderWidth: '1.5px' },
            '&.Mui-error fieldset': { borderColor: '#c0392b' },
            '&.Mui-error.Mui-focused': {
              boxShadow: `0 0 0 3px ${alpha('#c0392b', 0.12)}`,
            },
          },
          '& .MuiInputLabel-root': {
            fontSize: '0.9rem',
            color: '#64748b',
            '&.Mui-focused': { color: '#1a3a5c' },
          },
          '& .MuiFormHelperText-root': { fontSize: '0.8rem', marginTop: 4 },
        },
      },
    },

    MuiSelect: {
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },

    // ── Chip / Badge ────────────────────────────────────────
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: '0.75rem',
          borderRadius: 6,
          height: 26,
          letterSpacing: '0.01em',
        },
        sizeSmall: { height: 22, fontSize: '0.7rem' },
        colorSuccess: {
          backgroundColor: alpha('#1e6b45', 0.1),
          color: '#1e6b45',
          border: `1px solid ${alpha('#1e6b45', 0.25)}`,
        },
        colorError: {
          backgroundColor: alpha('#c0392b', 0.08),
          color: '#c0392b',
          border: `1px solid ${alpha('#c0392b', 0.2)}`,
        },
        colorWarning: {
          backgroundColor: alpha('#d68910', 0.1),
          color: '#b7770d',
          border: `1px solid ${alpha('#d68910', 0.25)}`,
        },
        colorInfo: {
          backgroundColor: alpha('#1a6fa0', 0.08),
          color: '#1a6fa0',
          border: `1px solid ${alpha('#1a6fa0', 0.2)}`,
        },
        colorDefault: {
          backgroundColor: '#f1f5f9',
          color: '#475569',
          border: '1px solid #e2e8f0',
        },
      },
    },

    // ── Table ───────────────────────────────────────────────
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            backgroundColor: '#f8fafc',
            color: '#475569',
            fontWeight: 600,
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            borderBottom: '2px solid #e2e8f0',
            padding: '10px 16px',
          },
        },
      },
    },

    MuiTableBody: {
      styleOverrides: {
        root: {
          '& .MuiTableRow-root': {
            '&:hover': { backgroundColor: '#f8fafc' },
            '&:last-child .MuiTableCell-body': { borderBottom: 'none' },
          },
          '& .MuiTableCell-body': {
            borderColor: '#f1f5f9',
            fontSize: '0.875rem',
            padding: '12px 16px',
            color: '#334155',
          },
        },
      },
    },

    // ── Alert ───────────────────────────────────────────────
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontSize: '0.875rem',
          fontWeight: 500,
          alignItems: 'center',
        },
        standardSuccess: { backgroundColor: alpha('#1e6b45', 0.08), color: '#1e6b45' },
        standardError:   { backgroundColor: alpha('#c0392b', 0.07), color: '#922b21' },
        standardWarning: { backgroundColor: alpha('#d68910', 0.08), color: '#9e6222' },
        standardInfo:    { backgroundColor: alpha('#1a6fa0', 0.08), color: '#154360' },
      },
    },

    // ── Divider ─────────────────────────────────────────────
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: '#e2e8f0' },
      },
    },

    // ── Tooltip ─────────────────────────────────────────────
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#1e293b',
          color: '#f8fafc',
          fontSize: '0.75rem',
          borderRadius: 6,
          padding: '6px 12px',
        },
        arrow: { color: '#1e293b' },
      },
    },

    // ── LinearProgress ──────────────────────────────────────
    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 4, height: 4 },
      },
    },

    // ── Dialog ──────────────────────────────────────────────
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          boxShadow: '0 24px 48px -12px rgb(0 0 0 / 0.18)',
        },
      },
    },

    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: '1.1rem',
          fontWeight: 700,
          paddingBottom: 8,
          color: '#1e293b',
        },
      },
    },

    // ── IconButton ──────────────────────────────────────────
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: 'background-color 0.15s ease, transform 0.15s ease',
          '&:hover': { transform: 'scale(1.05)' },
        },
      },
    },

    // ── List / Menu ─────────────────────────────────────────
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontSize: '0.875rem',
          margin: '1px 4px',
          '&.Mui-selected': {
            backgroundColor: alpha('#1a3a5c', 0.08),
            fontWeight: 600,
          },
          '&:hover': { backgroundColor: '#f1f5f9' },
        },
      },
    },

    // ── Skeleton ────────────────────────────────────────────────
    MuiSkeleton: {
      defaultProps: { animation: 'wave' },
      styleOverrides: {
        root: { borderRadius: 6 },
        wave: {
          '&::after': {
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
          },
        },
      },
    },

    // ── CircularProgress ────────────────────────────────────────
    MuiCircularProgress: {
      styleOverrides: {
        root: { animationDuration: '0.7s' },
      },
    },

    // ── Switch ──────────────────────────────────────────────────
    MuiSwitch: {
      styleOverrides: {
        root: { borderRadius: 12 },
        thumb: { boxShadow: '0 1px 3px rgb(0 0 0 / 0.2)' },
        track: {
          borderRadius: 12,
          opacity: 0.35,
        },
        switchBase: {
          transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
        },
      },
    },

    // ── Checkbox ────────────────────────────────────────────────
    MuiCheckbox: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          transition: 'color 0.15s ease',
        },
      },
    },

    // ── Badge ───────────────────────────────────────────────────
    MuiBadge: {
      styleOverrides: {
        badge: {
          fontWeight: 700,
          fontSize: '0.65rem',
          height: 18,
          minWidth: 18,
          padding: '0 4px',
        },
      },
    },

    // ── Tabs ────────────────────────────────────────────────────
    MuiTabs: {
      styleOverrides: {
        root: { minHeight: 44 },
        indicator: { height: 2.5, borderRadius: '2px 2px 0 0' },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: 44,
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.875rem',
          letterSpacing: 0,
          transition: 'color 0.15s ease, background-color 0.15s ease',
          '&:hover': { backgroundColor: alpha('#1a3a5c', 0.04) },
        },
      },
    },

    // ── DialogActions ────────────────────────────────────────────
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '16px 24px',
          gap: 8,
          '& .MuiButton-root': { minWidth: 88 },
        },
      },
    },

    // ── DialogContent ───────────────────────────────────────────
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '16px 24px',
          color: '#334155',
          lineHeight: 1.7,
        },
      },
    },

    // ── List ────────────────────────────────────────────────────
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: 'background-color 0.15s ease',
          '&.Mui-selected': {
            backgroundColor: alpha('#1a3a5c', 0.08),
            '&:hover': { backgroundColor: alpha('#1a3a5c', 0.12) },
          },
        },
      },
    },

    // ── Snackbar ────────────────────────────────────────────
    MuiSnackbar: {
      styleOverrides: {
        root: { '& .MuiAlert-root': { boxShadow: '0 8px 24px -4px rgb(0 0 0 / 0.15)' } },
      },
    },
  },
});

export default theme;
