"use client";

import { useAuth } from "@/components/AuthContext";
import BookingForm from "@/components/BookingForm";
import BookingFormPublic from "@/components/BookingFormPublic";

export default function Home() {
  const { authenticated } = useAuth();
  return (
    <div className="p-5 text-white mx-auto max-w-screen-xl">
      <div className="flex text-5xl py-4 justify-center md:justify-normal">
        DASHBOARD
      </div>
      {authenticated ? <BookingForm /> : <BookingFormPublic />}
    </div>
  );
}
