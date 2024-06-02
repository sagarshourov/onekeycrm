import { Lucide } from "@/base-components";
import { helper } from "@/utils/helper";
// function findById(array, id) {
//   return filter(array, (_items) => {
//     return _items.id === id;
//   });
// }

import { Link } from "react-router-dom";

const formatDate = (dat) => {
  //const date = dat.split(" ");
  return dat.split("T")[0];
};

const UsersTable = (props) => {
  const {
    users,
    rowCount,
    handelView,
    setDeleteConfirmationModal,
    setUserId,
    setNotiId,
  } = props;

  return (
    <>
    <div className="bg-danger text-white bg-red-400 text-white"></div>
      <table className="table table-report  mt-2">
        <thead>
          <tr>
            <th className="whitespace-nowrap">No</th>
            <th className="whitespace-nowrap">Type</th>
            <th className="whitespace-nowrap">Notifications</th>
            <th className="whitespace-nowrap">Sender</th>

            <th className="whitespace-nowrap">Receiver</th>

            <th className="whitespace-nowrap"></th>
          </tr>
        </thead>
        <tbody>
          {users.slice(0, rowCount).map((user, key) => {
            let count = key + 1;

            var row_color = " bg-white ";

            if (user.is_read == 0) {
              row_color = " alert-success-soft ";
            }else if(user.is_read ==2){
              row_color = " bg-red-400 text-danger ";
            }

            return (
              <tr key={key} className={"intro-x border-t " + row_color}>
                <td className="w-40">{count}</td>
                <td>{user?.types?.title}</td>
                <td className="">{user.content}</td>

                <td>
                  {user.user && (
                    <Link
                      className="flex items-center text-info mr-3"
                      to={"/profile/" + user?.user_id}
                    >
                      <Lucide icon="User" className="w-4 h-4 mr-1 " />{" "}
                      {user.user.first_name} {user.user.last_name}
                    </Link>
                  )}
                </td>
                <td>
                  {user.receiver && (
                    <Link
                      className="flex items-center text-info mr-3"
                      to={"/profile/" + user?.to_id}
                    >
                      <Lucide icon="User" className="w-4 h-4 mr-1 " />{" "}
                      {user.receiver.first_name} {user.receiver.last_name}
                    </Link>
                  )}
                </td>
                <td className="table-report__action w-56">
                  <div className="flex justify-center items-center">
                    <button
                      className="flex items-center text-info mr-3"
                      onClick={(e) => {
                        setUserId(user.user_id);
                        setNotiId(user?.id);
                        handelView(user);
                      }}
                    >
                      <Lucide icon="Info" className="w-4 h-4 mr-1 " /> View
                    </button>

                    <a
                      onClick={(e) => {
                        setUserId(user.user_id);
                        setNotiId(user?.id);
                        setDeleteConfirmationModal(true);
                      }}
                      className="flex items-center text-danger"
                      href="#"
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
    </>
  );
};

export default UsersTable;
