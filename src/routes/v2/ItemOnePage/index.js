import React from 'react'
import PropTypes from 'prop-types'
import echarts from 'echarts';
import { Menu, Table } from 'antd';
import styles from './index.less';

const dataSource={
  title: ['数学评价','语文评价','写作评价'], 
  legend: [['405得分率','年级得分率','403得分率'], ['405得分率','年级得分率','403得分率'],['405平均值','基准','403平均值']],
  xAxis: [
    ["大数的认识","整数的改写和近似数","整数大小的比较","简单的小数加减法","除数是一位数的笔算除法","两位数乘两位数笔算乘法","计算工具的使用","两位数乘两位数口算乘法","数的运算","公顷和平方千米","公顷和平方千米的换算","面积单位"],
    ["拼合规律", "易错字", "多义字","词语积累与运用","词义辨析","句子之间的关联","理解感悟","语言分析","文章内容分析","思想情感分析","领会写作技巧","分析任务形象","把握故事情节","记叙文"],
    ["字词基础","文章结构","语言表达","情感主题"]
  
  ],
  data: [
    [[90,80,97,97,92,92,97,97,99.5,90,88,27],[88,74,96,97,90,90,92,97,98,84,84,26],[86,69,95,97,89,89,87,98,97,78,79,24]],
    [[80,95,83,79,74,46,78,78,61,17,52,55,59,84],[77,96,80,78,75,37,72,72,65,13,56,55,56,83],[75,97,77,78,76,31,68,69,69,10,60,55,53,82]],
    [[72,48,71,78],[65,51,78,81],[50,44,75,74]]
  ],
};

