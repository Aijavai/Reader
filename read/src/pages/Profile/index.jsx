import './index.css';
import React, { useState } from 'react';
import { 
  Button,
   Image, 
   Grid, 
   Cell, 
   Badge, 
   Popup,
   ActionSheet,
   Toast
  } from 'react-vant';
import useTitle from '@/hooks/useTitle';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import ThemeSwitch from '@/components/ThemeSwitch';
import {
  generateAvatar
} from '@/llm'

const Profile = () => {
  const navigate = useNavigate();
  const { readingHistory, bookshelfBooks } = useAppStore();
  const [showRechargePopup, setShowRechargePopup] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [loading, setLoading] = useState(false);
  // 用户信息
  const [userInfo,setUserInfo] = useState({
    avatar: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    nickname: 'admin',
    coins: 99,
    beans: 0,
    coupons: 0,
    isVip: false
  });
  useTitle('我的')
  
  const actions = [
     {
            name: 'AI生成头像',
            color: '#123123',
            type: 1,
            callback: () => handleAction({type: 1})
        },
        {
            name: '上传头像',
            color: '#ee0a24',
            type: 2,
            callback: () => handleAction({type: 2})
        }
  ]
  // 功能菜单
  const functionMenus = [
    {
      id: 1,
      name: '签到',
      icon: '🎁',
      color: '#ff4444',
      badge: true
    },
    {
      id: 2,
      name: '阅历',
      icon: '📚',
      color: '#4285f4'
    },
    {
      id: 3,
      name: '购物车',
      icon: '🛒',
      color: '#ff9500'
    },
    {
      id: 4,
      name: '消息',
      icon: '💬',
      color: '#8e44ad'
    }
  ];
  
  // 个人功能列表
  const personalMenus = [
    {
      id: 1,
      name: '最近阅读',
      icon: '�',
      arrow: true,
      count: readingHistory.length,
      action: () => navigate('/reading-history')
    },
    {
      id: 2,
      name: '我的书架',
      icon: '�',
      arrow: true,
      count: bookshelfBooks.length,
      action: () => navigate('/bookshelf')
    },
    {
      id: 3,
      name: '搜索历史',
      icon: '🔍',
      arrow: true,
      action: () => navigate('/search-history')
    },
    {
      id: 4,
      name: '设置',
      icon: '⚙️',
      arrow: true,
      action: () => navigate('/settings')
    },
    {
      id: 5,
      name: '意见反馈',
      icon: '💬',
      arrow: true
    }
  ];
  
  const handleMenuClick = (menu) => {
    if (menu.action) {
      menu.action();
    } else {
      console.log('点击菜单:', menu.name);
    }
  };
  
  const handleRecharge = () => {
    setShowRechargePopup(true);
  };
  // 在handleAction函数中
  const handleAction = async (action) => {
    if (action.type === 1) {
      try {
        setLoading(true);
        console.log('正在生成AI头像...');
        
        // Toast.show({
        //   content: '正在生成AI头像...',
        //   duration: 2000
        // });
        
        const result = await generateAvatar(userInfo.nickname || '用户');
        
        if (result.code === 0) {
          setUserInfo(prev => ({
            ...prev,
            avatar: result.data.imageUrl
          }));
          
          // Toast.show({
          //   content: `头像生成成功！来源：${result.source === 'doubao' ? '豆包AI' : '默认生成'}`,
          //   duration: 2000
          // });
          
          // 调试信息
  
        } else {
          throw new Error('生成失败');
        }
      } catch (error) {
        console.error('AI头像生成失败:', error);
        // Toast.show({
        //   content: '头像生成失败，请稍后重试',
        //   duration: 2000
        // });
      } finally {
        setLoading(false);
        setShowActionSheet(false);
      }
    }
    else if (action.type === 2) {
      // 上传头像
    } 
  
  };
  
  
  
  return (
    <div className="profile-page">
      
      {/* 用户信息区域 */}
      <div className="user-info-section">
        <div className="user-avatar">
          <Image 
            src={userInfo.avatar}
            width="60"
            height="60"
            fit="cover"
            round
            className="avatar-image"
            onClick={() => setShowActionSheet(true)}
          />
        </div>
        <div className="user-nickname">{userInfo.nickname}</div>
        
        {/* 资产统计 */}
        <div className="assets-stats">
          <div className="asset-item">
            <div className="asset-number">{userInfo.coins}</div>
            <div className="asset-label">书币</div>
          </div>
          <div className="asset-item">
            <div className="asset-number">{userInfo.beans}</div>
            <div className="asset-label">书豆</div>
          </div>
          <div className="asset-item">
            <div className="asset-number">{userInfo.coupons}</div>
            <div className="asset-label">优惠券</div>
          </div>
          <Button 
            className="recharge-btn" 
            size="small" 
            color="#ff6b35"
            round
            onClick={handleRecharge}
          >
            充值
          </Button>
        </div>
      </div>
      
      {/* VIP区域 */}
      <div className="vip-section">
        <div className="vip-content">
          <span className="vip-label">VIP</span>
          <span className="vip-desc">立即开通，万本好书免费读</span>
        </div>
        <div className="vip-arrow">›</div>
      </div>
      
      {/* 功能菜单 */}
      <div className="function-menu-section">
        <div className="menu-grid">
          {functionMenus.map(menu => (
            <div 
              key={menu.id} 
              className="menu-item"
              onClick={() => handleMenuClick(menu)}
            >
              <div className="menu-icon-wrapper">
                <span className="menu-icon" style={{ backgroundColor: menu.color }}>
                  {menu.icon}
                </span>
                {menu.badge && <div className="menu-badge"></div>}
              </div>
              <div className="menu-name">{menu.name}</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* 个人功能列表 */}
      <div className="personal-menu-section">
        {personalMenus.map(menu => (
          <Cell
            key={menu.id}
            title={menu.name}
            value={menu.count !== undefined ? `${menu.count}` : ''}
            icon={<span className="cell-icon">{menu.icon}</span>}
            isLink={menu.arrow}
            onClick={() => handleMenuClick(menu)}
            className="personal-menu-item"
          />
        ))}
      </div>
      
      {/* 充值弹窗 */}
      <Popup
        visible={showRechargePopup}
        onClose={() => setShowRechargePopup(false)}
        position="bottom"
        round
      >
        <div className="recharge-popup">
          <div className="popup-title">充值中心</div>
          <div className="popup-content">
            <p>充值功能开发中...</p>
          </div>
          <Button 
            block 
            type="primary" 
            color="#ff6b35"
            onClick={() => setShowRechargePopup(false)}
          >
            确定
          </Button>
        </div>
      </Popup>
      {/* 更新头像弹窗 */}
      <ActionSheet
        visible={showActionSheet}
        actions={actions}
        onSelect={handleAction}
        cancelText='取消'
        onCancel={() => setShowActionSheet(false)}
      />
    </div>
  );
};

export default Profile;