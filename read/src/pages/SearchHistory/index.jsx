import React from 'react';
import { NavBar, Cell, Button, Toast, Empty, Tag } from 'react-vant';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import './index.css';

const SearchHistory = () => {
  const navigate = useNavigate();
  const { searchHistory, clearSearchHistory } = useAppStore();

  const handleClearHistory = () => {
    clearSearchHistory();
    Toast.success('搜索历史已清空');
  };

  const handleSearchAgain = (keyword) => {
    navigate(`/search?q=${encodeURIComponent(keyword)}`);
  };

  const formatTime = () => '';

  return (
    <div className="search-history">
      <NavBar
        title="搜索历史"
        leftText="返回"
        onClickLeft={() => navigate(-1)}
        rightText={searchHistory.length > 0 ? "清空" : ""}
        onClickRight={searchHistory.length > 0 ? handleClearHistory : undefined}
      />
      
      <div className="search-history-content">
        {searchHistory.length > 0 ? (
          <>
            <div className="history-stats">
              <span>共 {searchHistory.length} 条搜索记录</span>
            </div>
            
            <div className="history-list">
              {searchHistory.map((item, index) => (
                <div key={index} className="history-item">
                  <Cell
                    title={item}
                    label={''}
                    rightIcon="search"
                    clickable
                    onClick={() => handleSearchAgain(item)}
                  >
                    <div className="history-meta">
                      
                    </div>
                  </Cell>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="empty-history">
            <Empty
              image="https://img.yzcdn.cn/vant/custom-empty-image.png"
              description="暂无搜索历史"
            >
              <Button 
                round 
                type="primary" 
                className="bottom-button"
                onClick={() => navigate('/search')}
              >
                去搜索
              </Button>
            </Empty>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchHistory;
