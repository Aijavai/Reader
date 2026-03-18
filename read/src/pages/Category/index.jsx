import React, { useState, useEffect } from 'react';
import { Image, Tag } from 'react-vant';
import { useNavigate } from 'react-router-dom';
import './index.css';
import { getCategories } from '@/api/books';
import { getCover } from '@/utils/covers';

const COVER = (id) => getCover(id)

// 每个分类下的代表书籍（静态数据，按分类展示）
const CATEGORY_BOOKS = {
  '男生': [
    { id: 8,  title: '剑来',       author: '烽火戏诸侯', score: '9.7', tag: '仙侠' },
    { id: 4,  title: '全属性武道', author: '莫入江湖',   score: '9.2', tag: '玄幻' },
    { id: 5,  title: '大奉打更人', author: '卖报小郎君', score: '9.4', tag: '仙侠' },
    { id: 6,  title: '诡秘之主',   author: '爱潜水的乌贼', score: '9.6', tag: '西幻' },
    { id: 9,  title: '雪中悍刀行', author: '烽火戏诸侯', score: '9.3', tag: '武侠' },
    { id: 2,  title: '遮天',       author: '辰东',       score: '9.3', tag: '玄幻' },
  ],
  '女生': [
    { id: 11, title: '我师兄实在太稳健了', author: '言归正传', score: '9.0', tag: '仙侠' },
    { id: 12, title: '一念永恒',   author: '耳根',       score: '9.0', tag: '修仙' },
    { id: 3,  title: '斗破苍穹',   author: '天蚕土豆',   score: '9.1', tag: '玄幻' },
    { id: 1,  title: '凡人修仙传', author: '忘语',       score: '9.5', tag: '仙侠' },
  ],
  '精选': [
    { id: 6,  title: '诡秘之主',   author: '爱潜水的乌贼', score: '9.6', tag: '西幻' },
    { id: 8,  title: '剑来',       author: '烽火戏诸侯', score: '9.7', tag: '仙侠' },
    { id: 1,  title: '凡人修仙传', author: '忘语',       score: '9.5', tag: '仙侠' },
    { id: 5,  title: '大奉打更人', author: '卖报小郎君', score: '9.4', tag: '悬疑' },
  ],
  '出版': [
    { id: 9,  title: '雪中悍刀行', author: '烽火戏诸侯', score: '9.3', tag: '武侠' },
    { id: 3,  title: '斗破苍穹',   author: '天蚕土豆',   score: '9.1', tag: '玄幻' },
    { id: 7,  title: '完美世界',   author: '辰东',       score: '9.2', tag: '玄幻' },
  ],
  '听书': [
    { id: 10, title: '神秘复苏',   author: '佛前献花',   score: '9.1', tag: '悬疑' },
    { id: 2,  title: '遮天',       author: '辰东',       score: '9.3', tag: '玄幻' },
    { id: 4,  title: '全属性武道', author: '莫入江湖',   score: '9.2', tag: '玄幻' },
  ],
}

const topNavs = ['男生', '女生', '精选', '出版', '听书']
const categoryTabs = ['热门', '情节']

