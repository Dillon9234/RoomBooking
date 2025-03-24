import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/homepage";
import Buildings from "./pages/admin/buildings";
import Rooms from "./pages/admin/rooms";
import Building from "./pages/building";
import Login from "./pages/login";
import Room from "./pages/room";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/buildings" element={<Buildings />} />
        <Route path="/admin/rooms" element={<Rooms />} />
        <Route path="/building" element={<Building />} />
        <Route path="/login" element={<Login />} />
        <Route path="/room" element={<Room />} />
      </Routes>
    </Router>
  );
}

export default App;
