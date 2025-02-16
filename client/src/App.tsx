import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AuthLayout from "./components/AuthLayout";
import Quiz from "./pages/Quiz";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route
        path="/signup"
        element={
          <AuthLayout authentication={false}>
            <div className="container">
              <Signup />
            </div>
          </AuthLayout>
        }
      />
      <Route
        path="/login"
        element={
          <AuthLayout authentication={false}>
            <div className="container">
              <Login />
            </div>
          </AuthLayout>
        }
      />
      <Route
        path="/dashboard"
        element={
          <AuthLayout authentication={true}>
            <Dashboard />
          </AuthLayout>
        }
      />
      <Route
        path="/quiz/:id"
        element={
          <AuthLayout authentication={true}>
            <Quiz />
          </AuthLayout>
        }
      />
    </Routes>
  );
}

export default App;
