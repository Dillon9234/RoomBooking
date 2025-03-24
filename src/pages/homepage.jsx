import BookingForm from "../components/BookingForm";

export default function Home() {
  return (
    <div className="container text-white">
      <div className="d-flex justify-content-center justify-content-md-start py-4">
        <h1 className="display-4">DASHBOARD</h1>
      </div>
      <BookingForm />
    </div>
  );
}
