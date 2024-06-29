import {
  Checkbox,
  Tippy,
  Modal,
  ModalHeader,
  LoadingIcon,
  ModalBody,
  ModalFooter,
} from "@/base-components";

import { helper } from "@/utils/helper";
import axios from "axios";
import { useState } from "react";
import { adminApi } from "../../configuration";
import CopyEle from "./CopyEle";
const fText = (text) => {
  return text ? text.substr(0, 10) + "..." : "";
};

const remove_style_tr = () => {
  var table = document.querySelectorAll("tr");

  table.forEach((ele) => {
    ele.style.borderTop = "none";
    // check for the particulr class
  });
};

function extra_title(arr, group, index) {
  var value = "";
  if (arr.extra && arr.extra.length > 0) {
    arr.extra.map((dat) => {
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
const CallsTable = (props) => {
  const {
    calls,
    setHistory,
    setCallState,
    allCheck,
    setAllCheck,
    updateFunc,
    setAcheck,
    theme,
    dragStart,
    setting,
    setLoading,
    headers,
    section,
    setSection,
    setPageOff,
    pageOff,
  } = props;

  const [rowCount, setRowCount] = useState(10);

  const [startRow, setStartRow] = useState([]);

  const [targetRow, setTargetRow] = useState([]);
  const [infoModal, setInfoModal] = useState(false);
  const [innerLoading, setInnerLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  const [callId, setCallId] = useState(0);
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
      setAllCheck(
        users.map((li, index) => {
          if (index <= rowCount) {
            return li.id;
          }
        })
      );
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

  const loadMore = () => {
    if (calls.length < rowCount) {
      setPageOff(pageOff + 100);
      console.log("load new data from server", pageOff);
    } else {
      let count = rowCount + 20;
      setRowCount(count);
    }
  };

  const allOver = (e) => {
    // console.log('target',e.target.parentNode.id);
    e.target.parentNode.style.borderTop = "14px  solid green";
    // let children = Array.from(e.target.parentNode.parentNode.children);
    // if (children.indexOf(e.target.parentNode) > children.indexOf(targetRow)) {
    //   // e.target.parentNode.style.borderTop = "none";
    //   e.target.parentNode.style.borderBottom = "14px  solid green";
    // } else {
    //   e.target.parentNode.style.borderTop = "14px  solid green";
    //   //  e.target.parentNode.style.borderBottom = "none";
    // }

    setTargetRow(e.target.parentNode);
  };

  const DragEnd = async () => {
    targetRow.borderTop = "none";

    remove_style_tr();
    const URL = adminApi() + "calls_sort";
    setLoading(true);

    // instructions on 26.10.2023 // change sort by Priority

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
      // console.log(err);
      setLoading(false);
    }
  };

  const DragLeave = (e) => {
    e.target.parentNode.style.borderTop = "none";
    // e.target.parentNode.style.borderBottom = "none";
    //console.log("drag leave", e);
  };

  const feedbackCheck = (history) => {
    var is_admin = history.map((data) => {
      if (data.field === "feedbacks") {
        return data.user.is_admin;
      }
    });
    if (is_admin.length > 0) return is_admin[0];
    return 0;
  };

  const markRead = async () => {
    const URL = adminApi() + "update_feedback";
    setLoading(true);
    setInnerLoading(true);
    try {
      const response = await axios.post(
        URL,
        { id: callId },
        {
          headers,
        }
      );

      if (response?.data?.success) {
        setLoading(false);
        setInnerLoading(false);
        setCallState(response?.data?.data);

        setInfoModal(false);
      }
    } catch (err) {
      //  console.log(err);
      setLoading(false);

      setInnerLoading(false);
    }
  };
  const get_color = (sort) => {
    // colors of sort

    if (sort.id === 4) {
      return "text-danger";
    } else if (sort.id === 3) {
      return "text-warning";
    } else if (sort.id === 2) {
      return "text-fuchsia-400";
    } else {
      return "text-primary";
    }
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
                  handleClick={handelAllCheck}
                  // isChecked={allCheck.length > 0 ? true : false}
                />
              </div>
            </th>

            <th className="whitespace-nowrap">No</th>
            <th className="whitespace-nowrap">Client</th>
            <th className="whitespace-nowrap">E-mail</th>
            {/* <th className="text-center whitespace-nowrap">Phone</th> */}

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
            <th className="text-center whitespace-nowrap">Assigned To</th>
          </tr>
        </thead>
        <tbody>
          {calls &&
            calls.slice(0, rowCount).map((user, key) => {
              let dark = " bg-white ";

              var is_admin = 0;

              if (user.history) {
                var admin = feedbackCheck(user.history);

                is_admin = admin ? admin : 0;
              }

              if (is_admin === 1 && user.feedbacks && user.feedbacks !== "") {
                dark = " alert-warning-soft ";
              } else if (
                is_admin === 2 &&
                user.feedbacks &&
                user?.feedbacks !== ""
              ) {
                dark = " alert-success-soft ";
              } else if (
                is_admin === 4 &&
                user.feedbacks &&
                user?.feedbacks !== ""
              ) {
                dark = " bg-amber-200 ";
              } else if (allCheck.includes(user.id)) {
                dark = " alert-secondary ";
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
                    setStartRow(e);
                    // console.log('dragstart',e);
                    dragStart(e, user.id);

                    setSection(section);
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
                  <td className="w-40">{key + 1}</td>
                  <td>
                    {user.first_name} {user.last_name}
                  </td>
                  <td>
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      className="text-slate-500 text-xs whitespace-nowrap mt-0.5"
                    >
                      <CopyEle email={user.email} />
                    </div>
                  </td>

                  <td>
                    {user?.priority}
                    {user?.p_sort && (
                      <small className={get_color(user?.p_sort)}>
                        {" "}
                        {user?.p_sort?.title}{" "}
                      </small>
                    )}
                  </td>
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
                      helper.formatDate(user?.first_contact, "MMM D, YYYY")}
                  </td>
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

                  <td>
                    {user?.package?.title}
                    {/* <select
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
                    </select> */}
                  </td>

                  <td className="text-center">
                    {user.ag === 0 ? "No" : "Yes"}
                  </td>

                  <td> {user.agreed_to_signed === 0 ? "No" : "Yes"}</td>

                  <td>
                    {/* <select
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
                    </select> */}

                    {user?.statu?.title}
                  </td>
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
                        className="tooltip btn btn-secondary"
                        content={user?.feedbacks}
                        //onClick={(e) => { setInfoModal(true); setFeedback(user?.feedbacks); }

                        onClick={() => {
                          setInfoModal(true);
                          setFeedback(user?.feedbacks);
                          setCallId(user?.id);
                        }}
                      >
                        View
                      </Tippy>
                    </div>
                  </td>
                  <td>
                    {user?.assigned_to?.first_name}{" "}
                    {user?.assigned_to?.last_name}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>

      {/* <button className="btn btn-default m-5" onClick={loadMore}>
        Load more ...
      </button> */}

      <div className="intro-y  mt-5 col-span-12 flex flex-wrap sm:flex-row sm:flex-nowrap items-center">
        <button
          onClick={() => loadMore(rowCount - 100)}
          className="btn"
          disabled={rowCount < 100 ? true : false}
        >
          Prev
        </button>
        <button onClick={() => loadMore(rowCount + 100)} className="btn ml-5">
          Next
        </button>
      </div>

      <Modal
        size="modal-lg"
        show={infoModal}
        onHidden={() => {
          setInfoModal(false);
        }}
      >
        <ModalHeader>
          <h3>Feedback</h3>
        </ModalHeader>

        <ModalBody className="p-0">
          <div className="p-5 text-center">
            <div className="my-5 ">{feedback}</div>
          </div>
        </ModalBody>
        <ModalFooter>
          <div className=" text-center">
            <button
              type="button"
              onClick={() => {
                setInfoModal(false);
              }}
              className="btn btn-outline-secondary w-24 mr-1"
            >
              Cancel
            </button>

            <button
              onClick={markRead}
              type="button"
              className="btn btn-warning text-white "
            >
              Mark as read
              {innerLoading && (
                <LoadingIcon
                  icon="three-dots"
                  color="white"
                  className="w-4 h-4 ml-2"
                />
              )}
            </button>
          </div>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default CallsTable;
