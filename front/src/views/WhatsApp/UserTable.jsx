import { Tippy, Checkbox } from "@/base-components";

import { Link } from "react-router-dom";
import { filter } from "lodash";
const formatDate = (dat) => {
  //const date = dat.split(" ");
  return dat.split("T")[0];
};

const fText = (text) => {
  return text ? text.substr(0, 10) + "..." : "";
};

const TeamTable = (props) => {
  const {
    users,
    rowCount,
    setHistory,
    setUserId,
    setDeleteConfirmationModal,
    allCheck,
    setAllCheck,
    updateFunc,
    aheck,
    setAcheck,
    conversations,
  } = props;

  return (
    <>
      <table className="table mt-2">
        <thead>
          <tr>
            <th className="whitespace-nowrap"></th>
            <th className=""></th>
            <th className="">Name</th>
        

            <th className=" "></th>
          </tr>
        </thead>
        <tbody>
          {users.slice(0, rowCount).map((user, key) => {
            var count = key + 1;

            return (
              <tr key={key} className={"border-t pt-2"}>
                <td>{count}</td>
                <td>
                  <img
                    alt="Img"
                    className="rounded-full"
                    src={user?.profile?.image_48}
                  />
                </td>
                <td>{user.real_name ? user?.real_name : user?.name}</td>
                <td>{user?.profile?.phone}</td>
                <td></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default TeamTable;
