import React from "react"
import { FiMessageCircle, FiMonitor, FiUsers, FiLayers } from "react-icons/fi"
import { motion } from "framer-motion"
import { useLanguage } from "@/context/LanguageContext"

const RoomTabs = ({ activeTab, onChange }) => {
  const { t } = useLanguage()
  const tabsText = t.rooms.tabs

  const tabs = [
    { key: "communicate", label: tabsText.communicate, icon: FiMessageCircle },
    { key: "teaching", label: tabsText.teaching, icon: FiMonitor },
    { key: "group", label: tabsText.group, icon: FiUsers },
    { key: "class", label: tabsText.class, icon: FiLayers },
  ]

  return (
    <div className="mb-6 inline-flex flex-wrap items-center justify-start gap-1 rounded-full border border-gray-200 bg-white p-2 shadow-sm">
      {tabs.map((item) => {
        const Icon = item.icon
        const active = activeTab === item.key
        return (
          <button
            key={item.key}
            onClick={() => onChange(item.key)}
            className={`group relative flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300 ${
              active
                ? "bg-[#990011] text-white shadow-sm"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            }`}
            aria-pressed={active}
          >
            <Icon
              className={`h-4 w-4 ${
                active
                  ? "text-white"
                  : "text-gray-400 group-hover:text-gray-600"
              }`}
            />
            {item.label}
          </button>
        )
      })}
    </div>
  )
}

export default RoomTabs
