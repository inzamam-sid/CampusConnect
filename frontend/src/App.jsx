// import { BrowserRouter, Routes, Route } from "react-router-dom";
// //import Login from "./pages/Login";
// //import Signup from "./pages/Signup";
// import Dashboard from "./pages/Dashboard";
// import Seniors from "./pages/Seniors";
// import Profile from "./pages/Profile";

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Dashboard />} />
//         {/* <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} /> */}
//         <Route path="/seniors" element={<Seniors />} />
//         <Route path="/profile" element={<Profile />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;




import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Seniors from "./pages/Seniors";
import Profile from "./pages/Profile";

function App() {
  const { token } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={token ? <Dashboard /> : <Navigate to="/login" />}
        />

        <Route
          path="/seniors"
          element={token ? <Seniors /> : <Navigate to="/login" />}
        />

        <Route
          path="/profile"
          element={token ? <Profile /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;