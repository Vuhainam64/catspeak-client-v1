import React from "react"
import { Pagination, Tabs, ConfigProvider } from "antd"
import { motion } from "framer-motion"
import { FiMessageCircle, FiMonitor, FiUsers, FiLayers } from "react-icons/fi"
// RoomTabs import removed
import FiltersSidebar from "@/components/rooms/FiltersSidebar"
import ClassSidebar from "@/components/rooms/ClassSidebar"
import RoomsGrid from "@/components/rooms/RoomsGrid"
import { useRoomsPageLogic } from "@/hooks/rooms/useRoomsPageLogic"
import WelcomeSection from "@/components/rooms/WelcomeSection"
import SessionActionButtons from "@/components/rooms/SessionActionButtons"
import HeroCarousel from "@/components/rooms/HeroCarousel"
import LiveMessages from "@/components/rooms/LiveMessages"
import { useLanguage } from "@/context/LanguageContext"
import ClassTab from "@/components/rooms/ClassTab"

const RoomsPage = () => {
  const { t } = useLanguage()
  const { state, derived, actions } = useRoomsPageLogic()
  const {
    active,
    allowConnect,
    page,
    tab,
    liveInput,
    userLetters,
    totalLetters,
    // isCreating, // Not strictly needed here anymore if we use split states directly
  } = state
  const { current, totalPages, pagedRooms, slides } = derived
  const {
    setActive,
    setAllowConnect,
    setPage,
    setTab,
    setLiveInput,
    handleCreateOneOnOneSession,
    handleCreateStudyGroupSession,
    handleSendLive,
    next,
    prev,
  } = actions

  return (
    <div className="w-full">
      <div className="mx-auto flex max-w-screen-xl flex-col gap-10 px-6 py-12 md:flex-row md:items-start">
        {/* Left column */}
        <div className="w-full md:w-1/2">
          <WelcomeSection
            allowConnect={allowConnect}
            setAllowConnect={setAllowConnect}
          />

          {/* Session Creation Buttons (Moved from WelcomeSection) */}
          <SessionActionButtons
            handleCreateOneOnOneSession={handleCreateOneOnOneSession}
            handleCreateStudyGroupSession={handleCreateStudyGroupSession}
            isCreatingOneOnOne={state.isCreatingOneOnOne}
            isCreatingStudyGroup={state.isCreatingStudyGroup}
          />
        </div>

        {/* Right column */}
        <div className="w-full md:w-1/2">
          <HeroCarousel slides={slides} />
        </div>
      </div>

      {/* Lower section with content & sidebar - SWAPPED to Sidebar Left */}
      <div className="mx-auto grid max-w-screen-xl gap-6 px-6 pb-12 md:grid-cols-[360px_1fr]">
        {/* Sidebar - NOW ON LEFT */}
        {tab === "class" ? <ClassSidebar /> : <FiltersSidebar />}

        {/* Content area - NOW ON RIGHT */}
        {/* Content area - NOW ON RIGHT */}
        <div className="flex flex-col">
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#990011",
              },
            }}
          >
            <Tabs
              activeKey={tab}
              onChange={setTab}
              items={[
                {
                  key: "communicate",
                  label: (
                    <span className="flex items-center gap-2">
                      <FiMessageCircle className="h-4 w-4" />
                      {t.rooms.tabs.communicate}
                    </span>
                  ),
                  children: (
                    <>
                      {pagedRooms.length > 0 ? (
                        <>
                          <RoomsGrid rooms={pagedRooms} />

                          {/* Pagination (Moved from RoomsGrid) */}
                          <div className="mt-6 flex justify-center">
                            <Pagination
                              current={page} // page is 1-indexed
                              pageSize={1} // Treat each "item" as a page since we only have totalPages
                              total={totalPages}
                              onChange={setPage}
                              showSizeChanger={false}
                            />
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white py-20 text-center">
                          <div className="mb-4 text-6xl">🏜️</div>
                          <h3 className="mb-2 text-xl font-bold text-gray-800">
                            No rooms found
                          </h3>
                          <p className="text-gray-500">
                            There are no active rooms right now. Why not create
                            one?
                          </p>
                        </div>
                      )}
                    </>
                  ),
                },
                {
                  key: "teaching",
                  label: (
                    <span className="flex items-center gap-2">
                      <FiMonitor className="h-4 w-4" />
                      {t.rooms.tabs.teaching}
                    </span>
                  ),
                  children: (
                    <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-10 text-center text-gray-500">
                      Nội dung cho tab "teaching" sẽ được cập nhật.
                    </div>
                  ),
                },
                {
                  key: "group",
                  label: (
                    <span className="flex items-center gap-2">
                      <FiUsers className="h-4 w-4" />
                      {t.rooms.tabs.group}
                    </span>
                  ),
                  children: (
                    <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-10 text-center text-gray-500">
                      Nội dung cho tab "group" sẽ được cập nhật.
                    </div>
                  ),
                },
                {
                  key: "class",
                  label: (
                    <span className="flex items-center gap-2">
                      <FiLayers className="h-4 w-4" />
                      {t.rooms.tabs.class}
                    </span>
                  ),
                  children: <ClassTab />,
                },
              ]}
            />
          </ConfigProvider>
        </div>
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
  )
}

export default RoomsPage
