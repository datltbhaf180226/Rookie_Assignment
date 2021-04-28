import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";

// import styles from "./AddProduct.module.scss";
import { authHeader } from "../../../Services/AuthService";

function AddBook() {
  const [message, setMessage] = useState<String>("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<any>();

  function onSubmit(data: any, e: any) {
    (async () => {
      axios({
        method: "post",
        url: "https://localhost:44307/categories",
        headers: authHeader(),
        data: {
          name: data.name
        },
      })
        .then(() => {
          reset();
          setMessage("Add successfully!");
        })
        .catch((err) => console.log(err));
    })();
  }
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
            <p>Please enter the product name</p>
          )}
          {errors.name && errors.name.type === "maxLength" && (
            <p>The product name must be less than 50 characters</p>
          )}
        </div>

        <button type="submit">Create</button>
        {message && <div>{message}</div>}
      </form>
    </div>
  );
}

export default AddBook;
