import {
  Lucide,
  Modal,
  ModalBody,
  LoadingIcon,
  Litepicker,
} from "@/base-components";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue, useRecoilStateLoadable } from "recoil";
import { filter } from "lodash";
import { getBaseApi } from "../../configuration";
import {
  callListState,
  notiState,
  allUserListState,
} from "../../state/admin-atom";

import axios from "axios";
import { adminApi } from "../../configuration";
import { helper } from "@/utils/helper";
import { loginState } from "../../state/login-atom";
import { settingState } from "../../state/setting-atom";
import FollowUpSection from "./FollowUpSection";
import ConfirmedGpa from "./ConfirmedGpa";
function employeeFilters(array) {
  return filter(array, (_items) => {
    return _items.is_admin == 3;
  });
}

function getSingleCalls(array, id) {
  return filter(array, (item) => item?.id === id);
}

function removeArr(array, index) {
  return filter(array, (_items, key) => {
    return _items.id !== index;
  });
}

const EditCalls = (props) => {
  let { id } = useParams();
  let navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [callData, setCallState] = useRecoilStateLoadable(callListState);
  const [userData, setUserState] = useRecoilStateLoadable(allUserListState);
  const [notiData, setNotiState] = useRecoilState(notiState);
  const logindata = useRecoilValue(loginState);

  const [firstContact, setFirstContact] = useState("");

  const [followdate, setFollowDate] = useState("");

  const [validationModal, setValidationModal] = useState(false);

  const [err, setErr] = useState([]);
  const [emailErr, setEmailErr] = useState([]);

  let call = getSingleCalls(callData.contents, parseInt(id));
 
  const [ecall, setEcall] = useState([]);

  const [show, setShow] = useState(false);
  const setting = useRecoilValue(settingState);
  const [radio, setRadio] = useState(call[0] ? call[0].immigration_filling : 0);

  const [packages, setPackages] = useState(
    call[0] ? (call[0].package?.id === 5 ? true : false) : false
  );

  // const [followUpState, sectFollowUpSec] = useState(
  //   call[0] ? call[0].extra : [{ id: 0 }]
  // );

  const [followUpState, sectFollowUpSec] = useState(
    call[0] && call[0].extra.length > 1
      ? call[0].extra
      : [
          {
            id: 0,
            groups: "follow_up",
            values: [
              {
                value: "",
              },
              {
                value: "",
              },
              {
                value: "",
              },
              {
                value: "",
              },
              {
                value: "",
              },
            ],
          },
        ]
  );


  const [confirmGpaState, setConfirmGpaState] = useState(
    call[0].extra.length > 0
      ? call[0].extra
      : [
          {
            id: 0,
            groups: "con_gpa",
            values: [
              {
                value: "",
              },
              {
                value: "",
              },{
                value: "",
              },
            ],
          },
        ]
  );

  const deleteConGpa = (e) => {
    if (confirmGpaState.length > 1) {
      let newArr = removeArr(confirmGpaState, e);
      setConfirmGpaState(newArr);
    }
  };

  const addConGpa = (e) => {
    //console.log("addConGpa");
    let newObj = {
      id: confirmGpaState[confirmGpaState.length - 1].id + 1,
      groups: "con_gpa",
      values: [
        {
          value: "",
        },
        {
          value: "",
        },
      ],
    };

    setConfirmGpaState([...confirmGpaState, newObj]);
  };

  //let followUp = Object.assign({}, followUpState);

  //console.log("Follow Up state", followUp);

  const headers = {
    Authorization: `Bearer ${logindata?.token}`,
    ContentType: "application/json",
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    var data = new FormData(e.target);

    data.append("user_id", call[0].user_id);

    const URL = adminApi() + "calls";

    setLoading(true);

    try {
      const response = await axios.post(URL, data, {
        headers,
      });
      //console.log(response);
      if (response?.data?.success) {
        setLoading(false);

        setCallState(response?.data?.data);
        navigate("../calls/all", { replace: true });
      }
    } catch (err) {
      if (!err?.response?.data?.success) {
        //clae console.log("Err", err?.response?.data?.message.email[0]);

        if (
          err?.response?.data?.message.email &&
          err?.response?.data?.message.email[0] == "taken"
        ) {
          setEcall(err?.response?.data?.data);

          setValidationModal(true);
        } else {
          setErr(err?.response?.data?.message);
        }
      }

      setLoading(false);
    }
  };

  const moveAdmin = async () => {
    const URL = adminApi() + "notifications";

    try {
      const response = await axios.post(
        URL,
        { type: 1, content: "Client Recovering Request", call_id: call?.id },
        {
          //user id is creator of notifications
          headers,
        }
      );
      //console.log(response);
      if (response?.data?.success) {
        setLoading(false);
        setValidationModal(false);
        setNotiState(response?.data?.data);
      }
    } catch (err) {
      if (!err?.response?.data?.success) {
      }

      setLoading(false);
    }
  };

  const showMe = () => {
    setShow(true);
  };

  const checkEmail = async (e) => {
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(e.target.value)) {
     // console.log("Invalid Email");
      setEmailErr(["Email is not valid !"]);
      return false;
    } else {
      setEmailErr([]);
    }

    const URL = adminApi() + "check/" + "email/" + e.target.value;

    try {
      const response = await axios.get(URL, {
        //user id is creator of notifications
        headers,
      });
    } catch (err) {
      //console.log(err?.response?.data.message);

      if (err?.response?.data?.message?.email) {
        setEmailErr(err?.response?.data?.message?.email);
        setCallState(err?.response?.data?.data);

        setValidationModal(true);
      }

      setLoading(false);
    }
  };

  const users = employeeFilters(userData.contents);

  const handelRadio = (e) => {
    setRadio(e.target.value);
  };

  const handelPackage = (e) => {
    let name = e.target.name;

    let value = e.target.value;
    if (value == 5) {
      setPackages(true);
    } else {
      setPackages(false);
    }
  };

  const handelFollow = (e, index) => {
   // console.log("handelSelect", e.target.value);

    let name = e.target.name;
    let value = parseInt(e.target.value);
    if (value === 3 || value === 4) {
      let newObj = {
        id: followUpState[followUpState.length - 1].id + 1,
        groups: "follow_up",
        values: [
          {
            value: "",
          },
          {
            value: "",
          },
          {
            value: "",
          },
          {
            value: "",
          },
          {
            value: "",
          },
        ],
      };

      let newAte = JSON.stringify(followUpState);
      let followUp = JSON.parse(newAte);
      followUp[index].values[1].value = value;
      sectFollowUpSec([...followUp, newObj]);
    } else {
      onChange(e.target.value, index, 1);
    }
  };

  const deleteFollowUp = (e) => {
    if (followUpState.length > 1) {
      let newArr = removeArr(followUpState, e);
      sectFollowUpSec(newArr);
    }
  };

  const onChange = (val, index, sec) => {
    let newAte = JSON.stringify(followUpState);
    let newState = JSON.parse(newAte);
    newState[index].values[sec].value = val;
    sectFollowUpSec(newState);
  };
  const onChangeGpa = (val, index, sec) => {
    let newAte = JSON.stringify(confirmGpaState);
    let newState = JSON.parse(newAte);
    newState[index].values[sec].value = val;
    setConfirmGpaState(newState);
  };

  return (
    <>
      <h2 className="intro-y text-lg font-medium mt-10 ">Add Calls</h2>

      {callData.state == "hasValue" && (
        <form onSubmit={(e) => handleSubmit(e)}>
          <input type="hidden" name="id" defaultValue={call[0]?.id} />
          <div className="mt-5">
            <div className="px-5">
              {Object.keys(err).length > 0 &&
                Object.values(err).map((text, key) => {
                  return (
                    <h3 className="text-danger py-3 text-center" key={key}>
                      {text}
                    </h3>
                  );
                })}
            </div>

            <div className="intro-y box p-5">
            <h3 className="text-xl font-medium">Form Information</h3>
              <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
                <div className="intro-x ">
                  <label className="form-label">First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    className="form-control"
                    placeholder=""
                    defaultValue={call[0]?.first_name}
                  />
                </div>
                <div className="intro-x ">
                  <label className="form-label">Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    className="form-control"
                    placeholder=""
                    defaultValue={call[0]?.last_name}
                  />
                </div>
                <div className="intro-x ">
                  <label className="form-label">Email</label>
                  <input
                    type="text"
                    name="email"
                    className={
                      emailErr.length > 0
                        ? "border-warning form-control "
                        : "form-control"
                    }
                    placeholder=""
                    defaultValue={call[0]?.email}
                    required
                    onChange={(e) => checkEmail(e)}
                  />

                  {emailErr.length > 0 &&
                    emailErr.map((text, key) => {
                      return (
                        <small
                          className="text-danger py-3 text-center"
                          key={key}
                        >
                          {text}
                        </small>
                      );
                    })}
                </div>
                <div className="intro-x ">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    name="phone_number"
                    className=" form-control"
                    placeholder=""
                    defaultValue={call[0]?.phone_number}
                  />
                </div>
                <div className="intro-x ">
                  <label className="form-label">WhatsApp Number</label>
                  <input
                    type="text"
                    name="whatsapp"
                    className=" form-control"
                    defaultValue={call[0]?.whatsapp}
                  />
                </div>
                <div className="intro-x ">
                  <label className="form-label">Age</label>
                  <input
                    type="text"
                    name="age"
                    className=" form-control"
                    placeholder=""
                    defaultValue={call[0]?.age}
                  />
                </div>
                <div className="intro-x ">
                  <label className="form-label">GPA</label>
                  <input
                    type="text"
                    name="gpa"
                    className=" form-control"
                    placeholder=""
                    defaultValue={call[0]?.gpa}
                  />
                </div>
                <div className="intro-x ">
                  <label className="form-label">Priority</label>
                  <select
                    name="priority"
                    defaultValue={call[0] && call[0].priority?.id}
                    className="form-control"
                  >
                    <option value="0">Select..</option>
                    {setting.priorities &&
                      setting.priorities.map((val, indx) => (
                        <option key={indx} value={val?.id}>
                          {val?.title}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="intro-x ">
                  <label className="form-label">Referred by</label>
                  <input
                    type="text"
                    name="referred_by"
                    className="form-control"
                    placeholder=""
                    defaultValue={call[0]?.referred_by}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
                <div className="intro-x ">
                  <label className="form-label">Marital Status</label>

                  <select
                    name="marital_status"
                    defaultValue={
                      call[0]?.marital_status && call[0]?.marital_status?.id
                    }
                    className="form-control"
                  >
                    <option value="0">Select...</option>
                    {setting.marital_status &&
                      setting.marital_status.map((val, indx) => (
                        <option key={indx} value={val?.id}>
                          {val?.title}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="intro-x ">
                  <label className="form-label">Want to Study</label>
                  <select
                    name="want_to_study"
                    defaultValue={
                      call[0]?.want_to_study && call[0]?.want_to_study?.id
                    }
                    className="form-control"
                  >
                    <option value="0">Select...</option>
                    {setting.want_to_study &&
                      setting.want_to_study.map((val, indx) => (
                        <option key={indx} value={val?.id}>
                          {val?.title}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="intro-x ">
                  <label className="form-label">Assigned to</label>
                  <select
                    name="assigned_to"
                    defaultValue={
                      call[0]?.assigned_to && call[0]?.assigned_to?.id
                    }
                    className="form-control"
                  >
                    <option value="0">Select...</option>

                    {userData.state == "hasValue" &&
                      users.map((val, index) => (
                        <option key={index} value={val.id}>
                          {val.first_name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div className="border border-dashed border-2 p-5 md:mt-5">
                <div className="grid grid-cols-1  gap-4">
                  <div className="intro-y">
                    <label className="form-label">Memo</label>
                    <input
                      type="text"
                      name="memo"
                      className=" form-control"
                      placeholder=""
                      defaultValue={call[0]?.memo}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/*Section 1*/}

            <div className="intro-y box p-5 mt-5">
            <h3 className="text-xl font-medium">First Call</h3>
              <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-5 gap-4 mt-5">
                <div className="intro-x ">
                  <label className="form-label">First Contact Date</label>

                  <div className="relative w-full">
                    <div className="absolute rounded-l w-10 h-full flex items-center justify-center bg-slate-100 border text-slate-500 dark:bg-darkmode-700 dark:border-darkmode-800 dark:text-slate-400">
                      <Lucide icon="Calendar" className="w-4 h-4" />
                    </div>
                    <input
                      type="date"
                      name="first_contact"
                      defaultValue={call[0]?.first_contact}
                      className="form-control pl-12"
                    />
                  </div>
                </div>
                <div className="intro-x">
                  <label className="form-label">Education Level</label>

                  <select
                    name="applying_for"
                    defaultValue={
                      call[0]?.applying_for && call[0]?.applying_for?.id
                    }
                    className="form-control"
                  >
                    <option value="0">Select...</option>
                    {setting.applying_for &&
                      setting.applying_for.map((val, indx) => (
                        <option key={indx} value={val?.id}>
                          {val?.title}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="intro-y  col-span-2">
                  {confirmGpaState.map(
                    (val, indx) =>
                      val.groups == "con_gpa" && (
                        <ConfirmedGpa
                          index={indx}
                          setting={setting}
                          data={val}
                          deleteConGpa={deleteConGpa}
                          onChange={onChangeGpa}
                          key={indx}
                          team={logindata.team}
                        />
                      )
                  )}

                  <div className="col-span-2 mt-5 flex  justify-center">
                    <a
                      onClick={addConGpa}
                      className=" btn btn-elevated-primary"
                    >
                      <Lucide icon="Plus" className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                <div className="intro-x">
                  <label className="form-label">Immigration Filings </label>
                  <div className="flex flex-col sm:flex-row mt-2">
                    <div className="form-check mr-2">
                      <input
                        onChange={(e) => handelRadio(e)}
                        className="form-check-input"
                        type="radio"
                        name="immigration_filling"
                        value="1"
                        checked={radio == "1"}
                      />
                      <label className="form-check-label">Yes</label>
                    </div>
                    <div className="form-check mr-2 mt-2 sm:mt-0">
                      <input
                        onChange={(e) => handelRadio(e)}
                        className="form-check-input"
                        type="radio"
                        name="immigration_filling"
                        value="0"
                        checked={radio == "0"}
                      />
                      <label className="form-check-label">No</label>
                    </div>
                  </div>
                  {radio == "1" && (
                    <input
                      id="immigration_filling"
                      type="text"
                      className="form-control mt-2"
                      placeholder="Method Of Filling"
                      name="method_filling"
                      defaultValue={call[0] && call[0].method_filling}
                    />
                  )}
                </div>
                {/* <div className="intro-x">
                <label className="form-label">Method of Filling </label>
                <input type="text" name="method_filling" />
              </div> */}

                <div className="intro-x">
                  <label className="form-label">Goal </label>
                  <select
                    name="goal"
                    defaultValue={call[0] && call[0]?.goal?.id}
                    className="form-control"
                  >
                    <option value="0">Select...</option>
                    {setting.goal &&
                      setting.goal.map((val, indx) => (
                        <option key={indx} value={val?.id}>
                          {val?.title}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
                <div className="intro-y">
                  <label className="form-label">Nationality</label>
                  <input
                    type="text"
                    name="nationality"
                    className=" form-control"
                    placeholder=""
                    defaultValue={call[0]?.nationality}
                  />
                </div>
                <div>
                  <label className="form-label">Package</label>

                  <select
                    onChange={(e) => handelPackage(e)}
                    name="package"
                    className="form-control"
                    defaultValue={call[0] && call[0]?.package?.id}
                  >
                    <option value="0">Select...</option>

                    {setting.packages &&
                      setting.packages.map((val, indx) => (
                        <option key={indx} value={val?.id}>
                          {val?.title}
                        </option>
                      ))}
                  </select>

                  {packages && (
                    <input
                      type="text"
                      id="package"
                      defaultValue={call[0]?.package_explain}
                      placeholder="Explain"
                      name="package_explain"
                      className="form-control  mt-2"
                    />
                  )}
                </div>

                <div>
                  <label className="form-label">Status</label>

                  <select
                    defaultValue={call[0] && call[0]?.status?.id}
                    name="status"
                    className="form-control"
                  >
                    <option value="0">Select...</option>

                    {setting.status &&
                      setting.status.map((val, indx) => (
                        <option key={indx} value={val?.id}>
                          {val?.title}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">First Call Result</label>

                  <select
                    defaultValue={call[0] && call[0]?.results?.id}
                    name="results"
                    className="form-control"
                  >
                    <option value="0">Select...</option>

                    {setting.results &&
                      setting.results.map((val, indx) => (
                        <option key={indx} value={val?.id}>
                          {val?.title}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div className="border border-dashed border-2 p-5 md:mt-5">
                <div className="grid grid-cols-1  gap-4">
                  <div className="intro-y">
                    <label className="form-label">First Call Notes</label>
                    <input
                      type="text"
                      name="last_status_notes"
                      className=" form-control"
                      placeholder=""
                      defaultValue={call[0]?.last_status_notes}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 mt-5 gap-4">
                  <div className="intro-y">
                    <label className="form-label"> Agreement Sent</label>
                    <select
                      name="agreement_sent"
                      className="form-control"
                      defaultValue={call[0]?.agreement_sent}
                    >
                      <option value="0">No</option>
                      <option value="1">Yes</option>
                    </select>
                  </div>
                  <div className="intro-y">
                    <label className="form-label">Date Agreement Sent</label>
                    <input
                      type="date"
                      name="agree_date_sent"
                      className="form-control"
                      defaultValue={call[0]?.agree_date_sent}
                    />
                  </div>
                </div>
              </div>

              <div className="border mt-5 px-5 pb-5 border-dashed border-2">
              <h3 className="text-xl font-medium mt-5">Follow Up and Next Steps</h3>
                {callData.state == "hasValue" &&
                  followUpState.map(
                    (val, index) =>
                      val.groups == "follow_up" && (
                        <FollowUpSection
                          index={index}
                          key={index}
                          handelSelect={handelFollow}
                          setting={setting}
                          data={val}
                          deleteFollowUp={deleteFollowUp}
                          onChange={onChange}
                        />
                      )
                  )}
              </div>

              <div className="border border-dashed border-2 p-5 md:mt-5">
                <div className="grid grid-cols-1  gap-4">
                  <div className="intro-y">
                    <label className="form-label">Feedback</label>
                    <input
                      type="text"
                      name="feedbacks"
                      className=" form-control"
                      placeholder=""
                      defaultValue={call[0]?.feedbacks}
                    />
                  </div>

                  {call[0].history &&
                    call[0].history.map((data, index) => (
                      <div
                        key={index}
                        className="bg-white dark:bg-darkmode-400 shadow-sm border border-slate-200 rounded-md p-5 flex flex-col sm:flex-row items-start gap-y-3 "
                      >
                        <div className="mr-3">
                          <div className="image-fit w-12 h-12">
                            <img
                              className="rounded-full"
                              src={
                                getBaseApi() +
                                "file/" +
                                data?.user?.profile?.file_path
                              }
                            />
                          </div>
                        </div>
                        <div>
                          <a href="" className="text-primary font-medium mr-3">
                            {data?.user?.first_name} {data?.user?.last_name}
                          </a>
                          {data?.value}
                          <div className="text-slate-500 text-xs mt-1.5">
                            {helper.formatDate(
                              data?.created_at,
                              "ddd, MMMM D, YYYY h:mm A"
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
                <div className="intro-x ">
                  <label className="form-label">Cancellation reason </label>
                  <select
                    name="cancel_reason"
                    defaultValue={call[0] && call[0]?.cancel_reason?.id}
                    className="form-control"
                  >
                    <option value="0">Select...</option>
                    {setting.cancel_reason &&
                      setting.cancel_reason.map((val, indx) => (
                        <option key={indx} value={val?.id}>
                          {val?.title}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="intro-y col-span-12 flex items-center justify-center  mt-5">
              <button type="submit" className="btn btn-elevated-primary w-24">
                Save{" "}
                {loading && (
                  <LoadingIcon
                    icon="three-dots"
                    color="white"
                    className="w-4 h-4 ml-2"
                  />
                )}
              </button>
            </div>
          </div>
        </form>
      )}

      <Modal
        size="modal-lg"
        show={validationModal}
        onHidden={() => {
          setValidationModal(false);
        }}
      >
        <ModalBody className="p-0">
          <div className="p-5 text-center">
            <div className="text-xl mt-3 text-danger bg-danger/20 border border-danger/20 rounded-md px-1.5 py-5 ml-1">
              User already exist !
            </div>
            <div className="my-5 ">
              {show ? (
                <div className="intro-y p-5 box grid grid-cols-2 gap-2">
                  <div className="flex items-center">
                    Name:
                    <span className="text-xs text-success bg-success/20 border border-success/20 rounded-md px-1.5 py-0.5 ml-1">
                      {call?.first_name} {call?.last_name}
                    </span>
                  </div>
                  <div className="flex items-center">
                    E-mail:
                    <span className="text-xs text-success bg-success/20 border border-success/20 rounded-md px-1.5 py-0.5 ml-1">
                      {call?.email}
                    </span>
                  </div>
                  <div className="flex  items-center">
                    Phone:
                    <span className="text-xs text-success bg-success/20 border border-success/20 rounded-md px-1.5 py-0.5 ml-1">
                      {call?.phone}
                    </span>
                  </div>
                  <div className="flex  items-center">
                    Follow Up Date :
                    <span className="text-xs text-success bg-success/20 border border-success/20 rounded-md px-1.5 py-0.5 ml-1">
                      {call?.follow_up_date}
                    </span>
                  </div>
                </div>
              ) : (
                <button className="btn btn-success-soft" onClick={showMe}>
                  Show Me{" "}
                </button>
              )}
            </div>
          </div>
          <div className="px-5 pb-8 text-center">
            <button
              type="button"
              onClick={() => {
                setValidationModal(false);
              }}
              className="btn btn-outline-secondary w-24 mr-1"
            >
              Cancel
            </button>

            {show && (
              <button
                onClick={moveAdmin}
                type="button"
                className="btn btn-danger "
              >
                Transfer Customer To Admin
                {loading && (
                  <LoadingIcon
                    icon="three-dots"
                    color="white"
                    className="w-4 h-4 ml-2"
                  />
                )}
              </button>
            )}
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default EditCalls;
