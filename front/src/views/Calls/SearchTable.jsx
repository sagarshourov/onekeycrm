import { Tippy, Checkbox } from "@/base-components";

// function findById(array, id) {
//   return filter(array, (_items) => {
//     return _items.id === id;
//   });
// }

import { helper } from "@/utils/helper";

function extra_title(arr, group, index) {
  var value = "";
  if (arr.extra && arr.extra.length > 0) {
    arr.extra.map((dat, key) => {
      //   console.log("value dat", dat);
      if (dat.groups == group && dat.values[index]?.value) {
        value = dat.values[index]?.value;
      }
    });
  }

  if (index === 0 && value !== "") {
    return helper.formatDate(value, "MMM D, YYYY");
  }

  // console.log("value", value);

  return value;
}

const UsersTable = (props) => {
  const { users, rowCount, allCheck, setAllCheck } = props;

  const handelChange = (e, id) => {
    e.preventDefault();
  };
  const handelSingleCheck = (e) => {
    const { id, checked } = e.target;

    setAllCheck([...allCheck, parseInt(id)]);
    if (!checked) {
      setAllCheck(allCheck.filter((item) => item !== parseInt(id)));
    }
  };
  const handelAllCheck = (e) => {
    const { checked } = e.target;

    if (checked) {
      setAllCheck(users.map((li) => li.id));
      // setAcheck(true);
    } else {
      setAllCheck([]);
      // setAcheck(false);
    }
  };
  const fText = (text) => {
    return text ? text.substr(0, 10) + "..." : "";
  };
  return (
    <div className="overflow-auto relative">
      <table className="table table-report -mt-2">
        <thead>
          <tr>
            <th className="whitespace-nowrap">
              <div className=" mt-2">
                <Checkbox
                  className="form-check-input"
                  key={0}
                  type="checkbox"
                  name="allcheck"
                  id={0}
                  handleClick={handelAllCheck}
                  // isChecked={allCheck.length > 0 ? true : false}
                />
              </div>
            </th>
            <th className="whitespace-nowrap">No</th>
            <th className="whitespace-nowrap">Client</th>
            <th className="whitespace-nowrap">E-mail</th>
            {/* <th className="text-center whitespace-nowrap">Phone</th> */}

            <th className="text-center whitespace-nowrap">Assigned To</th>
            <th className="text-center whitespace-nowrap">Priority</th>
            <th className="text-center whitespace-nowrap">WhatsApp</th>
            <th className="text-center whitespace-nowrap">Age</th>

            {/* <th className="text-center whitespace-nowrap">GPA</th> */}
            {/* <th className="text-center whitespace-nowrap">Priority</th> */}
            {/* <th className="text-center whitespace-nowrap">Referred by</th>
            <th className="text-center whitespace-nowrap">Memo</th> */}
            <th className="text-center whitespace-nowrap">
              Call Schedule Date
            </th>
            <th className="text-center whitespace-nowrap">Case Type</th>

            <th className="text-center whitespace-nowrap"> First Call Date</th>
            <th className="text-center whitespace-nowrap">First Call Note</th>
            <th className="text-center whitespace-nowrap">Package</th>

            <th className="text-center whitespace-nowrap">Agreement Sent</th>

            <th className="text-center whitespace-nowrap">Agreement Signed</th>

            <th className="text-center whitespace-nowrap">Status</th>
            <th className="text-center whitespace-nowrap"> Next Step Date</th>

            <th className="text-center whitespace-nowrap"> Next Step Note</th>

            <th className="text-center whitespace-nowrap">Follow up date</th>
            <th className="text-center whitespace-nowrap">Follow up note</th>

            {/* <th className="text-center whitespace-nowrap">
              {" "}
              Cancellation reason
            </th> */}

            <th className="text-center whitespace-nowrap"> Feedback</th>
          </tr>
        </thead>
        <tbody>
          
          {users &&
            users.slice(0, rowCount).map((user, key) => {
              let count = key + 1;
              let dark = " bg-white ";

              var is_admin = 0;

              user.history &&
                user.history.map((data, index) => {
                  if (data.field == "feedbacks") {
                    is_admin = data.user.is_admin;

                    //console.log(user.id + "=is_admin", is_admin);
                  }
                });

              if (is_admin === 1) {
                dark = " alert-warning-soft ";
              } else if (is_admin == 2) {
                dark = " alert-success-soft ";
              }

              return (
                <tr key={key} className={"border-t pt-2" + dark}>
                  <td>
                    <div className="form-check mt-2">
                      <Checkbox
                        className="form-check-input "
                        key={key}
                        type="checkbox"
                        name="select"
                        id={user.id}
                        handleClick={handelSingleCheck}
                        isChecked={allCheck.includes(user.id)}
                      />
                    </div>
                  </td>
                  <td className="w-40">{key+1}</td>
                  <td>
                    {user.first_name} {user.last_name}
                  </td>
                  <td>{user?.email}</td>
                  <td>
                    {user?.assigned_to?.first_name}{" "}
                    {user?.assigned_to?.last_name}
                  </td>
                  <td>{user?.priority}</td>
                  <td>{user?.whatsapp}</td>
                  <td className="text-center">{user?.age}</td>
                  <td className="text-center">
                    {user?.call_schedule_date &&
                      helper.formatDate(
                        user?.call_schedule_date,
                        "MMM D, YYYY"
                      )}{" "}
                  </td>
                  <td className="text-center">
                    {user?.case_type == 1 && "F-1"}{" "}
                    {user?.case_type == 2 && "F-1/F2"}
                  </td>
                  <td className="text-center">
                    {user?.first_contact &&
                      helper.formatDate(
                        user?.first_contact,
                        "MMM D, YYYY"
                      )}{" "}
                  </td>
                  <td className="text-center">
                    <Tippy
                      tag="a"
                      href="#"
                      className="tooltip"
                      content={user?.first_call_notes}
                    >
                      {fText(user?.first_call_notes)}
                    </Tippy>
                  </td>
                  <td>{user?.package?.title}</td>
                  <td className="text-center">
                    {user.ag === 0 ? "No" : "Yes"}
                  </td>
                  <td> {user.agreed_to_signed === 0 ? "No" : "Yes"}</td>
                  <td>{user?.statu?.title}</td>
                  <td>{extra_title(user, "my_step", 0)}</td>
                  <td>
                    <div className="text-center">
                      <Tippy
                        tag="a"
                        href="#"
                        className="tooltip"
                        content={extra_title(user, "my_step", 1)}
                      >
                        {fText(extra_title(user, "my_step", 1))}
                      </Tippy>
                    </div>
                  </td>
                  <td className="text-center">
                    {user?.follow_up_date &&
                      helper.formatDate(user?.follow_up_date, "MMM D, YYYY")}
                  </td>
                  <td
                    className="text-center"
                    onClick={() =>
                      setHistory("follow_up_notes", user.history, user.id)
                    }
                  >
                    <div className="text-center">
                      <Tippy
                        tag="a"
                        href="#"
                        className="tooltip"
                        content={user?.follow_up_notes}
                      >
                        {fText(user?.follow_up_notes)}
                      </Tippy>
                    </div>
                  </td>
                  <td className="text-center">
                    <div className="text-center">
                      {" "}
                      <Tippy
                        tag="a"
                        href="#"
                        className="tooltip"
                        content={user?.feedbacks}
                      >
                        {fText(user?.feedbacks)}
                      </Tippy>
                    </div>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
