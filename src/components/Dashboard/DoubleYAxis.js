import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import createG2 from 'g2-react'
import { Stat } from 'g2'

const YAxis = createG2(chart => {
  const data = chart._attrs.data.data
  chart.source(data, {
    newResources: {
      alias: '新增课程资源数（个）',
    },
    courseInteractions: {
      alias: '课堂互动数（次）',
    },
    date: {
      range: [0, 1]
    }
  })
  chart.axis('date', {
    title: null,
    line: {
      lineWidth: 1,
      stroke: '#ccc'
    },
    labels: {
      label: {
        fill: '#999',
      },
    },
  })
  chart.axis('newResources', {
    line: {
      lineWidth: 1,
      stroke: '#0AACF8'
    },
    labels: {
      label: {
        fill: '#0AACF8',
      },
    },
    grid: {
      line: {
        stroke: '#ccc',
        lineWidth: 0.5,
        lineDash: [2, 2]
      }
    },
    title: null,
    // title: {
    //   fontSize: '12',
    //   textAlign: 'center',
    //   fill: '#0AACF8',
    //   fontWeight: 'normal'
    // },
    // titleOffset: 45,
  })
  chart.axis('courseInteractions', {
    line: {
      lineWidth: 1,
      stroke: '#FF4520'
    },
    labels: {
      label: {
        fill: '#FF4520',
      },
    },
    title: null,
    // title: {
    //   fontSize: '12',
    //   textAlign: 'center',
    //   fill: '#FF4520',
    //   fontWeight: 'normal'
    // },
    // titleOffset: 45,
  })
  chart.legend({
    position: 'top',
    leaveChecked: false,
    mode: false,
    title: null,
    spacingX: 10,
    spacingY: 12,
    dx: 0,
    dy: 10,
    word: {
      fill: '#8CA0B3',
      fontSize: 12
    },
    back: {
      fill: 'red'
    },
  })
  chart.area()
    .position('date*newResources')
    .color('#ade1ff')
    .shape('smooth')
    .tooltip('newResources')
  chart.line().position('date*newResources')
    .color('#ade1ff')
    .shape('smooth')
    .size(2)
  chart.line()
    .position('date*courseInteractions')
    .color('#FC765C')
    .shape('smooth')
    .size(2)
    .tooltip('courseInteractions')
  chart.render()
})

class DoubleYAxis extends PureComponent {
  static defaultProps = {
    width: 1400,
    height: 380,
  }
  componentDidMount() {
    this.createResize()
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.collapsed !== nextProps.collapsed) {
      this.createResize()
    }
  }
  // 手动触发resize 事件
  createResize() {
    const e = document.createEvent('Event')
    e.initEvent('resize', true, true)
    window.dispatchEvent(e)
  }

  render() {
    const { data, width, height } = this.props
    const chartDate = {
      data: data,
      forceFit: true,
      width: width,
      height: height,
      plotCfg: {
        margin: [80, 70, 60, 60],
        border: {
          lineWidth: 0,
        },
        background: {
          lineWidth: 0,
        },
      },
    }
    return (
      <YAxis
        forceFit={chartDate.forceFit}
        data={chartDate.data}
        width={chartDate.width}
        height={chartDate.height}
        plotCfg={chartDate.plotCfg}
      />
    )
  }
}

DoubleYAxis.propTypes = {
  data: PropTypes.array,
  collapsed: PropTypes.bool,
  width: PropTypes.number,
  height: PropTypes.number,
}

export default DoubleYAxis
