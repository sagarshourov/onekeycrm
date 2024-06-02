

const formatDate = (dat) => {
  //const date = dat.split(" ");
  return dat.split("T")[0];
};

const fText = (text) => {
  return text ? text.substr(0, 10) + "..." : "";
};

const UsersTable = (props) => {
  const {
    users,
    rowCount,
    setHistory,
    setConId,
    setDeleteConfirmationModal,
    allCheck,
    setAllCheck,
    updateFunc,
    aheck,
    setAcheck,
  } = props;

  const handelChange = (e, id, type) => {
    e.preventDefault();

    var val = 0;
    if (type == "n") {
      val = parseInt(e.target.value);
    }
    updateFunc(id, e.target.name, val);
  };

  const handelAllCheck = (e) => {
    const { checked } = e.target;

    if (checked) {
      setAllCheck(users.map((li) => li.id));
      setAcheck(true);
    } else {
      setAllCheck([]);
      setAcheck(false);
    }
  };

  const handelSingleCheck = (e) => {
    const { id, checked } = e.target;
   // console.log(checked);
    setAllCheck([...allCheck, parseInt(id)]);
    if (!checked) {
      setAllCheck(allCheck.filter((item) => item !== parseInt(id)));
    }
  };

  const handleCheck = (e) => {
    const { id, checked, name } = e.target;

    updateFunc(id, name, checked);

    //console.log(checked);
  };

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