class ItemOne extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      index: 0
    }
  }

  initEcharts=({id,index})=> {
    var myChart = echarts.init(document.getElementById(id));
    // 指定图表的配置项和数据
    var option = {
      title: {
        textStyle: {
          color: '#70717d',
          fontSize: 25,
          fontWeight: 'normal',
        },
        top:10,
        left: 'center',
        text: dataSource.title[index],
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        bottom: 10,

        itemWidth: 10,
        itemHeight: 10,
        orient: 'horizontal',
        data: dataSource.legend[index],
      },
      grid: {
        bottom: (index===2) ? '60': '150',
        
        x:60,
        y:60,
        x2:30,

  
      },
      xAxis: {
        type: 'category',
        axisTick: {show: false},
        axisLine: {show: false},
        axisLabel: (index<2) ? {interval: 0, rotate: 45, lineHeight: 200, margin: 20} : {},
        data: dataSource.xAxis[index],
      },
      yAxis: {
        type: 'value',
        axisTick: {show: false},
        axisLine: {show: false},
        axisLabel: (index<2) ? {
          formatter: '{value}.00%'
        } : {formatter: '{value}.00'},
        min: 0,
        max: (index<2)? 100: 90,
        interval: 10,
      },
      series: [
        {
          name: dataSource.legend[index][0],
          type: 'bar',
          data: dataSource.data[index][0],
          barCategoryGap: '40%',
        },
        {
          name: dataSource.legend[index][1],
          type: 'bar',
          data: dataSource.data[index][1],
          barCategoryGap: '40%',
        },
        {
          name: dataSource.legend[index][2],
          type: 'bar',
          data: dataSource.data[index][2],
          barCategoryGap: '40%',
        },
      ],
      color: ["#5b9bd5", "#ed7d31", "#a5a5a5"]
    };
      myChart.setOption(option);
  }

  componentDidMount () {
    this.initEcharts({id:'itemOne',index: 0});
    this.initEcharts({id:'itemTwo',index: 1});
  }

  componentDidUpdate () {
    const {index}= this.state;
    if(index < 2) {
      this.initEcharts({id:'itemOne',index: 0});
      this.initEcharts({id:'itemTwo',index: 1});
    }else if(index === 2) {
      // echarts.init(document.getElementById('itemOne')).dispose();
      // echarts.init(document.getElementById('itemTwo')).dispose();
      this.initEcharts({id:'itemThree',index: 2})
    }
  }

  handleClickIndex = ({key}) => {
    this.setState({
      index: parseInt(key)
    })
  }

  render () {
    const {index} = this.state;
    return (
      <div className={styles.box}>
        <Menu className={styles.subjectMenu} onClick={this.handleClickIndex} selectedKeys={[index.toString()]} mode="horizontal">
          <Menu.Item key="0">
            数学、语文学科评价
          </Menu.Item>
          {/* <Menu.Item key="1">
            语文评价
          </Menu.Item> */}
          <Menu.Item key="2">
            写作评价
          </Menu.Item>
          <Menu.Item key="3">
            学科能力与信息素养
          </Menu.Item>
        </Menu>
        {(index <2) && (
          <div>
            <div style={{display:'flex', justifyContent: 'space-around'}}>
              <div id="itemOne" style={{width: '40vw', height:'60vh'}}></div>
              <div id="itemTwo" style={{width: '40vw', height:'60vh'}}></div>
              
            </div>
            <div className={styles.content1}>
              <div className={styles.myhref} style={{textAlign: 'left',marginLeft: '5vw'}}><a href="http://study.hub.nercel.com/#/home" target="_blank">学习者学科能力测评系统</a></div>
              <div className={styles.summary}>
                <h1>结论：</h1>
                <p>数学评价：405班在数学的整体指标优于403班；</p>
                <p>语文评价：405班在语文整体指标优于403班；但在易错字、词义辨析、文章内容分析、领会写作技巧等指标低于403班。</p>
              </div>
            </div>
           
          </div>
        )}
        {index === 2 && (
            <div style={{display:'flex', margin: '20px'}}>
            <div id="itemThree" style={{width: '40vw', height:'60vh'}}></div>
            <div className={styles.content2}>
              <div className={styles.myhref} style={{textAlign: 'left',marginLeft: '5vw'}}><a href="http://202.114.40.160:8080/CAWS_war/user_login.action" target="_blank">汉语在线写作测评系统</a></div>
              <div className={styles.summary}>
              <h1>结论：</h1>
              <p>403班字词基础指标突出，优于基准；文章结构与情感主题均低于基准但优于405班，语言表达指标稍低于405班。
              405班在语言表达方面优于403班，但其余指标落后于403班与基准水平。</p>
            </div></div>
            
          </div>

        )}
        {index === 3 && (
          <div style={{display:'flex', margin: '20px'}}>
            <table border="2 solid red"  cellSpacing="8" cellPadding="5">
              <tbody>
                <tr>
                  <td rowSpan="2" style={{width: '90px'}}>成绩</td>
                  <td colSpan="5" >语文</td>
                  <td colSpan="3">数学</td>
                </tr>
                <tr>
                  <td className={styles.tdWidth}>总评</td>
                  <td className={styles.tdWidth}>文学积累</td>
                  <td className={styles.tdWidth}>语言文字运用</td>
                  <td className={styles.tdWidth}>语文阅读</td>
                  <td className={styles.tdWidth}>语文写作</td>
                  <td className={styles.tdWidth}>总评</td>
                  <td className={styles.tdWidth}>数与代数</td>
                  <td className={styles.tdWidth}>图形</td>
                </tr>
                <tr>
                  <td className={styles.bg}>信息素养领先的同学平均得分率</td>
                  <td>77.90%</td>
                  <td>70.94%</td>
                  <td>82.09%</td>
                  <td>63.18%</td>
                  <td>83.67%</td>
                  <td>90.35%</td>
                  <td>92.53%</td>
                  <td>90.69%</td>
                </tr>
                <tr>
                  <td className={styles.bg}>年级平均得分率</td>
                  <td>73.40%</td>
                  <td>59.63%</td>
                  <td>76.26%</td>
                  <td>55.30%</td>
                  <td>83.23%</td>
                  <td>85.58%</td>
                  <td>88.39%</td>
                  <td>83.85%</td>
                </tr>
                <tr>
                  <td className={styles.bg}>信息素养领先的同学平均得分率优于平均值</td>
                  <td>4.50%</td>
                  <td>11.31%</td>
                  <td>5.84%</td>
                  <td>7.88%</td>
                  <td>0.44%</td>
                  <td>4.77%</td>
                  <td>4.14%</td>
                  <td>6.83%</td>
                </tr>
              </tbody>
            </table>
            <div className={styles.content2}>
              <div className={styles.myhref}><a href="http://tail-s.ccnu.edu.cn/cs/" target="_blank">学习者信息素养测评系统</a></div>
              <div className={styles.summary}>
              <h1>结论：</h1>
              <p>总体信息素养平均分为61.04361，处中位水平。据统计，信息素养成绩好的同学（前8%）其语文平均分优于平均线4.5%，数学平均分优于平均线4.77%。同时，语文学科中文学积累与阅读能力显著高于平均水平；数学学科中图形分析显著高于平均水平。</p>
            </div></div>
            
          </div>
        )}
      </div>
     
    )       
  }
}

export default ItemOne;

