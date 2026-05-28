import React, { useState, useEffect } from 'react';
import {
  Tag,
  Image,
  Swiper,
  Skeleton,
  Loading
} from 'react-vant';
import { useNavigate } from 'react-router-dom';
import SearchBox from '@/components/SearchBox';
import './index.css';
import { getHomeData } from '@/api/books';
import { getCover } from '@/utils/covers';

const COVER = (id) => getCover(id)

// 书籍封面图（使用 picsum 随机但稳定的图片，seed=书籍id）
// COVER 已在文件顶部定义

// Banner 配置：点击跳转到对应书籍或分类
const BANNERS = [
  {
    id: 1,
    title: '热门推荐 · 剑来',
    subtitle: '烽火戏诸侯 · 9.7分',
    bg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    accent: '#e94560',
    bookId: 8,
  },
  {
    id: 2,
    title: '神作再推 · 诡秘之主',
    subtitle: '爱潜水的乌贼 · 9.6分',
    bg: 'linear-gradient(135deg, #2d1b69 0%, #11998e 100%)',
    accent: '#f7971e',
    bookId: 6,
  },
  {
    id: 3,
    title: '完本精选 · 凡人修仙传',
    subtitle: '忘语 · 9.5分',
    bg: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)',
    accent: '#fff',
    bookId: 1,
  },
]

const TAB_BOOK_IDS = {
  '推荐榜': null,   // 使用全部 recommendBooks
  '人气榜': [8, 6, 4, 5, 2, 3, 10, 11],
  '热搜榜': [6, 8, 5, 4, 9, 1, 3, 7],
  '完本榜': [1, 3, 2, 9, 6, 7, 5, 12],
}

const Home = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('推荐榜')
  const [recommendBooks, setRecommendBooks] = useState([])
  const [categories, setCategories] = useState([])
  const [hotBooks, setHotBooks] = useState([])
  const [loading, setLoading] = useState(true)

  const tabs = ['推荐榜', '人气榜', '热搜榜', '完本榜']

  useEffect(() => {
    getHomeData().then((res) => {
      setRecommendBooks(res.recommendBooks || [])
      setCategories(res.categories || [])
      setHotBooks(res.hotBooks || [])
      setLoading(false)
    })
  }, [])

  // 根据当前 tab 返回对应书单
  const currentTabBooks = React.useMemo(() => {
    const ids = TAB_BOOK_IDS[activeTab]
    if (!ids) return recommendBooks
    return ids.map((id, i) =>
      recommendBooks.find((b) => b.id === id) || {
        id,
        rank: i + 1,
        title: ['剑来','诡秘之主','全属性武道','大奉打更人','遮天','斗破苍穹','神秘复苏','我师兄实在太稳健了'][i] || '未知',
        author: '佚名',
        category: '玄幻',
      }
    )
  }, [activeTab, recommendBooks])

  return (
    <div className="home-page">
      <div className="home-header">
        <SearchBox
          placeholder="搜索书名、作者..."
          onClick={() => navigate('/search')}
          readOnly
        />
      </div>

      <div className="home-content">
        {/* Banner 轮播 */}
        <div className="banner-section">
          <Swiper autoplay={3500} indicatorColor="#ff6b35">
            {BANNERS.map((banner) => (
              <Swiper.Item key={banner.id}>
                <div
                  className="banner-item"
                  style={{ background: banner.bg }}
                  onClick={() => navigate(`/book/${banner.bookId}`)}
                >
                  <div className="banner-cover">
                    <img
                      src={COVER(banner.bookId, 80, 110)}
                      alt={banner.title}
                      className="banner-book-img"
                    />
                  </div>
                  <div className="banner-text">
                    <div className="banner-tag" style={{ background: banner.accent, color: banner.accent === '#fff' ? '#134e5e' : '#fff' }}>
                      HOT
                    </div>
                    <div className="banner-title">{banner.title}</div>
                    <div className="banner-subtitle">{banner.subtitle}</div>
                    <div className="banner-cta">立即阅读 →</div>
                  </div>
                </div>
              </Swiper.Item>
            ))}
          </Swiper>
        </div>

        {/* 分类导航 */}
        <div className="category-nav">
          <div className="nav-items">
            {[
              { label: '男生', icon: '♂', bg: '#e6f7ff', color: '#1890ff', nav: '男生' },
              { label: '女生', icon: '♀', bg: '#fff0f6', color: '#eb2f96', nav: '女生' },
              { label: '完本', icon: '📚', bg: '#f6ffed', color: '#52c41a', nav: '精选' },
              { label: '精选', icon: '⭐', bg: '#fff7e6', color: '#fa8c16', nav: '精选' },
              { label: '出版', icon: '📖', bg: '#f9f0ff', color: '#722ed1', nav: '出版' },
            ].map((item) => (
              <div
                key={item.label}
                className="nav-item"
                onClick={() => navigate('/category')}
              >
                <div className="nav-icon" style={{ background: item.bg, color: item.color }}>
                  {item.icon}
                </div>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 推荐榜单 */}
        <div className="recommend-section">
          <div className="section-header">
            <div className="tabs">
              {tabs.map((tab) => (
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
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="book-item skeleton-item">
                    <Skeleton style={{ width: 20, height: 20 }} />
                    <Skeleton style={{ width: 60, height: 80, borderRadius: 4 }} />
                    <div style={{ flex: 1 }}>
                      <Skeleton title paragraph={{ rows: 2 }} />
                    </div>
                  </div>
                ))
              : currentTabBooks.map((book, index) => (
                  <div
                    key={`${activeTab}-${book.id}`}
                    className="book-item"
                    onClick={() => navigate(`/book/${book.id}`)}
                  >
                    <div className="book-rank" style={{ color: index < 3 ? '#ff6b35' : '#999' }}>
                      {index + 1}
                    </div>
                    <div className="book-cover-wrapper">
                      <Image
                        src={COVER(book.id, 60, 80)}
                        width="60"
                        height="80"
                        fit="cover"
                        radius="4"
                      />
                      {index < 3 && (
                        <div className="top-tag">TOP{index + 1}</div>
                      )}
                    </div>
                    <div className="book-info">
                      <div className="book-title">{book.title}</div>
                      <div className="book-desc">
                        {book.description || `精彩好书，点击查看详情...`}
                      </div>
                      <div className="book-meta">
                        <span className="book-author">{book.author}</span>
                        {book.category && (
                          <Tag size="mini" color="#fff7f0" textColor="#ff6b35">
                            {book.category}
                          </Tag>
                        )}
                      </div>
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
            {categories.map((category) => (
              <div
                key={category.name}
                className="category-item"
                style={{ backgroundColor: category.color + '18', color: category.color, border: `1px solid ${category.color}30` }}
                onClick={() => navigate(`/search?q=${encodeURIComponent(category.name)}`)}
              >
                {category.name}
              </div>
            ))}
          </div>
          <div className="hot-books-grid">
            {hotBooks.map((book) => (
              <div
                key={book.id}
                className="hot-book-card"
                onClick={() => navigate(`/book/${book.id}`)}
              >
                <Image
                  src={COVER(book.id, 100, 130)}
                  width="100%"
                  height="130"
                  fit="cover"
                  radius="8"
                />
                <div className="hot-book-title">{book.title}</div>
                <div className="hot-book-score">⭐ {book.score}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 猜你喜欢 */}
      </div>
    </div>
  )
}

export default Home
