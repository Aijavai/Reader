import React, { useState } from 'react';
import { NavBar, Button, Image, Progress, Grid, ActionSheet, Toast, Empty } from 'react-vant';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import './index.css';

const Bookshelf = () => {
  const navigate = useNavigate();
  const { bookshelfBooks, removeFromBookshelf, addReadingHistory } = useAppStore();
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  
  // 用户阅读数据
  const readingStats = {
    totalHours: 0,
    totalMinutes: 0
  };
  
  // 使用状态管理中的书架数据
  const shelfBooks = bookshelfBooks;
  
  const actionSheetActions = [
    { 
      name: '继续阅读', 
      color: '#ff6b35',
      callback: () => {
        addReadingHistory(selectedBook);
        navigate(`/book/${selectedBook.id}`);
        setShowActionSheet(false);
      }
    },
    { 
      name: '移出书架', 
      color: '#ee0a24',
      callback: () => {
        removeFromBookshelf(selectedBook.id);
        Toast.success('已移出书架');
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
  
  const handleBookAction = (book) => {
    setSelectedBook(book);
    setShowActionSheet(true);
  };
  
  const handleActionSelect = (action) => {
    setShowActionSheet(false);
    if (action.name === '取消') return;
    
    // 处理不同的操作
    console.log(`对书籍 ${selectedBook?.title} 执行操作: ${action.name}`);
  };
  
  return (
    <div className="bookshelf-page">
      {/* 顶部导航 */}
      <div className="bookshelf-header">
        <div className="header-left" onClick={() => navigate('/search')}>
          <span className="header-icon">🔍</span>
          <span className="search-text">搜索</span>
        </div>
        <div className="header-center">
          <span className="header-icon">🕐</span>
          <span className="history-text">历史</span>
        </div>
        <div className="header-right">
          <span className="header-icon">⋯</span>
          <span className="more-text">更多</span>
        </div>
      </div>
      
      {/* 阅读时长统计 */}
      <div className="reading-stats">
        <div className="stats-number">
          {readingStats.totalHours}
        </div>
        <div className="stats-text">阅读时长/小时</div>
        <Button 
          className="sign-in-btn" 
          size="small" 
          color="#ff6b35"
          round
        >
          签到
        </Button>
      </div>
      
      {/* 书架内容 */}
      <div className="bookshelf-content">
        {shelfBooks.length > 0 ? (
          <>
            <div className="shelf-stats">
              <span>共 {shelfBooks.length} 本书</span>
              <Button size="small" type="primary" onClick={() => navigate('/category')}>添加书籍</Button>
            </div>
            
            <Grid className="books-grid" columnNum={3} gutter={16}>
              {shelfBooks.map(book => (
                <Grid.Item key={book.id}>
                  <div className="book-item" onClick={() => handleBookAction(book)}>
                    <div className="book-cover">
                      <Image src={book.cover} fit="cover" />
                      <div className="book-progress">
                        <Progress percentage={book.progress || 0} strokeWidth={3} color="#ff6b35" />
                      </div>
                    </div>
                    <div className="book-info">
                      <h4>{book.title}</h4>
                      <p>{book.author}</p>
                      <span className="update-time">{book.updateTime || '刚刚添加'}</span>
                    </div>
                  </div>
                </Grid.Item>
              ))}
            </Grid>
          </>
        ) : (
          <div className="empty-shelf">
            <Empty
              image="https://img.yzcdn.cn/vant/custom-empty-image.png"
              description="书架空空如也"
            >
              <Button 
                round 
                type="primary" 
                className="bottom-button"
                onClick={() => navigate('/category')}
              >
                去添加书籍
              </Button>
            </Empty>
          </div>
        )}
      </div>
      
      {/* 操作面板 */}
      <ActionSheet
        visible={showActionSheet}
        actions={actionSheetActions}
        onCancel={() => setShowActionSheet(false)}
        onSelect={(action) => {
          if (action.callback) {
            action.callback();
          }
        }}
        title={selectedBook?.title}
      />
    </div>
  );
};

export default Bookshelf;