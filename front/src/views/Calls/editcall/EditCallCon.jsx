import { Lucide, Modal, ModalBody, LoadingIcon } from "@/base-components";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useRecoilStateLoadable } from "recoil";
import { filter } from "lodash";
import classnames from "classnames";
import {
  callListState,
  notiState,
  allUserListState,
} from "../../../state/admin-atom";
import CallScheduleSection from "../CallScheduleSection";
import axios from "axios";
import { adminApi, getBaseApi } from "../../../configuration";
import { helper } from "@/utils/helper";
import { loginState } from "../../../state/login-atom";

import FollowUpSection from "../FollowUpSection";

import MySection from "../MySection";

import ConfirmedGpa from "../ConfirmedGpa";

import SupposeSection from "../SupposeSection";

// calls.extra

function filterById(array, id) {
  return filter(array, (_items) => {
    return _items.id == id;
  });
}

function filterExtra(array, group) {
  return filter(array, (_items) => {
    return _items.groups == group;
  });
}

function filterSingle(array, filed) {
  return filter(array, (_items) => {
    return _items.field == filed;
  });
}

function employeeFilters(array) {
  return filter(array, (_items) => {
    return _items.is_admin !== 1;
  });
}

function removeArr(array, index) {
  return filter(array, (_items, key) => {
    return _items.id !== index;
  });
}

