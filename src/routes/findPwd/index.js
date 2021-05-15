import React from 'react'
import PropTypes from 'prop-types'
import { push } from 'react-router-redux'
import { connect } from 'dva'
import selectors from './selectors'
import styles from './index.less'
import bgImg from '../login/images/login-bg.png'
import colseEye from '../login/images/colse-eye.png'
import openEye from '../login/images/open-eye.png'
import emailTimeOver from '../login/images/email-error.png'
import { Form, Input, Button } from 'antd'
import queryString from 'query-string'

const FormItem = Form.Item
const cssStyle = {
  inp: {
    outline: 'none',
    border: 'none',
    background: 'transparent',
    height: '20px',
    borderBottom: '1px solid #e5e5e5',
    color: '#757575'
  },
}
const CreatePwdForm = Form.create()((props) => {
  const {
    form, handleOnSubmit, handleBackLogin,
  } = props
  const { getFieldDecorator } = form
  return (
    <Form className="login-form">
      <div>
        <FormItem label="输入您的邮箱" >
          {getFieldDecorator('email', {
            rules: [{
              type: 'email', message: '请输入正确邮箱地址！',
            }, {
              required: true, message: '请输入正确的邮箱地址!',
            }],
          })(
            <Input style={cssStyle.inp} />
          )}
        </FormItem>
      </div>
      <div>
        <FormItem>
          <Button
            style={{ width: '100%' }}
            type="primary"
            htmlType="submit"
            className="login-form-button"
            onClick={handleOnSubmit}
          >
            重置密码
          </Button>
        </FormItem>
      </div>
      <div>
        <FormItem>
          <Button
            style={{ width: '100%' }}
            htmlType="submit"
            className="login-form-button"
            onClick={handleBackLogin}
          >
            返回登录
          </Button>
        </FormItem>
      </div>
    </Form>
  )
})

const CreateNewPwdForm = Form.create()((props) => {
  const {
    form, handleOnSubmit, passwordType, passwordTypeChange,
    checkConfirm, checkPassword,
  } = props
  const { getFieldDecorator } = form
  return (
    <Form className="login-form">
      <div className={styles.passwordWrapper}>
        <FormItem label="输入您的新密码" hasFeedback>
          {getFieldDecorator('password', {
            rules: [{
              required: true, message: '请输入您的密码!',
            }, {
              validator: checkConfirm,
            }],
          })(
            <Input type="text" style={cssStyle.inp} />
          )}
        </FormItem>
      </div>
      <div className={styles.passwordWrapper}>
        <FormItem label="再次确认您的新密码" hasFeedback>
          {getFieldDecorator('confirmPassword', {
            rules: [{
              required: true, message: '请输入您的密码!',
            }, {
              validator: checkPassword,
            }],
          })(
            <div className={styles.passwordBox}>
              <Input type={passwordType ? 'password' : 'text'} style={cssStyle.inp} />
              <button onClick={() => passwordTypeChange(passwordType)}>
                <img
                  alt="eye"
                  src={passwordType ? colseEye : openEye}
                />
              </button>
            </div>
          )}
        </FormItem>
      </div>
      <div>
        <FormItem>
          <Button
            style={{ width: '100%' }}
            type="primary"
            htmlType="submit"
            className="login-form-button"
            onClick={handleOnSubmit}
          >
            确定
          </Button>
        </FormItem>
      </div>
    </Form>
  )
})

let interval

class findPwd extends React.Component {
  state = {
    sendEmailAgain: false,
    timeLeft: 60,
  }

  componentWillMount() {
    const proofCode = queryString.parse(this.props.location.search).proofCode
    let stpe = 0
    if (proofCode === undefined) {
      stpe = 0
    } else {
      stpe = 2
    }
    this.props.dispatch({
      type: 'findPwd/setStep',
      step: stpe,
    })
  }

  // 重发邮件倒计时
  getTimeLeft = () => {
    this.setState({
      sendEmailAgain: true,
    })
    interval = setInterval(() => {
      const left = this.state.timeLeft - 1
      this.setState({
        timeLeft: left,
      })
      if (left === 0) {
        window.clearInterval(interval)
        this.setState({
          sendEmailAgain: false,
        })
      }
    }, 1000)
  }

  saveFormRef = (form) => {
    this.form = form
  }

  handleOnSubmit = () => {
    const form = this.form
    form.validateFields((err, values) => {
      if (err) {
        return
      }
      this.props.dispatch({
        type: 'findPwd/sendEmail',
        email: values.email,
      })
      form.resetFields()
    })
  }

  // 返回登录
  handleBackLogin = () => {
    this.props.dispatch({
      type: 'findPwd/setStep',
      step: 0,
    })
    this.props.dispatch(push('/user/login'))
  }

  // 上一步
  handleBackStep = (step) => {
    window.clearInterval(interval)
    this.setState({
      sendEmailAgain: false,
    })
    this.props.dispatch({
      type: 'findPwd/setStep',
      step: step - 1,
    })
  }

  // 密码是否可见
  handlePasswordTypeChange = (type) => {
    const passwordType = !type
    this.props.dispatch({ type: 'findPwd/passwordTypeChange', passwordType: passwordType })
  }

