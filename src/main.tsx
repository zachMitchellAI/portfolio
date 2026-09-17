import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import CssBaseline from '@mui/material/CssBaseline'
import ColorModeProvider from './components/ColorModeProvider'
import App from './App.tsx'

// ColorModeProvider already mounts MUI's ThemeProvider (css-vars path, default
// mode "system") internally, so the chain here is simply:
//   StrictMode > ColorModeProvider > CssBaseline + App
// The Vite scaffold `index.css` import was removed on purpose: its
// `body { display: grid; place-items: center }` / `main { text-align: center }`
// rules fight the full-width sticky header and page layout. CssBaseline and the
// theme's generated stylesheets handle all resets instead.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ColorModeProvider>
      <CssBaseline />
      <App />
    </ColorModeProvider>
  </StrictMode>,
)
