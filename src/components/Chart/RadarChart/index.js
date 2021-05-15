import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactEcharts from 'echarts-for-react';
import { cloneDeep } from 'lodash';

/**
 * 雷达图
 */
function getOption(data = [], title) {
  const copyData = cloneDeep(data);
  // 标签改为顺时针显示
  const reverseData = copyData.reverse();
  const countArr = reverseData.map((item) => parseInt(item.count));
  const indicator = reverseData.map((item) => ({ name: item.name, max: Math.max(...countArr) }));
  const option = {
    tooltip: {
      trigger: 'item',
    },
    radar: [
      {
        z: 2,
        splitNumber: 4,
        radius: 100,
        startAngle: `${90 + 360 / reverseData.length}`,
        splitLine: {
          lineStyle: {
            type: 'dotted',
          },
        },
        // 分割填充区域
        splitArea: {
          areaStyle: {
            color: ['#fff'],
          },
        },
        name: {
          // 标签样式
          color: 'rgba(0,0,0,0.65)',
          fontSize: 16,
          formatter: (val) => {
            if (val.length > 10) {
              return val.substring(0, 10) + '...';
            }
            return val;
          },
        },
        indicator,
      },
      {
        z: 1,
        shape: 'circle',
        radius: 100,
        splitNumber: 1,
        splitLine: {
          lineStyle: {
            type: 'solid',
            color: '#bfbfbf',
          },
        },
        name: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        splitArea: {
          show: false,
        },
        indicator,
      },
    ],
    series: [
      {
        z: 2,
        type: 'radar',
        // 区域填充样式
        areaStyle: {
          color: 'rgba(91, 143, 249, 0.16)',
        },
        // 折线拐点样式
        itemStyle: {
          opacity: 0,
        },
        // 折线样式
        lineStyle: {
          color: '#1890FF',
          width: 3,
        },
        data: [
          {
            value: countArr,
            name: title,
          },
        ],
      },
    ],
  };
  return option;
}

class RadarChart extends PureComponent {
  render() {
    const { data, title } = this.props;
    return (
      <ReactEcharts
        ref={(node) => {
          this.chartsRef = node;
        }}
        option={getOption(data, title)}
        style={{ width: '100%', height: '100%' }}
      />
    );
  }
}

RadarChart.propTypes = {
  data: PropTypes.array,
};

export default RadarChart;
