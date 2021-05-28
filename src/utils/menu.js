module.exports = [
  // *----------------------start学习注意力分析---------------------------*/
  {
    id: 102,
    icon: 'sliders',
    name: '学习注意力分析',
    router: '',
    role: '1, 3',
  },
  {
    id: 7,
    bpid: 102,
    mpid: 102,
    icon: 'picture',
    name: '实时看板',
    router: '/v2-time-board',
    role: '1, 3',
  },
  {
    id: 8,
    bpid: 102,
    mpid: 102,
    icon: 'dot-chart',
    name: '课程历史数据查询',
    router: '/v2-history-data-query',
    role: '1, 3',
  },
  {
    id: 9,
    bpid: 102,
    mpid: 102,
    icon: 'gold',
    name: '教室历史数据查询',
    router: '/v2-classroom-history-data-query',
    role: '1, 3',
  },
  {
    id: 10,
    bpid: 102,
    mpid: 102,
    icon: 'gold',
    name: '课堂数据分析',
    router: '/v2-course-data-analysis',
    role: '1, 3',
  },
  // *-----------------------end学习注意力分析---------------------------*/
  {
    id: 11,
    name: '认知负荷检测',
    router: '/cognition',
    role: '1, 3',
  }
]