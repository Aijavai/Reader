export default [
  {
    url: '/api/categories',
    method: 'get',
    response: () => ({
      hot: [
        { id: 1, name: '都市', color: '#ff6b35' },
        { id: 2, name: '玄幻', color: '#4ecdc4' },
        { id: 3, name: '历史', color: '#45b7d1' },
        { id: 4, name: '科幻', color: '#96ceb4' },
        { id: 5, name: '游戏', color: '#feca57' },
        { id: 6, name: '悬疑', color: '#ff9ff3' },
      ],
      plot: [
        { id: 1, name: '扮猪吃虎', color: '#ff6b35' },
        { id: 2, name: '强者归来', color: '#4ecdc4' },
        { id: 3, name: '升级流', color: '#feca57' },
        { id: 4, name: '无敌流', color: '#ff9ff3' },
      ],
    }),
  },
]
