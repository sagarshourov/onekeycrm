import { Lucide } from "@/base-components";
import { Link } from "react-router-dom";
const formatDate = (dat) => {
  //const date = dat.split(" ");
  return dat.split("T")[0];
};
const UsersTable = (props) => {
  const { users, rowCount,setSelected, setDeleteConfirmationModal } = props;

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
                  {user.users.first_name}
                </a>
                <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                  {user.users.last_name}
                </div>
              </td>
              <td className="text-center">{user.users.email}</td>

              <td className="text-center">{formatDate(user.created_at)}</td>
              <td className="table-report__action w-56">
                <div className="flex justify-center items-center">
                  <Link
                    className="flex items-center text-info mr-3"
                    to={"/profile/" + user.users.id}
                  >
                    <Lucide icon="User" className="w-4 h-4 mr-1 " /> User Profile
                  </Link>

                  <a
                    className="flex items-center text-danger"
                    href="#"
                    onClick={() => {
                      setDeleteConfirmationModal(true);
                      setSelected(user.users.id)
                    }}
                  >
                    <Lucide icon="Trash2" className="w-4 h-4 mr-1" /> Delete
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
