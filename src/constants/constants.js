import { FiUser, FiUsers, FiCpu } from "react-icons/fi"

export const slides = [
  {
    title: "Title của cái này",
    cta: "Tìm hiểu thêm",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Lớp Speaking nhóm nhỏ",
    cta: "Khám phá",
    image:
      "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Workshop Debate",
    cta: "Đăng ký ngay",
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
  },
]

export const badges = [
  { label: "1:1", desc: "Kèm riêng", icon: FiUser },
  { label: "2:5", desc: "Nhóm nhỏ", icon: FiUsers },
  { label: "AI", desc: "Giáo viên AI", icon: FiCpu },
]

export const roomFilters = [
  { label: "2 : 5", checked: true },
  { label: "Đã lưu" },
  { label: "Diễn đàn" },
]

export const topicsFilters = [
  ["Gia đình", "Thể thao"],
  ["Phim", "Du lịch"],
  ["Trường học", "Đồ đạc"],
  ["A1", "B2"],
  ["Khác"],
]
