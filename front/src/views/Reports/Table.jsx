import { Tippy, Checkbox } from "@/base-components";
import { useState } from "react";
import { Link } from "react-router-dom";
import CopyEle from "../Calls/CopyEle";
import { filter } from "lodash";
import { helper } from "@/utils/helper";

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

function findByID(array, id) {
  var data = filter(array, (_items) => {
    return _items.id == id;
  });

  if (data[0]) {
    return data[0]?.first_name + " " + data[0]?.last_name;
  } else {
    return "";
  }
}

const UsersTable = (props) => {
  const { users, setAllCheck, setAcheck, allCheck, emp } = props;



  const [rowCount, setRowCount] = useState(10);
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
      setAcheck(true);
    } else {
      setAllCheck([]);
      setAcheck(false);
    }
  };

  const loadMore = () => {
    let count = rowCount + 20;
    setRowCount(count);
  };

  return (
    <div className="overflow-auto relative">
      <table className="table  mt-2">
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
            <th className="text-center whitespace-nowrap">
              Call Schedule Date
            </th>
            <th className="text-center whitespace-nowrap">Case Type</th>
            <th className="text-center whitespace-nowrap">Age</th>

            <th className="text-center whitespace-nowrap"> First Call Date</th>
            <th className="text-center whitespace-nowrap">First Call Note</th>

            <th className="text-center whitespace-nowrap">Package</th>

            <th className="text-center whitespace-nowrap">Agreement Sent</th>
            <th className="text-center whitespace-nowrap">Agreement Signed</th>

            <th className="text-center whitespace-nowrap">Status</th>

            <th className="text-center whitespace-nowrap">Next step Date</th>
            <th className="text-center whitespace-nowrap">Next step Note</th>

            <th className="text-center whitespace-nowrap"> Follow up Date</th>
            <th className="text-center whitespace-nowrap"> Follow up Note</th>

            <th className="text-center whitespace-nowrap"> Cancel Reason</th>
            <th className="text-center whitespace-nowrap"> Cancel Date</th>
            <th className="text-center whitespace-nowrap">Assigned to</th>
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

              // var team_id = user?.user?.team;
              // if (
              //   // IR
              //   user?.gpa &&
              //   team_id &&
              //   parseFloat(user.gpa) < 2.5 &&
              //   team_id == 1
              // ) {
              //   dark = " alert-danger-soft ";
              // } else if (
              //   // TR
              //   user?.gpa &&
              //   team_id &&
              //   parseFloat(user.gpa) < 13 &&
              //   team_id == 2
              // ) {
              //   dark = " alert-danger-soft ";
              // } else {
              //   dark = " bg-white";
              // }

              return (
                <tr
                  key={key}
                  className={"border-t pt-2" + dark}

                  // onDragOver={(e) => dragover(e)}
                >
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
                    <Link
                      to="#"
                      draggable={false}
                      className="font-medium whitespace-nowrap"
                    >
                      {user.first_name} {user.last_name}
                    </Link>
                    <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                      <CopyEle email={user.email} />
                    </div>
                  </td>
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
                  <td className="text-center">{user?.age}</td>
                  <td className="text-center">{user?.first_contact}</td>
                  <td className="text-center">
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

                  <td className="text-center"> {user?.package?.title}</td>

                  <td className="text-center">
                    {user.ag === 0 ? "No" : "Yes"}
                  </td>

                  <td className="text-center">
                    {user.agreed_to_signed === 0 ? "No" : "Yes"}
                  </td>
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

                  <td className="text-center">
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

                  <td className="text-center">{user?.cancel_reason?.title}</td>
                  <td className="text-center">{user?.cancel_date}</td>

                  <td className="text-center">
                    {findByID(emp.contents, user?.assigned_to)}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
      {users.length > 0 && rowCount < users.length && (
        <button className="btn btn-default m-5" onClick={loadMore}>
          Load more ...
        </button>
      )}
      
    </div>
  );
};

export default UsersTable;
