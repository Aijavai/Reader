import React, { useState } from 'react';
import { NavBar, Image, Button, ActionSheet, Toast, Empty, Dialog } from 'react-vant';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import './index.css';
import { getCover } from '@/utils/covers';

const COVER = (id) => getCover(id)

const ReadingHistory = () => {
  const navigate = useNavigate();
  const { readingHistory, addToBookshelf, removeFromBookshelf, bookshelfBooks } = useAppStore();
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const handleBookAction = (book) => {
    setSelectedBook(book);
    setShowActionSheet(true);
  };

  const isInBookshelf = (bookId) =>
    bookshelfBooks.some(book => book.id === bookId);

  const actionSheetActions = [
    {
      name: '继续阅读',
      color: '#ff6b35',
      callback: () => {
        navigate(`/reader/${selectedBook.id}`);
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
  ];

  const formatReadTime = (timestamp) => {
    if (!timestamp) return '未知时间';
    const diff = Date.now() - timestamp;
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor(diff / 60000);
    if (days > 0) return `${days}天前`;
    if (hours > 0) return `${hours}小时前`;
    if (minutes > 0) return `${minutes}分钟前`;
    return '刚刚';
  };

  const handleClearAll = () => {
    Dialog.confirm({
      title: '清空阅读历史',
      message: '确定要清空所有阅读历史吗？此操作不可撤销。',
    })
      .then(() => {
        useAppStore.getState().clearReadingHistory();
        Toast.success('历史记录已清空');
      })
      .catch(() => {});
  };

  return (
    <div className="reading-history-page">
      <NavBar
        title="阅读历史"
        leftText="返回"
        onClickLeft={() => navigate(-1)}
        rightText={readingHistory.length > 0 ? '清空' : ''}
        onClickRight={readingHistory.length > 0 ? handleClearAll : undefined}
      />

      <div className="history-content">
        {readingHistory.length > 0 ? (
          <>
            <div className="history-stats-bar">
              共 {readingHistory.length} 条记录
            </div>
            <div className="history-list">
              {readingHistory.map((book, index) => (
                <div
                  key={`${book.id}-${index}`}
                  className="history-item"
                  onClick={() => handleBookAction(book)}
                >
                  <div className="book-cover-wrap">
                    <Image
                      src={book.cover || COVER(book.id)}
                      width="60"
                      height="80"
                      fit="cover"
                      radius="6"
                    />
                    {isInBookshelf(book.id) && (
                      <div className="shelf-badge">书架</div>
                    )}
                  </div>

                  <div className="book-info">
                    <h3 className="book-title">{book.title}</h3>
                    <div className="book-meta">
                      <span className="book-author">{book.author}</span>
                      {book.category && <span className="book-category">{book.category}</span>}
                    </div>
                    <div className="reading-progress">
                      <span className="progress-text">读到：{book.lastChapter || '第1章'}</span>
                      {book.percent > 0 && (
                        <span className="progress-pct">{book.percent}%</span>
                      )}
                    </div>
                    <div className="read-time">{formatReadTime(book.readTime)}</div>
                  </div>

                  <div className="action-col">
                    <Button
                      size="small"
                      color="#ff6b35"
                      round
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/reader/${book.id}`);
                      }}
                    >
                      继续
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="empty-state">
            <Empty description="暂无阅读历史">
              <Button round color="#ff6b35" onClick={() => navigate('/home')}>
                去看书
              </Button>
            </Empty>
          </div>
        )}
      </div>

      <ActionSheet
        visible={showActionSheet}
        onCancel={() => setShowActionSheet(false)}
        actions={actionSheetActions}
        onSelect={(action) => action.callback && action.callback()}
        cancelText="取消"
        title={selectedBook?.title}
      />
    </div>
  );
};

export default ReadingHistory;
