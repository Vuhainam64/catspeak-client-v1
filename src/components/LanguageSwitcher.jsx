import React from "react"
import { Select } from "antd"
import { GlobalOutlined } from "@ant-design/icons"
import { useLanguage } from "../context/LanguageContext"

const { Option } = Select

const LanguageSwitcher = ({ className = "" }) => {
  const { language, setLanguage } = useLanguage()

  const handleChange = (value) => {
    setLanguage(value)
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <GlobalOutlined className="text-gray-500 text-lg" />
      <Select
        defaultValue={language}
        value={language}
        onChange={handleChange}
        style={{ width: 120 }}
        variant="borderless"
        className="font-medium"
      >
        <Option value="vi">Tiếng Việt</Option>
        <Option value="en">English</Option>
      </Select>
    </div>
  )
}

export default LanguageSwitcher
