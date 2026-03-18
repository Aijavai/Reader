export default [
  {
    url: '/api/home',
    method: 'get',
    response: () => ({
      recommendBooks: [
        { id: 8,  title: '剑来',           author: '烽火戏诸侯', rank: 1, isTop: true,  category: '仙侠',  cover: 'https://img9.doubanio.com/view/subject/s/public/s34264140.jpg', description: '少年陈平安持剑走天下，一步一脚印走出属于自己的道路。' },
        { id: 6,  title: '诡秘之主',       author: '爱潜水的乌贼', rank: 2, isTop: true,  category: '西幻',  cover: 'https://img2.doubanio.com/view/subject/s/public/s33896248.jpg', description: '蒸汽与魔法交织的世界，克莱恩以愚者之名踏上诡秘之路。' },
        { id: 4,  title: '全属性武道',     author: '莫入江湖',   rank: 3, isTop: true,  category: '玄幻',  cover: 'https://img9.doubanio.com/view/subject/s/public/s33934224.jpg', description: '王斗穿越异界，发现自己能捡取他人掉落的属性点，从此开挂人生。' },
        { id: 5,  title: '大奉打更人',     author: '卖报小郎君', rank: 4, isTop: false, category: '仙侠',  cover: 'https://img9.doubanio.com/view/subject/s/public/s33697827.jpg', description: '打更人许七安卷入皇朝阴谋，凭智慧与武力一步步揭开真相。' },
        { id: 9,  title: '雪中悍刀行',     author: '烽火戏诸侯', rank: 5, isTop: false, category: '武侠',  cover: 'https://img2.doubanio.com/view/subject/s/public/s29564742.jpg', description: '北凉世子徐凤年三入江湖，由纨绔子弟蜕变为一代枭雄。' },
        { id: 1,  title: '凡人修仙传',     author: '忘语',       rank: 6, isTop: false, category: '仙侠',  cover: 'https://img2.doubanio.com/view/subject/s/public/s1727290.jpg', description: '资质平平的韩立凭借坚韧走上修仙之路，历经万年终成大能。' },
        { id: 2,  title: '遮天',           author: '辰东',       rank: 7, isTop: false, category: '玄幻',  cover: 'https://img1.doubanio.com/view/subject/s/public/s4554055.jpg', description: '叶凡自古星起步，一路遮天蔽日，踏碎一切阻挡在前的神魔。' },
        { id: 3,  title: '斗破苍穹',       author: '天蚕土豆',   rank: 8, isTop: false, category: '玄幻',  cover: 'https://img2.doubanio.com/view/subject/s/public/s3131470.jpg', description: '废材少年萧炎得到戒指中的老者相助，在斗气世界中强势崛起。' },
      ],
      categories: [
        { name: '都市', color: '#ff6b35' },
        { name: '玄幻', color: '#4ecdc4' },
        { name: '悬疑', color: '#45b7d1' },
        { name: '历史', color: '#96ceb4' },
        { name: '科幻', color: '#feca57' },
        { name: '仙侠', color: '#ff9ff3' },
        { name: '武侠', color: '#54a0ff' },
        { name: '奇幻', color: '#5f27cd' },
      ],
      hotBooks: [
        { id: 6,  title: '诡秘之主',   score: '9.6' },
        { id: 8,  title: '剑来',       score: '9.7' },
        { id: 5,  title: '大奉打更人', score: '9.4' },
        { id: 1,  title: '凡人修仙传', score: '9.5' },
      ],
    }),
  },
]
