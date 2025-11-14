import React, { useState, useEffect } from 'react';
import { NavBar, Search, Tag, Cell, Image, Loading, Toast } from 'react-vant';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAppStore from '../../store/useAppStore';
import { debounce, placeholder } from '../../utils';
import { searchBooks } from '@/api/books';
import './index.css';

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

  // 使用状态管理中的搜索历史，如果为空则使用默认值
  const historyTags = searchHistory.length > 0 ? searchHistory : [
    '创来漫画', '创来', '复不在使用', '小说', '加入深北'
  ];

  // 大家都在搜
  const popularTags = [
    { name: '凡人修仙传', hot: true },
    { name: '遮天', hot: true },
    { name: '创来', hot: true },
    { name: '仙逆', hot: false },
    { name: '斗罗', hot: false },
    { name: '斗罗大陆', hot: false },
    { name: '盗墓笔记', hot: false },
    { name: '斗破苍穹', hot: false },
    { name: '诡秘之主', hot: false },
    { name: '双男主', hot: false }
  ];

  // 本周热搜榜
  const hotSearchList = [
    {
      id: 1,
      title: '校花的贴身高手',
      author: '鱼人二代',
      category: '连载中',
      words: '2517万字',
      views: '3.9万次搜索',
      cover: '/api/placeholder/60/80'
    },
    {
      id: 2,
      title: '万古神帝',
      author: '玄幻',
      category: '已完结',
      words: '1455万字',
      views: '3.1万次搜索',
      cover: '/api/placeholder/60/80'
    },
    {
      id: 3,
      title: '都市极品医神',
      author: '都市',
      category: '连载中',
      words: '2471万字',
      views: '2.5万次搜索',
      cover: '/api/placeholder/60/80'
    },
    {
      id: 4,
      title: '凡人修仙传',
      author: '武侠仙侠',
      category: '已完结',
      words: '748万字',
      views: '1.9万次搜索',
      cover: '/api/placeholder/60/80'
    },
    {
      id: 5,
      title: '遮天',
      author: '武侠仙侠',
      category: '已完结',
      words: '636万字',
      views: '1.7万次搜索',
      cover: '/api/placeholder/60/80'
    },
    {
      id: 6,
      title: '斗破苍穹',
      author: '玄幻奇幻',
      category: '已完结',
      words: '535万字',
      views: '1.7万次搜索',
      cover: '/api/placeholder/60/80'
    },
    {
      id: 7,
      title: '开局签到荒古圣体',
      author: '玄幻',
      category: '连载中',
      words: '1200万字',
      views: '1.5万次搜索',
      cover: '/api/placeholder/60/80'
    }
  ];

  // 防抖搜索函数
  const debouncedSearch = React.useMemo(() => {
    return debounce(async (keyword) => {
      if (!keyword.trim()) return;
      setSearching(true);
      try {
        const results = await searchBooks(keyword);
        setSearchResults(results || []);
        setShowResults(true);
      } catch (error) {
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
  
  const handleClearHistory = () => {
    clearSearchHistory();
  };

  const handleBookClick = (book) => {
    navigate(`/book/${book.id}`);
  };

  return (
    <div className="search-page">
      {/* 顶部导航 */}
      <NavBar
        title="搜索"
        leftArrow
        rightText="搜索"
        onClickLeft={() => navigate(-1)}
        onClickRight={() => handleSearch(searchValue)}
        className="search-navbar"
      >
        <div className="search-header">
          <Search
            value={searchValue}
            onChange={setSearchValue}
            onSearch={handleSearch}
            placeholder="诡秘之主"
            className="search-input"
          />
          <div className="search-btn" onClick={() => handleSearch(searchValue)}>
            搜索
          </div>
        </div>
      </NavBar>

      <div className="search-content">
        {!showResults ? (
          <>
            {/* 搜索历史 */}
            <div className="search-section">
              <div className="section-header">
                <span className="history-icon">🕐</span>
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
                {searchHistory.length > 0 && (
                  <div className="clear-history" onClick={handleClearHistory}>
                    清除
                  </div>
                )}
              </div>
            </div>

            {/* 大家都在搜 */}
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

            {/* 本周热搜榜 */}
            <div className="search-section">
              <h3 className="section-title">本周热搜榜</h3>
              <div className="hot-search-list">
                {hotSearchList.map((book, index) => (
                  <div
                    key={book.id}
                    className="hot-search-item"
                    onClick={() => handleBookClick(book)}
                  >
                    <div className="rank-number">{index + 1}</div>
                    <Image
                      src={placeholder(60, 80)}
                      className="book-cover"
                      fit="cover"
                    />
                    <div className="book-info">
                      <h4 className="book-title">{book.title}</h4>
                      <div className="book-meta">
                        <span className="book-author">{book.author}</span>
                        <span className="book-status">{book.category}</span>
                        <span className="book-words">{book.words}</span>
                      </div>
                      <div className="search-count">{book.views}</div>
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
                <Loading size="24px" />
                <span>正在搜索...</span>
              </div>
            ) : (
              <div className="results-list">
                {searchResults.length > 0 ? (
                  searchResults.map((book, index) => (
                    <div
                      key={book.id}
                      className="result-item"
                      onClick={() => handleBookClick(book)}
                    >
                      <div className="result-rank">{index + 1}</div>
                      <Image
                        src={placeholder(60, 80)}
                        className="result-cover"
                        fit="cover"
                      />
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
                    <div className="no-results-text">没有找到相关结果</div>
                    <div className="no-results-tip">试试其他关键词吧</div>
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
