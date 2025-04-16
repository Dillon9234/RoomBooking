import BookingForm from "../../components/BookingForm";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";


const getCookie = (name) => {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
};

export default function Bookings() {
  const navigate = useNavigate();
  
  useEffect(() => {

    const token = getCookie("token"); // Fetch token from cookie
    let isAdmin = false;
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
    } catch (error) {
      console.error("Invalid token:", error);
      navigate("/login");
      return;
    }

  }, []);

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