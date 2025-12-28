import React from "react";
import { FiSearch } from "react-icons/fi";

const FiltersSidebar = ({ roomFilters, topicsFilters }) => {
  return (
    <aside className="rounded-3xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b px-4 py-3">
        <div className="flex h-9 flex-1 items-center rounded-full border border-gray-200 px-3 text-sm text-gray-600">
          <FiSearch className="mr-2 h-4 w-4 text-gray-400" />
          <input
            className="w-full bg-transparent outline-none placeholder:text-gray-400"
            placeholder="Tìm kiếm"
          />
        </div>
        <button className="flex h-9 w-9 items-center justify-center rounded-full bg-[#990011] text-white shadow">
          <span className="sr-only">Search</span>
          <FiSearch className="h-4 w-4" />
        </button>
      </div>

      <div className="max-h-[520px] overflow-y-auto px-4 pb-5 pt-3 scrollbar-thin scrollbar-thumb-[#990011] scrollbar-track-gray-200">
        <div className="space-y-5 text-sm">
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-gray-900">PHÒNG</h3>
            <div className="space-y-2">
              {roomFilters.map((item) => (
                <label key={item.label} className="flex items-center gap-2 text-gray-800">
                  <input
                    type="checkbox"
                    defaultChecked={item.checked}
                    className="h-4 w-4 rounded border-gray-300 text-[#990011] focus:ring-[#990011]"
                  />
                  {item.label}
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-3 border-t border-gray-200 pt-4">
            <h3 className="text-base font-semibold text-gray-900">CHỦ ĐỀ | TRÌNH ĐỘ</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {topicsFilters.map((row, idx) =>
                row.map((label) => (
                  <label key={`${idx}-${label}`} className="flex items-center gap-2 text-gray-800">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-[#990011] focus:ring-[#990011]"
                    />
                    {label}
                  </label>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default FiltersSidebar;

