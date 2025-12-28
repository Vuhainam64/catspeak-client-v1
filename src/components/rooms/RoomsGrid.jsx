import React from "react";
import RoomCard from "./RoomCard";
import Pagination from "@/components/ui/Pagination";

const RoomsGrid = ({ rooms = [], page, totalPages, onChangePage }) => {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {rooms.map((room) => (
          <RoomCard key={room.roomId} room={room} />
        ))}
      </div>
      {/* Pagination */}
      <Pagination page={page} totalPages={totalPages} onChangePage={onChangePage} />
    </section>
  );
};

export default RoomsGrid;

