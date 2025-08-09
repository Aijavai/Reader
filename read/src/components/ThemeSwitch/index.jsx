import React from 'react';
import { Switch } from 'react-vant';
import { useAppStore } from '../../store/useAppStore';
import './index.css';

const ThemeSwitch = ({ showLabel = true }) => {
  const { theme, setTheme } = useAppStore();
  
  const handleThemeChange = (checked) => {
    setTheme(checked ? 'dark' : 'light');
  };
  
  return (
    <div className="theme-switch">
      {showLabel && (
        <div className="theme-switch-label">
          <span className="theme-icon">🌙</span>
          <span className="theme-text">夜间模式</span>
        </div>
      )}
      <Switch
        checked={theme === 'dark'}
        onChange={handleThemeChange}
        size="20px"
        activeColor="#1989fa"
        inactiveColor="#ddd"
      />
    </div>
  );
};

export default ThemeSwitch;