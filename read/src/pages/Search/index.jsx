import React, { useState, useEffect } from 'react';
import { Search as VantSearch, Tag, Image, Loading, Toast } from 'react-vant';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAppStore from '../../store/useAppStore';
import { debounce } from '../../utils';
import { searchBooks } from '@/api/books';
import './index.css';
import { getCover } from '@/utils/covers';

const COVER = (id) => getCover(id)

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [activeTab, setActiveTab] = useState('');
  const [showResults, setShowResults] = useState(false);

  const {
    searchHistory,
    addSearchHistory,
    clearSearchHistory,
    searchResults,
    isSearching,
    setSearchResults,
    setSearching
  } = useAppStore();

  const historyTags = searchHistory.length > 0 ? searchHistory : [];

  const popularTags = [
    { name: '凡人修仙传', hot: true },
    { name: '遮天', hot: true },
    { name: '诡秘之主', hot: true },
    { name: '剑来', hot: false },
    { name: '斗罗大陆', hot: false },
    { name: '盗墓笔记', hot: false },
    { name: '斗破苍穹', hot: false },
    { name: '大奉打更人', hot: false },
    { name: '雪中悍刀行', hot: false },
    { name: '完美世界', hot: false }
  ];

  const hotSearchList = [
    { id: 8,  title: '剑来',       author: '烽火戏诸侯', category: '连载中', words: '1000万字', views: '3.9万次搜索' },
    { id: 6,  title: '诡秘之主',   author: '爱潜水的乌贼', category: '已完结', words: '340万字',  views: '3.1万次搜索' },
    { id: 1,  title: '凡人修仙传', author: '忘语',       category: '已完结', words: '748万字',  views: '2.5万次搜索' },
    { id: 5,  title: '大奉打更人', author: '卖报小郎君', category: '连载中', words: '680万字',  views: '1.9万次搜索' },
    { id: 2,  title: '遮天',       author: '辰东',       category: '已完结', words: '636万字',  views: '1.7万次搜索' },
    { id: 3,  title: '斗破苍穹',   author: '天蚕土豆',   category: '已完结', words: '535万字',  views: '1.7万次搜索' },
    { id: 9,  title: '雪中悍刀行', author: '烽火戏诸侯', category: '已完结', words: '490万字',  views: '1.5万次搜索' },
  ];

  const debouncedSearch = React.useMemo(() => {
    return debounce(async (keyword) => {
      if (!keyword.trim()) return;
      setSearching(true);
      try {
        const results = await searchBooks(keyword);
        setSearchResults(results || []);
        setShowResults(true);
      } catch {
        Toast.fail('搜索失败，请稍后重试');
      } finally {
        setSearching(false);
      }
    }, 300);
  }, [setSearching, setSearchResults]);

  const [params] = useSearchParams();
  useEffect(() => {
    const q = params.get('q');
    if (q) {
      setSearchValue(q);
      addSearchHistory(q);
      debouncedSearch(q);
      setActiveTab(q);
    }
  }, [params]);

  const handleSearch = (value) => {
    if (value.trim()) {
      addSearchHistory(value);
      debouncedSearch(value);
    }
  };

  useEffect(() => {
    if (!searchValue.trim()) {
      setShowResults(false);
      setSearchResults([]);
    }
  }, [searchValue]);

  const handleTagClick = (tag) => {
    setSearchValue(tag);
    setActiveTab(tag);
    handleSearch(tag);
  };

  const handleBookClick = (book) => {
    navigate(`/book/${book.id}`);
  };

  return (
    <div className="search-page">
      <div className="custom-navbar">
        <div className="navbar-left" onClick={() => navigate(-1)}>
          <i className="rv-icon rv-icon-arrow-left" style={{ fontSize: 20 }} />
          <span style={{ fontSize: 14, marginLeft: 4 }}>返回</span>
        </div>
        <div className="navbar-center">
          <VantSearch
            value={searchValue}
            onChange={setSearchValue}
            onSearch={handleSearch}
            placeholder="搜索书名、作者..."
            className="search-input"
            autoFocus
          />
        </div>
        <div className="navbar-right" onClick={() => handleSearch(searchValue)}>
          搜索
        </div>
      </div>

      <div className="search-content">
        {!showResults ? (
          <>
            {historyTags.length > 0 && (
              <div className="search-section">
                <div className="section-header-row">
                  <span className="section-title">🕐 搜索历史</span>
                  <span className="clear-history" onClick={clearSearchHistory}>清除</span>
                </div>
                <div className="history-tags">
                  {historyTags.map((tag, index) => (
                    <Tag
                      key={index}
                      className={`history-tag ${activeTab === tag ? 'active' : ''}`}
                      onClick={() => handleTagClick(tag)}
                    >
                      {tag}
                    </Tag>
                  ))}
                </div>
              </div>
            )}

            <div className="search-section">
              <h3 className="section-title">大家都在搜</h3>
              <div className="popular-tags">
                {popularTags.map((tag, index) => (
                  <Tag
                    key={index}
                    className={`popular-tag ${tag.hot ? 'hot' : ''}`}
                    onClick={() => handleTagClick(tag.name)}
                  >
                    {tag.hot && <span className="fire-icon">🔥</span>}
                    {tag.name}
                  </Tag>
                ))}
              </div>
            </div>

            <div className="search-section">
              <h3 className="section-title">本周热搜榜</h3>
              <div className="hot-search-list">
                {hotSearchList.map((book, index) => (
                  <div key={book.id} className="hot-search-item" onClick={() => handleBookClick(book)}>
                    <div className={`rank-number ${index < 3 ? 'top3' : ''}`}>{index + 1}</div>
                    <Image src={COVER(book.id, 60, 80)} width={60} height={80} fit="cover" radius={4} />
                    <div className="book-info">
                      <h4 className="book-title">{book.title}</h4>
                      <div className="book-meta">
                        <span className="book-author">{book.author}</span>
                        <span className="book-status">{book.category}</span>
                        <span className="book-words">{book.words}</span>
                      </div>
                      <div className="search-count">🔍 {book.views}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="search-results">
            <div className="results-header">
              <span>搜索结果</span>
              <span className="results-count">
                {isSearching ? '搜索中...' : `找到 ${searchResults.length} 个相关结果`}
              </span>
            </div>
            {isSearching ? (
              <div className="loading-container">
                <Loading size="24px" color="#ff6b35" />
                <span>正在搜索...</span>
              </div>
            ) : (
              <div className="results-list">
                {searchResults.length > 0 ? (
                  searchResults.map((book, index) => (
                    <div key={book.id} className="result-item" onClick={() => handleBookClick(book)}>
                      <div className={`result-rank ${index < 3 ? 'top3' : ''}`}>{index + 1}</div>
                      <Image src={COVER(book.id, 60, 80)} width={60} height={80} fit="cover" radius={4} />
                      <div className="result-info">
                        <h4 className="result-title">{book.title}</h4>
                        <div className="result-meta">
                          <span className="result-author">{book.author}</span>
                          <span className="result-status">{book.category}</span>
                          <span className="result-words">{book.words}</span>
                        </div>
                        <div className="result-views">{book.views}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-results">
                    <div className="no-results-icon">📚</div>
                    <div className="no-results-text">没有找到「{searchValue}」</div>
                    <div className="no-results-tip">试试其他关键词，或浏览<span onClick={() => navigate('/category')}>热门分类</span></div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
