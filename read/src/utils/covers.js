// 书籍封面映射表
// 使用豆瓣图书封面 CDN，按书籍 id 映射
export const BOOK_COVERS = {
  1:  'https://img2.doubanio.com/view/subject/s/public/s1727290.jpg',  // 凡人修仙传
  2:  'https://img1.doubanio.com/view/subject/s/public/s4554055.jpg',  // 遮天
  3:  'https://img2.doubanio.com/view/subject/s/public/s3131470.jpg',  // 斗破苍穹
  4:  'https://img9.doubanio.com/view/subject/s/public/s33934224.jpg', // 全属性武道
  5:  'https://img9.doubanio.com/view/subject/s/public/s33697827.jpg', // 大奉打更人
  6:  'https://img2.doubanio.com/view/subject/s/public/s33896248.jpg', // 诡秘之主
  7:  'https://img1.doubanio.com/view/subject/s/public/s6956554.jpg',  // 完美世界
  8:  'https://img9.doubanio.com/view/subject/s/public/s34264140.jpg', // 剑来
  9:  'https://img2.doubanio.com/view/subject/s/public/s29564742.jpg', // 雪中悍刀行
  10: 'https://img9.doubanio.com/view/subject/s/public/s33826724.jpg', // 神秘复苏
  11: 'https://img2.doubanio.com/view/subject/s/public/s33950413.jpg', // 我师兄实在太稳健了
  12: 'https://img1.doubanio.com/view/subject/s/public/s28968210.jpg', // 一念永恒
}

// 获取封面，找不到时降级到风格化占位图
export const getCover = (id) => {
  return BOOK_COVERS[id] || `https://picsum.photos/seed/novel${id}/120/160`
}
