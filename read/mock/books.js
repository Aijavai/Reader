export default [
  {
    url: '/api/books/search',
    method: 'get',
    response: ({ query }) => {
      const keyword = query?.q || ''
      const data = [
        { id: 1, title: '凡人修仙传', author: '武侠仙侠', category: '已完结', words: '748万字', views: '1.9万次搜索' },
        { id: 2, title: '遮天', author: '武侠仙侠', category: '已完结', words: '636万字', views: '1.7万次搜索' },
        { id: 3, title: '斗破苍穹', author: '玄幻奇幻', category: '已完结', words: '535万字', views: '1.7万次搜索' },
        { id: 4, title: '校花的贴身高手', author: '都市', category: '连载中', words: '2517万字', views: '3.9万次搜索' },
      ]
      return data.filter(
        (b) => b.title.includes(keyword) || b.author.includes(keyword)
      )
    },
  },
  {
    url: /\/api\/books\/\d+$/,
    method: 'get',
    response: ({ url }) => {
      const id = Number(url.split('/').pop())
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
    },
  },
  {
    url: /\/api\/books\/\d+\/chapters$/,
    method: 'get',
    response: ({ url }) => {
      const chapters = Array.from({ length: 20 }).map((_, i) => ({
        id: i + 1,
        title: `第${i + 1}章 假数据 ${i + 1}`,
      }))
      return chapters
    },
  },
]
