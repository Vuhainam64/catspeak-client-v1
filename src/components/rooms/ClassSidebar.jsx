import React, { useState } from "react";

const ClassSidebar = () => {
  const [activeMenu, setActiveMenu] = useState("phong");
  const [activeSubMenu, setActiveSubMenu] = useState("lop-hoc");

  const menuItems = [
    {
      key: "phong",
      label: "Phòng",
      subItems: [
        { key: "da-luu", label: "Đã lưu", count: 1 },
        { key: "lop-hoc", label: "Lớp học", count: 2 },
        { key: "loi-moi", label: "Lời mời", count: 5 },
      ],
    },
    {
      key: "letters",
      label: "Letters",
    },
    {
      key: "tai-lieu",
      label: "Tài liệu",
      subItems: [
        { key: "cua-ban", label: "Của bạn", count: 5 },
        { key: "record", label: "Record", count: 1 },
        { key: "chia-se", label: "Chia sẻ", count: 5 },
      ],
    },
  ];

  return (
    <aside className="rounded-3xl border border-gray-200 bg-white shadow-sm">
      {/* Breadcrumb */}
      <div className="border-b px-4 py-3">
        <nav className="text-sm">
          <span className="text-gray-600">Phòng</span>
          <span className="mx-2 text-gray-400">{" >> "}</span>
          <span className="text-gray-600">Lớp học</span>
          <span className="mx-2 text-gray-400">{" >> "}</span>
          <span className="font-semibold text-[#990011]">Mã lớp học</span>
        </nav>
      </div>

      {/* Navigation Menu */}
      <div className="px-4 py-4">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <div key={item.key}>
              <button
                onClick={() => setActiveMenu(item.key)}
                className={[
                  "w-full rounded-lg px-4 py-2.5 text-left text-sm font-semibold transition",
                  activeMenu === item.key
                    ? "bg-[#990011] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                ].join(" ")}
              >
                {item.label}
              </button>

              {item.subItems && activeMenu === item.key && (
                <div className="mt-2 space-y-1 pl-4">
                  {item.subItems.map((subItem) => (
                    <button
                      key={subItem.key}
                      onClick={() => setActiveSubMenu(subItem.key)}
                      className={[
                        "w-full rounded px-3 py-1.5 text-left text-sm transition",
                        activeSubMenu === subItem.key
                          ? "font-bold text-[#990011]"
                          : "text-gray-700 hover:text-[#990011]",
                      ].join(" ")}
                    >
                      {subItem.label} {subItem.count}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default ClassSidebar;

