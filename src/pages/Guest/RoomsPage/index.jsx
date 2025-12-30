import React from "react"
import RoomTabs from "@/components/rooms/RoomTabs"
import FiltersSidebar from "@/components/rooms/FiltersSidebar"
import ClassSidebar from "@/components/rooms/ClassSidebar"
import RoomsGrid from "@/components/rooms/RoomsGrid"
import LiveMessages from "@/components/rooms/LiveMessages"
import ClassTab from "@/components/rooms/ClassTab"

import { useRoomsPageLogic } from "./hooks/useRoomsPageLogic"
import WelcomeSection from "./components/WelcomeSection"
import HeroCarousel from "./components/HeroCarousel"
import { roomFilters, topicsFilters } from "./constants"

const RoomsPage = () => {
  const { state, derived, actions } = useRoomsPageLogic()
  const {
    active,
    allowConnect,
    page,
    tab,
    liveInput,
    userLetters,
    totalLetters,
    isCreating,
  } = state
  const { current, totalPages, pagedRooms } = derived
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
            handleCreateOneOnOneSession={handleCreateOneOnOneSession}
            handleCreateStudyGroupSession={handleCreateStudyGroupSession}
            isCreating={isCreating}
          />
        </div>

        {/* Right column */}
        <div className="w-full md:w-1/2">
          <HeroCarousel
            active={active}
            setActive={setActive}
            current={current}
            next={next}
            prev={prev}
          />
        </div>
      </div>

      {/* Lower section with sidebar & content for all tabs */}
      <div className="mx-auto grid max-w-screen-xl gap-6 px-6 pb-12 md:grid-cols-[360px_1fr]">
        {tab === "class" ? (
          <ClassSidebar />
        ) : (
          <FiltersSidebar
            roomFilters={roomFilters}
            topicsFilters={topicsFilters}
          />
        )}

        <div className="flex flex-col">
          <RoomTabs activeTab={tab} onChange={setTab} />

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
