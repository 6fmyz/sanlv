import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactEcharts from 'echarts-for-react';

class DistributedChart extends Component {
  static propTypes = {
    isMark: PropTypes.bool,
    dataSource: PropTypes.object,
    style: PropTypes.object,
    onClick: PropTypes.func,
    chartId: PropTypes.number
  };

  static defaultProps = {
    dataSource: {},
    style: {
      height: 460
    }
  };

  getOption = (dataSource) => {
    const option = {
      title: {
        text: '',
        subtext: ''
      },
      grid: {
        x: 40,
        y: 40,
        y2: 40,
        x2: 50
      },
      xAxis: [
        {
          type: 'value',
          name: '抬头率',
          max: 100,
          min: 0,
          axisLabel: {
            formatter: '{value}%'
          },
          axisLine: {
            lineStyle: {
              color: '#ccc'
            }
          },
          axisTick: {
            show: true,
            lineStyle: {
              color: '#8E8E8F',
              type: 'solid'
            }
          },
          splitLine: {
            lineStyle: {
              color: '#4A5271',
              type: 'dotted',
              width: 1
            }
          }
        }
      ],
      yAxis: [
        {
          name: '活跃指数',
          type: 'value',
          // max: 'dataMax',
          max: function (value) {
            let max = 4
            if (value.max > max) {
              max = value.max
            }
            return max
          },
          min: 0,
          axisLabel: {
            formatter: '{value}'
          },
          axisLine: {
            lineStyle: {
              color: '#999'
            }
          },
          axisTick: {
            show: true,
            lineStyle: {
              color: '#ccc',
              type: 'solid'
            }
          },
          splitLine: {
            lineStyle: {
              color: '#4A5271',
              type: 'dotted',
              width: 1
            }
          }
        }
      ],
      series: [
        {
          name: '',
          type: 'scatter',
          color: '#2DC7C9',
          markLine: {
            data: [
              {
                name: '活跃指数阀值',
                yAxis: 2,
                itemStyle: {
                  normal: {
                    color: 'red'
                  }
                }
              },
              {
                name: '抬头率阀值',
                xAxis: 50,
                valueIndex: 0,
                itemStyle: {
                  normal: {
                    color: 'red'
                  }
                }
              }
            ]
          },
          itemStyle: {
            normal: {
              label: {
                show: true,
                formatter: '{b}'
              }
            }
          },
          symbolSize: 8,
          data: dataSource
        }
      ]
    };
    return option
  }

  render() {
    return (
      <div id="linesChart" style={this.props.style}>
        <ReactEcharts
          option={this.getOption(this.props.dataSource)}
          style={this.props.style}
        />
      </div>
    );
  }
}

export default DistributedChart;

