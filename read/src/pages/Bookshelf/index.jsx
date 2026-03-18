import React, { useState, useMemo } from 'react';
import { Button, Image, Progress, Grid, ActionSheet, Toast, Empty, Checkbox, Dialog } from 'react-vant';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { placeholder } from '@/utils';
import './index.css';

const COVER = (id, w = 100, h = 130) =>
  `https://picsum.photos/seed/book${id}/${w}/${h}`

const SORT_OPTIONS = [
  { label: '最近添加', value: 'addTime' },
  { label: '阅读进度', value: 'progress' },
  { label: '书名排序', value: 'title' },
]

const Bookshelf = () => {
  const navigate = useNavigate()
  const { bookshelfBooks, removeFromBookshelf, addReadingHistory, readingHistory } = useAppStore()
  const [showActionSheet, setShowActionSheet] = useState(false)
  const [selectedBook, setSelectedBook] = useState(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState([])
  const [sortBy, setSortBy] = useState('addTime')
  const [showSortSheet, setShowSortSheet] = useState(false)

  // 计算阅读时长（每条阅读历史记录算5分钟）
  const readingMinutes = readingHistory.length * 5
  const readingHours = Math.floor(readingMinutes / 60)
  const readingMins = readingMinutes % 60

  // 排序后的书架
  const sortedBooks = useMemo(() => {
    const books = [...bookshelfBooks]
    switch (sortBy) {
      case 'progress':
        return books.sort((a, b) => {
          const pa = a.progress ?? readingHistory.find(i => i.id === a.id)?.percent ?? 0
          const pb = b.progress ?? readingHistory.find(i => i.id === b.id)?.percent ?? 0
          return pb - pa
        })
      case 'title':
        return books.sort((a, b) => (a.title || '').localeCompare(b.title || '', 'zh'))
      case 'addTime':
      default:
        return books.sort((a, b) => (b.addTime || 0) - (a.addTime || 0))
    }
  }, [bookshelfBooks, sortBy, readingHistory])

  const actionSheetActions = [
    {
      name: '继续阅读',
      color: '#ff6b35',
      callback: () => {
        if (!selectedBook) return
        addReadingHistory(selectedBook)
        navigate(`/reader/${selectedBook.id}`)
        setShowActionSheet(false)
      }
    },
    {
      name: '查看详情',
      callback: () => {
        if (!selectedBook) return
        navigate(`/book/${selectedBook.id}`)
        setShowActionSheet(false)
      }
    },
    {
      name: '移出书架',
      color: '#ee0a24',
      callback: () => {
        if (!selectedBook) return
        removeFromBookshelf(selectedBook.id)
        Toast.success('已移出书架')
        setShowActionSheet(false)
      }
    },
  ]

  const sortActions = SORT_OPTIONS.map(opt => ({
    name: opt.label,
    color: sortBy === opt.value ? '#ff6b35' : undefined,
    callback: () => {
      setSortBy(opt.value)
      setShowSortSheet(false)
    }
  }))

  const handleBookAction = (book) => {
    if (isEditMode) {
      toggleSelection(book.id)
    } else {
      setSelectedBook(book)
      setShowActionSheet(true)
    }
  }

  const toggleSelection = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleBatchDelete = () => {
    if (selectedIds.length === 0) return
    Dialog.confirm({
      title: '确认删除',
      message: `确定要删除选中的 ${selectedIds.length} 本书吗？`,
    })
      .then(() => {
        selectedIds.forEach((id) => removeFromBookshelf(id))
        Toast.success('删除成功')
        setIsEditMode(false)
        setSelectedIds([])
      })
      .catch(() => {})
  }

  return (
    <div className="bookshelf-page">
      {/* 顶部导航 */}
      <div className="bookshelf-header">
        <div className="header-left" onClick={() => navigate('/search')}>
          <span>🔍</span>
          <span>搜索</span>
        </div>
        <div className="header-center" onClick={() => navigate('/reading-history')}>
          <span>🕐</span>
          <span>历史</span>
        </div>
        <div className="header-right" onClick={() => {
          if (isEditMode) { setIsEditMode(false); setSelectedIds([]) }
          else setIsEditMode(true)
        }}>
          <span>{isEditMode ? '完成' : '管理'}</span>
        </div>
      </div>

      {/* 阅读统计 */}
      {!isEditMode && (
        <div className="reading-stats">
          <div className="stats-block">
            <div className="stats-number">
              {readingHours > 0 ? `${readingHours}h ${readingMins}m` : `${readingMins}m`}
            </div>
            <div className="stats-text">累计阅读</div>
          </div>
          <div className="stats-divider" />
          <div className="stats-block">
            <div className="stats-number">{bookshelfBooks.length}</div>
            <div className="stats-text">书架藏书</div>
          </div>
          <div className="stats-divider" />
          <div className="stats-block">
            <div className="stats-number">{readingHistory.length}</div>
            <div className="stats-text">阅读记录</div>
          </div>
        </div>
      )}

      {/* 书架内容 */}
      <div className="bookshelf-content">
        {sortedBooks.length > 0 ? (
          <>
            {!isEditMode && (
              <div className="shelf-toolbar">
                <span className="shelf-count">共 {sortedBooks.length} 本</span>
                <div className="toolbar-actions">
                  <button className="sort-btn" onClick={() => setShowSortSheet(true)}>
                    {SORT_OPTIONS.find(o => o.value === sortBy)?.label} ▾
                  </button>
                  <button className="add-btn" onClick={() => navigate('/category')}>+ 添加</button>
                </div>
              </div>
            )}
            <Grid className="books-grid" columnNum={3} gutter={12}>
              {sortedBooks.map((book) => {
                const progress = book.progress ?? readingHistory.find(i => i.id === book.id)?.percent ?? 0
                return (
                  <Grid.Item key={book.id}>
                    <div className="book-item" onClick={() => handleBookAction(book)}>
                      <div className="book-cover">
                        <Image src={COVER(book.id)} fit="cover" width="100%" height="130" radius={6} />
                        <div className="book-progress">
                          <Progress percentage={progress} strokeWidth={3} color="#ff6b35" />
                        </div>
                        {isEditMode && (
                          <div className="book-checkbox">
                            <Checkbox checked={selectedIds.includes(book.id)} />
                          </div>
                        )}
                        {progress > 0 && !isEditMode && (
                          <div className="progress-badge">{progress}%</div>
                        )}
                      </div>
                      <div className="book-info">
                        <h4>{book.title}</h4>
                        <p>{book.author}</p>
                      </div>
                    </div>
                  </Grid.Item>
                )
              })}
            </Grid>
          </>
        ) : (
          <div className="empty-shelf">
            <Empty description="书架空空如也">
              <Button round type="primary" color="#ff6b35" onClick={() => navigate('/category')}>
                去添加书籍
              </Button>
            </Empty>
          </div>
        )}
      </div>

      {/* 底部编辑操作栏 */}
      {isEditMode && (
        <div className="edit-bar">
          <div className="select-info">已选 {selectedIds.length} 本</div>
          <Button type="danger" round disabled={selectedIds.length === 0} onClick={handleBatchDelete}>
            删除
          </Button>
        </div>
      )}

      {/* 排序面板 */}
      <ActionSheet
        visible={showSortSheet}
        title="排序方式"
        actions={sortActions}
        onSelect={(action) => action.callback && action.callback()}
        onCancel={() => setShowSortSheet(false)}
        cancelText="取消"
      />

      {/* 操作面板 */}
      <ActionSheet
        visible={showActionSheet}
        actions={actionSheetActions}
        onCancel={() => setShowActionSheet(false)}
        onSelect={(action) => action.callback && action.callback()}
        title={selectedBook?.title}
        cancelText="取消"
      />
    </div>
  )
}

export default Bookshelf
