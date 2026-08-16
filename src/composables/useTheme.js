import { computed, ref } from 'vue';

const STORAGE_KEY = 'kumo-color-theme';
const getInitialTheme = () => {
  if (typeof window === 'undefined') return false;

  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved === 'dark') return true;
  if (saved === 'light') return false;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
};

const isDark = ref(getInitialTheme());

export function useTheme() {
  const setTheme = (dark) => {
    isDark.value = dark;
    window.localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
  };

  return {
    isDark: computed(() => isDark.value),
    themeLabel: computed(() => isDark.value ? 'Switch to light mode' : 'Switch to dark mode'),
    toggleTheme: () => setTheme(!isDark.value),
  };
}
