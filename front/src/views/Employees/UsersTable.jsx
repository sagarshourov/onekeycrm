import { Lucide } from "@/base-components";

import { Link } from "react-router-dom";
const formatDate = (dat) => {
  //const date = dat.split(" ");
  return dat.split("T")[0];
};
import axios from "axios";
import { useState } from "react";
import { adminApi } from "../../configuration";
const UsersTable = (props) => {
  const {
    users,
    rowCount,
    setUserId,
    setDeleteConfirmationModal,
    setAdminConfirmationModal,
    viewAsEmployee,
  } = props;

  const [loading, setLoading] = useState(false);

  const [startRow, setStartRow] = useState([]);

  const [targetRow, setTargetRow] = useState([]);

  const dragOver = (e) => {
    // console.log(e.target.parentNode);
    //  e.preventDefault();
    //  e.target.parentNode.style.borderTop = "14px  solid green";
    let children = Array.from(e.target.parentNode.parentNode.children);
    if (children.indexOf(e.target.parentNode) > children.indexOf(targetRow)) {
      e.target.parentNode.style.borderTop = "none";
      e.target.parentNode.style.borderBottom = "14px  solid green";

      //console.log("going down ");
    } else {
      e.target.parentNode.style.borderTop = "14px  solid green";
      e.target.parentNode.style.borderBottom = "none";
     // console.log("going upper ");
    }

    setTargetRow(e.target.parentNode);
  };
  const dragEnd = async (e) => {
    // targetRow.borderTop = "none";
    // targetRow.borderBottom = "none";
    //console.log("startRow", startRow.id);
   // console.log("targetRow", targetRow.id);

    const URL = adminApi() + "calls_sort";
    // setLoading(true);

    try {
      const response = await axios.post(
        URL,
        { start: parseInt(startRow.target.id), end: parseInt(targetRow.id) },
        {
          headers,
        }
      );

      if (response?.data?.success) {
        setLoading(false);

        setCallState(response?.data?.data);
      }
    } catch (err) {
     // console.log(err);
      setLoading(false);
    }
  };
  const dragLeave = (e) => {
    e.target.parentNode.style.borderTop = "none";
  };
  return (
    <table className="table  -mt-2">
      <thead>
        <tr>
          <th className="whitespace-nowrap">No</th>
          <th className="whitespace-nowrap">Full Name</th>
          <th className="text-center whitespace-nowrap">Email</th>
          <th className="text-center whitespace-nowrap">Team</th>
          <th className="text-center whitespace-nowrap">Created At</th>
        </tr>
      </thead>
      <tbody>
        {users.slice(0, rowCount).map((user, key) => {
          let count = key + 1;
          return (
            <tr
              draggable={true}
              onDragStart={(e) => {
                setStartRow(e);
              }}
              id={user.sort}
              onDragOver={(e) => dragOver(e)}
              onDragEnd={(e) => dragEnd(e)}
              onDragLeave={(e) => dragLeave(e)}
              key={key}
              className="intro-x "
            >
              <td className="w-40">{count}</td>
              <td>
                <a href="" className="font-medium whitespace-nowrap">
                  {user.first_name}
                </a>
                <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                  {user.last_name}
                </div>
              </td>
              <td className="text-center">{user.email}</td>
              <td className="text-center">{user.team == 1 ? "IR" : "TR"}</td>

              <td className="text-center">{formatDate(user.created_at)}</td>
              <td className="table-report__action ">
                <div className="flex justify-center items-center">
                  <Link
                    className="flex items-center text-info mr-3"
                    to={"/profile/" + user.id}
                  >
                    <Lucide icon="Eye" className="w-4 h-4 mr-1 " /> View Users
                  </Link>

                  <Link
                    className="flex items-center text-warning mr-3"
                    to={"/emp_activity/" + user.id}
                  >
                    <Lucide icon="Activity" className="w-4 h-4 mr-1 " />
                    Activity
                  </Link>
                  <button
                    className="flex items-center text-success mr-3"
                    onClick={() => viewAsEmployee(user.id)}
                  >
                    <Lucide icon="EyeOff" className="w-4 h-4 mr-1 " />
                    View as Employee
                  </button>

                  <a
                    className="flex items-center text-danger"
                    href="#"
                    onClick={() => {
                      setDeleteConfirmationModal(true);
                      setUserId(user.id);
                    }}
                  >
                    <Lucide icon="Trash2" className="w-4 h-4 mr-1" /> Delete
                  </a>

                  <a
                    className="flex items-center text-purple"
                    href="#"
                    onClick={() => {
                      setAdminConfirmationModal(true);
                      setUserId(user.id);
                    }}
                  >
                    <Lucide icon="UserPlus" className="w-4 h-4 mr-1 ml-1" />{" "}
                    Promoted to Supervisor
                  </a>
                  <a
                    className="flex items-center text-purple"
                    href="#"
                    onClick={() => {
                      setAdminConfirmationModal(true);
                      setUserId(user.id);
                    }}
                  >
                    <Lucide icon="UserPlus" className="w-4 h-4 mr-1 ml-1" />{" "}
                    Promoted to Admin
                  </a>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default UsersTable;
