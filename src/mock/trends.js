// 校园热搜/热点与趋势 Mock 数据

export const mockTrends = [
  // ==================== 我的（猜你喜欢） ====================
  {
    id: 't_mine_1',
    title: '#计算机期末周#',
    desc: '计算机系期末专业课连考，敲代码写算法的精神状态大赏。',
    heat: '34.5万',
    trend: 'hot',
    category: 'mine',
    relatedPosts: ['p001', 'p002', 'p003'],
    relatedCircles: ['c2'],
    relatedTags: ['期末', '考试', '熬夜']
  },
  {
    id: 't_mine_2',
    title: '#学校猫猫图鉴#',
    desc: '校园里的流浪猫大盘点！橘猫、黑猫、三花猫，谁是顶流？',
    heat: '28.2万',
    trend: 'up',
    category: 'mine',
    relatedPosts: ['p005', 'p008'],
    relatedCircles: ['c3'],
    relatedTags: ['猫咪', '宠物', '治愈']
  },
  {
    id: 't_mine_3',
    title: '#考研数学#',
    desc: '暑期备考黄金期，考研数学一二三如何高效刷真题？',
    heat: '21.0万',
    trend: 'hot',
    category: 'mine',
    relatedPosts: ['p002', 'p004'],
    relatedCircles: ['c2'],
    relatedTags: ['考研', '学习', '数学']
  },
  {
    id: 't_mine_4',
    title: '#校园OOTD#',
    desc: '夏日防晒与时尚兼得，大学生夏日经典穿搭分享。',
    heat: '18.5万',
    trend: 'up',
    category: 'mine',
    relatedPosts: ['p010', 'p013'],
    relatedCircles: ['c1'],
    relatedTags: ['穿搭', '时尚', '审美']
  },
  {
    id: 't_mine_5',
    title: '#六级成绩#',
    desc: '英语四六级成绩即将公布，保过玄学和查分指南。',
    heat: '15.6万',
    trend: 'new',
    category: 'mine',
    relatedPosts: ['p002', 'p007'],
    relatedCircles: ['c2'],
    relatedTags: ['英语', '四六级', '考试']
  },
  {
    id: 't_mine_6',
    title: '#宿舍熄灯后的茶话会#',
    desc: '每天熄灯后的深夜卧谈会，从八卦聊到人生理想。',
    heat: '12.4万',
    trend: 'up',
    category: 'mine',
    relatedPosts: ['p006', 'p012'],
    relatedCircles: ['c3'],
    relatedTags: ['宿舍', '八卦', '深夜']
  },
  {
    id: 't_mine_7',
    title: '#大学体育选课避坑#',
    desc: '太极拳、太极剑、健美操、足球，哪个项目最好拿绩点？',
    heat: '9.8万',
    trend: 'new',
    category: 'mine',
    relatedPosts: ['p003', 'p015'],
    relatedCircles: ['c2'],
    relatedTags: ['选课', '体育', '绩点']
  },
  {
    id: 't_mine_8',
    title: '#食堂新开的拌饭#',
    desc: '西区食堂一楼新开张的石锅拌饭，排队人山人海到底值不值？',
    heat: '8.5万',
    trend: 'up',
    category: 'mine',
    relatedPosts: ['p001', 'p011'],
    relatedCircles: ['c1'],
    relatedTags: ['美食', '食堂', '干饭']
  },
  {
    id: 't_mine_9',
    title: '#暑假留校日常#',
    desc: '留校考研、做实验、做项目的同学们，酷暑防暑指南。',
    heat: '6.2万',
    trend: 'new',
    category: 'mine',
    relatedPosts: ['p004', 'p014'],
    relatedCircles: ['c2'],
    relatedTags: ['暑假', '留校', '日常']
  },
  {
    id: 't_mine_10',
    title: '#图书馆占座大法#',
    desc: '如何在教二黄金座位占到带独立插口的位置？',
    heat: '4.8万',
    trend: 'up',
    category: 'mine',
    relatedPosts: ['p002', 'p005'],
    relatedCircles: ['c2'],
    relatedTags: ['图书馆', '学习', '占座']
  },

  // ==================== 热门（实时热搜） ====================
  {
    id: 't_hot_1',
    title: '#六级成绩出了#',
    desc: '教务网查分系统瞬间崩溃，微信群聊刷屏，你的分过了吗？',
    heat: '34.5万',
    trend: 'hot',
    category: 'hot',
    relatedPosts: ['p002', 'p007'],
    relatedCircles: ['c2'],
    relatedTags: ['六级', '查分', '备考']
  },
  {
    id: 't_hot_2',
    title: '#图书馆橘猫又来了#',
    desc: '胖橘大摇大摆占据了备考桌，并靠在同学的英语书上睡着了。',
    heat: '28.2万',
    trend: 'hot',
    category: 'hot',
    relatedPosts: ['p005', 'p008'],
    relatedCircles: ['c3'],
    relatedTags: ['橘猫', '图书馆', '萌宠']
  },
  {
    id: 't_hot_3',
    title: '#学校开始查寝了#',
    desc: '本周违章电器突击大检查，热得快、小电锅、吹风机何去何从？',
    heat: '22.0万',
    trend: 'new',
    category: 'hot',
    relatedPosts: ['p006', 'p012'],
    relatedCircles: ['c3'],
    relatedTags: ['查寝', '安全', '违章电器']
  },
  {
    id: 't_hot_4',
    title: '#宿舍空调大战#',
    desc: '舍友间的博弈：开24度觉得冷，开26度觉得热，终极折中方案出炉？',
    heat: '19.8万',
    trend: 'hot',
    category: 'hot',
    relatedPosts: ['p001', 'p003', 'p006'],
    relatedCircles: ['c3'],
    relatedTags: ['空调', '博弈', '夏日']
  },
  {
    id: 't_hot_5',
    title: '#期末周精神状态#',
    desc: '“只要胆子大，期末放长假”，在自习室复习的同学们神表情合集。',
    heat: '18.2万',
    trend: 'up',
    category: 'hot',
    relatedPosts: ['p002', 'p004'],
    relatedCircles: ['c2'],
    relatedTags: ['期末', '自习室', '搞笑']
  },
  {
    id: 't_hot_6',
    title: '#食堂二楼新烤肉饭#',
    desc: '排队半小时起的网红烤肉饭，外焦里嫩，酱汁浓郁真的太绝了。',
    heat: '15.4万',
    trend: 'up',
    category: 'hot',
    relatedPosts: ['p001', 'p011'],
    relatedCircles: ['c1'],
    relatedTags: ['美食', '干饭', '避坑']
  },
  {
    id: 't_hot_7',
    title: '#同城毕业音乐会#',
    desc: '本周末五校联合露天音乐节，持学生证即可免票进场。',
    heat: '14.1万',
    trend: 'hot',
    category: 'hot',
    relatedPosts: ['p003', 'p006', 'p009'],
    relatedCircles: ['c1'],
    relatedTags: ['音乐会', '毕业生', '摇滚']
  },
  {
    id: 't_hot_8',
    title: '#偶遇操场黑猫#',
    desc: '戴着红项圈的操场黑猫，今天成功从十几个同学手里蹭到了猫罐头。',
    heat: '11.2万',
    trend: 'new',
    category: 'hot',
    relatedPosts: ['p005', 'p008'],
    relatedCircles: ['c3'],
    relatedTags: ['操场', '黑猫', '罐头']
  },
  {
    id: 't_hot_9',
    title: '#西区路灯又坏了#',
    desc: '羽毛球场旁边路灯闪了三天还没修，晚上回去的同学结伴而行。',
    heat: '9.5万',
    trend: 'up',
    category: 'hot',
    relatedPosts: ['p005', 'p012'],
    relatedCircles: ['c3'],
    relatedTags: ['路灯', '吐槽', '安全']
  },
  {
    id: 't_hot_10',
    title: '#四六级保过玄学#',
    desc: '换上转发这只锦鲤，期末四六级分数直接拉满？',
    heat: '8.0万',
    trend: 'up',
    category: 'hot',
    relatedPosts: ['p002', 'p007'],
    relatedCircles: ['c2'],
    relatedTags: ['玄学', '锦鲤', '过过过']
  },

  // ==================== 同城热点 ====================
  {
    id: 't_city_1',
    title: '#同城毕业音乐会#',
    desc: '五校毕业生草坪弹唱夜，今年夏天的最后一首青春合唱。',
    heat: '23.1万',
    trend: 'hot',
    category: 'city',
    relatedPosts: ['p003', 'p009'],
    relatedCircles: ['c1'],
    relatedTags: ['同城', '音乐会', '青春']
  },
  {
    id: 't_city_2',
    title: '#同城青年摄影大赛#',
    desc: '“寻找高校之美”大赛开始，获胜者奖品为最新款微单。',
    heat: '15.4万',
    trend: 'up',
    category: 'city',
    relatedPosts: ['p003', 'p013'],
    relatedCircles: ['c1'],
    relatedTags: ['摄影', '比赛', '同城']
  },
  {
    id: 't_city_3',
    title: '#同城漫展组队#',
    desc: '下周末会展中心ACG同好线下聚会，找CN、摄影以及妆娘。',
    heat: '11.0万',
    trend: 'new',
    category: 'city',
    relatedPosts: ['p006', 'p010'],
    relatedCircles: ['c1'],
    relatedTags: ['漫展', '动漫', '二次元']
  },
  {
    id: 't_city_4',
    title: '#周末狼人杀搭子#',
    desc: '五道口桌游吧线下聚会开局，差2个警徽流高端局。',
    heat: '9.2万',
    trend: 'up',
    category: 'city',
    relatedPosts: ['p006', 'p015'],
    relatedCircles: ['c3'],
    relatedTags: ['狼人杀', '搭子', '周末']
  },
  {
    id: 't_city_5',
    title: '#五道口周末美食攻略#',
    desc: '适合学生聚餐的人均50元超值韩料、日料店红黑榜。',
    heat: '6.8万',
    trend: 'new',
    category: 'city',
    relatedPosts: ['p001', 'p011'],
    relatedCircles: ['c1'],
    relatedTags: ['美食', '聚餐', '推荐']
  },
  {
    id: 't_city_6',
    title: '#全市暴雨橙色预警#',
    desc: '明后天全市范围特大暴雨，非必要不出校门，注意防汛。',
    heat: '5.4万',
    trend: 'up',
    category: 'city',
    relatedPosts: ['p005', 'p012'],
    relatedCircles: ['c3'],
    relatedTags: ['天气', '预警', '防雷防雨']
  },

  // ==================== 本校热点 ====================
  {
    id: 't_school_1',
    title: '#东区跳蚤市场开市#',
    desc: '毕业生搬宿舍大甩卖，各种风扇、考研真题、自行车一律白菜价。',
    heat: '17.5万',
    trend: 'hot',
    category: 'school',
    relatedPosts: ['p001', 'p002', 'p015'],
    relatedCircles: ['c2'],
    relatedTags: ['闲置', '二手', '毕业季']
  },
  {
    id: 't_school_2',
    title: '#自习室抢座攻略#',
    desc: '教二黄金位置空调冷气最足、插座最多，早上排队时间指南。',
    heat: '12.1万',
    trend: 'up',
    category: 'school',
    relatedPosts: ['p002', 'p005'],
    relatedCircles: ['c2'],
    relatedTags: ['自习', '抢座', '干货']
  },
  {
    id: 't_school_3',
    title: '#校选课避坑指南#',
    desc: '学长学姐带你避坑：哪些通识课老师不给高分还爱挂人？',
    heat: '9.9万',
    trend: 'new',
    category: 'school',
    relatedPosts: ['p002', 'p004', 'p014'],
    relatedCircles: ['c2'],
    relatedTags: ['选课', '高分', '避雷']
  },
  {
    id: 't_school_4',
    title: '#一教多媒体系统故障#',
    desc: '一教投影仪罢工，教授硬生生手写了八块黑板公式，太硬核了。',
    heat: '7.2万',
    trend: 'up',
    category: 'school',
    relatedPosts: ['p002', 'p004'],
    relatedCircles: ['c2'],
    relatedTags: ['上课', '投影仪', '硬核']
  },
  {
    id: 't_school_5',
    title: '#校猫大橘喜提新豪宅#',
    desc: '爱猫协为大橘在大礼堂门口用木头搭了一座防风防雨的二层猫别墅。',
    heat: '5.5万',
    trend: 'new',
    category: 'school',
    relatedPosts: ['p005', 'p008'],
    relatedCircles: ['c3'],
    relatedTags: ['大橘', '猫咪别墅', '爱猫']
  },
  {
    id: 't_school_6',
    title: '#宿管阿姨爱心送饭#',
    desc: '西区四舍阿姨为期末周复习到深夜的考研人亲手熬了爱心绿豆沙。',
    heat: '3.8万',
    trend: 'up',
    category: 'school',
    relatedPosts: ['p006', 'p012'],
    relatedCircles: ['c3'],
    relatedTags: ['温暖', '宿管阿姨', '期末周']
  },

  // ==================== 摄影频道话题 ====================
  {
    id: 't_photo_1',
    title: '#黄金时间夕阳剪影#',
    desc: '下午六点到六点半，在操场看日落顺便拍出唯美剪影照片。',
    heat: '14.5万',
    trend: 'hot',
    category: 'photography',
    relatedPosts: ['p003', 'p013'],
    relatedCircles: ['c1'],
    relatedTags: ['夕阳', '人像', '机位']
  },
  {
    id: 't_photo_2',
    title: '#第一台微单买什么#',
    desc: '预算3k-8k，大学生新手入门买索尼、佳能还是富士？',
    heat: '8.2万',
    trend: 'up',
    category: 'photography',
    relatedPosts: ['p002', 'p013'],
    relatedCircles: ['c2'],
    relatedTags: ['微单', '相机', '入门']
  },
  {
    id: 't_photo_3',
    title: '#高颜值校园航拍#',
    desc: '用无人机俯瞰落日下的钟楼 and 图书馆，构图分享。',
    heat: '3.1万',
    trend: 'new',
    category: 'photography',
    relatedPosts: ['p013'],
    relatedCircles: ['c1'],
    relatedTags: ['航拍', '大风光', '构图']
  },

  // ==================== 动漫频道话题 ====================
  {
    id: 't_anime_1',
    title: '#七月新番吐槽大会#',
    desc: '本季异世界转生动画泛滥，你心目中的神作和雷作是谁？',
    heat: '20.1万',
    trend: 'hot',
    category: 'anime',
    relatedPosts: ['p010'],
    relatedCircles: ['c1'],
    relatedTags: ['新番', '吐槽', '追番']
  },
  {
    id: 't_anime_2',
    title: '#校园Cosplay日常#',
    desc: '在宿舍画好精致妆容出cos，宿管阿姨看呆了的奇妙场面。',
    heat: '9.8万',
    trend: 'up',
    category: 'anime',
    relatedPosts: ['p006', 'p010'],
    relatedCircles: ['c1'],
    relatedTags: ['Cosplay', '宿舍', '二次元']
  },

  // ==================== 音乐频道话题 ====================
  {
    id: 't_music_1',
    title: '#草坪音乐会歌单#',
    desc: '那些在操场大合唱中一听就流泪的青春神曲汇总。',
    heat: '18.4万',
    trend: 'hot',
    category: 'music',
    relatedPosts: ['p003', 'p009'],
    relatedCircles: ['c1'],
    relatedTags: ['音乐节', '大合唱', '青春']
  },
  {
    id: 't_music_2',
    title: '#吉他新手三个月#',
    desc: '教你三个万能和弦，新手如何快速学会自弹自唱？',
    heat: '6.7万',
    trend: 'up',
    category: 'music',
    relatedPosts: ['p003', 'p009'],
    relatedCircles: ['c1'],
    relatedTags: ['吉他', '弹唱', '新手']
  },

  // ==================== 游戏频道话题 ====================
  {
    id: 't_game_1',
    title: '#高校电竞联赛战况#',
    desc: '喜讯！我们校队电竞队打入了全国高校挑战赛八强！',
    heat: '25.3万',
    trend: 'hot',
    category: 'gaming',
    relatedPosts: ['p006'],
    relatedCircles: ['c3'],
    relatedTags: ['电竞', '校队', 'LOL']
  },
  {
    id: 't_game_2',
    title: '#Steam夏促买什么#',
    desc: '大学生百元以下必买的神作单机，省钱畅玩一整个暑假。',
    heat: '11.2万',
    trend: 'up',
    category: 'gaming',
    relatedPosts: ['p006'],
    relatedCircles: ['c3'],
    relatedTags: ['Steam', '夏促', '单机游戏']
  },

  // ==================== 穿搭频道话题 ====================
  {
    id: 't_ootd_1',
    title: '#夏日防晒穿搭#',
    desc: '穿防晒衣怎么搭配才不会显得老气？防晒与出街神搭。',
    heat: '15.9万',
    trend: 'hot',
    category: 'ootd',
    relatedPosts: ['p010', 'p013'],
    relatedCircles: ['c1'],
    relatedTags: ['穿搭', '防晒', '时尚']
  },

  // ==================== 考研频道话题 ====================
  {
    id: 't_pg_1',
    title: '#考研英语长难句#',
    desc: '每日死磕一句考研英语真题长难句，语法句型大拆解。',
    heat: '30.1万',
    trend: 'hot',
    category: 'postgrad',
    relatedPosts: ['p002', 'p004'],
    relatedCircles: ['c2'],
    relatedTags: ['考研', '英语', '长难句']
  },

  // ==================== 吃瓜频道话题 ====================
  {
    id: 't_gossip_1',
    title: '#食堂阿姨的手抖神功#',
    desc: '那一勺红烧肉，硬生生把肉抖了回去，只留下两块土豆。',
    heat: '35.4万',
    trend: 'hot',
    category: 'gossip',
    relatedPosts: ['p001', 'p012'],
    relatedCircles: ['c3'],
    relatedTags: ['食堂', '吐槽', '吃瓜']
  },

  // ==================== 失物招领频道话题 ====================
  {
    id: 't_lf_1',
    title: '#水卡饭卡失领#',
    desc: '今日一教捡到饭卡一张，学号2024xxx，失主速联！',
    heat: '12.5万',
    trend: 'hot',
    category: 'lost_found',
    relatedPosts: ['p001', 'p015'],
    relatedCircles: ['c2'],
    relatedTags: ['失物招领', '饭卡', '求捞']
  },

  // ==================== 校园墙频道话题 ====================
  {
    id: 't_wall_1',
    title: '#表白墙神仙学长#',
    desc: '求捞：今天下午在大礼堂看考研数学的男孩子，真的太温柔了。',
    heat: '28.1万',
    trend: 'hot',
    category: 'wall',
    relatedPosts: ['p002', 'p006'],
    relatedCircles: ['c3'],
    relatedTags: ['表白墙', '求捞', '暗恋']
  },

  // ==================== 二手频道话题 ====================
  {
    id: 't_sh_1',
    title: '#毕业清仓白菜价#',
    desc: '带不走的好东西，小风扇、书架、全身镜一律五元十元。',
    heat: '24.9万',
    trend: 'hot',
    category: 'second_hand',
    relatedPosts: ['p001', 'p002', 'p015'],
    relatedCircles: ['c2'],
    relatedTags: ['二手', '毕业季', '清仓']
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
