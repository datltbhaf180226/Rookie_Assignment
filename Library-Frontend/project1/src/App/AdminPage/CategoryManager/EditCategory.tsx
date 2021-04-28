import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

import { authHeader } from "../../../Services/AuthService";

function EditBook() {
  const [message, setMessage] = useState<String>("");
  const { categoryId } = useParams<any>();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<any>();

  function onSubmit(data: any, e: any) {
    (async () => {
      axios({
        method: "put",
        url: `https://localhost:44307/categories/${categoryId}`,
        headers: authHeader(),
        data: {
          name: data.name
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
        url: `https://localhost:44307/categories/${categoryId}`,
        headers: authHeader(),
      })
        .then((res) => res.data)
        .then((book) => {
          reset({
            name: book.name,
          });
        })
        .catch((err) => console.log(err));
    })();
  }, [reset, categoryId]);

  return (
    <div>
      <form action="" onSubmit={handleSubmit(onSubmit)}>
        <div className="inputWrapper">
          <div>
            <span>Category Name</span>
          </div>
          <div>
            <input
              {...register("name", {
                validate: {
                  isRequired: (value) => value.length > 0,
                  maxLength: (value) => value.length < 50,
                },
              })}
            />
          </div>
          {errors.name && errors.name.type === "isRequired" && (
            <p>Please enter the category name</p>
          )}
          {errors.name && errors.name.type === "maxLength" && (
            <p>The category name must be less than 50 characters</p>
          )}
        </div>

        <button type="submit">Update</button>
        {message && <div>{message}</div>}
      </form>
    </div>
  );
}

export default EditBook;
