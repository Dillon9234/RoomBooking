// app/page.jsx
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Home() {
  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 text-center">
          <h1 className="display-4 mb-4">Room Booking Application</h1>
          <p className="lead mb-5">
            Book rooms in various buildings for your meetings, events, and more.
          </p>
          
          <div className="d-grid gap-3 d-sm-flex justify-content-sm-center">
            <Link href="/buildings" className="btn btn-primary btn-lg px-4 gap-3">
              View Buildings
            </Link>
            <Link href="/admin" className="btn btn-outline-secondary btn-lg px-4">
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}