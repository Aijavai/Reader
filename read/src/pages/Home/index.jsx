import React, { useState, useEffect } from 'react';
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
import { placeholder } from '@/utils';
import './index.css';
import { getHomeData } from '@/api/books';

const Home = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('推荐榜');
  
  const tabs = ['推荐榜', '人气榜', '热搜榜', '完本榜'];
  const [recommendBooks, setRecommendBooks] = useState([])
  const [categories, setCategories] = useState([])
  const [hotBooks, setHotBooks] = useState([])
  useEffect(() => {
    getHomeData().then((res) => {
      setRecommendBooks(res.recommendBooks || [])
      setCategories(res.categories || [])
      setHotBooks(res.hotBooks || [])
    })
  }, [])

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
          <div className="nav-item" onClick={() => navigate('/category')}>男生</div>
          <div className="nav-item" onClick={() => navigate('/category')}>女生</div>
          <div className="nav-item" onClick={() => navigate('/category')}>阅文专区</div>
          <div className="nav-item" onClick={() => navigate('/category')}>精选</div>
          <div className="nav-item" onClick={() => navigate('/category')}>出版</div>
          <div className="nav-item" onClick={() => navigate('/category')}>听书</div>
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
          <div className="more-btn" onClick={() => navigate('/category')}>更多 &gt;</div>
        </div>
        
        <div className="book-list">
          {recommendBooks.map((book, index) => (
            <div key={book.id} className="book-item" onClick={() => navigate(`/book/${book.id}`)}>
              <div className="book-rank">
                {book.rank}
              </div>
              <div className="book-cover">
                <Image 
                  src={placeholder(60, 80)} 
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
          <span className="more-btn" onClick={() => navigate('/category')}>更多 &gt;</span>
        </div>
        
        <div className="category-grid">
          {categories.map(category => (
            <div 
              key={category.name} 
              className="category-item"
              style={{ backgroundColor: category.color }}
              onClick={() => navigate(`/search?q=${encodeURIComponent(category.name)}`)}
            >
              {category.name}
            </div>
          ))}
        </div>
        
        <div className="hot-books">
          {hotBooks.map(book => (
            <div key={book.id} className="hot-book-item">
              <Image 
                src={placeholder(80, 100)} 
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
