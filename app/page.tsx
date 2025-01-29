import BookingForm from "@/components/BookingForm";

export default function Home() {
  return (
    <div className="p-5 text-white">
      <div className="font-bold text-[#b2bbff] flex justify-center md:justify-normal">DASHBOARD</div>
      <div className="flex text-5xl py-4 justify-center md:justify-normal">
        Room Booking
      </div>
      <hr className="h-px my-1 bg-[#282828] border-0"/>
      <BookingForm/>
    </div>
  );
}