const Category = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('热门')
  const [activeTopNav, setActiveTopNav] = useState('男生')
  const [hotCategories, setHotCategories] = useState([])
  const [plotCategories, setPlotCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)

  useEffect(() => {
    getCategories().then((res) => {
      setHotCategories(res.hot || [])
      setPlotCategories(res.plot || [])
    })
  }, [])

  const currentBooks = CATEGORY_BOOKS[activeTopNav] || []

  const handleCategoryClick = (category) => {
    if (selectedCategory?.id === category.id) {
      setSelectedCategory(null)
    } else {
      setSelectedCategory(category)
    }
  }

  return (
    <div className="category-page">
      {/* 顶部导航 */}
      <div className="top-navigation">
        <div className="nav-items">
          {topNavs.map((nav) => (
            <div
              key={nav}
              className={`nav-item ${activeTopNav === nav ? 'active' : ''}`}
              onClick={() => {
                setActiveTopNav(nav)
                setSelectedCategory(null)
              }}
            >
              {nav}
            </div>
          ))}
        </div>
        <div className="search-icon" onClick={() => navigate('/search')}>🔍</div>
      </div>

      {/* 分类标签 */}
      <div className="category-tabs">
        {categoryTabs.map((tab) => (
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
          <div className="hot-section">
            {/* 分类标签网格 */}
            <div className="section-label">按类型浏览</div>
            <div className="categories-chip-grid">
              {hotCategories.map((cat) => (
                <div
                  key={cat.id}
                  className={`category-chip ${selectedCategory?.id === cat.id ? 'selected' : ''}`}
                  style={{
                    borderColor: cat.color,
                    backgroundColor: selectedCategory?.id === cat.id ? cat.color : 'transparent',
                    color: selectedCategory?.id === cat.id ? '#fff' : cat.color,
                  }}
                  onClick={() => handleCategoryClick(cat)}
                >
                  {cat.name}
                </div>
              ))}
            </div>

            {/* 当前频道书单 */}
            <div className="section-label" style={{ marginTop: 16 }}>
              {selectedCategory ? `「${selectedCategory.name}」精选` : `${activeTopNav}·推荐书单`}
            </div>
            <div className="book-list-vertical">
              {(selectedCategory
                ? currentBooks.filter((b) => b.tag === selectedCategory.name || true)
                : currentBooks
              ).map((book, index) => (
                <div
                  key={book.id}
                  className="book-list-item"
                  onClick={() => navigate(`/book/${book.id}`)}
                >
                  <div className="book-rank" style={{ color: index < 3 ? '#ff6b35' : '#bbb' }}>
                    {index + 1}
                  </div>
                  <Image
                    src={COVER(book.id, 60, 80)}
                    width={60}
                    height={80}
                    fit="cover"
                    radius={6}
                    className="book-cover-img"
                  />
                  <div className="book-list-info">
                    <div className="book-list-title">{book.title}</div>
                    <div className="book-list-meta">
                      <span className="book-list-author">{book.author}</span>
                      <Tag size="mini" color="#fff7f0" textColor="#ff6b35">{book.tag}</Tag>
                    </div>
                    <div className="book-list-score">⭐ {book.score}</div>
                  </div>
                  <div className="book-list-action">
                    <button
                      className="read-btn-small"
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/reader/${book.id}`)
                      }}
                    >
                      阅读
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === '情节' && (
          <div className="plot-section">
            <div className="section-label">按情节分类</div>
            <div className="plot-tags-grid">
              {plotCategories.map((cat) => (
                <div
                  key={cat.id}
                  className="plot-tag"
                  style={{ backgroundColor: cat.color }}
                  onClick={() => navigate(`/search?q=${encodeURIComponent(cat.name)}`)}
                >
                  {cat.name}
                </div>
              ))}
            </div>

            <div className="section-label" style={{ marginTop: 20 }}>热门情节书单</div>
            <div className="book-list-vertical">
              {currentBooks.map((book, index) => (
                <div
                  key={book.id}
                  className="book-list-item"
                  onClick={() => navigate(`/book/${book.id}`)}
                >
                  <div className="book-rank" style={{ color: index < 3 ? '#ff6b35' : '#bbb' }}>
                    {index + 1}
                  </div>
                  <Image
                    src={COVER(book.id, 60, 80)}
                    width={60}
                    height={80}
                    fit="cover"
                    radius={6}
                  />
                  <div className="book-list-info">
                    <div className="book-list-title">{book.title}</div>
                    <div className="book-list-meta">
                      <span className="book-list-author">{book.author}</span>
                      <Tag size="mini" color="#fff7f0" textColor="#ff6b35">{book.tag}</Tag>
                    </div>
                    <div className="book-list-score">⭐ {book.score}</div>
                  </div>
                  <div className="book-list-action">
                    <button
                      className="read-btn-small"
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/reader/${book.id}`)
                      }}
                    >
                      阅读
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Category
