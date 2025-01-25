import BookingForm from "@/components/BookingForm";

export default function Home() {
  return (
    <div className="p-5 text-white">
      <div className="font-bold text-[#b2bbff]">DASHBOARD</div>
      <div className="text-5xl py-4">
        Room Booking
      </div>
      <div className="w-full">
        <input type="text" className="w-full flex h-10 rounded-full bg-[#282828]
         text-[#8b8b8b] py-4" placeholder="Search"/>
      </div>
      <div className="py-4 flex flex-row gap-2">
        <div className="bg-[#3f3f3f] rounded-md p-2">filters</div>
        <div className="bg-[#3f3f3f] rounded-md p-2">filters</div>
        <div className="bg-[#3f3f3f] rounded-md p-2">filters</div>
        <div className="bg-[#3f3f3f] rounded-md p-2">filters</div>
      </div>
      <hr className="h-px my-1 bg-[#282828] border-0"/>
      <BookingForm/>
    </div>
  );
}
