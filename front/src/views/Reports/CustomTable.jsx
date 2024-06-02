import { Tippy } from "@/base-components";

// function findById(array, id) {
//   return filter(array, (_items) => {
//     return _items.id === id;
//   });
// }

import { helper } from "@/utils/helper";
const formatDate = (dat) => {
  //const date = dat.split(" ");
  return dat.split("T")[0];
};

const fText = (text) => {
  return text ? text.substr(0, 10) + "..." : "";
};

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

  return value;
}

const CustomTable = (props) => {
  const {
    users,
    rowCount,
    setUserId,
    setDeleteConfirmationModal,
    allCheck,
    setAllCheck,
    updateFunc,
    aheck,
    setAcheck,
    cols,
    emp,
  } = props;

  return (
    <>
      <table className="table mt-2">
        <thead>
          <tr>
            <th className="whitespace-nowrap">No</th>

            {cols !== null &&
              cols.map((val, index) => (
                <th
                  key={index}
                  className="whitespace-nowrap text-center capitalize"
                >
                  {val.label}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {users.slice(0, rowCount).map((user, key) => {
            let count = key + 1;

            var team_id = user?.user?.team;

            let dark = "";
            if (
              user?.gpa &&
              team_id &&
              parseFloat(user.gpa) < 2.5 &&
              team_id == 2
            ) {
              dark = " alert-danger-soft ";
            } else if (
              user?.gpa &&
              team_id &&
              parseFloat(user.gpa) < 13 &&
              team_id == 1
            ) {
              dark = " alert-danger-soft ";
            } else {
              dark = " bg-white";
            }

            return (
              <tr key={key} className={"border-t pt-2" + dark}>
                <td className="w-40">{user.id}</td>

                {cols !== null &&
                  cols.map((val, index) => {
                    if (val.value == "ag") {
                      return user[val.value] !== null ? (
                        <td key={index} className="text-center">
                          {user.ag == 1 ? "Yes" : "No"}
                        </td>
                      ) : (
                        <td key={index} className="text-center">
                          No
                        </td>
                      );
                    }

                    if (val.value == "agreed_to_signed") {
                      return user[val.value] !== null ? (
                        <td key={index} className="text-center">
                          {user.agreed_to_signed == 1 ? "Yes" : "No"}
                        </td>
                      ) : (
                        <td key={index} className="text-center"></td>
                      );
                    }

                    if (val.value == "statu") {
                      return user[val.value] !== null ? (
                        <td key={index} className="text-center">
                          {user?.statu?.title}
                        </td>
                      ) : (
                        <td key={index} className="text-center"></td>
                      );
                    }
                    if (val.value == "cancel_reason") {
                      return user[val.value] !== null ? (
                        <td key={index} className="text-center">
                          {user?.cancel_reason?.title}
                        </td>
                      ) : (
                        <td key={index} className="text-center"></td>
                      );
                    }

                    if (val.value == "assigned_to") {
                      return user[val.value] !== null ? (
                        <td key={index} className="text-center">
                          {user[val.value].first_name}{" "}
                          {user[val.value].last_name}
                        </td>
                      ) : (
                        <td key={index} className="text-center"></td>
                      );
                    }


                    

                    if (val.value == "next_step_date") {
                      return (
                        <td key={index} className="text-center">
                          {/* {extra_title(user, "my_step", 0)} */}

                          {extra_title(user, "my_step", 0)}
                        </td>
                      );
                    }

                    if (val.value == "follow_up_note") {
                      return (
                        <td key={index} className="text-center">
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
                      );
                    }

                    if (val.value == "first_call_notes") {
                      return (
                        <td key={index} className="text-center">
                          <div className="text-center">
                            <Tippy
                              tag="a"
                              href="#"
                              className="tooltip"
                              content={user?.first_call_notes}
                            >
                              {fText(user?.first_call_notes)}
                            </Tippy>
                          </div>
                        </td>
                      );
                    }

                    if (val.value == "follow_up_date") {
                      return (
                        <td key={index} className="text-center">
                          {user?.follow_up_date &&
                            helper.formatDate(
                              user?.follow_up_date,
                              "MMM D, YYYY"
                            )}
                        </td>
                      );
                    }

                    if (val.value == "call_schedule_date") {
                      return (
                        <td key={index} className="text-center">
                          {user?.call_schedule_date &&
                            helper.formatDate(
                              user?.call_schedule_date,
                              "MMM D, YYYY"
                            )}
                        </td>
                      );
                    }

                    if (val.value == "first_contact") {
                      return (
                        <td key={index} className="text-center">
                          {user?.first_contact &&
                            helper.formatDate(
                              user?.first_contact,
                              "MMM D, YYYY"
                            )}
                        </td>
                      );
                    }

                    if (val.value == "cancel_date") {
                      return (
                        <td key={index} className="text-center">
                          {user?.cancel_date &&
                            helper.formatDate(user?.cancel_date, "MMM D, YYYY")}
                        </td>
                      );
                    }

                    if (val.value == "assigned_to") {
                      return (
                        <td key={index} className="text-center">
                          {user?.assigned_to &&
                            user?.assigned_to?.first_name +
                              " " +
                              user?.assigned_to?.last_name}
                        </td>
                      );
                    }

                    // if (val.value == "case_type") {
                    //   return  <td key={index} className="text-center">case_type</td>;

                    // }

                    if (val.value == "case_type") {
                      return user[val.value] !== null ? (
                        <td key={index} className="text-center">
                          {user.case_type == 1 ? "F-1" : "F-1/F2"}
                        </td>
                      ) : (
                        <td key={index} className="text-center"></td>
                      );
                    }

                    return user[val.value] !== null && user[val.value].id ? (
                      <td key={index} className="text-center">
                        {user[val.value]?.title}
                      </td>
                    ) : (
                      <td key={index} className="text-center">
                        {user[val.value] && user[val.value]}
                      </td>
                    );
                  })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default CustomTable;
