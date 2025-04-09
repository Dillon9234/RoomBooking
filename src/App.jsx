import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/homepage";
import Buildings from "./pages/admin/buildings";
import Rooms from "./pages/admin/rooms";
import Building from "./pages/building";
import Register from "./pages/register";
import Login from "./pages/login";
import Room from "./pages/room";
import Layout from "./components/Layout";
import Dashboard from "./pages/admin/dashboard";
import Bookings from "./pages/admin/bookings";
import BuildingRooms from "./pages/buildingrooms";
import AdminBuildingRooms from "./pages/admin/adminbuildingrooms";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/admin/buildings"
          element={
            <Layout>
              <Buildings />
            </Layout>
          }
        />
        <Route
          path="/admin/rooms"
          element={
            <Layout>
              <Rooms />
            </Layout>
          }
        />
        <Route
          path="/buildings"
          element={
            <Layout>
              <Building />
            </Layout>
          }
        />
        <Route path="/building/:buildingId/rooms" element={<Layout><BuildingRooms /></Layout>} />

        <Route
          path="/room"
          element={
            <Layout>
              <Room />
            </Layout>
          }
        />
        <Route
          path="/admin"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/admin/building/:buildingId/rooms"
          element={
            <Layout>
              <AdminBuildingRooms />
            </Layout>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <Layout>
              <Bookings />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;