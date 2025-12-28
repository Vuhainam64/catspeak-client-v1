import React, { useMemo, useState } from "react";
import {
  FiUser,
  FiUsers,
  FiCpu,
} from "react-icons/fi";
import {
  BubbleChevronLeft,
  BubbleChevronRight,
  BubblePillMessage,
} from "@/components/ui/button";
import RoomTabs from "@/components/rooms/RoomTabs";
import FiltersSidebar from "@/components/rooms/FiltersSidebar";
import ClassSidebar from "@/components/rooms/ClassSidebar";
import RoomsGrid from "@/components/rooms/RoomsGrid";
import LiveMessages from "@/components/rooms/LiveMessages";
import ClassTab from "@/components/rooms/ClassTab";

const slides = [
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
];

import { useNavigate } from "react-router-dom";
import { useCreateVideoSessionMutation } from "@/store/api/videoSessionsApi";
import { useGetRoomsQuery } from "@/store/api/roomsApi";

const badges = [
  { label: "1:1", desc: "Kèm riêng", icon: FiUser },
  { label: "2:5", desc: "Nhóm nhỏ", icon: FiUsers },
  { label: "AI", desc: "Giáo viên AI", icon: FiCpu },
];

const roomFilters = [
  { label: "2 : 5", checked: true },
  { label: "Đã lưu" },
  { label: "Diễn đàn" },
];

const topicsFilters = [
  ["Gia đình", "Thể thao"],
  ["Phim", "Du lịch"],
  ["Trường học", "Đồ đạc"],
  ["A1", "B2"],
  ["Khác"],
];

