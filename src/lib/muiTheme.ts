import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#5B214F',
      light: '#7A356B',
      dark: '#3F1436',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#B76E79',
      light: '#D496A0',
      dark: '#934F5A',
      contrastText: '#ffffff',
    },
    success: {
      main: '#3F8F6B',
    },
    warning: {
      main: '#C58A3A',
    },
    error: {
      main: '#B94A48',
    },
    info: {
      main: '#7563A8',
    },
    background: {
      default: '#FCF9F7',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#241A21',
      secondary: '#6F626A',
    },
  },
  typography: {
    fontFamily: '"Manrope", "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.02em', color: '#2B1326' },
    h2: { fontWeight: 800, letterSpacing: '-0.015em', color: '#2B1326' },
    h3: { fontWeight: 700, letterSpacing: '-0.01em', color: '#2B1326' },
    h4: { fontWeight: 700, color: '#2B1326' },
    h5: { fontWeight: 600, color: '#2B1326' },
    h6: { fontWeight: 600, color: '#2B1326' },
    button: { fontWeight: 700, textTransform: 'none', letterSpacing: '0.01em' },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          padding: '10px 24px',
          fontSize: '0.875rem',
          fontWeight: 700,
          textTransform: 'none',
          boxShadow: 'none',
          transition: 'all 0.2s ease',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(91, 33, 79, 0.20)',
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'scale(0.98)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #5B214F 0%, #3F1436 100%)',
          color: '#ffffff',
          '&:hover': {
            background: 'linear-gradient(135deg, #4A1B40 0%, #2B1326 100%)',
          },
        },
        outlined: {
          borderWidth: '1.5px',
          borderColor: '#E8DDE1',
          color: '#5B214F',
          '&:hover': {
            borderWidth: '1.5px',
            borderColor: '#5B214F',
            backgroundColor: 'rgba(91, 33, 79, 0.04)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 14,
            backgroundColor: '#FFFFFF',
            '& fieldset': { borderColor: '#E8DDE1' },
            '&:hover fieldset': { borderColor: '#B76E79' },
            '&.Mui-focused fieldset': {
              borderColor: '#5B214F',
              borderWidth: '2px',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          border: '1px solid #E8DDE1',
          boxShadow: '0 12px 40px rgba(43, 19, 38, 0.06)',
          backgroundColor: '#FFFFFF',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 20,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 9999,
          fontWeight: 700,
          fontSize: '0.75rem',
          backgroundColor: '#F7F0F2',
          color: '#5B214F',
          border: '1px solid #E8DDE1',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: 700,
          textTransform: 'none',
          fontSize: '0.875rem',
          borderRadius: 12,
          color: '#6F626A',
          '&.Mui-selected': {
            color: '#5B214F',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: '#D6B36A',
          height: 3,
          borderRadius: 3,
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          backgroundColor: '#5B214F',
          color: '#ffffff',
          fontWeight: 800,
        },
      },
    },
  },
});

export default theme;
