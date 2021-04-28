import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import { authHeader } from "../../../Services/AuthService";
import "../../Assets/table.css";

function BorrowDetail() {
  const { borrowRequestId } = useParams<any>();
  const [borrowRequestDetails, setBorrowRequestDetails] = useState<any>();

  useEffect(() => {
    (async () => {
      axios({
        method: "get",
        url: `https://localhost:44307/borrowRequests/${borrowRequestId}`,
        headers: authHeader(),
      })
        .then((res) => {
          setBorrowRequestDetails(res.data);
        })
        .catch((err) => console.log(err));
    })();
  }, [borrowRequestId]);

  const handleRequestStatus = (status: any) => {
    if (status === 0) {
      return <div style={{ color: "orange", fontWeight: 600 }}>Pending</div>;
    } else if (status === 1) {
      return <div style={{ color: "green", fontWeight: 600 }}>Aprrove</div>;
    } else {
      return <div style={{ color: "red", fontWeight: 600 }}>Reject</div>;
    }
  };

  return (
    <div>
      <table className="productTable">
        <thead>
          <tr>
            <th>No.</th>
            <th>BookId</th>
            <th>Name</th>
            <th>Category</th>
            <th>Author</th>
          </tr>
        </thead>
        <tbody>
          {borrowRequestDetails &&
            borrowRequestDetails[0].borrowRequestDetails.map(
              (borrowRequestDetail: any, index: any) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{borrowRequestDetail.book.id}</td>
                  <td>{borrowRequestDetail.book.name}</td>
                  <td>{borrowRequestDetail.book.category.name}</td>
                  <td>{borrowRequestDetail.book.author}</td>
                </tr>
              )
            )}
        </tbody>
      </table>
      <div>
        {borrowRequestDetails &&
          borrowRequestDetails.map((borrowRequestDetail: any) => (
            <div key={borrowRequestDetail.id}>
              <div>{borrowRequestDetail.id}</div>
              <div>{borrowRequestDetail.user.username}</div>
              {handleRequestStatus(borrowRequestDetail.status)}
            </div>
          ))}
      </div>
    </div>
  );
}

export default BorrowDetail;
