import { useContext } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

import UserContext from "../../Context/UserContext";

export function Login() {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();


  async function onSubmit(data: any) {

    axios({
      method: "POST",
      url: "https://localhost:44307/users/login",
      data: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => {
        if (res.data.id) {
          localStorage.setItem("token", JSON.stringify(res.data));
          setCurrentUser(res.data);
        }
      })
      .catch((error) => console.log(error));
  }
  return (
    <form
      action=""
      className="form-container"
      onSubmit={handleSubmit(onSubmit)}
    >
      <header></header>
      <div className="login-row">
        <div className="title">Email address</div>
        <div className="login-input">
          <input
            type="text"
            {...register("username", {
              validate: {
                isRequired: (value) => value.length > 0,
                maxLength: (value) => value.length <= 20,
              },
            })}
          />
          {errors.password && errors.password.type === "isRequired" && (
            <div style={{ color: "red" }}>The password is required</div>
          )}
        </div>
      </div>
      <div className="login-row">
        <div className="title">Password</div>
        <div className="login-input">
          <input
            type="password"
            {...register("password", {
              validate: {
                isRequired: (value) => value.length > 0,
                minLength: (value) => value.length >= 6,
              },
            })}
          />
          {errors.password && errors.password.type === "isRequired" && (
            <div style={{ color: "red" }}>The password is required</div>
          )}
          {errors.password && errors.password.type === "minLength" && (
            <div style={{ color: "red" }}>
              The password must be at least 6 characters
            </div>
          )}
        </div>
      </div>

      <div>
        <input type="checkbox" />
        <span>Remember me</span>
      </div>
      <div>
        <button type="submit">Login</button>
      </div>
    </form>
  );
}
