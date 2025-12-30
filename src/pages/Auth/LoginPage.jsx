import React from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useLanguage } from "@context/LanguageContext.jsx"
import { useLoginMutation } from "@/store/api/authApi"
import { Form, Input, Button, Checkbox } from "antd"
import { UserOutlined, LockOutlined } from "@ant-design/icons"
import AuthLayout from "@/layouts/AuthLayout"

const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useLanguage()
  const authText = t.auth

  const [login, { isLoading }] = useLoginMutation()
  const [form] = Form.useForm()

  const onFinish = async (values) => {
    try {
      await login({
        username: values.username,
        password: values.password,
      }).unwrap()
      const from = location.state?.from?.pathname || "/rooms"
      navigate(from, { replace: true })
    } catch (err) {
      console.error("Login failed:", err)
    }
  }

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Connect with cat lovers around the world. Join the conversation and share your passion."
    >
      <div className="text-center lg:text-left">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">
          {authText.loginTitle}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Please enter your details to sign in
        </p>
      </div>

      <Form
        form={form}
        name="login"
        layout="vertical"
        onFinish={onFinish}
        size="large"
        className="mt-8"
      >
        <Form.Item
          name="username"
          label={<span className="font-semibold text-gray-700">Username</span>}
          rules={[
            {
              required: true,
              message:
                authText.usernameRequired || "Please input your username!",
            },
          ]}
        >
          <Input
            prefix={<UserOutlined className="text-gray-400" />}
            placeholder="Enter your username"
            className="rounded-xl py-3"
          />
        </Form.Item>

        <Form.Item
          name="password"
          label={
            <span className="font-semibold text-gray-700">
              {authText.passwordLabel}
            </span>
          }
          rules={[
            {
              required: true,
              message:
                authText.passwordRequired || "Please input your password!",
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder={authText.passwordPlaceholder}
            className="rounded-xl py-3"
          />
        </Form.Item>

        <div className="flex items-center justify-between mb-6">
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox className="text-sm font-medium text-gray-600">
              {authText.rememberMe}
            </Checkbox>
          </Form.Item>

          <Link
            to="/forgot-password"
            className="text-sm font-semibold text-[#f08d1d] hover:text-[#d87c15] transition-colors"
          >
            {authText.forgotLink}
          </Link>
        </div>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            block
            className="h-12 text-base font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 border-none bg-gradient-to-r from-[#f08d1d] to-[#f4ab1b]"
          >
            {authText.loginButton}
          </Button>
        </Form.Item>
      </Form>

      <p className="text-center text-sm text-gray-600 font-medium">
        {authText.dontHaveAccount}{" "}
        <Link
          to="/register"
          className="font-bold text-[#f08d1d] hover:text-[#d87c15] transition-colors hover:underline"
        >
          {authText.registerLink}
        </Link>
      </p>
    </AuthLayout>
  )
}

export default LoginPage
