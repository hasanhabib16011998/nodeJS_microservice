import { useSelector, useDispatch } from "react-redux";
import type { RootState } from '../store/store';
import { logout } from "../store/authSlice";
import { useNavigate, Link } from "react-router-dom";
import "./styles/NavBar.css";

function Navbar() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="navbar-root">
      <div className="navbar-content">
        <Link to="/get-all-posts" className="navbar-brand">
          All you have to see
        </Link>
        {isAuthenticated && (
          <button className="navbar-logout-btn" onClick={handleLogout}>
            Log Out
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;