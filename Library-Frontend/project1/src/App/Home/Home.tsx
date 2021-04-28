import axios from "axios";
import {  useEffect, useState } from "react";
import { authHeader } from "../../Services/AuthService";
import { Book } from "../AdminPage/BookManager/BookManager";

export function Home({ onClickAddtoCart = (book: any) => {} }) {
  const [book, setBooks] = useState<Book[]>();

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
  }, []);

  return (
    <div>
      {book &&
        book.length > 0 &&
        book.map((book: any) => (
          <div key={book.id}>
            <div>Name: {book.name}</div>
            <div>Author: {book.author}</div>
            <div>Category: {book.category.name}</div>
            <button onClick={() => onClickAddtoCart(book)}>Add to carts</button>
          </div>
        ))}
    </div>
  );
}
