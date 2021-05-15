import dynamic from 'dva/dynamic'

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => dynamic({
  app,
  models: () => models.map(m => import(`../models/${m}.js`)),
  component,
})

// nav data
export const getNavData = app => [
  {
    component: dynamicWrapper(app, [], () => import('../layouts/BasicLayout')),
    path: '/',
    layout: 'BasicLayout',
    children: [
      {
        name: '实时看板',
        path: '/v2-time-board',
        component: dynamicWrapper(app, ['v2_realTimeBoard'], () => import('../routes/v2/realTimeBoard')),
      }, {
        name: '课程历史数据查询',
        path: '/v2-history-data-query',
        component: dynamicWrapper(app, ['v2_historyDataQuery'], () => import('../routes/v2/historyDataQuery')),
      }, {
        name: '课程历史数据查询-box',
        path: '/v2-history-data-query/detailedBox',
        component: dynamicWrapper(app, ['v2_historyDataDetailedBox'], () => import('../routes/v2/historyDataDetailedBox')),
      }, {
        name: '课程历史数据查询-详情',
        path: '/v2-history-data-query/detailed',
        component: dynamicWrapper(app, ['v2_historyDataDetailed'], () => import('../routes/v2/historyDataDetailed')),
      }, {
        name: '教室历史数据查询',
        path: '/v2-classroom-history-data-query',
        component: dynamicWrapper(app, ['v2_classroomHistoryDataQuery'], () => import('../routes/v2/classroomHistoryDataQuery')),
      },
      {
        name: '教室历史数据查询-教室详情',
        path: '/v2-classroom-history-data-query/classroomDetailed',
        component: dynamicWrapper(app, ['v2_classroomHistoryClassroomDetail'], () => import('../routes/v2/classroomHistoryClassroomDetail'))
      },
      {
        name: '教室历史数据查询-详情',
        path: '/v2-classroom-history-data-query/detailed/:cId',
        component: dynamicWrapper(app, ['v2_classroomHistoryDetailed'], () => import('../routes/v2/classroomHistoryDetailed')),
      }, {
        name: '课堂数据分析',
        path: '/v2-course-data-analysis',
        component: dynamicWrapper(app, ['v2_courseDataAnalysis'], () => import('../routes/v2/courseDataAnalysis')),
      }
    ],
  },
  {
    component: dynamicWrapper(app, [], () => import('../layouts/ClassicLayout')),
    path: '/user',
    layout: 'ClassicLayout',
    children: [
      {
        name: '帐户',
        icon: 'user',
        path: 'user',
        children: [
          {
            name: '登录',
            path: 'login',
            component: dynamicWrapper(app, ['login'], () => import('../routes/login')),
          }, {
            name: '找回密码',
            path: 'findPwd',
            component: dynamicWrapper(app, ['findPwd'], () => import('../routes/findPwd')),
          },
          {
            name: '修改密码',
            path: 'resetPassword',
            component: dynamicWrapper(app, ['resetPassword'], () => import('../routes/resetPassword')),
          },
        ],
      },
    ],
  },
]
