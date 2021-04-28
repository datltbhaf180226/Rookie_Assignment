import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { Home } from "./Home/Home";
import { Login } from "./Login/Login";
import UserContext from "../Context/UserContext";
import Header from "./Header/Header";
import BorrowManager from "./AdminPage/BorrowManager/BorrowManager";
import CategoryManager from "./AdminPage/CategoryManager/CategoryManager";
import BorrowedBooks from "./Home/BorrowedBooks";
import AddBook from "./AdminPage/BookManager/AddBook";
import EditBook from "./AdminPage/BookManager/EditBook";
import EditCategory from "./AdminPage/CategoryManager/EditCategory";
import AddCategory from "./AdminPage/CategoryManager/AddCategory";
import BorrowDetail from "./AdminPage/BorrowManager/BorrowDetail";
import CartContext from "../Context/CartContext";
import BookManager from "./AdminPage/BookManager/BookManager";
import BookCart from "./Home/BookCart";
import axios from "axios";
import { authHeader } from "../Services/AuthService";

function App() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [cart, setCart] = useState<any>([]);


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setCurrentUser(JSON.parse(token));
    }
    
  }, []);

  useEffect(() => {
    const cart = localStorage.getItem("cart");
    if (cart) {
      setCart(JSON.parse(cart));
    }
  }, []);

  

  
  const addBookToCart = (book: any) => {
    if (cart) {
      setCart([...cart, book]);
      window.localStorage.setItem("cart", JSON.stringify([...cart, book]));
    } else {
      setCart([book]);
      window.localStorage.setItem("cart", JSON.stringify([book]));
    }
  };

  const removerBookFromCart = (bookId: any) => {
    if (cart) {
      const index = cart.findIndex((item: any) => item.id === bookId);
      cart.splice(index, 1);
      setCart(cart);
    }
  };

  const handleBorrowBook = () => {
    const books: any = {
      borrowRequestDetails: []
    }
    if (cart) {
      for (let item of cart) {
        books.borrowRequestDetails.push({bookId: item.id})
      }

      (async () => {
        axios({
          method: "post",
          url: `https://localhost:44307/borrowRequests/${currentUser.username}`,
          headers: authHeader(),
          data: books,
        })
          .catch((err) => {
            if (err.response.status === 400) {
              alert("Bạn chỉ được mượn tối đa 3 lần trong một tháng và mỗi lần chỉ được mượn 5 cuốn sách")
            }
          });
      })();
    }

  }
  console.log(cart)

  let userLogin = null;
  let routeLink = null;
  if (currentUser !== null) {
    if (currentUser.role === 0) {
      userLogin = <Redirect to="/admin" />;
      routeLink = (
        <>
          <Route exact path="/admin">
            <BookManager />
          </Route>
          <Route path="/admin/addBook">
            <AddBook />
          </Route>
          <Route path="/admin/books/:bookId/edit">
            <EditBook />
          </Route>
          <Route path="/admin/addCategory">
            <AddCategory />
          </Route>
          <Route path="/admin/categories/:categoryId/edit">
            <EditCategory />
          </Route>
          <Route path="/admin/borrowManager">
            <BorrowManager />
          </Route>
          <Route path="/admin/borrowRequests/:borrowRequestId">
            <BorrowDetail />
          </Route>
          <Route path="/admin/categoryManager">
            <CategoryManager />
          </Route>
        </>
      );
    } else if (currentUser.role === 1) {
      userLogin = <Redirect to="/" />;
      routeLink = (
        <>
          <Route path="/borrowedBooks">
            <BorrowedBooks />
          </Route>
          <Route path="/bookcart">
            <BookCart
              onRemoveCartItem={removerBookFromCart}
              onBorrowBook={handleBorrowBook}
            />
          </Route>
          <Route exact path="/">
            <Home onClickAddtoCart={addBookToCart} />
          </Route>
        </>
      );
    }
  } else {
    userLogin = <Login />;
  }

  if (currentUser && currentUser.role === 0) {
  }

  return (
    <Router>
      <UserContext.Provider value={{ currentUser, setCurrentUser }}>
        <CartContext.Provider value={{ cart, setCart }}>
          <div className="a">
            <Header />
            <Switch>
              <Route path="/login">{userLogin}</Route>
              {routeLink}
            </Switch>
          </div>
        </CartContext.Provider>
      </UserContext.Provider>
    </Router>
  );
}

export default App;
