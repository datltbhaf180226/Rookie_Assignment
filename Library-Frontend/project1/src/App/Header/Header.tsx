import { useContext } from "react";
import { Link } from "react-router-dom";
import CartContext from "../../Context/CartContext";

import UserContext from "../../Context/UserContext";

function Header() {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const { cart } = useContext(CartContext);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
  };

  return (
    <div>
      <ul>
        {currentUser && currentUser.role === 1 && (
          <>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/borrowedBooks">Borrowed Books</Link>
            </li>
            <li>
              <Link to="/bookcart">Cart ({cart && cart.length})</Link>
            </li>
          </>
        )}
        {currentUser && currentUser.role === 0 && (
          <>
            <li>
              <Link to="/admin">Book Manager</Link>
            </li>
            <li>
              <Link to="/admin/categoryManager">Category Manager</Link>
            </li>
            <li>
              <Link to="/admin/borrowManager">Borrow Manager</Link>
            </li>
          </>
        )}

        {currentUser ? (
          <Link to="/logout" onClick={handleLogout}>
            Logout
          </Link>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </ul>
    </div>
  );
}

export default Header;
