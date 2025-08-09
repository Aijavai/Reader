import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search } from 'react-vant';
import { useNavigate } from 'react-router-dom';
import { debounce } from '../../utils';
import useAppStore from '../../store/useAppStore';
import './index.css';

const SearchBox = ({ 
  placeholder = '搜索书籍、作者',
  showSuggestions = false,
  onSearch = null,
  onClick,
  readOnly = false 
}) => {
  const navigate = useNavigate();
  const [value, setValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef(null);
  
  const { searchHistory, addSearchHistory } = useAppStore();

  // 防抖搜索
  const debouncedSearch = useMemo(() => {
    return debounce((keyword) => {
      if (onSearch && keyword.trim()) {
        onSearch(keyword);
      }
    }, 300);
  }, [onSearch]);

  useEffect(() => {
    if (value && showSuggestions) {
      debouncedSearch(value);
    }
  }, [value, debouncedSearch, showSuggestions]);

  const handleSearchClick = () => {
    if (!showSuggestions) {
      navigate('/search');
    }
  };

  const handleFocus = () => {
    if (!showSuggestions) {
      navigate('/search');
    } else {
      setShowDropdown(true);
    }
  };

  const handleChange = (val) => {
    setValue(val);
    setShowDropdown(!!val);
  };

  const handleSearch = (keyword) => {
    if (keyword.trim()) {
      addSearchHistory(keyword);
      setShowDropdown(false);
      if (onSearch) {
        onSearch(keyword);
      }
    }
  };

  const handleHistoryClick = (keyword) => {
    setValue(keyword);
    handleSearch(keyword);
  };

  return (
    <div className="search-box-container">
      <div className="search-box" onClick={handleSearchClick}>
        <Search
          ref={inputRef}
          value={value}
          placeholder={placeholder}
          readonly={readOnly || !showSuggestions}
          onFocus={readOnly ? undefined : handleFocus}
          onChange={readOnly ? undefined : handleChange}
          onSearch={readOnly ? undefined : handleSearch}
          onClick={readOnly ? onClick : undefined}
          style={readOnly ? { cursor: 'pointer' } : {}}
        />
      </div>
      
      {/* 搜索建议下拉框 */}
      {showSuggestions && showDropdown && (
        <div className="search-dropdown">
          {searchHistory.length > 0 && (
            <div className="search-history">
              <div className="history-title">搜索历史</div>
              {searchHistory.slice(0, 5).map((keyword, index) => (
                <div 
                  key={index}
                  className="history-item"
                  onClick={() => handleHistoryClick(keyword)}
                >
                  {keyword}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBox;