import React from "react"
import { FiSearch } from "react-icons/fi"
import { useSearchParams } from "react-router-dom"
import { useLanguage } from "@/context/LanguageContext"
import { Input, Checkbox, ConfigProvider, theme } from "antd"

const LEVELS = {
  english: ["A1", "A2", "B1", "B2", "C1", "C2"],
  vietnamese: ["A1", "A2", "B1", "B2", "C1", "C2"],
  chinese: ["HSK 1", "HSK 2", "HSK 3", "HSK 4", "HSK 5", "HSK 6"],
}

const FiltersSidebar = () => {
  const { t } = useLanguage()
  const filtersText = t.rooms.filters
  const [searchParams] = useSearchParams()
  const currentLanguage = searchParams.get("language") || "english"
  const currentLevels = LEVELS[currentLanguage] || LEVELS.english

  // Use Ant Design theme token for consistent colors
  const { token } = theme.useToken()

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#990011", // Brand red color
        },
      }}
    >
      <aside className="rounded-3xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {/* Search Header */}
        <div className="border-b px-4 py-4">
          <Input
            prefix={<FiSearch className="text-gray-400 mr-2" />}
            placeholder={filtersText.searchPlaceholder}
            variant="borderless"
            className="rounded-full bg-gray-50 px-4 py-2 hover:bg-gray-100 focus:bg-white border border-transparent focus:border-gray-200 transition-all"
            styles={{
              input: { fontWeight: 500 },
            }}
          />
        </div>

        {/* Filters Content */}
        <div className="max-h-[520px] overflow-y-auto px-6 py-6 scrollbar-thin scrollbar-thumb-[#990011] scrollbar-track-gray-200">
          <div className="space-y-4">
            <h3 className="text-base font-bold text-gray-800 uppercase tracking-wide">
              {filtersText.topicsAndLevels}
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {currentLevels.map((level) => (
                <Checkbox
                  key={level}
                  className="text-gray-600 font-medium hover:text-[#990011] transition-colors"
                >
                  {level}
                </Checkbox>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </ConfigProvider>
  )
}

export default FiltersSidebar
