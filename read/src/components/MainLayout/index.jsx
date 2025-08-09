import React from 'react';
import { Outlet } from 'react-router-dom';
import { Tabbar } from 'react-vant';
import { WapHomeO, AppsO, Records, ManagerO } from '@react-vant/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import './index.css';

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('home')) return 'home';
    if (path.includes('category')) return 'category';
    if (path.includes('bookshelf')) return 'bookshelf';
    if (path.includes('profile')) return 'profile';
    return 'home';
  };

  return (
    <div className="main-layout">
      <div className="main-content">
        <Outlet />
      </div>
      <Tabbar
        value={getActiveTab()}
        onChange={(value) => navigate(`/${value}`)}
        fixed
        placeholder
        safeAreaInsetBottom
        activeColor="#ff6b35"
        inactiveColor="#7d7e80"
        border
      >
        <Tabbar.Item
          name="home"
          icon={<WapHomeO />}
          dot={false}
        >
          <span>书城</span>
        </Tabbar.Item>
        <Tabbar.Item
          name="category"
          icon={<AppsO />}
        >
          <span>分类</span>
        </Tabbar.Item>
        <Tabbar.Item
          name="bookshelf"
          icon={<Records />}
          badge={null}
        >
          <span>书架</span>
        </Tabbar.Item>
        <Tabbar.Item
          name="profile"
          icon={<ManagerO />}
          badge="Hot"
        >
          <span>我的</span>
        </Tabbar.Item>
      </Tabbar>
    </div>
  );
};

export default MainLayout;