import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

class RectangleInImg extends PureComponent {  
  static propTypes = {
    imgMode: PropTypes.number, // 1 固定图片宽高 2 固定图片宽，高auto
    url: PropTypes.string,
    rectArr: PropTypes.array,
  }

  static defaultProps = {
    rectArr: []
  }

  componentDidMount() {
    const { url, rectArr, imgMode } = this.props
    this.drawRectangleInImg(url, rectArr, imgMode)
    window.addEventListener("resize", () => {
      this.drawRectangleInImg(url, rectArr,imgMode)
      // this.canvasRef.width = this.canvasWrapRef.clientWidth
      // this.canvasRef.height = this.canvasWrapRef.clientHeight
    })
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.url !== this.props.url){
      const { url,rectArr,imgMode }  = nextProps
      this.drawRectangleInImg(url, rectArr,imgMode)
    }
  }

  drawRectangleInImg = (src, rectangleCoordArr=[], mode) => {
    const canvasWidth = this.canvasWrapRef.clientWidth
    let canvasHeight = this.canvasWrapRef.clientHeight
    const img = new Image()
    img.src = src
    img.onload = () => {
      const xRate = canvasWidth / img.width
      let yRate = canvasHeight / img.height
      // 图片宽度固定，高度auto
      if (mode === 2) {
        yRate = xRate
        canvasHeight = img.height * yRate
      }
      const ctx = this.initCanvas(canvasWidth, canvasHeight)
      ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight)

      rectangleCoordArr.length > 0 && rectangleCoordArr.map((coord) => {
        if (coord) {
          const x = coord[0] * xRate
          const y = coord[1] * yRate
          const width = coord[2] * xRate
          const height = coord[3] * yRate
          const lineColor = coord[4] === 1 ? 'yellow' : 'red'
          this.drawRect(ctx, x, y, width, height, lineColor, 2)  
        }
      })
    }
  }

  initCanvas = (width, height) => {
    // 设置canvas容器宽高
    this.canvasRef.width = width
    this.canvasRef.height = height
    const ctx = this.canvasRef.getContext('2d')
    return ctx
  }

  drawRect = (ctx, x, y, width, height, lineColor, lineWidth) => {
    ctx.lineWidth = lineWidth
    ctx.strokeStyle = lineColor
    ctx.strokeRect(x, y, width, height)
  }

  render() {
    return (
      <div style={{ width: '100%', height: '100%' }} ref={(node) => (this.canvasWrapRef = node)}>
        <canvas ref={(node) => (this.canvasRef = node)} /> 
      </div>
    )
  }
}

export default RectangleInImg
