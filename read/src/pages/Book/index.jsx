import React from 'react';
import { NavBar, Button, Tag, Image } from 'react-vant';
import { useNavigate } from 'react-router-dom';
import './index.css';

const Book = () => {
  const navigate = useNavigate();
  
  const bookInfo = {
    title: '全属性武道',
    author: '莫入江湖',
    cover: '/api/placeholder/120/160',
    description: '星空彼岸，人类已踏出母星，征服了一片星域！在这个大时代，至强者乃是武者！而武者，以淬炼己身为根本，可开山，可裂石，可翻江倒海，可摘星拿月！王斗穿越而来，却发现自己竟然可以捡属性！别人掉落的属性，他都能捡到！力量+1！敏捷+1！体质+1！精神+1！...',
    tags: ['都市', '系统', '爽文'],
    score: '9.2',
    status: '连载中',
    wordCount: '456万字',
    updateTime: '2小时前',
    chapterCount: '第2156章'
  };
  
  return (
    <div className="book-page">
      <NavBar
        title="书籍详情"
        leftText="返回"
        onClickLeft={() => navigate(-1)}
        rightText="分享"
      />
      
      <div className="book-header">
        <div className="book-cover">
          <Image 
            src={bookInfo.cover}
            width="120"
            height="160"
            fit="cover"
            radius="8"
          />
        </div>
        
        <div className="book-info">
          <h1 className="book-title">{bookInfo.title}</h1>
          <div className="book-author">作者：{bookInfo.author}</div>
          
          <div className="book-tags">
            {bookInfo.tags.map(tag => (
              <Tag key={tag} size="mini" color="#f0f0f0" textColor="#666">
                {tag}
              </Tag>
            ))}
          </div>
          
          <div className="book-stats">
            <span className="score">评分：{bookInfo.score}</span>
            <span className="status">{bookInfo.status}</span>
          </div>
          
          <div className="book-meta">
            <span>{bookInfo.wordCount}</span>
            <span>{bookInfo.updateTime}更新</span>
          </div>
        </div>
      </div>
      
      <div className="book-description">
        <h3>内容简介</h3>
        <p>{bookInfo.description}</p>
      </div>
      
      <div className="chapter-info">
        <div className="latest-chapter">
          <span>最新章节：</span>
          <span className="chapter-title">{bookInfo.chapterCount} 终极对决</span>
        </div>
        <div className="update-time">{bookInfo.updateTime}更新</div>
      </div>
      
      <div className="action-buttons">
        <Button 
          type="default" 
          size="large" 
          className="add-shelf-btn"
        >
          加入书架
        </Button>
        <Button 
          type="primary" 
          size="large" 
          className="read-btn"
          color="#ff6b35"
        >
          立即阅读
        </Button>
      </div>
    </div>
  );
};

export default Book;