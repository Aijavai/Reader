import React, { useState } from 'react';
import { 
  Grid, 
  Tag, 
  Image, 
  Badge 
} from 'react-vant';
import { 
  useNavigate 
} from 'react-router-dom';
import SearchBox from '@/components/SearchBox';
import './index.css';

const Home = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('推荐榜');
  
  const tabs = ['推荐榜', '人气榜', '热搜榜', '完本榜'];
  
  const recommendBooks = [
    {
      id: 1,
      title: '神秘复苏',
      author: '佛前献花',
      cover: '/api/placeholder/80/100',
      rank: 1,
      isTop: true,
      category: '技术流'
    },
    {
      id: 2,
      title: '我师兄实在太稳健了',
      author: '言归正传',
      cover: '/api/placeholder/80/100',
      rank: 2,
      isTop: true,
      category: '穿越文'
    },
    {
      id: 3,
      title: '驭房有术',
      author: '随身流',
      cover: '/api/placeholder/80/100',
      rank: 3
    },
    {
      id: 4,
      title: '这游戏也太真实了',
      author: '晨星LL',
      cover: '/api/placeholder/80/100',
      rank: 4,
      category: '科幻文'
    },
    {
      id: 5,
      title: '第一序列',
      author: '会说话的肘子',
      cover: '/api/placeholder/80/100',
      rank: 5,
      category: '系统文'
    },
    {
      id: 6,
      title: '我在修仙界种长生',
      author: '草根编剧',
      cover: '/api/placeholder/80/100',
      rank: 6
    },
    {
      id: 7,
      title: '我的御兽真不是邪神',
      author: '开荒',
      cover: '/api/placeholder/80/100',
      rank: 7
    },
    {
      id: 8,
      title: '仙途凡修',
      author: '凡人流',
      cover: '/api/placeholder/80/100',
      rank: 8
    }
  ];
  
  const categories = [
    { name: '都市', color: '#ff6b35' },
    { name: '玄幻', color: '#4ecdc4' },
    { name: '悬疑', color: '#45b7d1' },
    { name: '历史', color: '#96ceb4' },
    { name: '科幻', color: '#feca57' },
    { name: '仙侠', color: '#ff9ff3' }
  ];
  
  const hotBooks = [
    {
      id: 1,
      title: '我的总裁老婆很凶',
      cover: '/api/placeholder/100/130',
      score: '8.6分'
    },
    {
      id: 2,
      title: '海贼：从白色城堡开始',
      cover: '/api/placeholder/100/130',
      score: '9.5分'
    },
    {
      id: 3,
      title: '强龙出狱',
      cover: '/api/placeholder/100/130',
      score: '8.4分'
    },
    {
      id: 4,
      title: '龙王出狱',
      cover: '/api/placeholder/100/130',
      score: '8.8分'
    }
  ];

  return (
    <div className="home-page">
      <SearchBox 
        placeholder="全属性武道" 
        onClick={() => navigate('/search')}
        readOnly
      />
      
      {/* 分类导航 */}
      <div className="category-nav">
        <div className="nav-items">
          <div className="nav-item">男生</div>
          <div className="nav-item">女生</div>
          <div className="nav-item">阅文专区</div>
          <div className="nav-item">精选</div>
          <div className="nav-item">出版</div>
          <div className="nav-item">听书</div>
        </div>
      </div>
      
      {/* 推荐榜单 */}
      <div className="recommend-section">
        <div className="section-header">
          <div className="tabs">
            {tabs.map(tab => (
              <div 
                key={tab}
                className={`tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </div>
            ))}
          </div>
          <div className="more-btn">更多 &gt;</div>
        </div>
        
        <div className="book-list">
          {recommendBooks.map((book, index) => (
            <div key={book.id} className="book-item">
              <div className="book-rank">
                {book.rank}
              </div>
              <div className="book-cover">
                <Image 
                  src={book.cover} 
                  width="60" 
                  height="80" 
                  fit="cover"
                  radius="4"
                />
                {book.isTop && (
                  <Tag className="top-tag" color="#ff4444" size="mini">
                    TOP
                  </Tag>
                )}
              </div>
              <div className="book-info">
                <div className="book-title">{book.title}</div>
                <div className="book-author">{book.author}</div>
                {book.category && (
                  <Tag size="mini" color="#f0f0f0" textColor="#666">
                    {book.category}
                  </Tag>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* 热门分类 */}
      <div className="hot-category-section">
        <div className="section-title">
          <span>热门分类</span>
          <span className="more-btn">更多 &gt;</span>
        </div>
        
        <div className="category-grid">
          {categories.map(category => (
            <div 
              key={category.name} 
              className="category-item"
              style={{ backgroundColor: category.color }}
            >
              {category.name}
            </div>
          ))}
        </div>
        
        <div className="hot-books">
          {hotBooks.map(book => (
            <div key={book.id} className="hot-book-item">
              <Image 
                src={book.cover} 
                width="80" 
                height="100" 
                fit="cover"
                radius="6"
              />
              <div className="book-title">{book.title}</div>
              <div className="book-score">{book.score}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;