const EditCallCon = (props) => {
  const { calls, setCallId, setting, setSingleCallState } = props;

  const [err, setErr] = useState([]);
  const [emailErr, setEmailErr] = useState([]);

  let navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const logindata = useRecoilValue(loginState);

  // const [firstContact, setFirstContact] = useState("");

  // const [followdate, setFollowDate] = useState("");

  const [validationModal, setValidationModal] = useState(false);

  const [callData, setCallState] = useRecoilState(callListState);
  const [userData, setUserState] = useRecoilStateLoadable(allUserListState);
  const [notiData, setNotiState] = useRecoilState(notiState);
  const [callSwitch, setCallSwitch] = useState(false);
  // const restSingleCall = useResetRecoilState(singleCallState);

  // const restCallIdState = useResetRecoilState(callIdState);

  const [radio, setRadio] = useState(calls ? calls.immigration_filling : 0);

  const [call, setCall] = useState([]);

  const [show, setShow] = useState(false);

  const [redirectFlag, setRedirectFlag] = useState(true);

  const [suppose, setSuppose] = useState(
    calls.marital_status && calls.marital_status.id == 2 ? true : false
  );
  const [score, setScore] = useState(
    calls.eng_test_score && calls.eng_test_score !== null ? true : false
  );
  const [cancelReason, setCancelReason] = useState(
    calls?.cancel_reason !== null ? true : false
  );

  const [cancelReasonId, setCancelReasonId] = useState(
    calls?.cancel_reason !== null ? calls?.cancel_reason?.id : 0
  );
  const [cancelReasonDate, setCancelReasonDate] = useState(
    calls.cancel_date !== null ? calls.cancel_date : ""
  );
  const [cancelReasonNote, setCancelReasonNote] = useState(
    calls.cancel_note !== null ? calls.cancel_note : ""
  );

  const [fCallResult, setFCallResult] = useState(false);

  const [followUpState, sectFollowUpSec] = useState(
    calls.extra
      ? calls.extra
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

  const [myNextStepState, setMyNextStep] = useState(
    calls.extra
      ? calls.extra
      : [
          {
            id: 0,
            groups: "my_step",
            values: [
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
    calls
      ? calls.extra
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
              },
              {
                value: "",
              },
            ],
          },
        ]
  );

  const addMyStep = () => {
    let newObj = {
      id:
        myNextStepState.length > 0
          ? myNextStepState[myNextStepState.length - 1].id + 1
          : 1,
      groups: "my_step",
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
      ],
    };
    let myStep = myNextStepState;

    setMyNextStep([...myStep, newObj]);
  };

  const headers = {
    Authorization: `Bearer ${logindata?.token}`,
    ContentType: "application/json",
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      document.getElementById("cancel_reason").selectedIndex == 0 &&
      callSwitch
    ) {
      alert("Cancel Reason Required ");

      return false;
    }

    var data = new FormData(e.target);

    // data.append("follow_up_date", helper.formatDate(followdate, "YYYY-MM-DD"));
    // data.append("first_contact", helper.formatDate(firstContact, "YYYY-MM-DD"));

    //data.append("last_status_date", lastStatus);

    data.append("user_id", logindata?.userId);

    //calls?.cancel_reason && calls?.cancel_reason?.id > 0 && data.append("cancel", callSwitch);

    // data.append("cancel_reason", cancelReasonId);
    // data.append("cancel_date", cancelReasonDate);

    // data.append("cancel", cancelReasonNote);

    // console.log("call switch", callSwitch);

    //data.set("results", fCallResult);

    //data.append("f_results", fCallResult);

    ////data.append("results", 3);

    //calls.section !== null && data.append("section", calls.section.id);

    const URL = adminApi() + "calls";

    redirectFlag ? setLoading(true) : setLoading2(true);

    try {
      const response = await axios.post(URL, data, {
        headers,
      });
      //console.log(response);
      if (response?.data?.success) {
        setLoading(false);
        setLoading2(false);
        setCallState(response?.data?.data);
        // window.location.reload();

        redirectFlag && navigate("../calls/all", { replace: true });
      }
    } catch (err) {
      // console.log("Err", err);
      if (!err?.response?.data?.success) {
        //   console.log("Err", err?.response?.data?.message.email[0]);
        if (
          err?.response?.data?.message.email &&
          err?.response?.data?.message.email[0] == "taken"
        ) {
          setCall(err?.response?.data?.data);
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
        {
          type: 1,
          content: "Client Recovering Request",
          call_id: call?.id,
          user_id: logindata.userId,
          is_read: 0,
        },
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
      // console.log(err);
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
      // console.log(err?.response?.data.message);

      if (err?.response?.data?.message?.email) {
        setEmailErr(err?.response?.data?.message?.email);
        setCall(err?.response?.data?.data);

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
    document.getElementById(name).classList.add("hidden");
    let value = e.target.value;
    if (value == 5) {
      document.getElementById(name).classList.remove("hidden");
    }
  };
  const onChange = (val, index, sec) => {
    let newAte = JSON.stringify(followUpState);
    let newState = JSON.parse(newAte);
    newState[index].values[sec].value = val;
    sectFollowUpSec(newState);
  };

  const onChangeGpa = (val, index, sec) => {
    // console.log("login data", logindata);

    // if (parseInt(logindata.team) === 1 && parseInt(val) < 13.5) {

    // }

    let newAte = JSON.stringify(confirmGpaState);
    let newState = JSON.parse(newAte);
    newState[index].values[sec].value = val;
    setConfirmGpaState(newState);
  };

  const addFollow = () => {
    let newObj = {
      id:
        followUpState.length > 0
          ? followUpState[followUpState.length - 1].id + 1
          : 1,

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
    let followUp = followUpState;

    sectFollowUpSec([...followUp, newObj]);
  };

  const handelFollow = (e, index) => {
    onChange(e.target.value, index, 1);

    setFCallResult(e.target.value);

    return;
  };

  const deleteFollowUp = (e) => {
    if (followUpState.length > 1) {
      let newArr = removeArr(followUpState, e);
      sectFollowUpSec(newArr);
    }
  };

  const deleteMyStep = (e) => {
    if (myNextStepState.length > 1) {
      let newArr = removeArr(myNextStepState, e);
      setMyNextStep(newArr);
    }
  };
  const onChangeMyStep = (val, index, sec) => {
    let newAte = JSON.stringify(myNextStepState);
    let newState = JSON.parse(newAte);
    newState[index].values[sec].value = val;
    setMyNextStep(newState);
  };

  const deleteConGpa = (e) => {
    if (confirmGpaState.length > 1) {
      let newArr = removeArr(confirmGpaState, e);
      setConfirmGpaState(newArr);
    }
  };

  const addConGpa = (e) => {
    let newObj = {
      id:
        confirmGpaState.length > 0
          ? confirmGpaState[confirmGpaState.length - 1].id + 1
          : 1,
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

  const [callScheduleState, setCallScheduleState] = useState(
    filterExtra(calls.extra, "call_schedule").length > 0
      ? filterExtra(calls.extra, "call_schedule")
      : [
          {
            id: 0,
            groups: "call_schedule",
            values: [
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

  const addCallSchedule = (e) => {
    let newObj = {
      id: callScheduleState[callScheduleState.length - 1].id + 1,
      values: [
        {
          value: "",
        },
        {
          value: "",
        },
      ],
    };

    setCallScheduleState([...callScheduleState, newObj]);
  };

  const deleteCallSchedule = (e) => {
    if (callScheduleState.length > 1) {
      let newArr = removeArr(callScheduleState, e);
      setCallScheduleState(newArr);
    }
  };

  const handelMargie = (e) => {
    // console.log("married", e.target.value);

    if (e.target.value == 2) {
      setSuppose(true);
    } else {
      setSuppose(false);
    }
  };

  const handelEngTest = (e) => {
    //console.log("handelEngTest", e.target.value);

    if (parseInt(e.target.value) !== 0) {
      setScore(true);
    } else {
      setScore(false);
    }
  };

  const handelCancelReason = (e) => {
    setCancelReason(true);
  };

  const restCancel = () => {
   // console.log("called rest cancel");
    setCancelReason(false);

    setCancelReasonId(0);
    setCancelReasonDate("");
    setCancelReasonNote("");

    document.getElementById("cancel_reason").selectedIndex = 0;
  };

  const CancelSwitch = () => {
    // hit cancel again button
    setCallSwitch(() => !callSwitch);

    callSwitch === false && restCancel();

   // console.log("call switch", callSwitch);
  };

  // console.log('calls', calls);

  let assigned_filter = calls.history
    ? filterSingle(calls.history, "assigned_to")
    : [];

  const markRead = async (id) => {
    const URL = adminApi() + "update_feedback";
    setLoading(true);

    try {
      const response = await axios.post(
        URL,
        { id: id },
        {
          headers,
        }
      );

      if (response?.data?.success) {
        setLoading(false);
        window.location.reload();
      }
    } catch (err) {
      // console.log(err);
      setLoading(false);
    }
  };

  const setRedirect = (flag) => {
   // console.log("flag", flag);

    setRedirectFlag(flag);
  };

  return Object.keys(calls).length > 0 ? (
    <>
      <form onSubmit={(e) => handleSubmit(e)}>
        <input type="hidden" name="id" defaultValue={calls?.id} />
        <input type="hidden" name="sections" defaultValue={calls?.sections} />

        <div className="mt-5">
          <div className="px-5">
            {err &&
              Object.keys(err).length > 0 &&
              Object.values(err).map((text, key) => {
                return (
                  <h3 className="text-danger py-3 text-center" key={key}>
                    {text}
                  </h3>
                );
              })}
          </div>

          <div className="intro-y box p-5">
            <div className="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2">
              <div className="lg:basis-5/12  ">
                <h3 className="text-xl font-medium">Form Information</h3>
              </div>
              <div className="lg:basis-2/12  ">
                <h3 className="text-sm">
                  Created At : 
                  <span className="text-sm ml-2">
                    {calls?.created_at &&
                      helper.formatDate(calls?.created_at, "MMM D, YYYY")}{" "}
                  </span>
                </h3>
                {/* {calls.cancel_reason && calls?.results?.id !== 1 && (
                  <div
                    onClick={CancelSwitch}
                    className="dark-mode-switcher cursor-pointer shadow-md  bottom-0 left-0 box border rounded-full w-36 h-10 flex items-center justify-center z-50 "
                  >
                    <div className="mr-3 text-slate-600 dark:text-slate-200">
                      Cancel Again
                    </div>
                    <div
                      className={classnames({
                        "dark-mode-switcher__toggle border": true,
                        "dark-mode-switcher__toggle--active": callSwitch,
                      })}
                    ></div>
                  </div>
                )} */}
              </div>
              <div className="lg:basis-5/12">
                {assigned_filter.length > 0 && (
                  <div className="relative before:hidden before:lg:block before:absolute before:w-[69%] before:h-[3px] before:top-0 before:bottom-0 before:mt-4 before:bg-slate-100 before:dark:bg-darkmode-400 flex flex-col lg:flex-row justify-center px-5 sm:px-20">
                    {assigned_filter.map((data, index) => {
                      //  console.log(data);

                      var selected =
                        "btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400";
                      if (index == 0) {
                        selected = " btn btn-primary";
                      }

                      if (data.user) {
                        return (
                          <div
                            key={index}
                            className="intro-x lg:text-center flex items-center lg:block flex-1 z-10"
                          >
                            <button
                              type="button"
                              className={"w-50 h-10 rounded-full " + selected}
                            >
                              Assigned
                            </button>
                            <div className="lg:w-32 font-medium text-base lg:mt-1 ml-3 lg:mx-auto">
                              {data?.user?.first_name}
                            </div>

                            <div className="lg:w-32  ml-3 lg:mx-auto">
                              <small className="w-100 mb-5">
                                (
                                {helper.formatDate(
                                  data?.created_at,
                                  "MMMM D, YYYY h:mm A"
                                )}
                                )
                              </small>
                            </div>
                          </div>
                        );
                      }
                    })}

                    <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                      <button
                        type="button"
                        className="w-50 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400"
                      >
                        Creator
                      </button>
                      <div className="lg:w-32 text-base lg:mt-1 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400">
                        {calls.user.first_name} {calls.user.last_name}
                      </div>

                      <div className="lg:w-32  ml-3 lg:mx-auto">
                        <small className="w-100 mb-5">
                          (
                          {helper.formatDate(
                            calls?.created_at,
                            "MMMM D, YYYY h:mm A"
                          )}
                          )
                        </small>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1  border-t pt-5  md:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
              <div className="intro-x ">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  className="form-control"
                  placeholder=""
                  defaultValue={calls?.first_name ? calls?.first_name : ""}
                />
              </div>
              <div className="intro-x ">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  className="form-control"
                  defaultValue={calls?.last_name}
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
                  onChange={(e) => checkEmail(e)}
                  defaultValue={calls?.email}
                />

                {emailErr.length > 0 &&
                  emailErr.map((text, key) => {
                    return (
                      <small className="text-danger py-3 text-center" key={key}>
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
                  defaultValue={calls?.phone_number && calls?.phone_number}
                />
              </div>
              <div className="intro-x ">
                <label className="form-label">WhatsApp Number</label>
                <input
                  type="text"
                  name="whatsapp"
                  className=" form-control"
                  placeholder=""
                  defaultValue={calls?.whatsapp && calls?.whatsapp}
                />
              </div>

              <div className="intro-x ">
                <label className="form-label">Age</label>
                <input
                  type="text"
                  name="age"
                  className=" form-control"
                  placeholder=""
                  defaultValue={calls?.age && calls?.age}
                />
              </div>
              <div className="intro-x ">
                <label className="form-label">GPA</label>
                <input
                  type="text"
                  name="gpa"
                  className=" form-control"
                  placeholder=""
                  defaultValue={calls?.gpa && calls?.gpa}
                />
              </div>
              <div className="intro-x  bg-slate-100 p-3">
                <label className="form-label">Priority</label>

                <div className="grid  grid-cols-2  gap-2">
                  <input
                    type="text"
                    name="priority"
                    className=" form-control"
                    placeholder=""
                    defaultValue={calls?.priority}
                  />

                  <select
                    name="p_sort"
                    defaultValue={calls?.p_sort && calls?.p_sort}
                    className="form-control"
                  >
                    <option value="0">Select Sort ..</option>
                    {setting.priorities &&
                      setting.priorities.map((val, indx) => (
                        <option key={indx} value={val?.id}>
                          {val?.title}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div className="intro-x ">
                <label className="form-label">Education level </label>
                <select
                  name="degree"
                  defaultValue={calls?.degree && calls?.degree}
                  className="form-control"
                >
                  <option value="0">Select..</option>
                  {setting.applying_for &&
                    setting.applying_for.map((val, indx) => (
                      <option key={indx} value={val?.id}>
                        {val?.title}
                      </option>
                    ))}
                </select>
              </div>

              <div className="intro-x ">
                <label className="form-label">Field of Study </label>
                <input
                  name="field_study"
                  defaultValue={calls?.field_study && calls?.field_study}
                  className="form-control"
                  type="text"
                />
              </div>

              <div className="intro-x ">
                <label className="form-label">Referred by</label>
                <input
                  type="text"
                  name="referred_by"
                  className="form-control"
                  defaultValue={calls?.referred_by && calls?.referred_by}
                />
              </div>

              <div className="intro-x ">
                <label className="form-label"> Case Type</label>
                <select
                  className="form-control"
                  name="case_type"
                  defaultValue={calls?.case_type}
                >
                  <option value="0">Select..</option>

                  <option value="1">F-1</option>
                  <option value="2">F-1/F2</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
              <div className="intro-x ">
                <label className="form-label">Marital Status</label>

                <select
                  name="marital_status"
                  onChange={handelMargie}
                  className="form-control"
                  defaultValue={
                    calls?.marital_status ? calls?.marital_status.id : 0
                  }
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
                  defaultValue={calls?.want_to_study && calls?.want_to_study.id}
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

              {/* {logindata.role !== 3 &&  ( */}
              <div className="intro-x ">
                <label className="form-label">Assigned to</label>
                {userData.state == "hasValue" && (
                  <select
                    name="assigned_to"
                    defaultValue={calls?.assigned_to && calls?.assigned_to.id}
                    className="form-control"
                  >
                    {logindata.role !== 3 && (
                      <option value="3">Select...</option>
                    )}

                    {users.map((val, index) => (
                      <option value={val.id} key={index}>
                        {val.first_name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {suppose && (
              <SupposeSection data={filterExtra(calls.extra, "suppose")} />
            )}

            <div className="border border-dashed border-2 p-5 mt-5">
              <div className="grid grid-cols-1  gap-4">
                <div className="intro-y">
                  <label className="form-label">Memo</label>
                  <textarea
                    name="memo"
                    className=" form-control"
                    placeholder=""
                    defaultValue={calls?.memo && calls?.memo}
                  />
                </div>
              </div>
              {/* <div className="grid grid-cols-1 lg:grid-cols-2 mt-5  gap-4">
                <div className="intro-y">
                  <label className="form-label">Call Schedule Date</label>
                  <input
                    type="date"
                    name="call_schedule_date"
                    className=" form-control"
                    placeholder=""
                    defaultValue={
                      calls?.call_schedule_date && calls?.call_schedule_date
                    }
                  />
                </div>
                <div className="intro-y">
                  <label className="form-label">Call Schedule time</label>
                  <input
                    type="time"
                    name="call_schedule_time"
                    className=" form-control"
                    placeholder=""
                    defaultValue={
                      calls?.call_schedule_time && calls?.call_schedule_time
                    }
                  />
                </div>
              </div> */}

              <div className="intro-y bg-slate-100 pb-5">
                {callScheduleState &&
                  callScheduleState.length > 0 &&
                  callScheduleState.map((val, index) => (
                    <CallScheduleSection
                      key={index}
                      index={index}
                      deleteCallSchedule={deleteCallSchedule}
                      data={val}
                    />
                  ))}

                <div className="col-span-2 mt-5 flex  justify-center">
                  <a
                    className=" btn btn-elevated-primary"
                    onClick={addCallSchedule}
                  >
                    <Lucide icon="Plus" className="w-4 h-4" />
                  </a>
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
                    defaultValue={calls?.first_contact && calls?.first_contact}
                    className="form-control pl-12"
                  />
                </div>
              </div>
              <div className="intro-y  lg:col-span-2">
                {confirmGpaState &&
                  confirmGpaState.map((val, indx) => {
                    return (
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
                    );
                  })}

                <div className="col-span-2 mt-5 flex  justify-center">
                  <a onClick={addConGpa} className=" btn btn-elevated-primary">
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
                {radio == 1 && (
                  <input
                    id="immigration_filling"
                    type="text"
                    className="form-control mt-2 "
                    placeholder="Method Of Filling"
                    name="method_filling"
                    defaultValue={calls && calls.method_filling}
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
                  defaultValue={calls?.goal ? calls?.goal.id : 0}
                  name="goal"
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
                <label className="form-label"> English Test</label>
                <select
                  name="eng_test"
                  onChange={handelEngTest}
                  className="form-control"
                  defaultValue={calls?.eng_test && calls?.eng_test}
                >
                  <option value="0">None...</option>
                  <option value="1">TOEFL</option>
                  <option value="2">IELTS</option>
                  <option value="3">Duolingo</option>
                </select>
              </div>
              {score && (
                <div className="intro-y">
                  <label className="form-label">English Test Score</label>
                  <input
                    className="form-control"
                    type="text"
                    name="eng_test_score"
                    defaultValue={
                      calls?.eng_test_score && calls?.eng_test_score
                    }
                  />
                </div>
              )}
              <div className="intro-y">
                <label className="form-label">Nationality</label>
                <input
                  type="text"
                  name="nationality"
                  className=" form-control"
                  placeholder=""
                  defaultValue={calls?.nationality && calls?.nationality}
                />
              </div>
              <div>
                <label className="form-label">Package</label>

                <select
                  onChange={(e) => handelPackage(e)}
                  name="package"
                  className="form-control"
                  defaultValue={calls?.package && calls?.package.id}
                >
                  <option value="0">Select...</option>

                  {setting.packages &&
                    setting.packages.map((val, indx) => (
                      <option key={indx} value={val?.id}>
                        {val?.title}
                      </option>
                    ))}
                </select>
                <input
                  type="text"
                  id="package"
                  placeholder="Explain"
                  name="package_explain"
                  defaultValue={
                    calls?.package_explain && calls?.package_explain
                  }
                  className="form-control hidden mt-2"
                />
              </div>

              <div>
                <label className="form-label">Status</label>

                <select
                  name="status"
                  defaultValue={calls?.status && calls?.status}
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
                  name="f_results"
                  onChange={() => setFCallResult(true)}
                  className="form-control"
                  defaultValue={calls?.f_results ? calls?.f_results : 3}
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
              {/* {fCallResult && (
                <div className="intro-x lg:col-span-3">
                  <label className="form-label"> Notes</label>
                  <textarea
                    type="text"
                    name="first_call_notes"
                    className="form-control"
                    placeholder=""
                    defaultValue={
                      calls?.first_call_notes && calls?.first_call_notes
                    }
                  />
                </div>
              )} */}
            </div>
            <div className="border border-dashed border-2 p-2 lg:p-5 mt-5">
              <div className="grid grid-cols-1  gap-4">
                <div className="intro-y">
                  <label className="form-label">First Call Notes</label>
                  <textarea
                    name="first_call_notes"
                    defaultValue={
                      calls?.first_call_notes && calls?.first_call_notes
                    }
                    className=" form-control"
                    placeholder=""
                  />
                </div>
              </div>

              <div className="grid  grid-cols-1 lg:grid-cols-4 mt-5 gap-4">
                <div className="intro-y">
                  <label className="form-label"> Agreement Sent</label>
                  <select
                    name="ag"
                    defaultValue={calls?.ag}
                    className="form-control"
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
                    defaultValue={
                      calls?.agree_date_sent && calls?.agree_date_sent
                    }
                  />
                </div>

                {/* <div className="intro-y">
                  <label className="form-label">Follow Up Date</label>
                  <input
                    type="date"
                    name="follow_up_date"
                    defaultValue={
                      calls?.follow_up_date && calls?.follow_up_date
                    }
                    className="form-control"
                  />
                </div> */}

                {/* <div className="intro-y">
                  <label className="form-label"> Next Steps</label>
                  <input
                    type="text"
                    name="next_step"
                    className="form-control"
                    defaultValue={calls?.next_step && calls?.next_step}
                  />
                </div> */}
              </div>
            </div>

            <div className="border mt-5 p-2 lg:p-5  border-dashed border-2">
              <h3 className="text-xl font-medium mt-5">
                Follow Up and Next Steps
              </h3>
              <div className="bg-slate-100 mt-5 pb-5">
                {followUpState &&
                  followUpState.length > 0 &&
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

                <div className="col-span-2 mt-5 flex  border-t pt-5 justify-center">
                  <a onClick={addFollow} className=" btn btn-elevated-primary">
                    <Lucide icon="Plus" className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 p-2 lg:p-5  gap-4">
                <div className="intro-y">
                  <label className="form-label"> Agreed to Pay</label>
                  <select
                    name="agreed_to_pay"
                    className="form-control"
                    defaultValue={calls?.agreed_to_pay && calls?.agreed_to_pay}
                  >
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                  </select>
                </div>
                <div className="intro-y">
                  <label className="form-label"> Payment Method</label>
                  <select
                    className="form-control"
                    name="payment_method"
                    defaultValue={
                      calls?.payment_method && calls?.payment_method
                    }
                  >
                    <option value="0">Select ... </option>

                    {setting.payment_method &&
                      setting.payment_method.map((val, indx) => (
                        <option key={indx} value={val.id}>
                          {val?.title}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="intro-y">
                  <label className="form-label"> Agreement Signed</label>
                  <select
                    name="agreed_to_signed"
                    className="form-control"
                    defaultValue={
                      calls?.agreed_to_signed && calls?.agreed_to_signed
                    }
                  >
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                  </select>
                </div>
                <div className="intro-y">
                  <label className="form-label"> Agreement Signed Date</label>
                  <input
                    type="date"
                    name="agreement_signed_date"
                    className="form-control"
                    defaultValue={
                      calls?.agreement_signed_date &&
                      calls?.agreement_signed_date
                    }
                  />
                </div>
              </div>
            </div>

            <div className="border mt-5 p-2 lg:p-5 border-dashed border-2">
              <h3 className="text-xl font-medium mt-5">My Next Steps</h3>
              <div className="bg-slate-100 mt-5 pb-5">
                {myNextStepState &&
                  myNextStepState.length > 0 &&
                  myNextStepState.map(
                    (val, index) =>
                      val.groups == "my_step" && (
                        <MySection
                          index={index}
                          key={index}
                          setting={setting}
                          data={val}
                          deleteFollowUp={deleteMyStep}
                          onChange={onChangeMyStep}
                        />
                      )
                  )}

                <div className="col-span-2 mt-5 flex  border-t pt-5 justify-center">
                  <a onClick={addMyStep} className=" btn btn-elevated-primary">
                    <Lucide icon="Plus" className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            <div className="border border-dashed border-2  p-2 lg:p-5 mt-5">
              <div className="grid grid-cols-1  gap-4">
                <div className="intro-y">
                  <label className="form-label">Feedback</label>
                  <textarea
                    name="feedbacks"
                    className=" form-control"
                    placeholder=""
                  />
                </div>

                {calls.history &&
                  filterSingle(calls.history, "feedbacks").map(
                    (data, index) => {
                      var color = "bg-white ";

                      if (
                        data?.user?.is_admin === 1 &&
                        index === 0 &&
                        calls.feedbacks &&
                        calls.feedbacks !== ""
                      ) {
                        color = "bg-warning text-white";
                      }
                      if (
                        data?.user?.is_admin === 2 &&
                        index === 0 &&
                        calls.feedbacks &&
                        calls.feedbacks !== ""
                      ) {
                        color = "bg-info text-white";
                      }

                      if (
                        data?.user?.is_admin === 4 &&
                        index === 0 &&
                        calls.feedbacks &&
                        calls.feedbacks !== ""
                      ) {
                        color = "bg-amber-200 ";
                      }

                      return (
                        <div
                          key={index}
                          className={
                            color +
                            " relative  dark:bg-darkmode-400 shadow-sm border border-slate-200 rounded-md p-5 flex flex-col sm:flex-row items-start gap-y-3 "
                          }
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
                            <a
                              href=""
                              className="text-primary font-medium mr-3"
                            >
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

                          <div className="absolute right-5">
                            {index === 0 &&
                              calls.feedbacks &&
                              calls.feedbacks !== "" && (
                                <input
                                  onClick={() => markRead(calls.id)}
                                  type="checkbox"
                                />
                              )}
                          </div>
                        </div>
                      );
                    }
                  )}
              </div>
            </div>

            <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-5 gap-4 mt-5">
              <div className="intro-x ">
                <label className="form-label">Cancellation reason </label>
                <select
                  id="cancel_reason"
                  required
                  name="cancel_reason"
                  onChange={handelCancelReason}
                  className="form-control"
                  defaultValue={cancelReasonId}
                >
                  <option value="0">Select...</option>
                  {setting?.cancel_reason &&
                    setting?.cancel_reason.map((val, indx) => (
                      <option key={indx} value={val?.id}>
                        {val?.title}
                      </option>
                    ))}
                </select>
              </div>
              {cancelReason && (
                <div className="intro-y">
                  <label className="form-label"> Cancel Date</label>
                  <input
                    type="date"
                    name="cancel_date"
                    className="form-control"
                    defaultValue={cancelReasonDate}
                  />
                </div>
              )}
              {cancelReason && (
                <div className="intro-y lg:col-span-3">
                  <label className="form-label">Notes</label>
                  <textarea
                    name="cancel_note"
                    className=" form-control"
                    placeholder=""
                    defaultValue={cancelReasonNote}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="intro-y col-span-12 flex items-center justify-center  mt-5">
            <button
              type="submit"
              onClick={() => setRedirect(false)}
              className="btn btn-elevated-success  text-white w-36"
            >
              Save and continue
              {loading2 && (
                <LoadingIcon
                  icon="three-dots"
                  color="white"
                  className="w-4 h-4 ml-2"
                />
              )}
            </button>
            <button
              type="submit"
              className="btn btn-elevated-primary w-36 ml-5"
              onClick={() => setRedirect(true)}
            >
              Save and exit
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
  ) : (
    <h3>You are Not allowed To edit this record !</h3>
  );
};

export default EditCallCon;
