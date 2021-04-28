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

export interface Category {
  id: string;
  name: string;
}

function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>();
  const [changes, setChanges] = useState<boolean>(false);
  const [message, setMessage] = useState<string>();
  useEffect(() => {
    (async () => {
      axios({
        method: "get",
        url: "https://localhost:44307/categories",
        headers: authHeader(),
      })
        .then((res) => {
          setCategories(res.data);
        })
        .catch((err) => console.log(err));
    })();
  }, [changes]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function deleteCategory(categoryId: string) {
    axios({
      method: "delete",
      url: `https://localhost:44307/categories/${categoryId}`,
      headers: authHeader(),
    })
      .then(() => {
        setChanges(!changes);
        setMessage("Delete successfully!");
      })
      .catch((err) => console.log(err));
  }

  const handleDeleteBtn = (categoryId: string) => {
    if (window.confirm("Are you sure to delete this book?")) {
      deleteCategory(categoryId);
    }
  };

  return (
    <div className="productWrapper">
      <div className="tableWrapper">
        <div className="tableHeader">
          <div>
            <span>Categories</span>
          </div>
          <div className="addProductIcon">
            <Link to="/admin/addCategory">
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories &&
              categories.length > 0 &&
              categories.map((category, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{category.id}</td>
                  <td>{category.name}</td>
                  <td className="action">
                    <div>
                      <Link to={`/admin/categories/${category.id}/edit`}>
                        <FontAwesomeIcon icon={faPenSquare} />
                      </Link>
                    </div>
                    <div>
                      <FontAwesomeIcon
                        icon={faMinusSquare}
                        onClick={() => handleDeleteBtn(category.id)}
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

export default CategoryManager;
