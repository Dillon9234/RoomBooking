import BookingForm from "@/components/BookingForm";

export default function Home() {
  return (
    <div className="p-5 text-white mx-auto max-w-screen-xl">
      <div className="flex text-5xl py-4 justify-center md:justify-normal">
        DASHBOARD
      </div>
      <BookingForm/>
    </div>
  );
}
