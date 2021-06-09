import React from 'react'
import PropTypes from 'prop-types'
import echarts from 'echarts';
import { Menu, Table } from 'antd';
// import sanlv from '../../../images/sanlv.png';
import studyPro1 from '../../../images/studyPro1.png';
import studyPro2 from '../../../images/studyPro2.png';
import styles from './index.less';

class ItemFive extends React.Component {



  render () {
    return (
      <div className={styles.box}>
				<div className={styles.myhref}><a href="http://121.5.156.95:8000/" target="_blank">学生群组在线学习时序管理子系统</a></div>
				<img src={studyPro1} alt="studyPro1"></img>
				<div className={styles.summary}>	

					<h1>结论：</h1>
					<p>学生的学习参与度模式与学习时间管理风格之间存在一定程度的相关性，并且通过学习时间分布图可以有效的呈现不同的学习时间管理风格。上述可视化结果与日常授课中观察到的学生长期学习行为一致，即学生的学习行为在整个学期中会呈现多种时间管理的风格。</p>
				</div>
				<img src={studyPro2} alt="studyPro2"></img>
				<div className={styles.summary}>
					<h1>结论：</h1>
					<p>四个群组明显的学习参与度分布差异主要来自于“学生-内容”（iSCCount）指标的分布差异。 Non-OLS 组学生在其他各项学习参与度指标明显较低的情况下，在“学生-内容”（iSCCount）指标上与其他各组的分布接近，说明该组学生可能在短时间内访问了大量的课程学习资源。这种分布差异表明学生的学习过程存在不同的模式，并且这些模式与他们使用 OLS 服务的情况有关。</p>
				</div>

      </div>
    )
  }
}

export default ItemFive;

