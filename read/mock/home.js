export default [
  {
    url: '/api/home',
    method: 'get',
    response: () => ({
      recommendBooks: [
        { id: 1, title: '神秘复苏', author: '佛前献花', cover: '', rank: 1, isTop: true, category: '技术流' },
        { id: 2, title: '我师兄实在太稳健了', author: '言归正传', cover: '', rank: 2, isTop: true, category: '穿越文' },
        { id: 3, title: '驭房有术', author: '随身流', cover: '', rank: 3 },
        { id: 4, title: '这游戏也太真实了', author: '晨星LL', cover: '', rank: 4, category: '科幻文' },
        { id: 5, title: '第一序列', author: '会说话的肘子', cover: '', rank: 5, category: '系统文' },
        { id: 6, title: '我在修仙界种长生', author: '草根编剧', cover: '', rank: 6 },
        { id: 7, title: '我的御兽真不是邪神', author: '开荒', cover: '', rank: 7 },
        { id: 8, title: '仙途凡修', author: '凡人流', cover: '', rank: 8 },
      ],
      categories: [
        { name: '都市', color: '#ff6b35' },
        { name: '玄幻', color: '#4ecdc4' },
        { name: '悬疑', color: '#45b7d1' },
        { name: '历史', color: '#96ceb4' },
        { name: '科幻', color: '#feca57' },
        { name: '仙侠', color: '#ff9ff3' },
      ],
      hotBooks: [
        { id: 101, title: '我的总裁老婆很凶', cover: '', score: '8.6分' },
        { id: 102, title: '海贼：从白色城堡开始', cover: '', score: '9.5分' },
        { id: 103, title: '强龙出狱', cover: '', score: '8.4分' },
        { id: 104, title: '龙王出狱', cover: '', score: '8.8分' },
      ],
    }),
  },
]
