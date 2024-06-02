import {
  Lucide,
  Modal,
  ModalBody,
  LoadingIcon,
  Litepicker,
} from "@/base-components";

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";

import { callListState, notiState } from "../../state/admin-atom";

import axios from "axios";
import { adminApi } from "../../configuration";
import { helper } from "@/utils/helper";
import { loginState } from "../../state/login-atom";

const AddCalls = (props) => {
  let { id } = useParams();
  let navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [callData, setCallState] = useRecoilState(callListState);

  const [notiData, setNotiState] = useRecoilState(notiState);
  const logindata = useRecoilValue(loginState);

  const [firstContact, setFirstContact] = useState("");

  const [followdate, setFollowDate] = useState("");

  const [validationModal, setValidationModal] = useState(false);

  const [err, setErr] = useState([]);

  const [call, setCall] = useState([]);

  const [show, setShow] = useState(false);
  const [wizard, setWizard] = useState(1);
  const numPage = 2;
  const [first, setFirst] = useState(false);
  const [last, setLast] = useState(false);

  const headers = {
    Authorization: `Bearer ${logindata?.token}`,
    ContentType: "application/json",
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    var data = new FormData(e.target);

    if (numPage !== wizard) {
      return false;
    }

    data.append("follow_up_date", helper.formatDate(followdate, "YYYY-MM-DD"));
    data.append("first_contact", helper.formatDate(firstContact, "YYYY-MM-DD"));

    // data.append("last_status_date", lastStatus);

    data.append("user_id", logindata?.userId);

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
        //console.log("Err", err?.response?.data?.message.email[0]);

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

  const SetWizzard = (next) => {
    var wiz = wizard;

    if (next) {
      wiz = wizard + 1;
    } else {
      wiz = wizard - 1;
    }

    setWizard(wiz);

    if (numPage === wiz) {
      // last page
      setLast(true);
      setFirst(true);
    } else if (wiz == 1) {
      // first page
      setFirst(false);
      setLast(false);
    }
  };

  const wizzClass = (num) => {
    var cla = "intro-y w-10 h-10 rounded-full btn  mx-2 ";
    //console.log("wiCla" + num, wizard);
    if (num !== wizard) {
      cla +=
        "bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400 text-slate-500";
    } else {
      cla += "btn-primary";
    }

    return cla;
  };

  return (
    <>
      <h2 className="intro-y text-lg font-medium mt-10 ">Add Calls</h2>

      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="intro-y box py-10 sm:py-20 mt-5">
          <div className="flex justify-center">
            <button type="button" className={wizzClass(1)}>
              1
            </button>
            <button type="button" className={wizzClass(2)}>
              2
            </button>
          </div>
          <div className="px-5 mt-10">
            {/* <div className="text-slate-500 text-center mt-2 hidden">
              To start off, please enter your username, email address and
              password.
              
            </div> */}

            {Object.keys(err).length > 0 &&
              Object.values(err).map((text, key) => {
                return (
                  <h3 className="text-danger py-3 text-center" key={key}>
                    {text}
                  </h3>
                );
              })}
          </div>
          <div className="px-2 sm:px-20 mt-5 pt-10 border-t border-slate-200/60 dark:border-darkmode-400">
            <div className={wizard !== 1 ? "hidden" : ""}>
              <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
                <div className="intro-x ">
                  <label className="form-label">First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    className=" form-control"
                    placeholder=""
                    defaultValue=""
                  />
                </div>
                <div className="intro-x ">
                  <label className="form-label">Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    className=" form-control"
                    placeholder=""
                    defaultValue=""
                  />
                </div>
                <div className="intro-x ">
                  <label className="form-label">Email</label>
                  <input
                    type="text"
                    name="email"
                    className=" form-control"
                    placeholder=""
                    defaultValue=""
                  />
                </div>
                <div className="intro-x ">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    name="phone_number"
                    className=" form-control"
                    placeholder=""
                    defaultValue=""
                  />
                </div>
                <div className="intro-x ">
                  <label className="form-label">Age</label>
                  <input
                    type="text"
                    name="age"
                    className=" form-control"
                    placeholder=""
                    defaultValue=""
                  />
                </div>
                <div className="intro-x ">
                  <label className="form-label">GPA</label>
                  <input
                    type="text"
                    name="gpa"
                    className=" form-control"
                    placeholder=""
                    defaultValue=""
                  />
                </div>
                <div className="intro-x ">
                  <label className="form-label">Priority</label>
                  <select name="priority" className="form-control">
                    <option value="0">Select..</option>
                    <option value="1">Regular</option>
                    <option value="2">ASAP</option>
                  </select>
                </div>
                <div className="intro-x ">
                  <label className="form-label">Referred by</label>
                  <input
                    type="text"
                    name="referred_by"
                    className=" form-control"
                    placeholder=""
                    defaultValue=""
                  />
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
                      defaultValue=""
                    />
                  </div>
                </div>
              </div>
            </div>

            {/*Section 1*/}

            <div className={wizard !== 2 ? "hidden" : ""}>
              <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
                <div className="intro-x ">
                  <label className="form-label">First Contact Date</label>

                  <div className="relative w-full">
                    <div className="absolute rounded-l w-10 h-full flex items-center justify-center bg-slate-100 border text-slate-500 dark:bg-darkmode-700 dark:border-darkmode-800 dark:text-slate-400">
                      <Lucide icon="Calendar" className="w-4 h-4" />
                    </div>
                    <Litepicker
                      value={firstContact}
                      onChange={setFirstContact}
                      options={{
                        format: "MM/DD/YYYY",
                        autoApply: false,
                        showWeekNumbers: true,
                        dropdowns: {
                          minYear: 1990,
                          maxYear: 2030,
                          months: true,
                          years: true,
                        },
                      }}
                      className="form-control pl-12"
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">First Call Result</label>

                  <select name="results" className="form-control">
                    <option value="3">Open</option>
                    <option value="4">No Answer</option>
                    <option value="1">Cancel </option>
                    <option value="2">Client</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Package</label>

                  <select name="package" className="form-control">
                    <option value="1">Platinum </option>
                    <option value="2">Gold</option>
                    <option value="3">Silver</option>
                    <option value="4">Bronze</option>
                    <option value="5">Other</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Status</label>

                  <select name="status" className="form-control">
                    <option value="1">Hot </option>
                    <option value="2">Warm</option>
                    <option value="3">Cold</option>
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
                      defaultValue=""
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
                <div className="intro-x ">
                  <label className="form-label">Follow Up Date Set</label>

                  <div className="relative w-full">
                    <div className="absolute rounded-l w-10 h-full flex items-center justify-center bg-slate-100 border text-slate-500 dark:bg-darkmode-700 dark:border-darkmode-800 dark:text-slate-400">
                      <Lucide icon="Calendar" className="w-4 h-4" />
                    </div>
                    <Litepicker
                      value={followdate}
                      onChange={setFollowDate}
                      options={{
                        format: "MM/DD/YYYY",
                        autoApply: false,
                        showWeekNumbers: true,
                        dropdowns: {
                          minYear: 1990,
                          maxYear: 2030,
                          months: true,
                          years: true,
                        },
                      }}
                      className="form-control pl-12"
                    />
                  </div>
                </div>

                <div className="intro-x ">
                  <label className="form-label">Follow Up Call Results</label>

                  <select name="f_results" className="form-control">
                    <option value="3">Open</option>
                    <option value="4">No Answer</option>
                    <option value="1">Cancel </option>
                    <option value="2">Client</option>
                  </select>
                </div>

                <div className="intro-x ">
                  <label className="form-label">Cancellation reason </label>

                  <select name="cancel_reason" className="form-control">
                    <option value="1">Financial Not qualified </option>
                    <option value="4">GPA not qualified</option>
                    <option value="3">Financial Problems now</option>
                    <option value="2">Family related</option>
                    <option value="5">Trust Issues</option>
                    <option value="7">No Installment Reasons</option>
                    <option value="8">Bank Letter Issue</option>
                    <option value="9">Military not qualified</option>
                    <option value="6">No answer</option>
                  </select>
                </div>
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
                      defaultValue=""
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="intro-y col-span-12 flex items-center justify-center sm:justify-end mt-5">
              {first && (
                <a
                  type="button"
                  className="btn btn-secondary w-24"
                  onClick={() => SetWizzard(false)}
                >
                  Previous
                </a>
              )}
              {!last ? (
                <a
                  type="button"
                  onClick={() => SetWizzard(true)}
                  className="btn btn-primary w-24 ml-2"
                >
                  Next
                </a>
              ) : (
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
              )}
            </div>
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
  );
};

export default AddCalls;
