import { Lucide } from "@/base-components";

import { Link } from "react-router-dom";
const formatDate = (dat) => {
  //const date = dat.split(" ");
  return dat.split("T")[0];
};
const UsersTable = (props) => {
  const {
    users,
    rowCount,
    setUserId,
    setDeleteConfirmationModal,
    viewAsAdmin,
    setEmployeeConfirmationModal,
  } = props;

  return (
    <table className="table table-report -mt-2">
      <thead>
        <tr>
          <th className="whitespace-nowrap">No</th>
          <th className="whitespace-nowrap">Full Name</th>
          <th className="text-center whitespace-nowrap">Email</th>

          <th className="text-center whitespace-nowrap">Created At</th>
        </tr>
      </thead>
      <tbody>
        {users.slice(0, rowCount).map((user, key) => {
          let count = key + 1;
          return (
            <tr key={key} className="intro-x">
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

              <td className="text-center">{formatDate(user.created_at)}</td>
              <td className="table-report__action ">
                <div className="flex justify-center items-center">
                  <Link
                    className="flex items-center text-info mr-3"
                    to={"/assign_employee/" + user.id}
                  >
                    <Lucide icon="Plus" className="w-4 h-4 mr-1 " /> Assign Employee
                  </Link>

                  <a
                    className="flex items-center text-danger  mr-3"
                    href="#"
                    onClick={() => {
                      setDeleteConfirmationModal(true);
                      setUserId(user.id);
                    }}
                  >
                    <Lucide icon="Trash2" className="w-4 h-4 mr-1" /> Delete
                  </a>

                  <button
                    className="flex items-center text-success mr-3"
                    onClick={() => viewAsAdmin(user.id)}
                  >
                    <Lucide icon="EyeOff" className="w-4 h-4 mr-1 " />
                    View as Supervisor
                  </button>

                  <a
                    className="flex items-center text-warning  mr-3"
                    href="#"
                    onClick={() => {
                      setEmployeeConfirmationModal(true);
                      setUserId(user.id);
                    }}
                  >
                    <Lucide icon="UserMinus" className="w-4 h-4 mr-1" /> Make
                    Employee
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
