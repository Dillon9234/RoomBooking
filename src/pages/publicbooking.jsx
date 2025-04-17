import { Link } from "react-router-dom";
import PublicBookingForm from "../components/PublicBookingForm";

export default function PublicBookings() {

  return (
    <div className="container text-white py-4">
      <Link to="/" className="btn btn-outline-light mb-2">
        &larr; Back to Homepage
      </Link>
      <div className="row justify-content-center justify-content-md-start py-2">
        <div className="col text-center text-md-start">
          <h1 className>ALLOTMENT</h1>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <PublicBookingForm />
        </div>
      </div>
    </div>
  );
}