import React from 'react';
import { NavBar, Button, Toast, Empty, Dialog } from 'react-vant';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { storage } from '../../utils';
import './index.css';

const SearchHistory = () => {
  const navigate = useNavigate()
  const { searchHistory, clearSearchHistory } = useAppStore()

  // 删除单条历史
  const handleDeleteItem = (keyword, e) => {
    e.stopPropagation()
    const { searchHistory: current } = useAppStore.getState()
    const next = current.filter((k) => k !== keyword)
    useAppStore.setState({ searchHistory: next })
    storage.set('searchHistory', next)
  }

  const handleClearAll = () => {
    Dialog.confirm({
      title: '清空搜索历史',
      message: '确定要清空所有搜索历史吗？',
    })
      .then(() => {
        clearSearchHistory()
        Toast.success('搜索历史已清空')
      })
      .catch(() => {})
  }

  const handleSearchAgain = (keyword) => {
    navigate(`/search?q=${encodeURIComponent(keyword)}`)
  }

  return (
    <div className="search-history">
      <NavBar
        title="搜索历史"
        leftText="返回"
        onClickLeft={() => navigate(-1)}
        rightText={searchHistory.length > 0 ? '清空' : ''}
        onClickRight={searchHistory.length > 0 ? handleClearAll : undefined}
      />

      <div className="search-history-content">
        {searchHistory.length > 0 ? (
          <>
            <div className="history-stats">
              <span>共 {searchHistory.length} 条搜索记录</span>
            </div>

            <div className="history-tags-wrap">
              {searchHistory.map((item, index) => (
                <div key={index} className="history-tag-item">
                  <span
                    className="history-tag-text"
                    onClick={() => handleSearchAgain(item)}
                  >
                    🕐 {item}
                  </span>
                  <span
                    className="history-tag-delete"
                    onClick={(e) => handleDeleteItem(item, e)}
                  >
                    ✕
                  </span>
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
  )
}

export default SearchHistory
