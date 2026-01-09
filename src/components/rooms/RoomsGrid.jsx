import RoomCard from "./RoomCard"

const RoomsGrid = ({ rooms = [] }) => {
  return (
    <section className="">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {rooms.map((room) => (
          <RoomCard key={room.roomId} room={room} />
        ))}
      </div>
    </section>
  )
}

export default RoomsGrid
