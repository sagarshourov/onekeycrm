
const UsersTable = (props) => {
  const {
    users,
    rowCount,
    setConId,
    setDeleteConfirmationModal,
  } = props;

  
  return (
    <>
      <table className="table mt-2">
        <thead>
          <tr>
            <th className="whitespace-nowrap"></th>
            <th className="">Channel Name</th>
            <th className="text-left"></th>
            <th className=" "></th>
            <th className=" "></th>
          </tr>
        </thead>
        <tbody>
          {users.slice(0, rowCount).map((user, key) => {
            var count = key + 1;

            return (
              <tr key={key} className={"border-t pt-2"}>
                <td>{count}</td>

                <td>{user.real_name ? user?.real_name : user?.name}</td>
                <td>{user?.profile?.phone}</td>
                <td>{user?.profile?.team}</td>

                <td>
                  <button
                  className="btn"
                    onClick={() => {
                      setDeleteConfirmationModal(true);
                      setConId(user.id);
                    }}
                  >
                    Archived
                  </button>
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
