import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import selectors from './selectors'
import styles from './index.less'
import bgImg from './images/login-bg.png'
import colseEye from './images/colse-eye.png'
import openEye from './images/open-eye.png'
import { config } from '../../utils'
import { Form, Input, Button, Checkbox, Popover } from 'antd'
import menus from '../../utils/menu'
import Copyright from '../../components/Copyright'

const { push } = routerRedux
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
const CreateLoginForm = Form.create()((props) => {
  const {
    form, handleOnSubmit, passwordType, passwordTypeChange, forgetPassword,
    pwdPopoverVisible, handlepwdPopoverVisibleChange, loginFrom,
  } = props
  const { getFieldDecorator } = form
  const checkboxTitle = (<span className={styles.popoverTitle}>温馨提示</span>)
  const checkboxContent = (
    <div className={styles.popoverContent}>
      <p>为了您的信息安全，请不要</p>
      <p>在网吧或者公共电脑上使用</p>
      <p>此功能</p>
    </div>
  )
  const findPwdFun = () => {
    handlepwdPopoverVisibleChange(pwdPopoverVisible)
    forgetPassword()
  }
  const pwdTitle = (<span className={styles.popoverTitle}>帐号或密码错误</span>)
  const pwdContent = (
    <div className={styles.popoverContent}>
      <p> 提示：</p>
      <p>1.请检查帐号拼写，是否输入有误，</p>
      <p>或打开了键盘大小写锁定。</p>
      <br />
      <p>2.若您忘记密码，请<a onClick={() => findPwdFun()}>找回密码</a></p>
    </div>
  )
  return (
    <Form className="login-form">
      <div>
        <FormItem label="邮箱">
          {getFieldDecorator('email', {
            initialValue: loginFrom.email,
            rules: [{
              type: 'email', message: '请输入正确邮箱地址！',
            }, {
              required: true, message: '请输入您的邮箱地址!',
            }],
          })(<Input style={cssStyle.inp} />)}
        </FormItem>
      </div>
      <div className={styles.passwordWrapper}>
        <FormItem label="密码" style={{ margin: '0' }}>
          {getFieldDecorator('password', {
            initialValue: loginFrom.password,
            rules: [{
              required: true, message: '请输入您的密码!',
            }],
          })(
            <div className={styles.passwordBox}>
              <Popover
                placement="rightTop"
                content={pwdContent}
                title={pwdTitle}
                trigger=""
                visible={pwdPopoverVisible}
                onVisibleChange={() => handlepwdPopoverVisibleChange(pwdPopoverVisible)}
              >
                <Input type={passwordType ? 'password' : 'text'} style={cssStyle.inp} />
              </Popover>
              <a onClick={() => passwordTypeChange(passwordType)}>
                <img
                  alt="eye"
                  src={passwordType ? colseEye : openEye}
                />
              </a>
            </div>
          )}
        </FormItem>
      </div>
      <div className={styles.remember}>
        <FormItem>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: loginFrom.isAutoLogin,
          })(
            <Checkbox>
              <Popover placement="rightTop" content={checkboxContent} title={checkboxTitle} trigger="hover">
                记住我的密码
              </Popover>
            </Checkbox>
          )}
          {
            // <a className={styles.forgetBtn} onClick={() => forgetPassword()}>忘记密码？</a>
          }
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
            登录
          </Button>
        </FormItem>
      </div>
    </Form>
  )
})

class login extends React.Component {
  componentWillMount() {
    if (this.props.loginStatus) {
      this.onLoginSuccess()
    }
    if (this.props.initOrgListStatus) {
      this.toWindow()
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.loginStatus !== nextProps.loginStatus && nextProps.loginStatus) {
      this.onLoginSuccess()
    }
    if (nextProps.initOrgListStatus) {
      this.toWindow()
    }
  }

  onLoginSuccess = () => {
    this.resetFieldsFrom()
    this.props.dispatch({ type: 'app/queryInitData' })
  }

  toWindow = () => {
    this.resetFieldsFrom()
    if (this.props.role === 2) {
      this.props.dispatch(push('/v2-equipment-control'))
    } else {
      this.props.dispatch(push('/v2-time-board'))
    }
  }

  resetFieldsFrom() {
    if (this.form) {
      this.form.resetFields()
    }
  }

  // 提交登录信息
  handleSubmit = () => {
    const form = this.form
    const props = this.props
    form.validateFields((err, values) => {
      if (err) {
        return
      }
      props.dispatch({
        type: 'login/submitLogin',
        email: values.email,
        password: values.password,
        remember: values.remember
      })
    })
  }

  // 密码是否可见
  handlePasswordTypeChange = (type) => {
    const passwordType = !type
    this.props.dispatch({ type: 'login/passwordTypeChange', passwordType: passwordType })
  }

  // 忘记密码
  handelForgetPassword = () => {
    this.props.dispatch({
      type: 'findPwd/setStep',
      step: 0,
    })
    this.props.dispatch(push('/user/findPwd'))
  }

  // 密码错误是显示提示语
  handlepwdPopoverVisibleChange = (type) => {
    const pwdPopoverVisible = !type
    this.props.dispatch({
      type: 'login/popoverVisibleChange',
      pwdPopoverVisible: pwdPopoverVisible
    })
  }

  saveFormRef = (form) => {
    this.form = form
  }

  render() {
    const loginFrom = {
      email: this.props.email,
      isAutoLogin: this.props.isAutoLogin,
    }
    return (
      <div className={styles.loginPage} style={{ backgroundImage: `url(${bgImg})` }}>
        <div className={styles.loginFormWrapper}>
          <div className={styles.logoWrapper}>
            <div className={styles.topWrapper}>
              <img alt="" src={config.logo} />
              <div className={styles.descWrapper}>
                <div className={styles.appName}>{config.name}</div>
                <div>{config.desc}</div>
              </div>
            </div>
          </div>
          <div className={styles.loginForm}>
            <CreateLoginForm
              ref={this.saveFormRef}
              handleOnSubmit={this.handleSubmit}
              passwordType={this.props.isPassword}
              passwordTypeChange={this.handlePasswordTypeChange}
              forgetPassword={this.handelForgetPassword}
              pwdPopoverVisible={this.props.pwdPopoverVisible}
              handlepwdPopoverVisibleChange={this.handlepwdPopoverVisibleChange}
              loginFrom={loginFrom}
            />
          </div>
        </div>
        <div className={styles.pageBottomWrap}>
          <Copyright />
        </div>
      </div>
    )
  }
}

login.propTypes = {
  initOrgListStatus: PropTypes.bool,
  isPassword: PropTypes.bool,
  dispatch: PropTypes.func,
  pwdPopoverVisible: PropTypes.bool,
  loginStatus: PropTypes.bool,
  isAutoLogin: PropTypes.bool,
  loginMsg: PropTypes.string,
  email: PropTypes.string,
  role: PropTypes.number,
}
export default connect(selectors)(login)
