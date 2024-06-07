import { Checkbox, Tippy } from "@/base-components";

import axios from "axios";
import { helper } from "@/utils/helper";
import { useState } from "react";
import { Link } from "react-router-dom";
import CopyEle from "./CopyEle";
import { filter } from "lodash";
import { adminApi, getBaseApi } from "../../configuration";
const fText = (text) => {
  return text ? text.substr(0, 10) + "..." : "";
};

const get_section = (array, val) => {
  if (val) {
    var dat = filter(array, (_items) => {
      return _items.id === val;
    });
    return dat[0].title;
  }
  return "";
};

const remove_style_tr = () => {
  var table = document.querySelectorAll("tr");

  table.forEach(ele => {

    ele.style.borderTop = "none";
    // check for the particulr class
   // console.log(ele);
  
  });

  
};

const UsersTable = (props) => {
  const {
    users,
    setHistory,
    setCallState,
    setUserId,
    setDeleteConfirmationModal,
    allCheck,
    setAllCheck,
    updateFunc,
    aheck,
    setAcheck,
    theme,
    dragStart,
    dragover,
    tableDragOver,
    section,
    setting,
    setLoading,
    headers,
  } = props;

  const [rowCount, setRowCount] = useState(10);

  const [startRow, setStartRow] = useState([]);

  const [targetRow, setTargetRow] = useState([]);

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

    setAllCheck([...allCheck, parseInt(id)]);
    if (!checked) {
      setAllCheck(allCheck.filter((item) => item !== parseInt(id)));
    }
  };

  const handleCheck = (e) => {
    const { id, checked, name } = e.target;

    updateFunc(id, name, checked);

   // console.log(checked);
  };
  const loadMore = () => {
    let count = rowCount + 20;
    setRowCount(count);
  };

  const allOver = (e) => {
    //  console.log(e.target.parentNode.id);
    setTargetRow(e.target.parentNode);

    e.target.parentNode.style.borderTop = "14px  solid green";
  };

  const DragEnd = async (e) => {
    targetRow.borderTop = "none";

    // console.log("DragEnd", e);

    // console.log("target end", targetRow.id);
    // console.log("start row", startRow.target.id);

    remove_style_tr();
    const URL = adminApi() + "calls_sort";
    setLoading(true);

    try {
      const response = await axios.post(
        URL,
        { start: parseInt(startRow.target.id), end: parseInt(targetRow.id) },
        {
          headers,
        }
      );

      if (response?.data?.success) {
        setLoading(false);
        setCallState(response?.data?.data);
      }
    } catch (err) {
      //console.log(err);
      setLoading(false);
    }
  };

  const DragLeave = (e) => {
    e.target.parentNode.style.borderTop = "none";
    //console.log("drag leave", e);
  };

  return (
    <div className="overflow-auto relative">
      <p className="text-orange-500 text-stone-600"></p>
      <table id="tbl" className="table  mt-2">
        <thead className={theme}>
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

            {/* <th className="text-center whitespace-nowrap">Phone</th> */}

            <th className="text-center whitespace-nowrap">Assigned To</th>
            <th className="text-center whitespace-nowrap">WhatsApp</th>
            <th className="text-center whitespace-nowrap">Age</th>
            <th className="text-center whitespace-nowrap">Case Type</th>
            {/* <th className="text-center whitespace-nowrap">GPA</th> */}
            {/* <th className="text-center whitespace-nowrap">Priority</th> */}
            {/* <th className="text-center whitespace-nowrap">Referred by</th>
            <th className="text-center whitespace-nowrap">Memo</th> */}
            <th className="text-center whitespace-nowrap">
              Call Schedule Date
            </th>
            <th className="text-center whitespace-nowrap">Next steps</th>
            <th className="text-center whitespace-nowrap">Package</th>
            <th className="text-center whitespace-nowrap">Status</th>

            <th className="text-center whitespace-nowrap">First Call Notes</th>
            <th className="text-center whitespace-nowrap">
              Follow up date set
            </th>
            <th className="text-center whitespace-nowrap">
              Follow up call notes
            </th>

            <th className="text-center whitespace-nowrap">Agreement Sent</th>

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
                  draggable={true}
                  onDragStart={(e) => {
                    dragStart(e, user.id);
                    setStartRow(e);
                  }}
                  id={user.sort}
                  onDragOver={(e) => allOver(e)}
                  onDragEnd={(e) => DragEnd(e)}
                  onDragLeave={(e) => DragLeave(e)}
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

                  <td>
                    {user?.assigned_to?.first_name}{" "}
                    {user?.assigned_to?.last_name}
                  </td>

                  <td>{user?.whatsapp}</td>

                  <td className="text-center">{user?.age}</td>

                  <td className="text-center">
                    {user?.case_type == 1 && "F-1"}{" "}
                    {user?.case_type == 2 && "F-1/F2"}
                  </td>

                  <td className="text-center">
                    {user?.call_schedule_date &&
                      helper.formatDate(
                        user?.call_schedule_date,
                        "MMM D, YYYY"
                      )}{" "}
                  </td>
                  <td className="text-center">{user?.next_step}</td>
                  <td>
                    <select
                      onChange={(e) => handelChange(e, user.id, "n")}
                      name="package"
                      className="form-select form-select-sm mt-2 w-20"
                      defaultValue={user?.package?.id}
                    >
                      <option value="0">Select..</option>

                      {setting.packages &&
                        setting.packages.map((val, indx) => (
                          <option key={indx} value={val?.id}>
                            {val?.title}
                          </option>
                        ))}
                    </select>
                  </td>
                  <td>
                    <select
                      onChange={(e) => handelChange(e, user.id, "n")}
                      name="status"
                      className="form-select form-select-sm mt-2 w-20"
                      defaultValue={user?.status}
                    >
                      <option value="0">Select..</option>

                      {setting.status &&
                        setting.status.map((val, indx) => (
                          <option key={indx} value={val?.id}>
                            {val?.title}
                          </option>
                        ))}
                    </select>
                  </td>
                  <td
                    onClick={() =>
                      setHistory("last_status_notes", user.history, user.id)
                    }
                    className="text-center"
                  >
                    <div className="text-center">
                      <Tippy
                        tag="a"
                        href="#"
                        className="tooltip"
                        content={user?.last_status_notes}
                      >
                        {fText(user?.last_status_notes)}
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
                    {user.ag === 0 ? "No" : "Yes"}
                  </td>

                  <td
                    className="text-center"
                    onClick={() =>
                      setHistory("feedbacks", user.history, user.id)
                    }
                  >
                    <div className="text-center">
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

      <button className="btn btn-default m-5" onClick={loadMore}>
        Load more ...
      </button>
    </div>
  );
};

export default UsersTable;
