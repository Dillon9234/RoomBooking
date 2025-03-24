// app/admin/page.jsx
'use client';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminDashboard = () => {
  return (
    <div className="container py-5">
      <h1 className="mb-4">Admin Dashboard</h1>
      
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-5">
        <div className="col">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Buildings</h5>
              <p className="card-text">Manage buildings and their information.</p>
              <Link href="/admin/buildings" className="btn btn-primary">
                Manage Buildings
              </Link>
            </div>
          </div>
        </div>
        
        <div className="col">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Rooms</h5>
              <p className="card-text">Manage rooms across all buildings.</p>
              <Link href="/admin/rooms" className="btn btn-primary">
                Manage Rooms
              </Link>
            </div>
          </div>
        </div>
        
        <div className="col">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Bookings</h5>
              <p className="card-text">View and manage room bookings.</p>
              <Link href="/admin/bookings" className="btn btn-primary">
                Manage Bookings
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="d-flex justify-content-center">
        <Link href="/" className="btn btn-outline-secondary">
          Return to Public Site
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;