import React, { useState, useEffect } from 'react';
import { Tabs, Image, Grid } from 'react-vant';
import { useNavigate } from 'react-router-dom';
import './index.css';
import { placeholder } from '@/utils';
import { getCategories } from '@/api/books';

const Category = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('热门');
  
  // 顶部导航
  const topNavs = ['男生', '女生', '精选', '出版', '听书'];
  const [activeTopNav, setActiveTopNav] = useState('男生');
  
  // 分类标签
  const categoryTabs = ['热门', '情节'];
  
  // 热门分类数据
  const [hotCategories, setHotCategories] = useState([])
  
  // 情节分类数据
  const [plotCategories, setPlotCategories] = useState([])

  useEffect(() => {
    getCategories().then((res) => {
      setHotCategories(res.hot || [])
      setPlotCategories(res.plot || [])
    })
  }, [])
  
  const handleCategoryClick = (category) => {
    navigate(`/search?q=${encodeURIComponent(category.name)}`);
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
                      src={placeholder(100, 130)}
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
