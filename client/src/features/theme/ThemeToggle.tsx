import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { toggleTheme } from './themeSlice';
import styles from './ThemeToggle.module.css';

export const ThemeToggle: React.FC = () => {
  const dispatch = useAppDispatch();
  const mode = useAppSelector((state) => state.theme.mode);

  return (
    <button
      className={styles.button}
      onClick={() => dispatch(toggleTheme())}
      title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
    >
      {mode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
};
