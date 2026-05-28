import './index.css';
import { useState } from 'react';
import {
  Button,
  Image,
  Cell,
  Popup,
  ActionSheet,
  Toast,
  Loading
} from 'react-vant';
import useTitle from '@/hooks/useTitle';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import ThemeSwitch from '@/components/ThemeSwitch';
import { generateAvatar } from '@/llm';

// 阅读统计图表组件
function ReadingStatsChart({ readingHistory, bookshelfBooks }) {
  const totalBooks = readingHistory.length;
  const shelfBooks = bookshelfBooks.length;
  const finishedBooks = readingHistory.filter(b => (b.percent || 0) >= 90).length;
  const inProgressBooks = totalBooks - finishedBooks;

  // 近7天阅读分布（模拟数据 + 真实阅读时间）
  const days = ['一', '二', '三', '四', '五', '六', '日'];
  const now = Date.now();
  const weekData = days.map((_, i) => {
    const dayStart = now - (6 - i) * 86400000;
    const dayEnd = dayStart + 86400000;
    const count = readingHistory.filter(b => b.readTime >= dayStart && b.readTime < dayEnd).length;
    return { day: days[i], count: count + Math.floor(Math.random() * 2) };
  });
  const maxCount = Math.max(...weekData.map(d => d.count), 1);

  // 分类分布
  const tagMap = {};
  readingHistory.forEach(b => {
    const tag = b.category || b.tag || '其他';
    tagMap[tag] = (tagMap[tag] || 0) + 1;
  });
  const tagList = Object.entries(tagMap).sort((a, b) => b[1] - a[1]).slice(0, 4);
  const tagColors = ['#ff6b35', '#4285f4', '#34a853', '#fbbc04'];
  const tagTotal = tagList.reduce((s, [, c]) => s + c, 0) || 1;

  if (totalBooks === 0) return null;

  return (
    <div className="stats-chart-section">
      <div className="stats-title">📊 阅读统计</div>

      {/* 数字摘要 */}
      <div className="stats-summary">
        <div className="stat-card">
          <div className="stat-num" style={{ color: '#ff6b35' }}>{totalBooks}</div>
          <div className="stat-desc">已读书籍</div>
        </div>
        <div className="stat-card">
          <div className="stat-num" style={{ color: '#4285f4' }}>{shelfBooks}</div>
          <div className="stat-desc">书架收藏</div>
        </div>
        <div className="stat-card">
          <div className="stat-num" style={{ color: '#34a853' }}>{finishedBooks}</div>
          <div className="stat-desc">读完</div>
        </div>
        <div className="stat-card">
          <div className="stat-num" style={{ color: '#fbbc04' }}>{inProgressBooks}</div>
          <div className="stat-desc">在读</div>
        </div>
      </div>

      {/* 近7天柱状图 */}
      <div className="chart-block">
        <div className="chart-label">近7天阅读活跃度</div>
        <div className="bar-chart">
          {weekData.map((d, i) => (
            <div key={i} className="bar-item">
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{
                    height: `${Math.max((d.count / maxCount) * 100, d.count > 0 ? 12 : 0)}%`,
                    background: i === 6 ? '#ff6b35' : 'linear-gradient(180deg,#ff9a5c,#ff6b35)',
                    opacity: d.count === 0 ? 0.15 : 1,
                  }}
                />
              </div>
              <div className="bar-day">{d.day}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 类型分布水平条 */}
      {tagList.length > 0 && (
        <div className="chart-block">
          <div className="chart-label">阅读类型分布</div>
          <div className="genre-bar">
            {tagList.map(([tag, count], i) => (
              <div
                key={tag}
                className="genre-seg"
                style={{ width: `${(count / tagTotal) * 100}%`, background: tagColors[i] }}
                title={`${tag}: ${count}本`}
              />
            ))}
          </div>
          <div className="genre-legend">
            {tagList.map(([tag, count], i) => (
              <div key={tag} className="legend-item">
                <span className="legend-dot" style={{ background: tagColors[i] }} />
                <span className="legend-name">{tag}</span>
                <span className="legend-pct">{Math.round((count / tagTotal) * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const Profile = () => {
  const navigate = useNavigate();
  const { readingHistory, bookshelfBooks } = useAppStore();
  const [showRechargePopup, setShowRechargePopup] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({
    avatar: 'https://img2.doubanio.com/icon/u209607770-1.jpg',
    nickname: 'admin',
    coins: 99,
    beans: 0,
    coupons: 0,
    isVip: false
  });
  useTitle('我的');

  const actions = [
    {
      name: 'AI生成头像',
      color: '#ff6b35',
      type: 1,
      callback: () => handleAction({ type: 1 })
    },
    {
      name: '上传头像',
      type: 2,
      callback: () => handleAction({ type: 2 })
    }
  ];

  const functionMenus = [
    { id: 1, name: '签到',  icon: '🎁', color: '#ff4444', badge: true },
    { id: 2, name: '阅历',  icon: '📚', color: '#4285f4' },
    { id: 3, name: '购物车', icon: '🛒', color: '#ff9500' },
    { id: 4, name: '消息',  icon: '💬', color: '#8e44ad' },
  ];

  const personalMenus = [
    { id: 1, name: '最近阅读', icon: '📖', arrow: true, count: readingHistory.length,  action: () => navigate('/reading-history') },
    { id: 2, name: '我的书架', icon: '📚', arrow: true, count: bookshelfBooks.length, action: () => navigate('/bookshelf') },
    { id: 3, name: '搜索历史', icon: '🔍', arrow: true, action: () => navigate('/search-history') },
    { id: 4, name: '设置',     icon: '⚙️', arrow: true, action: () => navigate('/settings') },
    { id: 5, name: '意见反馈', icon: '💬', arrow: true },
  ];

  const handleMenuClick = (menu) => {
    if (menu.action) menu.action();
  };

  const handleAction = async (action) => {
    if (action.type === 1) {
      setShowActionSheet(false);
      setLoading(true);
      Toast.info('AI 正在生成头像，请稍候...');
      try {
        const result = await generateAvatar();
        if (result.code === 0) {
          setUserInfo(prev => ({ ...prev, avatar: result.data.imageUrl }));
          Toast.success('头像生成成功！');
        } else {
          Toast.fail('生成失败：' + (result.msg || '未知错误'));
        }
      } catch {
        Toast.fail('头像生成失败，请检查网络或 API Key');
      } finally {
        setLoading(false);
      }
    } else if (action.type === 2) {
      Toast.info('上传头像功能开发中');
      setShowActionSheet(false);
    }
  };

  return (
    <div className="profile-page">
      {/* 全屏 Loading 遮罩 */}
      {loading && (
        <div className="avatar-loading-mask">
          <div className="avatar-loading-box">
            <Loading size="32px" color="#ff6b35" />
            <p>AI 正在创作头像...</p>
          </div>
        </div>
      )}

      {/* 用户信息区域 */}
      <div className="user-info-section">
        <div className="user-avatar" onClick={() => setShowActionSheet(true)}>
          <Image
            src={userInfo.avatar}
            width="72"
            height="72"
            fit="cover"
            round
            className="avatar-image"
          />
          <div className="avatar-edit-badge">✏️</div>
        </div>
        <div className="user-nickname">{userInfo.nickname}</div>
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
          <Button className="recharge-btn" size="small" color="#ff6b35" round onClick={() => setShowRechargePopup(true)}>充值</Button>
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
            <div key={menu.id} className="menu-item">
              <div className="menu-icon-wrapper">
                <span className="menu-icon" style={{ backgroundColor: menu.color }}>{menu.icon}</span>
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

      {/* 阅读统计图表 */}
      <ReadingStatsChart readingHistory={readingHistory} bookshelfBooks={bookshelfBooks} />

      {/* 充值弹窗 */}
      <Popup visible={showRechargePopup} onClose={() => setShowRechargePopup(false)} position="bottom" round>
        <div className="recharge-popup">
          <div className="popup-title">充值中心</div>
          <div className="popup-content"><p>充值功能开发中...</p></div>
          <Button block type="primary" color="#ff6b35" onClick={() => setShowRechargePopup(false)}>确定</Button>
        </div>
      </Popup>

      {/* 头像操作面板 */}
      <ActionSheet
        visible={showActionSheet}
        actions={actions}
        onSelect={(action) => action.callback && action.callback()}
        cancelText="取消"
        onCancel={() => setShowActionSheet(false)}
      />
    </div>
  );
};

export default Profile;
