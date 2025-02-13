import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Initialiser le thème au chargement de la page
const initializeTheme = () => {
  const root = window.document.documentElement;
  root.classList.remove('light', 'dark'); // Nettoyer les classes existantes
  
  const savedTheme = localStorage.getItem('theme');
  
  if (!savedTheme || savedTheme === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    root.classList.add(systemTheme);
    localStorage.setItem('theme', 'system');
  } else {
    root.classList.add(savedTheme);
  }
};

// S'assurer que le thème est initialisé avant le rendu
initializeTheme();

// Écouter les changements de préférences système
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
mediaQuery.addEventListener('change', () => {
  const theme = localStorage.getItem('theme');
  if (theme === 'system') {
    initializeTheme();
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);