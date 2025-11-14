import React from 'react'
import { NavBar, Button, Popup, Cell, Toast, ActionSheet } from 'react-vant'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppStore } from '@/store/useAppStore'
import { placeholder } from '@/utils'
import './index.css'
import { getChapters } from '@/api/books'

function genChapters() {
  return Array.from({ length: 20 }).map((_, i) => ({ id: i + 1, title: `第${i + 1}章 内容 ${i + 1}` }))
}

export default function Reader() {
  const navigate = useNavigate()
  const { id } = useParams()
  const {
    fontSize,
    updateReadingProgress,
    addReadingHistory,
    bookshelfBooks,
  } = useAppStore()

  const book =
    bookshelfBooks.find((b) => String(b.id) === String(id)) || {
      id: Number(id) || 1,
      title: '全属性武道',
      author: '莫入江湖',
      cover: placeholder(120, 160),
    }

  const [visible, setVisible] = React.useState(false)
  const [settingsVisible, setSettingsVisible] = React.useState(false)
  const [current, setCurrent] = React.useState(0)
  const [chapters, setChapters] = React.useState(genChapters())

  React.useEffect(() => {
    addReadingHistory({ id: book.id, title: book.title, author: book.author, cover: book.cover })
    getChapters(book.id).then((res) => {
      setChapters(Array.isArray(res) ? res : genChapters())
    })
  }, [])

  const goChapter = (index) => {
    setCurrent(index)
    const percent = Math.round(((index + 1) / chapters.length) * 100)
    updateReadingProgress(book.id, { lastChapter: chapters[index].title, percent })
    useAppStore.getState().updateBookshelfProgress(book.id, percent)
  }

  const prev = () => {
    if (current > 0) goChapter(current - 1)
    else Toast.info('已经是第一章')
  }

  const next = () => {
    if (current < chapters.length - 1) goChapter(current + 1)
    else Toast.info('已经是最后一章')
  }

  return (
    <div className="reader-page">
      <NavBar
        title={book.title}
        leftArrow
        rightText="章节"
        onClickLeft={() => navigate(-1)}
        onClickRight={() => setVisible(true)}
      />

      <div className="reader-content" style={{ fontSize }}>
        <h2 className="chapter-title">{chapters[current].title}</h2>
        <div className="chapter-body">
          {Array.from({ length: 8 }).map((_, i) => (
            <p key={i}>
              这是示例章节内容段落 {i + 1}。为了演示阅读器功能，文本使用占位内容并根据设置的字体大小进行展示。
            </p>
          ))}
        </div>
      </div>

      <div className="reader-actions">
        <Button size="large" type="default" onClick={prev}>
          上一章
        </Button>
        <Button size="large" type="primary" color="#ff6b35" onClick={next}>
          下一章
        </Button>
        <Button size="large" type="default" onClick={() => setSettingsVisible(true)}>
          设置
        </Button>
      </div>

      <Popup visible={visible} position="bottom" round onClose={() => setVisible(false)}>
        <div className="chapters-popup">
          <div className="popup-title">章节列表</div>
          <div className="chapters-list">
            {chapters.map((c, idx) => (
              <Cell
                key={c.id}
                title={c.title}
                clickable
                onClick={() => {
                  goChapter(idx)
                  setVisible(false)
                }}
              />
            ))}
          </div>
        </div>
      </Popup>

      <ActionSheet
        visible={settingsVisible}
        onCancel={() => setSettingsVisible(false)}
        title="阅读设置"
        actions={[
          { name: '小号字体', callback: () => useAppStore.getState().setFontSize(14) },
          { name: '标准字体', callback: () => useAppStore.getState().setFontSize(16) },
          { name: '大号字体', callback: () => useAppStore.getState().setFontSize(18) },
          { name: '超大字体', callback: () => useAppStore.getState().setFontSize(20) },
          { name: '取消' },
        ]}
      />
    </div>
  )
}
