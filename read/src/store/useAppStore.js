import { create } from 'zustand'
import { storage } from '../utils'

// 全局应用状态管理
const useAppStore = create((set, get) => {
  // 从本地存储获取搜索历史
  const searchHistory = storage.get('searchHistory') || []
  
  return {
    // 搜索相关状态
    searchHistory,
    searchResults: [],
    isSearching: false,
    
    // 用户偏好
    theme: storage.get('theme') || 'light',
    fontSize: storage.get('fontSize') || 'medium',
    
    // 阅读历史
    readingHistory: storage.get('readingHistory') || [],
    
    // 书架数据
    bookshelfBooks: storage.get('bookshelfBooks') || [],
    
    // 搜索历史管理
    addSearchHistory: (keyword) => {
      const { searchHistory } = get()
      if (!keyword.trim()) return
      
      // 去重并添加到开头
      const newHistory = [keyword, ...searchHistory.filter(item => item !== keyword)]
      // 限制历史记录数量
      const limitedHistory = newHistory.slice(0, 10)
      
      set({ searchHistory: limitedHistory })
      storage.set('searchHistory', limitedHistory)
    },
    
    clearSearchHistory: () => {
      set({ searchHistory: [] })
      storage.remove('searchHistory')
    },
    
    // 搜索结果管理
    setSearchResults: (results) => {
      set({ searchResults: results })
    },
    
    setSearching: (isSearching) => {
      set({ isSearching })
    },
    
    // 主题管理
    setTheme: (theme) => {
      set({ theme })
      storage.set('theme', theme)
    },
    
    // 字体大小管理
    setFontSize: (fontSize) => {
      set({ fontSize })
      storage.set('fontSize', fontSize)
    },
    
    // 阅读历史管理
    addReadingHistory: (book) => {
      const { readingHistory } = get()
      const prev = readingHistory.find((i) => i.id === book.id) || {}
      const merged = { ...prev, ...book, readTime: Date.now() }
      const newHistory = [merged, ...readingHistory.filter(item => item.id !== book.id)]
      const limitedHistory = newHistory.slice(0, 50)
      set({ readingHistory: limitedHistory })
      storage.set('readingHistory', limitedHistory)
    },
    updateReadingProgress: (bookId, progress) => {
      const { readingHistory } = get()
      const updated = readingHistory.map((item) =>
        item.id === bookId ? { ...item, ...progress, readTime: Date.now() } : item
      )
      set({ readingHistory: updated })
      storage.set('readingHistory', updated)
    },
    updateBookshelfProgress: (bookId, percentage) => {
      const { bookshelfBooks } = get()
      const updated = bookshelfBooks.map((b) =>
        b.id === bookId ? { ...b, progress: percentage } : b
      )
      set({ bookshelfBooks: updated })
      storage.set('bookshelfBooks', updated)
    },
    updateBookshelfMeta: (bookId, patch) => {
      const { bookshelfBooks } = get()
      const updated = bookshelfBooks.map((b) =>
        b.id === bookId ? { ...b, ...patch } : b
      )
      set({ bookshelfBooks: updated })
      storage.set('bookshelfBooks', updated)
    },
    clearReadingHistory: () => {
      set({ readingHistory: [] })
      storage.remove('readingHistory')
    },
    
    // 书架管理
    addToBookshelf: (book) => {
      const { bookshelfBooks } = get()
      if (bookshelfBooks.find(item => item.id === book.id)) return
      
      const newBooks = [...bookshelfBooks, { ...book, addTime: Date.now() }]
      set({ bookshelfBooks: newBooks })
      storage.set('bookshelfBooks', newBooks)
    },
    
    removeFromBookshelf: (bookId) => {
      const { bookshelfBooks } = get()
      const newBooks = bookshelfBooks.filter(book => book.id !== bookId)
      set({ bookshelfBooks: newBooks })
      storage.set('bookshelfBooks', newBooks)
    }
  }
})

export default useAppStore
export { useAppStore }
