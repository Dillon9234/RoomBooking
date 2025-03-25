import BookingForm from "../../components/BookingForm";

export default function Bookings() {
  return (
    <div className="container text-white py-5">
      <div className="row justify-content-center justify-content-md-start">
        <div className="col text-center text-md-start">
          <h1 className="display-4">ALLOTMENT</h1>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col">
          <BookingForm />
        </div>
      </div>
    </div>
  );
}