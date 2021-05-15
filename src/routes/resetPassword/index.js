import React from 'react'
import PropTypes from 'prop-types'
import { push } from 'react-router-redux'
import { connect } from 'dva'
import selectors from './selectors'
import styles from './index.less'
import bgImg from '../login/images/login-bg.png'
import { Form, Input, Button } from 'antd'
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
const CreateNewPwdForm = Form.create()((props) => {
  const {
    form, handleOnSubmit, checkConfirm, checkPassword,
  } = props
  const { getFieldDecorator } = form
  return (
    <Form className="reset-password-form">
      <div className={styles.passwordWrapper}>
        <FormItem label="输入您的密码" hasFeedback>
          {getFieldDecorator('oldPwd', {
            rules: [{
              required: true, message: '请输入您的密码!',
            }, {
              validator: checkConfirm,
            }],
          })(
            <Input type="password" style={cssStyle.inp} />
          )}
        </FormItem>
      </div>
      <div className={styles.passwordWrapper}>
        <FormItem label="输入您的新密码" hasFeedback>
          {getFieldDecorator('password', {
            rules: [{
              required: true, message: '输入您的新密码!',
            }, {
              validator: checkConfirm,
            }],
          })(
            <Input type="password" style={cssStyle.inp} />
          )}
        </FormItem>
      </div>
      <div className={styles.passwordWrapper}>
        <FormItem label="再次确认您的新密码" hasFeedback>
          {getFieldDecorator('confirmPassword', {
            rules: [{
              required: true, message: '再次确认您的新密码!',
            }, {
              validator: checkPassword,
            }],
          })(
            <div className={styles.passwordBox}>
              <Input type="password" style={cssStyle.inp} />
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


class resetPassword extends React.Component {
  state = {}

  componentDidMount() {
    this.props.dispatch({ type: 'resetPassword/changeStep', step: 0 })
  }

  saveFormRef = (form) => {
    this.form = form
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
      callback('两次输入的新密码不匹配!')
    } else {
      callback()
    }
  }

  // 设置新密码
  handelSetNewPwd = () => {
    const form = this.form
    form.validateFields((err, values) => {
      if (err) {
        return
      }
      this.props.dispatch({
        type: 'resetPassword/resetPassword',
        param: {
          oldPsd: values.oldPwd,
          newPsd: values.password,
        },
      })
      form.resetFields()
    })
  }

  // 修改密码成功，到登录页面用新密码登录
  handleBackLogin = () => {
    this.props.dispatch(push('/user/login'))
  }

  // 根据修改密码步骤 显示不同样式
  boxWrapper = (step) => {
    let stepPage = (null)
    switch (step) {
      case 0:
        stepPage = (
          <div className={styles.boxWrapper}>
            <div className={styles.topWrapper}>
              <div className={styles.title}>修改密码</div>
              <div className={styles.content}>
                请修改金课坊登录密码。密码长度建议在6~14位，支持数字、大小写字母和标点符号，不允许有空格。
              </div>
            </div>
            <CreateNewPwdForm
              ref={this.saveFormRef}
              handleOnSubmit={this.handelSetNewPwd}
              checkConfirm={this.handleCheckConfirm}
              checkPassword={this.handleCheckPassword}
            />
          </div>
        )
        break
      case 1:
        stepPage = (
          <div className={styles.boxWrapper}>
            <div className={styles.topWrapper}>
              <div className={styles.title}>已成功修改密码</div>
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
      case 2:
        stepPage = (
          <div className={styles.boxWrapper}>
            <div className={styles.topWrapper}>
              <div className={styles.title}>修改密码失败</div>
              <div className={styles.content}>
                修改密码失败，请重新尝试
              </div>
            </div>
            <CreateNewPwdForm
              ref={this.saveFormRef}
              handleOnSubmit={this.handelSetNewPwd}
              checkConfirm={this.handleCheckConfirm}
              checkPassword={this.handleCheckPassword}
            />
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

resetPassword.propTypes = {
  step: PropTypes.number,
  dispatch: PropTypes.func,
  location: PropTypes.object,
}
export default connect(selectors)(resetPassword)
