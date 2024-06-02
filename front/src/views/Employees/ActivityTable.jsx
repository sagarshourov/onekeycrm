import { helper } from "@/utils/helper";
const formatDate = (dat) => {
  //const date = dat.split(" ");
  return dat.split("T")[0];
};
const UsersTable = (props) => {
  const { users, rowCount, setSelected, setDeleteConfirmationModal } = props;

  return (
    <table className="table table-report -mt-2">
      <thead className="bg-primary text-white">
        <tr>
          <th className="whitespace-nowrap">No</th>
          <th className="whitespace-nowrap">Subject</th>
          <th className="text-center whitespace-nowrap">URL</th>
          <th className="text-center whitespace-nowrap">Method</th>
          <th className="text-center whitespace-nowrap">IP</th>
          <th className="text-center whitespace-nowrap">Device</th>
          <th className="text-center whitespace-nowrap">Time</th>
        </tr>
      </thead>
      <tbody>
        {users.slice(0, rowCount).map((user, key) => {
          let count = key + 1;
          return (
            <tr key={key} className="intro-x">
              <td className="w-40">{count}</td>
              <td>{user.subject}</td>
              <td className="text-center">{user.url}</td>

              <td className="text-center">{user.method}</td>
              <td className="text-center">{user.ip}</td>
              <td className="text-center">{user.agent}</td>
              <td className="text-center">{  helper.formatDate(user.created_at, "MMMM D, YYYY h:mm A")}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default UsersTable;
