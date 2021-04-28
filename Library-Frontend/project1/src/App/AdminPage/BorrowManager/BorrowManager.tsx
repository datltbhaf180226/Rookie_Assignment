import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";

import { authHeader } from "../../../Services/AuthService";
import "../../Assets/table.css";
import "./BorrowManager.css";

function BorrowManager() {
  const [borrowRequests, setBorrowRequests] = useState<any>();
  const [changes, setChanges] = useState<boolean>(false);
  useEffect(() => {
    (async () => {
      axios({
        method: "get",
        url: "https://localhost:44307/borrowRequests",
        headers: authHeader(),
      })
        .then((res) => {
          console.log(res.data);
          setBorrowRequests(res.data);
        })
        .catch((err) => console.log(err));
    })();
  }, [changes]);

  const handleRejectRequest = (requestId: any) => {
    (async () => {
      axios({
        method: "put",
        url: `https://localhost:44307/borrowRequests/${requestId}/reject`,
        headers: authHeader(),
      })
        .then(() => {
          setChanges(!changes);
        })
        .catch((err) => console.log(err));
    })();
  };

  const handleApproveRequest = (requestId: any) => {
    (async () => {
      axios({
        method: "put",
        url: `https://localhost:44307/borrowRequests/${requestId}/approve`,
        headers: authHeader(),
      })
        .then(() => {
          setChanges(!changes);
        })
        .catch((err) => console.log(err));
    })();
  };

  const handleRequestStatus = (status: any) => {
    if (status === 0) {
      return <td style={{ color: "orange", fontWeight: 600 }}>Pending</td>;
    } else if (status === 1) {
      return <td style={{ color: "green", fontWeight: 600 }}>Aprrove</td>;
    } else {
      return <td style={{ color: "red", fontWeight: 600 }}>Reject</td>;
    }
  };

  return (
    <div className="productWrapper">
      <div className="tableWrapper">
        <div className="tableHeader">
          <div>
            <span>Borrow Requests</span>
          </div>
        </div>
        <table className="productTable">
          <thead>
            <tr>
              <th>No.</th>
              <th>Request Id</th>
              <th>User Id</th>
              <th>Username</th>
              <th>Request Date</th>
              <th className="status-actions">Status</th>
              <th className="status-actions">Reject</th>
              <th className="status-actions">Approve</th>
            </tr>
          </thead>
          <tbody>
            {borrowRequests &&
              borrowRequests.length > 0 &&
              borrowRequests.map((borrowRequest: any, index: any) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <Link
                      to={`/admin/borrowRequests/${borrowRequest.id}`}
                    >
                      {borrowRequest.id}
                    </Link>
                  </td>
                  <td>{borrowRequest.userId}</td>
                  <td>{borrowRequest.user.username}</td>
                  <td>{borrowRequest.borrowDate.slice(0, 10)}</td>
                  {handleRequestStatus(borrowRequest.status)}
                  <td>
                    <div
                      className="status-icon reject-icon"
                      onClick={() => handleRejectRequest(borrowRequest.id)}
                    >
                      <FontAwesomeIcon icon={faTimesCircle} />
                      <div>Reject</div>
                    </div>
                  </td>
                  <td>
                    <div
                      className="status-icon approve-icon"
                      onClick={() => handleApproveRequest(borrowRequest.id)}
                    >
                      <FontAwesomeIcon icon={faCheckCircle} />
                      <div>Approve</div>
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

export default BorrowManager;
