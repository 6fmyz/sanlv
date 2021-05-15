English | [简体中文](./README.zh-CN.md)

# Ant Design Pro

[![](https://img.shields.io/travis/ant-design/ant-design-pro.svg?style=flat-square)](https://travis-ci.org/ant-design/ant-design-pro) [![Build status](https://ci.appveyor.com/api/projects/status/67fxu2by3ibvqtat/branch/master?svg=true)](https://ci.appveyor.com/project/afc163/ant-design-pro/branch/master)  [![Gitter](https://badges.gitter.im/ant-design/ant-design-pro.svg)](https://gitter.im/ant-design/ant-design-pro?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

An out-of-box UI solution for enterprise applications as a React boilerplate.

![](https://gw.alipayobjects.com/zos/rmsportal/xEdBqwSzvoSapmnSnYjU.png)

- Preview: http://preview.pro.ant.design
- Home Page: http://pro.ant.design
- Documentation: http://pro.ant.design/docs/getting-started
- FAQ: http://pro.ant.design/docs/faq

## Translation Recruitment :loudspeaker:

We need your help: https://github.com/ant-design/ant-design-pro/issues/120

## Features

- :gem: **Neat Design**: Follow [Ant Design specification](http://ant.design/)
- :triangular_ruler: **Common Templates**: Typical templates for enterprise applications
- :rocket: **State of The Art Development**: Newest development stack of React/dva/antd
- :iphone: **Responsive**: Designed for varies of screen size
- :art: **Themeing**: Customizable theme with simple config
- :globe_with_meridians: **International**: Built-in i18n solution
- :gear: **Best Practice**: Solid workflow make your code health
- :1234: **Mock development**: Easy to use mock development solution
- :white_check_mark: **UI Test**: Fly safely with unit test and e2e test

## Templates

```
- Dashboard
  - Analytic
  - Monitor
  - Workspace
- Form
  - Basic Form
  - Step Form
  - Advanced From
- List
  - Standard Table
  - Standard List
  - Card List
  - Search List (Project/Applications/Article)
- Profile
  - Simple Profile
  - Advanced Profile
- Result
  - Success
  - Failed
- Exception
  - 403
  - 404
  - 500
- User
  - Login
  - Register
  - Register Result
```

## Usage

```bash
$ git clone https://github.com/ant-design/ant-design-pro.git --depth=1
$ cd ant-design-pro
$ npm install
$ npm start         # visit http://localhost:8000
```

Or you can use the command tool: [ant-design-pro-cli](https://github.com/ant-design/ant-design-pro-cli)

```bash
$ npm install ant-design-pro-cli -g
$ mkdir pro-demo && cd pro-demo
$ pro new
```

More instruction at [documentation](http://pro.ant.design/docs/getting-started)。

## Compatibility

Modern browsers and IE11.

## Contributing

Any Contribution of following ways will be welcome:

- Use Ant Design Pro in your daily work.
- Submit [issue](http://github.com/ant-design/ant-design-pro/issues) to report bug or ask questions.
- Propose [pull request](http://github.com/ant-design/ant-design-pro/pulls) to improve our code.

机构版统计数据算法

实时数据【
  缺勤学生实时流水清单
  教师教学档案
  学生学习档案
  课堂数据档案
  基础信息管理
】
教学资源 半小时统计一次
互动数据一小时统计一次

教务视窗
  今日学情【一小时统计一次】
    开启互动教师数【今日开启互动的老师之和】
    今日参与互动学生数 【实时统计】
    今日互动总数【学生的今日互动数之和】
    平均签到到课率【今日开启过签到的课堂的平均到课率】
    平均课堂活跃度【今天课堂互动次数的平均值】
    缺勤人数【实时统计，今天签到课堂的缺勤学生数之和】
    请假人数【实时统计，今天签到课堂的请假学生之和】

  教学资源沉淀【半小时统计一次】

  学情风向 【半小时统计一次】
    新增课程资源数
    课堂互动数



教学互动分析【半小时统计一次】
  全校教师教学概览
    教法分析
      签到【教师开启签到次数】
      答题【教师开启题目次数】
      讨论【教师课堂中的讨论次数（教师主动开启讨论，学生自主往课堂发言时，
        课堂会创建立一个默认主题的讨论并开启该讨论，课堂中所有学生学生的自主发言，都会发到该讨论中。
        默认主题的讨论每个课堂每天有且只有一个。）】
      互评【教师开启的互评次数】
      课件【教师课件开启次数（包含课件和微课）】
      点答【教师开启抢答的次数（随机点人的次数不算互动数】

    教师活跃度排行榜Top10
      排名【教师活跃度排名，降序】
      名字【教师姓名+教师所属院系】
      活跃度【教师互动次数】
      上升下降箭头【教师互动数（选择时间段）的环比】

    教师活跃度排行榜完整榜单
      排名【教师活跃度排名，降序】
      教师姓名【教师姓名】
      课堂名称【教师所有的课堂名称列表】
      院系【教师所属的院系名称】
      活跃度【教师在其所有课堂总的互动次数】

    院系教师活跃度
      签到【各院系教师开启签到次数】
      答题【各院系教师开启题目次数】
      讨论【各院系教师课堂中的讨论次数（教师主动开启讨论，学生自主往课堂发言时，
        课堂会创建立一个默认主题的讨论并开启该讨论，课堂中所有学生学生的自主发言，都会发到该讨论中。
        默认主题的讨论每个课堂每天有且只有一个。）】
      互评【各院系教师开启的互评次数】
      课件【各院系教师课件开启次数（包含课件和微课）】
      点答【各院系教师开启抢答的次数（随机点人的次数不算互动数】


  全校学生学习概览
    全校学生学习概览
      学生互动总数【学生所有的互动次数含（签到、答题、讨论、互评、课件（课件和微课）、点答）的互动数据】
      生均互动次数【学生总人数÷学生总互动数÷天数（天数是过滤条件中时间段之间的天数）】
      生均资源利用率【学生总人数÷课堂资源数（含单题、组卷、课件、微课、互评）】

    学生互动分析
      签到【学生在课堂中的签到次数（不包含教师修改的签到状态）】
      答题【学生答题数】
      讨论【学生往课堂中发出的讨论条数（包含自主发言）】
      互评【学生在课堂中互评的次数】
      课件【学生查阅课件次数（包含课件和微课，不包含课件的下载）】
      点答【学生抢答的次数】

    院系学生活跃度
      签到【各院系学生在课堂中的签到次数（不包含教师修改的签到状态）】
      答题【各院系学生答题数】
      讨论【各院系学生往课堂中发出的讨论条数（包含自主发言）】
      互评【各院系学生在课堂中互评的次数】
      课件【各院系学生查阅课件次数（包含课件和微课，不包含课件的下载）】
      点答【各院系学生抢答的次数】


  全校实时出勤情况统计
    出勤率
      出勤百分比【出勤人数与缺勤人数的百分比】
      缺勤百分比【请假、迟到、缺勤，人数的百分比】

    课堂签到率排行榜Top10
      排名【课堂签到率排名，降序】
      名字【课堂名称】
      签到率【课堂签到率】
      上升下降箭头【课堂签到率（选择时间段）的环比】

    课堂签到率排行榜完整榜单【院系中所有课堂的签到率排行榜，降序，可查缺勤详情】

    院系出勤
      出勤【各院系出勤总人数】
      请假【各院系请假总人数】
      迟到【各院系迟到总人数】
      缺勤【各院系缺勤总人数】

    院系签到率排行榜完整榜单
      排名【院系签到率排行榜名次，降序】
      院系【院系名称】
      教师总数【院系教师总数】
      教师活跃次数【院系教师人均活跃次数（互动次数）】
      签到率【院系签到率】
      出勤【院系出勤总人数】
      请假【院系请假总人数】
      迟到【院系迟到总人数】
      缺勤【院系缺勤总人数】

  缺勤统计【实时数据】
    查看每个学生的缺勤信息含(学号、姓名、学生院系、签到课堂、课堂教师姓名、课堂签到时间、学生签到状态)
    可查看学生详情查看其详细学习状态

  教学资源分析【半小时统计一次数据】
    登录管理员权限范围以内可查看数据
      课程【】
      单题【】
      组卷【】
      课件【】
      微课【】
      互评【】

    列表数据
      院系【各院系名称】
      单题【各院系单题总数】
      组卷【各院系组卷总数】
      课件【各院系课件总数】
      微课【各院系微课总数】
      互评【各院系互评总数】
      课堂数【各院系课堂总数】
      课均资源【各院系平均课堂资源数 (单题+组卷+课件+微课+互评)/各院系课堂总数
      教师数【各院系教师总数】
      师均资源【各院系师均资源 (单题+组卷+课件+微课+互评)/各院系教师总数】
      总计【各院系资源总数 单题+组卷+课件+微课+互评】


学习注意力分析
  实时看板
    教室实时监控查询添加【联动查询】
      校区【】
      教学楼【】
      教室【】

    右侧实时教室画面【实时展示返回图片】

    左侧三率监测数据
      出勤人数【实时课堂出勤人数】
      抬头率【1秒中接受一次数据】
      点头率【1分钟接受一次数据】

      图标chart
        抬头率【线图 实时渲染返回数据】
        点头率【柱图 实时渲染返回数据】

  课程历史数据
    查询条件【教师、课程、学期（全部、春、秋、其他）】

    列表数据
      教师姓名【教师姓名】
      课程名称
      学期
      学生人数

    教师课程数据总览【教师所有含有三率课程数据展示】
      三率总览数据块【出勤学生数、上课时间、（抬头率、点头率）的图形展示】

    教师某次课程数据详情【教师上课时的具体详情】
      左侧上课图片展示

      右侧数据【点头率、抬头率、抬头率(一个峰值点，三个谷值点)展示】
        峰值点、谷值点可点击。点击后左侧图片展示值点的数据和值点图片。左右联动
      抬头率与点头频次散点图
        【点头频次阀值2，抬头率阀值50%。横竖两条线将图分割成四个象限，第四象限为好课】

  教室历史数据
    查询条件【校区、教学楼、教室，级联联动】
    校区【校区名称】
    教学楼【教学楼名称】
    教室【教室名称】
    课程名称【在教室内上课的课程名称】
    时间【上课时间段】

  课堂数据分析
    查询条件【院系、教师、课堂（三级联动），时间（当天、一周、一月），内容（出勤率、抬头率、点头率）】
    课堂名称【教师所有的课堂名称列表】
    课堂编号【课堂标示编号】
    教师名称【】
    院系【课堂所属院系】
    课堂人数【课堂上课人数（实时监控课堂上课人数值的最大值）】
    时间段【上课时间】
    出勤率【课堂出勤人数的平均值 ÷ 课堂人数（选择显示）】
    抬头率【实时监控历史数据中的抬头率（选择显示）】
    点头率【实时监控历史数据中的点头率（选择显示）】
    导出三率【导出该条数据中，详细三率信息】



教学数据档案
  教师教学档案
    查询条件【院系、认证状态】
    搜索条件【工号、教师姓名、邮箱】
    导出【导出列表中显示的数据】
    导入【按模板填写导入模板将，教师全部导入管理平台】
      1.下载导入模板
      2.按导入模板规则填写需要导入人员的信息
      3.填写好后，上传文件后点击下一步，执行导入
      4.进入预导入界面，显示可导入数据条数，不可导入数据条数，及不可导入的用户列表
        列表中
          行数【不可导入的数据在原始Excel中的行数】
          错误提示【不可导入的原因】
      5.点击下一步，完成导入过程。显示导入成功数据条数
    添加【添加教师信息】
      工号【教师工号（执行重复验证）】
      姓名【教师姓名】
      院系
      邮箱【教师邮箱（执行重复验证）】
      密码
      确认密码
      性别
      是否允许查看三率【是、否（该字段，决定教师是否可以在PC端查看自己课堂的三率信息）】


  学生学习档案
    机构版登录时，用户信息中返回isAppUserOpen字段，该字段控制是否可以添加、导入学生。isAppUserOpen是学校所有设施，数据配置完成后手动修改字段
    查询条件【院系、专业（级联选择），认证状态、年级、层次】
    搜索条件【学号、姓名】
    导出【导出列表中显示的数据】
    导入【按模板填写导入模板将，学生全部导入管理平台】
      1.下载导入模板
      2.按导入模板规则填写需要导入人员的信息
      3.填写好后，上传文件后点击下一步，执行导入
      4.进入预导入界面，显示可导入数据条数，不可导入数据条数，及不可导入的用户列表
        列表中
          行数【不可导入的数据在原始Excel中的行数】
          错误提示【不可导入的原因】
      5.点击下一步，完成导入过程。显示导入成功数据条数
    添加【添加学生信息】
      学号【学生学号（执行重复验证）】
      姓名
      院系
      专业【学生专业，与院系级联】
      行政班【学生所属班级】
      年级【入学学年】
      层次【本科、专升本、专科】
      性别
      邮箱【学生邮箱（执行重复验证）】
      密码
      确认密码

  课堂数据档案
    查询条件【院系】
    搜索条件【工号、教师姓名、课堂名称】
    导出当前榜单
    列表
      工号
      姓名
      院系
      课程
      电子资源【
        单题
        组卷
        课件
        微课
        互评
      】
      学生
      课堂互动数【签到、答题、讨论、互评、课件（课件和微课）、点答的互动数据之和】
      人均互动数【学生人数/课堂互动数】
      教师互动总数【教师开启互动数之和】



基础信息管理
  账号管理
    添加、编辑、删除管理员（管理员不能删除自己）
    只有学校管理员才有添加、编辑、删除管理员信息权限


  认证管理（院系管理员看不到该功能，只有学校管理员能）
    各院系中认证教师数，教师总数，教师认证率（教师总数/教师认证率）。
    学生认证数，学生总数，学生认证率（学生认证数/学生总数）。

  组织机构管理
    院系管理员（编辑自己本院系，部基本编辑新建的功能）
    学校管理员
      1.可在学校级别添加管理员
      2.可在学校中添加院系
      3.可编辑、删除学校院系
      4.可点击跳转至账号管理，添加院系管理员


总体设备控制（可根据校区、教学楼（级联选择），查看每个教室的设备状态）










