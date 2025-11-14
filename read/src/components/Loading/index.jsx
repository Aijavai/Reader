import React from 'react';
import { Loading as VantLoading } from 'react-vant';

const Loading = () => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: 'var(--bg-color)'
    }}>
      <VantLoading size="24px" color="#ff6b35" />
    </div>
  );
};

export default Loading;
