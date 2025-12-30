import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { useLanguage } from "@context/LanguageContext.jsx"
import { useRegisterMutation } from "@/store/api/authApi"
import { Form, Input, Button, Checkbox, Select, DatePicker } from "antd"
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  EnvironmentOutlined,
  LinkOutlined,
  TrophyOutlined,
} from "@ant-design/icons"
import AuthLayout from "@/layouts/AuthLayout"
import dayjs from "dayjs"

const { Option } = Select

const RegisterPage = () => {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const authText = t.auth
  const [register, { isLoading }] = useRegisterMutation()
  const [form] = Form.useForm()

  const onFinish = async (values) => {
    try {
      const payload = {
        username: values.username,
        email: values.email,
        password: values.password,
        avatarImageUrl: values.avatarImageUrl || "",
        address: values.address || "",
        dateOfBirth: values.dateOfBirth
          ? dayjs(values.dateOfBirth).toISOString()
          : "",
        level: values.level,
      }

      await register(payload).unwrap()
      navigate("/app")
    } catch (err) {
      console.error("Registration failed:", err)
    }
  }

  return (
    <AuthLayout
      title="Join Our Community"
      subtitle="Create an account to start your journey. Connect, share, and discover with fellow cat enthusiasts."
    >
      <div className="text-center lg:text-left">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">
          {authText.registerTitle}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Create your free account today
        </p>
      </div>

      <Form
        form={form}
        name="register"
        layout="vertical"
        onFinish={onFinish}
        size="large"
        className="mt-8"
        initialValues={{
          level: "Beginner",
        }}
      >
        <Form.Item
          name="username"
          label={
            <span className="font-semibold text-gray-700">
              {authText.usernameLabel}
            </span>
          }
          rules={[
            {
              required: true,
              message: "Please input your username!",
            },
          ]}
        >
          <Input
            prefix={<UserOutlined className="text-gray-400" />}
            placeholder={authText.usernamePlaceholder}
            className="rounded-xl py-2.5"
          />
        </Form.Item>

        <Form.Item
          name="email"
          label={
            <span className="font-semibold text-gray-700">
              {authText.emailLabel}
            </span>
          }
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "Please enter a valid email!" },
          ]}
        >
          <Input
            prefix={<MailOutlined className="text-gray-400" />}
            placeholder={authText.emailPlaceholder}
            className="rounded-xl py-2.5"
          />
        </Form.Item>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Form.Item
            name="dateOfBirth"
            label={
              <span className="font-semibold text-gray-700">
                {authText.dateOfBirthLabel}
              </span>
            }
            rules={[
              { required: true, message: "Please select your date of birth!" },
            ]}
          >
            <DatePicker
              className="w-full rounded-xl py-2.5"
              format="YYYY-MM-DD"
              placeholder={authText.dateOfBirthPlaceholder}
            />
          </Form.Item>

          <Form.Item
            name="level"
            label={
              <span className="font-semibold text-gray-700">
                {authText.levelLabel}
              </span>
            }
            rules={[{ required: true, message: "Please select your level!" }]}
          >
            <Select className="h-[46px] rounded-xl">
              <Option value="Beginner">
                <div className="flex items-center gap-2">
                  <TrophyOutlined className="text-gray-400" />
                  {authText.levelBeginner}
                </div>
              </Option>
              <Option value="Intermediate">
                <div className="flex items-center gap-2">
                  <TrophyOutlined className="text-gray-400" />
                  {authText.levelIntermediate}
                </div>
              </Option>
              <Option value="Advanced">
                <div className="flex items-center gap-2">
                  <TrophyOutlined className="text-gray-400" />
                  {authText.levelAdvanced}
                </div>
              </Option>
            </Select>
          </Form.Item>
        </div>

        <Form.Item
          name="address"
          label={
            <span className="font-semibold text-gray-700">
              {authText.addressLabel}
            </span>
          }
          rules={[{ required: true, message: "Please input your address!" }]}
        >
          <Input
            prefix={<EnvironmentOutlined className="text-gray-400" />}
            placeholder={authText.addressPlaceholder}
            className="rounded-xl py-2.5"
          />
        </Form.Item>

        <Form.Item
          name="avatarImageUrl"
          label={
            <span className="font-semibold text-gray-700">
              {authText.avatarImageUrlLabel}
            </span>
          }
        >
          <Input
            prefix={<LinkOutlined className="text-gray-400" />}
            placeholder={authText.avatarImageUrlPlaceholder}
            className="rounded-xl py-2.5"
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
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder={authText.passwordPlaceholder}
            className="rounded-xl py-2.5"
          />
        </Form.Item>

        <div className="mt-4">
          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(new Error("Should accept agreement")),
              },
            ]}
          >
            <Checkbox className="text-sm text-gray-600 leading-relaxed">
              {authText.agreePrefix}{" "}
              <span className="font-bold text-[#f08d1d] hover:text-[#d87c15] transition-colors hover:underline cursor-pointer">
                {authText.serviceTerms}
              </span>{" "}
              {authText.and}{" "}
              <span className="font-bold text-[#f08d1d] hover:text-[#d87c15] transition-colors hover:underline cursor-pointer">
                {authText.privacyPolicy}
              </span>{" "}
              {authText.companySuffix}
            </Checkbox>
          </Form.Item>
        </div>

        <Form.Item className="mt-2">
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            block
            className="h-12 text-base font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 border-none bg-gradient-to-r from-[#f08d1d] to-[#f4ab1b]"
          >
            {authText.registerButton}
          </Button>
        </Form.Item>
      </Form>

      <div className="mt-8 pt-6 border-t border-gray-100 text-center">
        <p className="text-sm text-gray-600 font-medium">
          {authText.haveAccount}{" "}
          <Link
            to="/login"
            className="font-bold text-[#f08d1d] hover:text-[#d87c15] transition-colors hover:underline"
          >
            {authText.loginLink}
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}

export default RegisterPage
