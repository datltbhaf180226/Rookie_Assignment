import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

import { authHeader } from "../../../Services/AuthService";
import { Category } from "./BookManager";

function EditBook() {
  const [category, setCategory] = useState<Category[]>([]);
  const [message, setMessage] = useState<String>("");
  const { bookId } = useParams<any>();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<any>();

  function onSubmit(data: any, e: any) {
    const categoryData = JSON.parse(data.category);
    const categoryId = categoryData.id;
    (async () => {
      axios({
        method: "put",
        url: `https://localhost:44307/books/${bookId}`,
        headers: authHeader(),
        data: {
          name: data.name,
          author: data.author,
          categoryId: categoryId,
        },
      })
        .then(() => {
          setMessage("Update successfully!");
        })
        .catch((err) => console.log(err));
    })();
  }
  useEffect(() => {
    (async () => {
      axios({
        method: "get",
        url: "https://localhost:44307/categories",
        headers: authHeader(),
      })
        .then((res) => {
          setCategory(res.data);
        })
        .catch((err) => console.log(err));
    })();
  }, []);

  useEffect(() => {
    (async () => {
      axios({
        method: "get",
        url: `https://localhost:44307/books/${bookId}`,
        headers: authHeader(),
      })
        .then((res) => res.data)
        .then((book) => {
          const category = {
            id: book.categoryId,
            name: book.category.name,
          };
          reset({
            category: JSON.stringify(category),
            name: book.name,
            author: book.author,
          });
        })
        .catch((err) => console.log(err));
    })();
  }, [reset, bookId, category]);

  return (
    <div>
      <div className="">{bookId}</div>
      <form action="" onSubmit={handleSubmit(onSubmit)}>
        <div className="inputWrapper">
          <div>
            <span>Book Name</span>
          </div>
          <div>
            <input
              {...register("name", {
                validate: {
                  isRequired: (value) => value.length > 0,
                  maxLength: (value) => value.length < 20,
                },
              })}
            />
          </div>
          {errors.name && errors.name.type === "isRequired" && (
            <p>Please enter the product name</p>
          )}
          {errors.name && errors.name.type === "maxLength" && (
            <p>The product name must be less than 20 characters</p>
          )}
        </div>

        <select
          {...register("category", {
            validate: {
              isSelected: (value) => Number(value) !== 0,
            },
          })}
        >
          <option value="">Select category</option>
          {category &&
            category.length > 0 &&
            category.map((item: Category) => (
              <option
                value={JSON.stringify({ id: item.id, name: item.name })}
                key={item.id}
              >
                {item.name}
                {/* {console.log(JSON.stringify({ id: item.id, name: item.name }))} */}
              </option>
            ))}
        </select>
        {errors.category && errors.category.type === "isSelected" && (
          <p>Please select a category</p>
        )}
        <div className="inputWrapper">
          <div>
            <span>Author</span>
          </div>
          <div>
            <input
              type="string"
              {...register("author", {
                validate: {
                  isString: (value) => isNaN(Number(value)) === true,
                  value: (value) => value.length > 0,
                },
              })}
            />
            {errors.author && errors.author.type === "isString" && (
              <p>The field must be not a number</p>
            )}
            {errors.price && errors.price.type === "value" && (
              <p>The field must be at least one character</p>
            )}
          </div>
        </div>

        <button type="submit">Create</button>
        {message && <div>{message}</div>}
      </form>
    </div>
  );
}

export default EditBook;