const RoomsPage = () => {
  const [active, setActive] = useState(0);
  const [allowConnect, setAllowConnect] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const [tab, setTab] = useState("communicate");
  const [liveInput, setLiveInput] = useState("");
  const [userLetters, setUserLetters] = useState(2);
  const totalLetters = 220;

  const navigate = useNavigate();
  const [createVideoSession, { isLoading: isCreating }] = useCreateVideoSessionMutation();
  const { data: rooms = [], isLoading: isLoadingRooms } = useGetRoomsQuery();

  const handleCreateSession = async () => {
    try {
      const response = await createVideoSession({
        sessionType: 1,
        invitedParticipants: [],
      }).unwrap();
      
      // Assuming the response has sessionId or id. Adjust based on actual API response.
      const sessionId = response.sessionId || response.id;
      if (sessionId) {
        navigate(`/meet/${sessionId}`);
      }
    } catch (error) {
      console.error("Failed to create session:", error);
    }
  };

  const current = useMemo(() => slides[active], [active]);
  
  // Client-side pagination
  const totalPages = Math.max(1, Math.ceil(rooms.length / pageSize));
  const pagedRooms = useMemo(
    () => rooms.slice((page - 1) * pageSize, page * pageSize),
    [page, rooms]
  );

  const handleSendLive = (msg) => {
    if (!msg?.trim()) return;
    setUserLetters((n) => n + 1);
    setLiveInput("");
  };

  const next = () => setActive((p) => (p + 1) % slides.length);
  const prev = () => setActive((p) => (p - 1 + slides.length) % slides.length);

  return (
    <div className="w-full">
      <div className="mx-auto flex max-w-screen-xl flex-col gap-10 px-6 py-12 md:flex-row md:items-start">
        {/* Left column */}
        <div className="relative w-full md:w-1/2 pl-6">
          {/* Decorative connecting lines */}
          <div className="absolute left-2 top-4 h-0.5 w-20 bg-[#990011]" />
          <div className="absolute left-2 top-4 h-[220px] w-0.5 bg-[#990011]" />

          <p className="text-3xl font-bold mb-1 ml-20">Hi Quỳnh,</p>
          <h2 className="text-3xl font-bold text-[#990011] drop-shadow-[0_2px_6px_rgba(0,0,0,0.15)]">
            Happy Halloween
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-gray-800">
            Halloween is nominally a <span className="font-semibold text-[#990011]">Christian holiday</span> honoring the
            souls of saints and other souls who have been blessed. It descends from an{" "}
            <span className="font-semibold text-[#990011]">ancient Celtic festival</span> of the dead that marked the
            official end of the growing season.
          </p>
          <p className="mt-3 text-sm italic text-gray-600">Trick or Treat</p>

          <div className="mt-8 inline-flex items-center gap-3 rounded-full bg-gray-50 px-4 py-2 text-sm text-[#990011] shadow">
            <button
              type="button"
              onClick={() => setAllowConnect((v) => !v)}
              className={[
                "relative inline-flex h-6 w-11 items-center rounded-full transition",
                allowConnect ? "bg-yellow-500" : "bg-gray-300",
              ].join(" ")}
              aria-pressed={allowConnect}
            >
              <span
                className={[
                  "h-5 w-5 transform rounded-full bg-white shadow transition",
                  allowConnect ? "translate-x-5" : "translate-x-1",
                ].join(" ")}
              />
            </button>
            Cho phép kết nối với bạn bè quốc tế
          </div>

          <div className="relative mt-6">
            <div className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 bg-[#990011]/20" />
            <div className="relative flex flex-wrap gap-3">
              {badges.map((b) => {
                const Icon = b.icon;
                const isOneOnOne = b.label === "1:1";
                return (
                  <BubblePillMessage 
                    key={b.label} 
                    className={`text-sm font-semibold ${isOneOnOne ? "cursor-pointer hover:bg-red-700 hover:text-white transition-colors" : ""}`}
                    onClick={isOneOnOne ? handleCreateSession : undefined}
                    disabled={isOneOnOne && isCreating}
                  >
                    {isOneOnOne && isCreating ? (
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <Icon className="mr-2 h-4 w-4 text-white" />
                    )}
                    {b.label}
                  </BubblePillMessage>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="w-full md:w-1/2">
          <div className="relative overflow-hidden rounded-3xl bg-black/5 shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
            <div className="relative h-[260px] w-full overflow-hidden rounded-3xl">
              <img
                src={current.image}
                alt={current.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 flex flex-col justify-center px-8 text-white drop-shadow-[0_3px_10px_rgba(0,0,0,0.35)]">
                <div className="inline-flex flex-col gap-3 rounded-2xl bg-black/45 px-6 py-4 backdrop-blur-[2px]">
                  <p className="text-lg font-semibold uppercase">
                    {current.title}
                  </p>
                  <button className="inline-flex w-fit items-center gap-2 rounded-full bg-[#f5c518] px-5 py-2 text-sm font-semibold text-[#990011] shadow">
                    {current.cta}
                  </button>
                </div>
              </div>
              <div className="absolute left-3 top-3">
                <BubbleChevronLeft aria-label="Prev slide" onClick={prev} />
              </div>
              <div className="absolute right-3 bottom-3">
                <BubbleChevronRight aria-label="Next slide" onClick={next} />
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 py-4">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActive(idx)}
                  className={[
                    "h-3 w-3 rounded-full transition",
                    idx === active ? "bg-[#990011]" : "bg-gray-300",
                  ].join(" ")}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          <RoomTabs activeTab={tab} onChange={setTab} />
        </div>
      </div>

      {/* Lower section with sidebar & content for all tabs */}
      <div className="mx-auto grid max-w-screen-xl gap-6 px-6 pb-12 md:grid-cols-[360px_1fr]">
        {tab === "class" ? (
          <ClassSidebar />
        ) : (
          <FiltersSidebar roomFilters={roomFilters} topicsFilters={topicsFilters} />
        )}
        {tab === "communicate" ? (
          <RoomsGrid
            rooms={pagedRooms}
            page={page}
            totalPages={totalPages}
            onChangePage={setPage}
          />
        ) : tab === "class" ? (
          <ClassTab />
        ) : (
          <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-10 text-center text-gray-500">
            Nội dung cho tab "{tab}" sẽ được cập nhật.
          </div>
        )}
      </div>

      {/* Live messages footer for all tabs */}
      <div className="mx-auto max-w-screen-xl px-6 pb-12">
        <LiveMessages
          messages={[
            "Có ai mới học tiếng anh khum?",
            "Lớp A2 – Gia đình mở chưa?",
            "Thầy ơi cho xin tài liệu!",
            "Team debate tối nay không?",
            "Link zoom đâu vậy mọi người?",
            "Có suất speaking 1:1 không?",
          ]}
          inputValue={liveInput}
          onChangeInput={setLiveInput}
          onSend={handleSendLive}
          userLetters={userLetters}
          totalLetters={totalLetters}
        />
      </div>
    </div>
  );
};

export default RoomsPage;
