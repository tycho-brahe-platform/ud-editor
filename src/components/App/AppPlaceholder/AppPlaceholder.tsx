import React from 'react';
import './style.scss';

type AppPlaceholderProps = {
  children: React.ReactNode;
};

function AppPlaceholder({ children }: AppPlaceholderProps) {
  return <div className="placeholder-container">{children}</div>;
}

export default AppPlaceholder;
