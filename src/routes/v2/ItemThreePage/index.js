import React from 'react'
import PropTypes from 'prop-types'
import echarts from 'echarts';
import { Menu, Table } from 'antd';
import { AttentionChart, DistributedChart } from "../../../components/Chart";
// import {  bind} from 'size-sensor'
import {
  Slider,
} from 'antd'
import RectangleInImg from "../../../components/RectangleInImg";
import styles from './index.less';

import sliderStick from '../../../components/Chart/AttentionChart/images/slider_stick.png'
import sliderBlock from '../../../components/Chart/AttentionChart/images/slider_block.png'

const video = [...Array(31)].map((v,k) => k)
const videoArray = video.map((item) => require("../../../images/attention/uphead"+ item + ".jpg"));

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

const attentionData = {
  time: ["16:38","16:39","16:40","16:41","16:42","16:43","16:44","16:45","16:46","16:47","16:48","16:49","16:50","16:51","16:52","16:53","16:54","16:55","16:56","16:57","16:58","16:59","17:00","17:01","17:02","17:03","17:04","17:05","17:06","17:07","17:08"],
  attention: [
    [0,0,0,0.14,0,0,0,0.26,0.1,0.24,0.29,0.08,0.22,0.24,0.05,0.35,0.71,0.3,0.08,0.14,0.14,0.25,0.49,0.36,1.35,2.29,1.11,0.32,0.51,0,0.31],
    [0.46,0.44,0.08,0.07,0.34,0,0,0.26,0,0.61,0,0,0.05,0,0.29,0.48,0.05,0.45,0.04,0,0,0.03,0,0.18,0,0.15,0.13,0,0.15,0.03,0.04],
    [2.1,0.68,0.83,2.32,0.87,0.25,0.86,0.74,1.76,1.6,0.64,1.97,1.11,0.9,1.68,1.29,1.16,1.95,1.03,0.57,2.67,1.36,0,0,0.07,0,1.52,0.51,0.77,1.73,1.09],
  ],
}

