import React from "react";
import { FiMessageCircle, FiMonitor, FiUsers, FiLayers } from "react-icons/fi";

const tabs = [
  { key: "communicate", icon: FiMessageCircle },
  { key: "teaching", icon: FiMonitor },
  { key: "group", icon: FiUsers },
  { key: "class", icon: FiLayers },
];

const RoomTabs = ({ activeTab, onChange }) => {
  return (
    <div className="mt-6 flex items-center justify-center gap-10 px-6">
      {tabs.map((item) => {
        const Icon = item.icon;
        const active = activeTab === item.key;
        return (
          <button
            key={item.key}
            onClick={() => onChange(item.key)}
            className="relative flex flex-col items-center gap-2 text-2xl transition"
            aria-pressed={active}
          >
            <Icon className={`h-8 w-8 ${active ? "text-[#990011]" : "text-gray-300"}`} />
            {active && <span className="block h-0.5 w-10 rounded-full bg-[#990011]" />}
          </button>
        );
      })}
    </div>
  );
};

export default RoomTabs;

