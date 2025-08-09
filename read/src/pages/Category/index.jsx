import React, { useState } from 'react';
import { Tabs, Image, Grid } from 'react-vant';
import { useNavigate } from 'react-router-dom';
import './index.css';

const Category = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('热门');
  
  // 顶部导航
  const topNavs = ['男生', '女生', '精选', '出版', '听书'];
  const [activeTopNav, setActiveTopNav] = useState('男生');
  
  // 分类标签
  const categoryTabs = ['热门', '情节'];
  
  // 热门分类数据
  const hotCategories = [
    {
      id: 1,
      name: '都市',
      cover: '/api/placeholder/100/130',
      color: '#ff6b35'
    },
    {
      id: 2,
      name: '玄幻',
      cover: '/api/placeholder/100/130',
      color: '#4ecdc4'
    },
    {
      id: 3,
      name: '历史',
      cover: '/api/placeholder/100/130',
      color: '#45b7d1'
    },
    {
      id: 4,
      name: '科幻',
      cover: '/api/placeholder/100/130',
      color: '#96ceb4'
    },
    {
      id: 5,
      name: '游戏',
      cover: '/api/placeholder/100/130',
      color: '#feca57'
    },
    {
      id: 6,
      name: '悬疑',
      cover: '/api/placeholder/100/130',
      color: '#ff9ff3'
    },
    {
      id: 7,
      name: '仙侠',
      cover: '/api/placeholder/100/130',
      color: '#54a0ff'
    },
    {
      id: 8,
      name: '武侠',
      cover: '/api/placeholder/100/130',
      color: '#5f27cd'
    },
    {
      id: 9,
      name: '短故事',
      cover: '/api/placeholder/100/130',
      color: '#00d2d3'
    }
  ];
  
  // 情节分类数据
  const plotCategories = [
    { id: 1, name: '扮猪吃虎', color: '#ff6b35' },
    { id: 2, name: '强者归来', color: '#4ecdc4' },
    { id: 3, name: '王者荣耀', color: '#45b7d1' },
    { id: 4, name: '绝地求生', color: '#96ceb4' },
    { id: 5, name: '升级流', color: '#feca57' },
    { id: 6, name: '无敌流', color: '#ff9ff3' }
  ];
  
  const handleCategoryClick = (category) => {
    console.log('点击分类:', category.name);
  };
  
  const handleTopNavClick = (nav) => {
    setActiveTopNav(nav);
    console.log('切换导航:', nav);
  };
  
  return (
    <div className="category-page">
      {/* 顶部导航 */}
      <div className="top-navigation">
        <div className="nav-items">
          {topNavs.map(nav => (
            <div 
              key={nav}
              className={`nav-item ${activeTopNav === nav ? 'active' : ''}`}
              onClick={() => handleTopNavClick(nav)}
            >
              {nav}
            </div>
          ))}
        </div>
        <div className="search-icon" onClick={() => navigate('/search')}>
          🔍
        </div>
      </div>
      
      {/* 分类标签 */}
      <div className="category-tabs">
        {categoryTabs.map(tab => (
          <div 
            key={tab}
            className={`category-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </div>
        ))}
      </div>
      
      {/* 内容区域 */}
      <div className="category-content">
        {activeTab === '热门' && (
          <div className="hot-categories-section">
            <div className="section-title">按热门分类</div>
            
            <div className="categories-grid">
              {hotCategories.map(category => (
                <div 
                  key={category.id}
                  className="category-card"
                  onClick={() => handleCategoryClick(category)}
                >
                  <div className="category-cover">
                    <Image 
                      src={category.cover}
                      width="100"
                      height="130"
                      fit="cover"
                      radius="8"
                    />
                  </div>
                  <div className="category-name">{category.name}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === '情节' && (
          <div className="plot-categories-section">
            <div className="section-title">按情节分类</div>
            
            <div className="plot-tags-grid">
              {plotCategories.map(category => (
                <div 
                  key={category.id}
                  className="plot-tag"
                  style={{ backgroundColor: category.color }}
                  onClick={() => handleCategoryClick(category)}
                >
                  {category.name}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Category;