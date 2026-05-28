import React from 'react';
import { NavBar, Button, Tag, Image, Toast } from 'react-vant';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import './index.css';
import { getBookDetail } from '@/api/books';
import { getCover } from '@/utils/covers';

const COVER = (id) => getCover(id)

const Book = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToBookshelf, addReadingHistory, bookshelfBooks } = useAppStore();
  const [detail, setDetail] = React.useState(null);

  React.useEffect(() => {
    if (id) getBookDetail(id).then((res) => setDetail(res));
  }, [id]);

  const defaultInfo = {
    id: Number(id) || 1,
    title: '全属性武道',
    author: '莫入江湖',
    description: '星空彼岸，人类已踏出母星，征服了一片星域！王斗穿越而来，却发现自己竟然可以捡属性！',
    tags: ['都市', '系统', '爽文'],
    score: '9.2',
    status: '连载中',
    wordCount: '456万字',
    updateTime: '2小时前',
    chapterCount: '第2156章'
  };
  const bookInfo = detail || bookshelfBooks.find((b) => String(b.id) === String(id)) || defaultInfo;
  const isInShelf = bookshelfBooks.some((b) => String(b.id) === String(id));

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
            src={bookInfo.cover || COVER(bookInfo.id)}
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
            {(bookInfo.tags || []).map(tag => (
              <Tag key={tag} size="mini" color="#f0f0f0" textColor="#666">{tag}</Tag>
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

      {/* 内容简介 */}
      <div className="book-description">
        <h3>内容简介</h3>
        <p>{bookInfo.description}</p>
      </div>

      {/* 最新章节 */}
      <div className="chapter-info">
        <div className="latest-chapter">
          <span>最新章节：</span>
          <span className="chapter-title">{bookInfo.chapterCount} 终极对决</span>
        </div>
        <div className="update-time">{bookInfo.updateTime}更新</div>
      </div>

      {/* 底部操作 */}
      <div className="action-buttons">
        <Button
          type="default"
          size="large"
          className="add-shelf-btn"
          onClick={() => {
            if (isInShelf) {
              Toast.info('已在书架中');
            } else {
              addToBookshelf(bookInfo);
              Toast.success('已加入书架');
            }
          }}
        >
          {isInShelf ? '✓ 已在书架' : '+ 加入书架'}
        </Button>
        <Button
          type="primary"
          size="large"
          className="read-btn"
          color="#ff6b35"
          onClick={() => {
            addReadingHistory(bookInfo);
            navigate(`/reader/${bookInfo.id}`);
          }}
        >
          立即阅读
        </Button>
      </div>
    </div>
  );
};

export default Book;
