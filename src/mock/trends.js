// 校园热点与趋势 Mock 数据

export const mockTrends = [
  // ===== 热门热点 =====
  {
    id: 't1',
    title: '#宿舍空调大战',
    desc: '夏天太热了，但宿舍空调开多少度、开多久成了舍友间的终极博弈。',
    heat: 3421,
    trend: 'hot',
    category: 'hot',
    relatedPosts: ['p001', 'p003', 'p006'],
    relatedCircles: ['c3'],
    relatedTags: ['宿舍日常', '吐槽', '夏日']
  },
  {
    id: 't2',
    title: '#期末周精神状态',
    desc: '“只要胆子大，期末放长假”，同学们纷纷晒出自己在自习室的搞笑瞬间。',
    heat: 2890,
    trend: 'up',
    category: 'hot',
    relatedPosts: ['p002', 'p004'],
    relatedCircles: ['c2'],
    relatedTags: ['期末复习', '自习', '干货']
  },
  {
    id: 't3',
    title: '#大学生到底有多穷',
    desc: '月底的钱包比脸还干净，吃土少年的省钱绝招大公开。',
    heat: 1984,
    trend: 'new',
    category: 'hot',
    relatedPosts: ['p001', 'p005'],
    relatedCircles: ['c3'],
    relatedTags: ['闲聊', '吃土', '避坑']
  },
  {
    id: 't4',
    title: '#食堂二楼新烤肉饭',
    desc: '排队半小时起步的新晋网红烤肉饭，到底值不值得一试？',
    heat: 1420,
    trend: 'up',
    category: 'hot',
    relatedPosts: ['p001', 'p003'],
    relatedCircles: ['c1'],
    relatedTags: ['美食', '食堂测评', '安利']
  },

  // ===== 最新热点 =====
  {
    id: 't5',
    title: '#偶遇操场黑猫',
    desc: '操场跑道旁出现了一只戴着红色项圈的黑猫，性格非常黏人。',
    heat: 820,
    trend: 'new',
    category: 'newest',
    relatedPosts: ['p001'],
    relatedCircles: ['c3'],
    relatedTags: ['校园活动', '宠物', '偶遇']
  },
  {
    id: 't6',
    title: '#西区路灯又坏了',
    desc: '西区羽毛球场旁边的两盏路灯已经连续闪烁三天，夜行同学请注意安全。',
    heat: 650,
    trend: 'up',
    category: 'newest',
    relatedPosts: ['p005', 'p007'],
    relatedCircles: ['c3'],
    relatedTags: ['安全', '吐槽', '校园日常']
  },
  {
    id: 't7',
    title: '#四六级保过玄学',
    desc: '考前换上锦鲤头像、转发这只烤鸭，今年四六级稳了？',
    heat: 580,
    trend: 'up',
    category: 'newest',
    relatedPosts: ['p002'],
    relatedCircles: ['c2'],
    relatedTags: ['四六级', '玄学', '备考']
  },

  // ===== 本校热点 =====
  {
    id: 't8',
    title: '#东区跳蚤市场开市',
    desc: '大四学长学姐的毕业清仓甩卖，各种考研资料、数码配件白菜价。',
    heat: 1750,
    trend: 'hot',
    category: 'school',
    relatedPosts: ['p001', 'p002'],
    relatedCircles: ['c2'],
    relatedTags: ['二手闲置', '毕业季', '淘货']
  },
  {
    id: 't9',
    title: '#自习室抢座攻略',
    desc: '早上六点半的排队大军，教你如何优雅地占到带插座的黄金座位。',
    heat: 1210,
    trend: 'up',
    category: 'school',
    relatedPosts: ['p002', 'p005'],
    relatedCircles: ['c2'],
    relatedTags: ['学习干货', '自习', '考研']
  },
  {
    id: 't10',
    title: '#校选课避坑指南',
    desc: '哪些选课给分超高？哪些老师上课风趣幽默绝不点名？',
    heat: 990,
    trend: 'new',
    category: 'school',
    relatedPosts: ['p002', 'p004'],
    relatedCircles: ['c2'],
    relatedTags: ['选课攻略', '选课', '干货']
  },

  // ===== 同城热点 =====
  {
    id: 't11',
    title: '#同城毕业音乐会',
    desc: '本周末同城五校联合举办露天音乐节，持学生证免费入场。',
    heat: 2310,
    trend: 'hot',
    category: 'city',
    relatedPosts: ['p003', 'p006'],
    relatedCircles: ['c1'],
    relatedTags: ['演出', '音乐', '周末去哪儿']
  },
  {
    id: 't12',
    title: '#同城摄影大赛征集',
    desc: '“镜头下的高校之美”同城青年摄影大赛开始报名，奖品丰厚。',
    heat: 1540,
    trend: 'up',
    category: 'city',
    relatedPosts: ['p003'],
    relatedCircles: ['c1'],
    relatedTags: ['摄影', '比赛', '活动']
  },
  {
    id: 't13',
    title: '#周末狼人杀搭子',
    desc: '五道口线下桌游，目前7缺5，欢迎各位戏精新手或高玩加入。',
    heat: 1100,
    trend: 'new',
    category: 'city',
    relatedPosts: ['p001', 'p006'],
    relatedCircles: ['c3'],
    relatedTags: ['搭子', '桌游', '周末活动']
  }
]

// ===== 趋势专题 =====
export const mockTopics = [
  {
    id: 'tp1',
    name: '校园穿搭季',
    desc: '做操场上最亮眼的仔',
    gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)',
    icon: '👗',
    relatedTag: '穿搭'
  },
  {
    id: 'tp2',
    name: '四六级冲刺',
    desc: '最后一周，真题通关',
    gradient: 'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)',
    icon: '📝',
    relatedTag: '四六级'
  },
  {
    id: 'tp3',
    name: '毕业旅行日记',
    desc: '致青春的一场出逃',
    gradient: 'linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)',
    icon: '✈️',
    relatedTag: '旅行'
  },
  {
    id: 'tp4',
    name: '考研上岸打卡',
    desc: '研路漫漫，顶峰相见',
    gradient: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
    icon: '🎓',
    relatedTag: '考研'
  },
  {
    id: 'tp5',
    name: '暑假实习情报',
    desc: '大厂春招/实习攻略',
    gradient: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
    icon: '💼',
    relatedTag: '实习'
  }
]

// ===== 猜你感兴趣 =====
export const mockInterestTags = [
  '摄影约拍',
  '期末不挂科',
  '猫片大赏',
  '食堂红黑榜',
  '图书馆空调好凉',
  '今天吃什么',
  '摇滚协会招新',
  '选修课老师求放过'
]
