import React, { useRef, useEffect, useState, useMemo } from 'react'
import { Button, Popup, Cell, Toast, Slider } from 'react-vant'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppStore } from '@/store/useAppStore'
import { placeholder } from '@/utils'
import './index.css'
import { getChapters } from '@/api/books'

function genChapters() {
  return Array.from({ length: 20 }).map((_, i) => ({ id: i + 1, title: `第${i + 1}章 内容 ${i + 1}` }))
}

const READER_THEMES = {
  light: { background: '#ffffff', color: '#333333', name: '默认' },
  night: { background: '#1a1a1a', color: '#888888', name: '夜间' },
  eye: { background: '#cce8cf', color: '#333333', name: '护眼' },
  parchment: { background: '#f5f5d5', color: '#5a4a42', name: '羊皮' },
}

export default function Reader() {
  const navigate = useNavigate()
  const { id } = useParams()
  const {
    fontSize,
    updateReadingProgress,
    addReadingHistory,
    bookshelfBooks,
    theme: appTheme,
  } = useAppStore()

  const book = useMemo(() => (
    bookshelfBooks.find((b) => String(b.id) === String(id)) || {
      id: Number(id) || 1,
      title: '全属性武道',
      author: '莫入江湖',
      cover: placeholder(120, 160),
    }
  ), [bookshelfBooks, id])

  const [visible, setVisible] = useState(false)
  const [settingsVisible, setSettingsVisible] = useState(false)
  const [current, setCurrent] = useState(0)
  const [chapters, setChapters] = useState(genChapters())
  const [readerTheme, setReaderTheme] = useState('light')
  const contentRef = useRef(null)

  useEffect(() => {
    addReadingHistory({ id: book.id, title: book.title, author: book.author, cover: book.cover })
    getChapters(book.id).then((res) => {
      setChapters(Array.isArray(res) ? res : genChapters())
    })
    // Initialize theme based on app theme or default
    if (appTheme === 'dark') setReaderTheme('night')
  }, [addReadingHistory, appTheme, book.id, book.title, book.author, book.cover])

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0
    }
  }, [current])

  const goChapter = (index) => {
    setCurrent(index)
    const percent = Math.round(((index + 1) / chapters.length) * 100)
    updateReadingProgress(book.id, { lastChapter: chapters[index].title, percent })
    useAppStore.getState().updateBookshelfProgress(book.id, percent)
  }

  const prev = (e) => {
    e?.stopPropagation()
    if (current > 0) goChapter(current - 1)
    else Toast.info('已经是第一章')
  }

  const next = (e) => {
    e?.stopPropagation()
    if (current < chapters.length - 1) goChapter(current + 1)
    else Toast.info('已经是最后一章')
  }

  const handleContentClick = (e) => {
    const width = window.innerWidth
    const x = e.clientX

    // Center 40% triggers menu
    if (x > width * 0.3 && x < width * 0.7) {
      setSettingsVisible(!settingsVisible)
    } else if (x <= width * 0.3) {
      prev()
    } else {
      next()
    }
  }

  const currentThemeStyle = READER_THEMES[readerTheme]

  return (
    <div
      className="reader-page"
      style={{
        backgroundColor: currentThemeStyle.background,
        color: currentThemeStyle.color
      }}
    >
      {/* 始终显示的顶部浮动退出按钮 */}
      <div
        className={`reader-fab-header ${settingsVisible ? 'hidden' : ''}`}
        style={{ color: currentThemeStyle.color }}
      >
        <button
          className="fab-back-btn"
          style={{ color: currentThemeStyle.color, borderColor: currentThemeStyle.color + '40' }}
          onClick={() => navigate(-1)}
        >
          ‹ 退出
        </button>
        <span className="fab-title">{book.title}</span>
        <button
          className="fab-menu-btn"
          style={{ color: currentThemeStyle.color, borderColor: currentThemeStyle.color + '40' }}
          onClick={() => setSettingsVisible(true)}
        >
          ☰
        </button>
      </div>

      {/* Header - visible only when settings are open */}
      <div className={`reader-header ${settingsVisible ? 'visible' : ''}`}>
        <div className="custom-nav-bar" style={{ backgroundColor: currentThemeStyle.background, color: currentThemeStyle.color }}>
          <div className="nav-left" onClick={() => navigate(-1)}>
            <i className="rv-icon rv-icon-arrow-left" style={{ fontSize: 20 }} />
          </div>
          <div className="nav-title">{book.title}</div>
          <div className="nav-right" onClick={() => navigate('/bookshelf')}>
            书架
          </div>
        </div>
      </div>

      <div
        className="reader-content"
        style={{ fontSize: typeof fontSize === 'number' ? `${fontSize}px` : fontSize }}
        onClick={handleContentClick}
        ref={contentRef}
      >
        <div className="chapter-info-header">
          <span className="chapter-name">{chapters[current].title}</span>
        </div>

        <h2 className="chapter-title">{chapters[current].title}</h2>
        <div className="chapter-body">
          {chapters[current].content
            ? chapters[current].content.split('\n').filter(Boolean).map((para, i) => (
                <p key={i}>{para}</p>
              ))
            : Array.from({ length: 8 }).map((_, i) => (
                <p key={i}>
                  {chapters[current].title}——{i === 0 ? '本章内容正在加载中，请稍候。点击屏幕中间呼出设置菜单，点击左右两侧可以翻页。' : `这是第${i + 1}段正文内容，讲述了主角在此章节中经历的种种奇遇与成长。`}
                </p>
              ))
          }
        </div>

        <div className="chapter-actions">
          <Button plain type="primary" size="small" onClick={prev} disabled={current === 0}>上一章</Button>
          <Button plain type="primary" size="small" onClick={next} disabled={current === chapters.length - 1}>下一章</Button>
        </div>
      </div>

      {/* Footer Settings Panel */}
      <Popup
        visible={settingsVisible}
        position="bottom"
        round
        onClose={() => setSettingsVisible(false)}
        overlay={false}
        className="reader-settings-popup"
      >
        <div className="reader-settings">
          <div className="setting-row">
            <span className="label">进度</span>
            <div className="slider-container">
              <Button size="mini" icon="arrow-left" onClick={prev} />
              <Slider
                value={current}
                min={0}
                max={chapters.length - 1}
                onChange={goChapter}
                buttonSize={18}
                activeColor="#ff6b35"
              />
              <Button size="mini" icon="arrow" onClick={next} />
            </div>
          </div>

          <div className="setting-row">
            <span className="label">字号</span>
            <div className="font-controls">
              <Button size="small" onClick={() => useAppStore.getState().setFontSize(Math.max(12, fontSize - 2))}>A-</Button>
              <span className="current-size">{fontSize}</span>
              <Button size="small" onClick={() => useAppStore.getState().setFontSize(Math.min(30, fontSize + 2))}>A+</Button>
            </div>
          </div>

          <div className="setting-row">
            <span className="label">主题</span>
            <div className="theme-options">
              {Object.entries(READER_THEMES).map(([key, theme]) => (
                <div
                  key={key}
                  className={`theme-circle ${readerTheme === key ? 'active' : ''}`}
                  style={{ backgroundColor: theme.background }}
                  onClick={() => setReaderTheme(key)}
                />
              ))}
            </div>
          </div>

          <div className="setting-actions">
            <div className="action-item" onClick={() => setVisible(true)}>
              <span style={{ fontSize: 20 }}>📖</span>
              <span>目录</span>
            </div>
            <div className="action-item" onClick={() => navigate('/bookshelf')}>
              <span style={{ fontSize: 20 }}>📚</span>
              <span>书架</span>
            </div>
            <div className="action-item" onClick={() => navigate(-1)}>
              <span style={{ fontSize: 20 }}>✕</span>
              <span>退出阅读</span>
            </div>
            <div className="action-item" onClick={() => setSettingsVisible(false)}>
              <span style={{ fontSize: 20 }}>⊙</span>
              <span>关闭</span>
            </div>
          </div>
        </div>
      </Popup>

      {/* 底部进度条 */}
      <div
        className={`reader-bottom-bar ${settingsVisible ? 'hidden' : ''}`}
        style={{ backgroundColor: currentThemeStyle.background + 'ee' }}
      >
        <button className="bottom-prev" onClick={prev} disabled={current === 0} style={{ color: currentThemeStyle.color }}>
          ‹
        </button>
        <div className="bottom-progress">
          <div
            className="bottom-progress-fill"
            style={{ width: `${Math.round(((current + 1) / chapters.length) * 100)}%` }}
          />
        </div>
        <span className="bottom-chapter-info" style={{ color: currentThemeStyle.color }}>
          {current + 1}/{chapters.length}
        </span>
        <button className="bottom-next" onClick={next} disabled={current === chapters.length - 1} style={{ color: currentThemeStyle.color }}>
          ›
        </button>
      </div>

      {/* Chapter List Popup */}
      <Popup visible={visible} position="left" style={{ width: '80%', height: '100%' }} onClose={() => setVisible(false)}>
        <div className="chapters-popup">
          <div className="popup-title">
            <span>目录</span>
            <span className="chapter-count">共 {chapters.length} 章</span>
          </div>
          <div className="chapters-list">
            {chapters.map((c, idx) => (
              <Cell
                key={c.id}
                title={c.title}
                clickable
                className={current === idx ? 'active-chapter' : ''}
                onClick={() => {
                  goChapter(idx)
                  setVisible(false)
                  setSettingsVisible(false)
                }}
              />
            ))}
          </div>
        </div>
      </Popup>
    </div>
  )
}
