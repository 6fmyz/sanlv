import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactEcharts from 'echarts-for-react';

/**
 * 柱状图
 */

function sliceStr(str, limitLen) {
  if (str.length > limitLen) {
    return str.substring(0, limitLen) + '...';
  }
  return str;
}

const getEchartOption = (data = [], title) => {
  const xAxisData = data.map((item) => item.name);
  const yAxisData = data.map((item) => item.count);

  const echartOption = {
    tooltip: {
      trigger: 'axis',
      formatter:
        '<span style="display: inline-block;max-width: 200px;overflow: hidden;white-space:nowrap;text-overflow:ellipsis;">{b}</span><br />{a}: {c}',
    },
    color: ['#1890FF'],
    grid: {
      left: '8%',
      right: '4%',
      bottom: '1%',
      show: false,
      containLabel: true,
    },
    xAxis: {
      data: xAxisData,
      boundaryGap: ['10%', '10%'],
      axisLine: {
        lineStyle: {
          color: 'rgba(0,0,0,0.5)',
        },
      },
      axisTick: {
        alignWithLabel: true,
        lineStyle: {
          color: 'rgba(0,0,0,0.5)',
        },
      },
      axisLabel: {
        color: 'rgba(0,0,0,0.65)',
        interval: 0,
        rotate: 45,
        formatter: (val) => sliceStr(val, 8),
      },
    },
    yAxis: {
      axisLine: {
        show: false, // 是否显示坐标轴
      },
      axisTick: {
        show: false, // 是否显示坐标轴刻度
      },
      axisLabel: {
        color: 'rgba(0,0,0,0.65)',
      },
    },

    series: [
      {
        name: title,
        type: 'bar',
        barWidth: '30%',
        barMaxWidth: 30,
        data: yAxisData,
      },
    ],
  };
  return echartOption;
};

class ColumnChart extends PureComponent {
  render() {
    const { data, title } = this.props;
    return (
      <div>
        <ReactEcharts
          ref={(node) => {
            this.chartsRef = node;
          }}
          option={getEchartOption(data, title)}
          style={{ width: '100%' }}
        />
      </div>
    );
  }
}

ColumnChart.propTypes = {
  data: PropTypes.array,
};

export default ColumnChart;
