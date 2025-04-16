import BookingForm from "../../components/BookingForm";
import { Link } from "react-router-dom";
export default function Bookings() {
  return (
    <div className="container text-white py-4">
      <Link to="/admin" className="btn btn-outline-light mb-2">
        &larr; Back to Admin
      </Link>
      <div className="row justify-content-center justify-content-md-start py-2">
        <div className="col text-center text-md-start">
          <h1 className>ALLOTMENT</h1>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <BookingForm />
        </div>
      </div>
    </div>
  );
}