class ItemThree extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      index: 0,
      sliderValue: 0,
    }
  }

  initAttentionEchart=({id, index})=> {
    var attentionEchart = echarts.init(document.getElementById(id));
    var attentionOption = {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        // orient: 'vertical',
        data: ['??????1','??????2','??????3'],
      //   top: 5,
      //  left: 'center',
      //   borderWidth: 1,
      //   borderColor: 'black',
      },
      xAxis: {
        name: '??????',
        nameLocation: 'center',
        nameTextStyle: {
          lineHeight: 40,
        },
        // axisLine: {
        //   lineStyle: {
        //     color: '#ccc'
        //   }
        // },
        // axisTick: {
        //   show: true,
        //   lineStyle: {
        //     color: '#8E8E8F',
        //     type: 'solid'
        //   }
        // },
        type: 'category',
        // boundaryGap: false,
        data: attentionData.time//[...Array(31)].map((v,k) => k+1),
      },
      yAxis: [
        {
          name:'?????????',
          // nameLocation: 'center',
          max: 3,
          min: 0,
          interval: 0.5,
          // nameTextStyle: {
          //   fontSize: 16,
          //   lineHeight: 40,
          // },
        },
      ],
      series: [
        {
          name: '??????1',
          type: 'line',
          showSymbol: false,
          data: attentionData.attention[0],
        },
        {
          name: '??????2',
          type: 'line',
          showSymbol: false,
          data: attentionData.attention[1],
        },
        {
          name: '??????3',
          type: 'line',
          showSymbol: false,
          data: attentionData.attention[2],
        }
      ],
      color: ["#4a7ebb", "#be4b48", "#98b954",]
      
    };
    attentionEchart.setOption(attentionOption);
    window.addEventListener('resize', () => {
      attentionEchart.resize();
    })
    // bind(document.getElementById(id), () => {
    //   attentionEchart.resize();
    // })
    
  }

  handleChangeSliderValue = (value) => {
    this.setState({
      sliderValue: value,
    })
  }

  initEcharts=({id,index})=> {
    var myChart = echarts.init(document.getElementById(id));
    // ?????????????????????????????????
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
        data: ['?????????','????????????'],
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
        name: index===0 ? '403???????????????' : '405???????????????',
        nameLocation: 'center',
        nameTextStyle: {
          fontSize: 16,
          lineHeight: 40,
        },
        type: 'category',
        boundaryGap: false,
        axisTick: {
          interval: (index, value) => { if ((index+1)%2 === 0){ return true}}
        },
        axisLabel: {
          interval: (index, value) => { if ((index+1)%4 === 0){ return true}}
        },
        data: index=== 0 ? [...Array(64)].map((v,k) => k+1) : [...Array(57)].map((v,k) => k+1),
      },
      yAxis: [
        {
          name:'?????????',
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
          name:'????????????',
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
          name: '?????????',
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
          name: '????????????',
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
      window.addEventListener('resize', () => {
        myChart.resize();
      })
    // bind(document.getElementById(id), () => {??????????????????.onreesize?????????bind???????????????
    //   console.log(id, myChart)
    //   myChart.resize();
    // })
  }

  componentDidMount () {
    if(this.state.index < 2 ) {
      this.initEcharts({id:'itemOne',index: 0});
      this.initEcharts({id:'itemTwo',index: 1});
    } else {
      this.initAttentionEchart({id:'attention',index: 4});
      // var canvas = document.getElementById("ex1");
      // var ctx = canvas.getContext("2d");
      
      // ctx.strokeRect(0,0,100,100)
    }
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
    }else if (index === 4) {
      this.initAttentionEchart({id:'attention',index: 4});
    }
  }

  handleClickIndex = ({key}) => {
    this.setState({
      index: parseInt(key)
    })
  }

  render () {
    const {index, sliderValue} = this.state;
    const sliderStickLeft = `${attentionData.time.length ? `${100 * sliderValue / (attentionData.time.length - 1)}` : 0}%`
    return (
      <div className={styles.box}>
        <Menu className={styles.subjectMenu} onClick={this.handleClickIndex} selectedKeys={[index.toString()]} mode="horizontal">
          <Menu.Item key="0">
            ????????????????????????
          </Menu.Item>
          <Menu.Item key="3">
            ???????????????????????????
          </Menu.Item>
          <Menu.Item key="4">
            ???????????????
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
                <h1>?????????</h1>
                <p>????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????</p>
                <h1>?????????</h1>
                <p>??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????,??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????</p>
              </div>
            </div>
           
          </div>
        )}

        {index === 3 && (
          <div style={{display:'flex', margin: '40px', alignItems: 'center'}}>
            <table border="2 solid red"  cellSpacing="8" cellPadding="5">
              <tbody>
               <tr>
                 <td>??????</td>
                 <td>??????</td>
                 <td>????????????(M??SD)</td>
                 <td>F</td>
                 <td>F crit</td>
                 <td>P(??=0.05)</td>
               </tr>
               <tr>
                 <td rowSpan='2'>403</td>
                 <td>?????????</td>
                 <td>7.7??4.7</td>
                 <td rowSpan='2'>4.41</td>
                 <td rowSpan='2'>4.20</td>
                 <td rowSpan='2'>0.045</td>
               </tr>
               <tr>
                <td>?????????</td>
                 <td>6.0??5.4</td>
               </tr>
               <tr>
                 <td rowSpan='2'>405</td>
                 <td>?????????</td>
                 <td>6.7??1.9</td>
                 <td rowSpan='2'>4.39</td>
                 <td rowSpan='2'>4.13</td>
                 <td rowSpan='2'>0.043</td>
               </tr>
               <tr>
                <td>?????????</td>
                 <td>5.6??3.0</td>
               </tr>



              </tbody>
            </table>
            <div className={styles.content2}>
              <div className={styles.summary}>
                <h1>?????????</h1>
                <p>??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????</p>
                <h1>?????????</h1>
                <p>?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????</p>
              </div>
            </div>
            
          </div>
        )}
        {index === 4 && (
          <div className={styles.container}>
            <div
              // className={styles.left}
              style={{ width: "60vw", position:"relative", padding:"10px"}}
            >
                <RectangleInImg
                  url={videoArray[sliderValue]}
                  imgMode={2}
                 
                />
                <div style={{border: '2px solid #4a7ebb', position:'absolute', top:`calc(42% - 2vw)`,left: `calc(28% - 2vw)`,width: '4vw', height: '4vw'}}></div>
                <div style={{border: '2px solid #be4b48', position:'absolute', top:`calc(39% - 2vw)`,right: `calc(23% - 2vw)`,width: '4vw', height: '4vw'}}></div>
                <div style={{border: '2px solid #98b954', position:'absolute', top:`calc(44% - 2vw)`,right: `calc(39% - 2vw)`,width: '4vw', height: '4vw'}}></div>
              {/* </div> */}
              
            </div>
            <div className={styles.right}>
              <div id="attention" style={{width: '25vw', height:'50vh'}}></div>
              <div className={styles.sliderWrapper}>
                <Slider
                  value={sliderValue}
                  onChange={(value) => {
                    this.handleChangeSliderValue(value)
                  }}
                  min={0}
                  max={attentionData.time.length - 1 }
                  tipFormatter={(value) => {
                    if (attentionData.time.length) {
                      return attentionData.time[value]
                    }
                    return value
                  }}
                  handleStyle={{
                    height: '48px',
                    width: '48px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    backgroundImage: `url(${sliderBlock})`,
                    backgroundSize:'cover',
                    top: '-10px'
                  }}
                />
                <div
                  className={styles.sliderLines}
                  style={{
                    left: `calc(${sliderStickLeft} - 5px)`
                  }}
                >
                  <img src={sliderStick} alt="" height={160} />
                </div>
              </div>

            </div>

          </div>
        )}
      </div>
     
    )       
  }
}

export default ItemThree;

