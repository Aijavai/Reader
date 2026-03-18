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
    { id: 1, title: '凡人修仙传', author: '忘语', category: '仙侠', words: '748万字', views: '1.9万次搜索', cover: '', status: '已完结' },
    { id: 2, title: '遮天', author: '辰东', category: '仙侠', words: '636万字', views: '1.7万次搜索', cover: '', status: '已完结' },
    { id: 3, title: '斗破苍穹', author: '天蚕土豆', category: '玄幻', words: '535万字', views: '1.7万次搜索', cover: '', status: '已完结' },
    { id: 4, title: '全属性武道', author: '莫入江湖', category: '玄幻', words: '456万字', views: '1.2万次搜索', cover: '', status: '连载中' },
    { id: 5, title: '大奉打更人', author: '卖报小郎君', category: '仙侠', words: '380万字', views: '2.1万次搜索', cover: '', status: '已完结' },
    { id: 6, title: '诡秘之主', author: '爱潜水的乌贼', category: '玄幻', words: '446万字', views: '2.5万次搜索', cover: '', status: '已完结' },
    { id: 7, title: '完美世界', author: '辰东', category: '玄幻', words: '658万字', views: '1.6万次搜索', cover: '', status: '已完结' },
    { id: 8, title: '诛仙', author: '萧鼎', category: '仙侠', words: '120万字', views: '1.1万次搜索', cover: '', status: '已完结' },
    { id: 9, title: '雪中悍刀行', author: '烽火戏诸侯', category: '武侠', words: '461万字', views: '1.4万次搜索', cover: '', status: '已完结' },
    { id: 10, title: '剑来', author: '烽火戏诸侯', category: '仙侠', words: '900万字', views: '3.2万次搜索', cover: '', status: '连载中' },
    { id: 11, title: '圣墟', author: '辰东', category: '玄幻', words: '500万字', views: '1.8万次搜索', cover: '', status: '已完结' },
    { id: 12, title: '一念永恒', author: '耳根', category: '仙侠', words: '360万字', views: '1.3万次搜索', cover: '', status: '已完结' },
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
