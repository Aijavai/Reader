import http from './config'

const local = {
  home: {
    recommendBooks: [
      { id: 1, title: '神秘复苏', author: '佛前献花', cover: '', rank: 1, isTop: true, category: '技术流' },
      { id: 2, title: '我师兄实在太稳健了', author: '言归正传', cover: '', rank: 2, isTop: true, category: '穿越文' },
    ],
    categories: [
      { name: '都市', color: '#ff6b35' },
      { name: '玄幻', color: '#4ecdc4' },
    ],
    hotBooks: [
      { id: 101, title: '我的总裁老婆很凶', cover: '', score: '8.6分' },
      { id: 102, title: '海贼：从白色城堡开始', cover: '', score: '9.5分' },
    ],
  },
  categories: {
    hot: [
      { id: 1, name: '都市', color: '#ff6b35' },
      { id: 2, name: '玄幻', color: '#4ecdc4' },
    ],
    plot: [
      { id: 1, name: '扮猪吃虎', color: '#ff6b35' },
      { id: 2, name: '强者归来', color: '#4ecdc4' },
    ],
  },
  books: [
    { id: 1, title: '凡人修仙传', author: '武侠仙侠', category: '已完结', words: '748万字', views: '1.9万次搜索' },
    { id: 2, title: '遮天', author: '武侠仙侠', category: '已完结', words: '636万字', views: '1.7万次搜索' },
    { id: 3, title: '斗破苍穹', author: '玄幻奇幻', category: '已完结', words: '535万字', views: '1.7万次搜索' },
  ],
}

export async function getHomeData() {
  try {
    const res = await http.get('/home')
    return res || local.home
  } catch {
    return local.home
  }
}

export async function getCategories() {
  try {
    const res = await http.get('/categories')
    return res || local.categories
  } catch {
    return local.categories
  }
}

export async function searchBooks(keyword) {
  try {
    const res = await http.get('/books/search', { params: { q: keyword } })
    return Array.isArray(res) ? res : []
  } catch {
    return local.books.filter(
      (b) => b.title.includes(keyword) || b.author.includes(keyword)
    )
  }
}

export async function getBookDetail(id) {
  try {
    const res = await http.get(`/books/${id}`)
    return res
  } catch {
    return {
      id,
      title: '全属性武道',
      author: '莫入江湖',
      description: '示例书籍简介文本，用于演示详情数据。',
      tags: ['都市', '系统', '爽文'],
      score: '9.2',
      status: '连载中',
      wordCount: '456万字',
      updateTime: '2小时前',
      chapterCount: '第2156章',
    }
  }
}

export async function getChapters(id) {
  try {
    const res = await http.get(`/books/${id}/chapters`)
    return Array.isArray(res) ? res : []
  } catch {
    return Array.from({ length: 20 }).map((_, i) => ({ id: i + 1, title: `第${i + 1}章 假数据 ${i + 1}` }))
  }
}