  handleCheckConfirm = (rule, value, callback) => {
    const form = this.form
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true })
    }
    // 请按照正确的格式设置密码
    callback()
  }

  handleCheckPassword = (rule, value, callback) => {
    const form = this.form
    if (value && value !== form.getFieldValue('password')) {
      callback('请输入相同的密码!')
    } else {
      callback()
    }
  }

  // 重新发送邮件
  handleSendEmailAgain = (email) => {
    this.getTimeLeft()
    this.props.dispatch({
      type: 'findPwd/sendEmail',
      email: email,
    })
  }

  // 设置新密码
  handelSetNewPwd = () => {
    const form = this.form
    form.validateFields((err, values) => {
      if (err) {
        return
      }
      this.props.dispatch({
        type: 'findPwd/resetPassword',
        param: {
          proofCode: queryString.parse(this.props.location.search).proofCode,
          password: values.password,
        },
      })
      form.resetFields()
    })
  }

  // 返回发送忘记邮件
  handleBackSendEmail = () => {
    this.props.dispatch({
      type: 'findPwd/setStep',
      step: 0,
    })
    this.props.dispatch(push('/user/findPwd'))
  }
  // 根据重置密码步骤 显示不同样式
  boxWrapper = (step) => {
    let stepPage = (null)
    const sendEmailState = this.props.sendEmailState
    const sendEmailAgain = this.state.sendEmailAgain
    const email = this.props.email
    switch (step) {
      case 0:
        stepPage = (
          <div className={styles.boxWrapper}>
            <div className={styles.topWrapper}>
              <div className={styles.title}>忘记密码</div>
              <div className={styles.content}>
                请输入您用于登录微助教的邮箱地址，我们将会向此邮箱发送重置密码链接的邮件。
              </div>
            </div>
            <CreatePwdForm
              ref={this.saveFormRef}
              handleBackLogin={this.handleBackLogin}
              handleOnSubmit={this.handleOnSubmit}
            />
          </div>
        )
        break
      case 1:
        stepPage = (
          <div className={styles.boxWrapper}>
            <div className={styles.topWrapper}>
              <div className={styles.title}>{sendEmailState ? '发送邮件成功' : '发送邮件失败'}</div>
              <div className={styles.content}>
                {
                  sendEmailState &&
                    <div>
                      重置密码的邮件已发送至邮箱<br />{email}<br />有效期为24小时
                    </div>
                }
                {
                  !sendEmailState &&
                    <span>重置密码的邮件发送失败，邮箱未注册</span>
                }
              </div>
            </div>
            {
              !sendEmailState &&
                <Button
                  style={{ width: '100%' }}
                  onClick={() => this.handleBackStep(step)}
                >
                  上一步
                </Button>
            }
            {
              sendEmailState &&
                <div>
                  <Button
                    style={{ width: '100%', marginBottom: '13px' }}
                    type="primary"
                    onClick={() => this.handleBackStep(step)}
                  >
                    上一步
                  </Button>
                  <Button
                    style={{ width: '100%', marginBottom: '40px' }}
                    type="primary"
                    onClick={() => this.handleSendEmailAgain(email)}
                    disabled={sendEmailAgain}
                  >
                    {
                      sendEmailAgain ? `邮件已重发，请${this.state.timeLeft}秒后重试` : '重发激活邮件'
                    }
                  </Button>
                  <Button
                    style={{ width: '100%' }}
                    onClick={this.handleBackLogin}
                  >
                    返回登录
                  </Button>
                </div>
            }
          </div>
        )
        break
      case 2:
        stepPage = (
          <div className={styles.boxWrapper}>
            <div className={styles.topWrapper}>
              <div className={styles.title}>重置密码</div>
              <div className={styles.content}>
                请重置金课坊登录密码。密码长度建议在6~14位，支持数字、大小写字母和标点符号，不允许有空格。
              </div>
            </div>
            <CreateNewPwdForm
              ref={this.saveFormRef}
              handleOnSubmit={this.handelSetNewPwd}
              passwordType={this.props.isPassword}
              passwordTypeChange={this.handlePasswordTypeChange}
              checkConfirm={this.handleCheckConfirm}
              checkPassword={this.handleCheckPassword}
            />
          </div>
        )
        break
      case 3 :
        stepPage = (
          <div className={styles.boxWrapper}>
            <div className={styles.topWrapper}>
              <div className={styles.title}>已成功重置密码</div>
              <div className={styles.content}>
                您现在可以使用新密码登录金课坊
              </div>
            </div>
            <Button
              style={{ width: '100%' }}
              type="primary"
              onClick={this.handleBackLogin}
            >
              前往登录
            </Button>
          </div>
        )
        break
      case 4:
        // stepPage = (
        //   <div className={styles.boxWrapper}>
        //     <div className={styles.topWrapper}>
        //       <div className={styles.title}>重置密码失败</div>
        //       <div className={styles.content}>
        //         重置密码失败，请重新尝试
        //       </div>
        //     </div>
        //     <Button
        //       style={{ width: '100%' }}
        //       type="primary"
        //       onClick={() => this.handleSendEmailAgain(email)}
        //     >
        //       重新发送邮件
        //     </Button>
        //   </div>
        // )
        stepPage = (
          <div className={styles.emailError}>
            <img alt="" src={emailTimeOver} />
            <div>您的邮件已过期，请重新验证邮箱哟～</div>
            <button onClick={this.handleBackSendEmail}>重新验证</button>
          </div>
        )
        break
      default:
        break
    }
    return stepPage
  }

  render() {
    return (
      <div className={styles.wrapper} style={{ backgroundImage: `url(${bgImg})` }}>
        {
          this.boxWrapper(this.props.step)
        }
      </div>
    )
  }
}

findPwd.propTypes = {
  email: PropTypes.string,
  step: PropTypes.number,
  sendEmailState: PropTypes.bool,
  isPassword: PropTypes.bool,
  dispatch: PropTypes.func,
  location: PropTypes.object,

}
export default connect(selectors)(findPwd)
