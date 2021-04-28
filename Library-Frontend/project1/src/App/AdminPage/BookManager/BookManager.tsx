import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlusSquare,
  faPenSquare,
  faMinusSquare,
} from "@fortawesome/free-solid-svg-icons";

import "../../Assets/table.css";
import { authHeader } from "../../../Services/AuthService";

export interface Book {
  id: string;
  name: string;
  author: string;
  category: Category;
  categoryId: string;
}

export interface Category {
  id: string;
  name: string;
  books: Book[];
}

function BookManager() {
  const [books, setBooks] = useState<Book[]>();
  const [changes, setChanges] = useState<Boolean>(false);
  const [message, setMessage] = useState<string>();
  useEffect(() => {
    (async () => {
      axios({
        method: "get",
        url: "https://localhost:44307/books",
        headers: authHeader(),
      })
        .then((res) => {
          setBooks(res.data);
        })
        .catch((err) => console.log(err));
    })();
  }, [changes]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function deleteBook(bookId: string) {
    axios({
      method: "delete",
      url: `https://localhost:44307/books/${bookId}`,
      headers: authHeader(),
    })
      .then(() => {
        setChanges(!changes)
        setMessage("Delete successfully!");
      })
      .catch((err) => console.log(err));
  }

  const handleDeleteBtn = (bookId: string) => {
    if (window.confirm("Are you sure to delete this book?")) {
      deleteBook(bookId);
    }
  };

  return (
    <div className="productWrapper">
      <div className="tableWrapper">
        <div className="tableHeader">
          <div>
            <span>Book List</span>
          </div>
          <div className="addProductIcon">
            <Link to="/admin/addBook">
              <FontAwesomeIcon id="addProd" icon={faPlusSquare} />
              <label htmlFor="addProd">
                <span>Add</span>
              </label>
            </Link>
          </div>
        </div>
        <table className="productTable">
          <thead>
            <tr>
              <th>No.</th>
              <th>Id</th>
              <th>Name</th>
              <th>Category</th>
              <th>Author</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books &&
              books.length > 0 &&
              books.map((book, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{book.id}</td>
                  <td>{book.name}</td>
                  <td>{book.category.name}</td>
                  <td>{book.author}</td>
                  <td className="action">
                    <div>
                      <Link to={`/admin/books/${book.id}/edit`}>
                        <FontAwesomeIcon icon={faPenSquare} />
                      </Link>
                    </div>
                    <div>
                      <FontAwesomeIcon
                        icon={faMinusSquare}
                        onClick={() => handleDeleteBtn(book.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BookManager;
