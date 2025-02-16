import { useAuth } from "../provider/AuthContext";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function Header() {
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await axios.post(
        import.meta.env.VITE_BASE_URL + "/users/signout",
        {},
        { withCredentials: true }
      );
      logout();
      toast.success("Logged out successfully.");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="sticky bg-[#090917] border-b-2 border-slate-700 ">
      <div className="flex items-center justify-between w-[90%] sm:w-[80%] mx-auto">
        <div>
          <h3 className="text-2xl font-bold text-left p-4">Quizo</h3>
        </div>

        <div className="flex justify-end items-center">
          <div className="flex gap-4">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard">
                  <Button className="bg-green-500 hover:bg-green-600 ">
                    Dashboard
                  </Button>
                </Link>
                <Button variant="destructive" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/signup">
                  <Button className="bg-teal-600 hover:bg-teal-700">
                    Signup
                  </Button>
                </Link>
                <Link to="/login">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Login
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
