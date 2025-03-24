import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/homepage";
import Buildings from "./pages/admin/buildings";
import Rooms from "./pages/admin/rooms";
import Building from "./pages/building";
import Login from "./pages/login";
import Room from "./pages/room";
import Layout from "./components/layout"; // Import Layout

function App() {
  return (
    <Router>
      {/* Removed the container-fluid div to allow full width */}
      <Routes>
        {/* Routes that don't use Layout */}
        <Route path="/login" element={<Login />} />

        {/* Routes that use Layout */}
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
          path="/building"
          element={
            <Layout>
              <Building />
            </Layout>
          }
        />
        <Route
          path="/room"
          element={
            <Layout>
              <Room />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;