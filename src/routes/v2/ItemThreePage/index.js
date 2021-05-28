import React from 'react'
import PropTypes from 'prop-types'
import echarts from 'echarts';
import { Menu, Table } from 'antd';
import styles from './index.less';

const dataSource={
  xAxis: [
    [4,8,12,16,20,24,28,32,36,40,44,48,52,56,60,64],
    [4,8,12,16,20,24,28,32,36,40,44,48,52,56]
  
  ],
  data: [
   [[4,6,5,2,1,4,4,2,4,8,7,4,3,8,2,5,2,3,5,7,2,4,7,8,5,4,4,7,8,6,4,6,4,8,4,9,2,8,4,6,2,4,8,3,2,8,4,8,2,1,4,9,4,3,4,3,2,1,8,4,7,5,3,6],
   [3.5,5,5,1,3,5,5,3,5,7,7,5,5,7,3,5,3,3,5,6,4.5,5.5,6,7,4.5,5.6,1,6,7,5.5,5,6,5,7,5,5,1,7,5,5,3,4.5,7,3,3,6,5,9,3,3,5,7,5.5,4,5,5,1,1,7,5,7,5.5,3,5]],
  [[5,5.5,7,4,2,7.5,4,6,6,6.5,2,1,6,4,8,7,5,4.5,4,6,5,5,4.5,5,5,5,4.5,4,6,5,5.5,5,6,5,3,4,7,6,5,5,6,4,6,7,6.5,7,8,7,7,5,4.5,5.5,5,3,6,1,8],
  [4.5,5.5,6,4.5,4,6.5,5,8,5.5,6,3.5,3.5,5.5,4.5,7,7,4.5,4,4,6,5.5,5,5,5.5,5.5,5,5.5,5,5.5,5,5,5,5.5,4,4.5,5.5,6.5,5.5,5.5,4.5,5,1,3.4,6.5,5,5.5,7.5,6,7,5,4,6,5,3.5,6,1.5,7.5]]
  ],

};

class ItemThree extends React.Component {
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
        // text: dataSource.title[index],
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        // orient: 'vertical',
        data: ['专注度','认知负荷'],
        top: 5,
       left: 'center',
        borderWidth: 1,
        borderColor: 'black',
      },
      grid: {
        show: true,
        borderColor: 'ddd',
        bottom: '50', 
        x:60,
        y: 35, //   60,
        x2:60,
      },
      xAxis: {
        name: index===0 ? '403班学生编号' : '405班学生编号',
        nameLocation: 'center',
        nameTextStyle: {
          fontSize: 16,
          lineHeight: 40,
        },
        type: 'category',
        boundaryGap: false,
        axisTick: {
          interval: (index, value) => { if ((index+1)%2 === 0){console.log(index,value); return true}}
        },
        axisLabel: {
          interval: (index, value) => { if ((index+1)%4 === 0){console.log(index,value); return true}}
        },
        data: index=== 0 ? [...Array(64)].map((v,k) => k+1) : [...Array(57)].map((v,k) => k+1),
      },
      yAxis: [
        {
          name:'专注度',
          nameLocation: 'center',
          max: 20,
          min: 0,
          interval: 4,
          minorTick: {
            show: true,
            splitNumber: 2,
          },
          splitLine: {
            show: false,
          },
          nameTextStyle: {
            fontSize: 16,
            lineHeight: 40,
          },
        },
        {
          name:'认知负荷',
          nameLocation: 'center',
          // boundaryGap: ['1', '0'],
          max: 10,
          min: -10,
          interval: 4,
          minorTick: {
            show: true,
            splitNumber: 2,
          },
          splitLine: {
            show: false,
          },
          nameTextStyle: {
            fontSize: 16,
            lineHeight: 40,
          },
        }

      ],
      series: [
        {
          name: '专注度',
          type: 'line',
          symbol:  index === 0 ?'circle' : 'rect',
          lineStyle: {
            type: 'dashed',
            width: 1,
          },
          itemStyle: {
            color: '#515151',
          },
          data: dataSource.data[index][0],
        },
        {
          name: '认知负荷',
          type: 'line',
          yAxisIndex: 1,
          symbol: 'rect',
          lineStyle: {
            color:  index === 0 ? 'black' : 'red',
            width: 1,
          },
          itemStyle: {
            color: index===0 ? "#0000ff": 'red'
          },
          data: dataSource.data[index][1],
        },
      ],
      // color: ["#515151","#0000ff"]
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
            专注度与认知负荷
          </Menu.Item>
          <Menu.Item key="3">
            知识基础与认知负荷
          </Menu.Item>
        </Menu>
        {(index <2) && (
          <div>
            <div style={{display:'flex', justifyContent: 'space-around'}}>
              <div id="itemOne" style={{width: '40vw', height:'60vh'}}></div>
              <div id="itemTwo" style={{width: '40vw', height:'60vh'}}></div>
              
            </div>
            <div className={styles.content1}>
              <div className={styles.summary}>
                <div>结论：</div>
                <span>学生专注度与认知负荷呈现规律大致相同。同注意力分散的学生相比，注意力集中、专注度更高的学生认知负荷更高。</span>
                <div>解释：</div>
                <span>积极参与、专注度更高的学生有更多的认知资源用到与学习有直接相关的加工比如图式构建中去,让学习者在工作记忆中的元素活动中加入更高级的有意识的认知加工，从而有更高的认知负荷。</span>
              </div>
            </div>
           
          </div>
        )}

        {index === 3 && (
          <div style={{display:'flex', margin: '40px', alignItems: 'center'}}>
            <table border="2 solid red"  cellSpacing="8" cellPadding="5">
              <tbody>
               <tr>
                 <td>班级</td>
                 <td>组别</td>
                 <td>认知负荷(M±SD)</td>
                 <td>F</td>
                 <td>F crit</td>
                 <td>P(α=0.05)</td>
               </tr>
               <tr>
                 <td rowSpan='2'>403</td>
                 <td>基础好</td>
                 <td>7.7±4.7</td>
                 <td rowSpan='2'>4.41</td>
                 <td rowSpan='2'>4.20</td>
                 <td rowSpan='2'>0.045</td>
               </tr>
               <tr>
                <td>基础差</td>
                 <td>6.0±5.4</td>
               </tr>
               <tr>
                 <td rowSpan='2'>405</td>
                 <td>基础好</td>
                 <td>6.7±1.9</td>
                 <td rowSpan='2'>4.39</td>
                 <td rowSpan='2'>4.13</td>
                 <td rowSpan='2'>0.043</td>
               </tr>
               <tr>
                <td>基础差</td>
                 <td>5.6±3.0</td>
               </tr>



              </tbody>
            </table>
            <div className={styles.content2}>
              <div className={styles.summary}>
                <h1>结论：</h1>
                <p>重复方差测量分析显示，在传统教学课堂中，基础好的学生的认知负荷显著大于基础差的学生。</p>
                <h1>解释：</h1>
                <p>高先前知识经验者对学习内容或任务有相关的知识储备与认知结构，有更多的认知资源关注学习材料本身，从而对学习材料有更高的满意度，有更高的认知负荷。注：基础分组是根据问卷自评的方式</p>
              </div>
            </div>
            
          </div>
        )}
      </div>
     
    )       
  }
}

export default ItemThree;

