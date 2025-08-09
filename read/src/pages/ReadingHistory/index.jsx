import React, { useState } from 'react';
import { NavBar, Image, Button, ActionSheet, Toast, Empty } from 'react-vant';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import './index.css';

const ReadingHistory = () => {
  const navigate = useNavigate();
  const { readingHistory, addToBookshelf, removeFromBookshelf, bookshelfBooks } = useAppStore();
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  
  const handleBookAction = (book) => {
    setSelectedBook(book);
    setShowActionSheet(true);
  };
  
  const isInBookshelf = (bookId) => {
    return bookshelfBooks.some(book => book.id === bookId);
  };
  
  const actionSheetActions = [
    {
      name: '继续阅读',
      color: '#ff6b35',
      callback: () => {
        navigate(`/book/${selectedBook.id}`);
        setShowActionSheet(false);
      }
    },
    {
      name: isInBookshelf(selectedBook?.id) ? '移出书架' : '加入书架',
      callback: () => {
        if (isInBookshelf(selectedBook.id)) {
          removeFromBookshelf(selectedBook.id);
          Toast.success('已移出书架');
        } else {
          addToBookshelf(selectedBook);
          Toast.success('已加入书架');
        }
        setShowActionSheet(false);
      }
    },
    {
      name: '查看详情',
      callback: () => {
        navigate(`/book/${selectedBook.id}`);
        setShowActionSheet(false);
      }
    },
    {
      name: '取消',
      color: '#969799',
      callback: () => setShowActionSheet(false)
    }
  ];
  
  const formatReadTime = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (days > 0) return `${days}天前`;
    if (hours > 0) return `${hours}小时前`;
    if (minutes > 0) return `${minutes}分钟前`;
    return '刚刚';
  };
  
  return (
    <div className="reading-history-page">
      <NavBar
        title="阅读历史"
        leftText="返回"
        onClickLeft={() => navigate(-1)}
        rightText="清空"
        onClickRight={() => {
          // 这里可以添加清空历史的逻辑
          Toast.success('历史记录已清空');
        }}
      />
      
      <div className="history-content">
        {readingHistory.length > 0 ? (
          <div className="history-list">
            {readingHistory.map((book, index) => (
              <div
                key={`${book.id}-${index}`}
                className="history-item"
                onClick={() => handleBookAction(book)}
              >
                <div className="book-cover">
                  <Image
                    src={book.cover}
                    width="60"
                    height="80"
                    fit="cover"
                    radius="6"
                  />
                  {isInBookshelf(book.id) && (
                    <div className="shelf-badge">已收藏</div>
                  )}
                </div>
                
                <div className="book-info">
                  <h3 className="book-title">{book.title}</h3>
                  <div className="book-meta">
                    <span className="book-author">{book.author}</span>
                    <span className="book-category">{book.category}</span>
                  </div>
                  <div className="reading-progress">
                    <span className="progress-text">
                      读到: {book.lastChapter || '第1章'}
                    </span>
                    <span className="read-time">
                      {formatReadTime(book.readTime || Date.now())}
                    </span>
                  </div>
                </div>
                
                <div className="action-btn">
                  <Button
                    size="small"
                    color="#ff6b35"
                    round
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/book/${book.id}`);
                    }}
                  >
                    继续阅读
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Empty
              image="https://img.yzcdn.cn/vant/custom-empty-image.png"
              description="暂无阅读历史"
            >
              <Button
                round
                color="#ff6b35"
                className="empty-btn"
                onClick={() => navigate('/home')}
              >
                去看书
              </Button>
            </Empty>
          </div>
        )}
      </div>
      
      {/* 操作菜单 */}
      <ActionSheet
        visible={showActionSheet}
        onCancel={() => setShowActionSheet(false)}
        actions={actionSheetActions}
        title={selectedBook?.title}
      />
    </div>
  );
};

export default ReadingHistory;