import { Lucide, LoadingIcon, Litepicker } from "@/base-components";

import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

import { useRecoilState, useRecoilValue } from "recoil";
import { callListState } from "../../state/admin-atom";

import { helper } from "@/utils/helper";
import axios from "axios";
import { adminApi } from "../../configuration";

import { filter } from "lodash";
import { settingState } from "../../state/setting-atom";
const token = localStorage.getItem("token");

const headers = {
  Authorization: `Bearer ${token}`,
  ContentType: "application/json",
};

function getSingleCalls(array, id) {
  return filter(array, (item) => item.id === id);
}

const AddCalls = (props) => {
  let { id } = useParams();

  let navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [callData, setCallState] = useRecoilState(callListState);
  const [err, setErr] = useState([]);

  const [wizard, setWizard] = useState(1);
  const numPage = 2;
  const [first, setFirst] = useState(false);
  const [last, setLast] = useState(false);
  const [emailErr, setEmailErr] = useState([]);
  const setting = useRecoilValue(settingState);
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

  let call = [];
  if (id) {
    call = getSingleCalls(callData, parseInt(id));
  } else {
    call = [];
    //console.log("cal no");
  }
  const [followUp, setfollowUp] = useState(
    call[0].follow_up_date ? call[0].follow_up_date : ""
  );

  // const [lastContact, setLastContact] = useState(
  //   call[0].last_contact ? call[0].last_contact : ""
  // );

  //const [firstContact, setFirstContact] = useState("");

  //const [followdate, setFollowDate] = useState("");

  const [followdate, setFollowDate] = useState(
    call[0].follow_up_date ? call[0].follow_up_date : ""
  );

  const [firstContact, setFirstContact] = useState(
    call[0].first_contact ? call[0].first_contact : ""
  );

  const [lastStatus, setLastStatus] = useState(
    call[0].last_status_date ? call[0].last_status_date : ""
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    var data = new FormData(e.target);

    const URL = adminApi() + "calls";

    setLoading(true);

    data.append("follow_up_date", helper.formatDate(followdate, "YYYY-MM-DD"));
    data.append("first_contact", helper.formatDate(firstContact, "YYYY-MM-DD"));

    try {
      const response = await axios.post(URL, data, {
        headers,
      });
     // console.log(response);
      if (response?.data?.success) {
        setLoading(false);
        setCallState(response?.data?.data);
        navigate("../calls/all", { replace: true });
      }
    } catch (err) {
      setLoading(false);
    }
  };
  const checkEmail = async (e) => {
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(e.target.value)) {
      //console.log("Invalid Email");
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
  return (
    <>
      <div className="intro-y mt-10 flex justify-between items-center mt-2">
        <span className="intro-y text-lg font-medium  ">Edit Calls</span>

        {/* <Link
          className="btn btn-elevated-primary shadow-md mr-2 py-2"
          to="/calls/add"
        >
          Add New Call
        </Link> */}
      </div>

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
                  required
                  defaultValue={call[0]?.email}
                  onChange={(e) => checkEmail(e)}
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
                  defaultValue={call[0]?.phone_number}
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
                  className="form-control"
                  defaultValue={call[0]?.priority?.id}
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
                  className=" form-control"
                  placeholder=""
                  defaultValue={call[0]?.referred_by}
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
                    defaultValue={call[0]?.memo}
                  />
                </div>
              </div>
            </div>
          </div>

          {/*Section 1*/}

          <div className="intro-y box p-5 mt-5">
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

                <select
                  name="results"
                  className="form-control"
                  defaultValue={call[0]?.results?.id}
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

              <div>
                <label className="form-label">Package</label>

                <select
                  name="package"
                  className="form-control"
                  defaultValue={call[0]?.package?.id}
                >
                  <option value="0">Select...</option>
                  {setting.packages &&
                    setting.packages.map((val, indx) => (
                      <option key={indx} value={val?.id}>
                        {val?.title}
                      </option>
                    ))}

                  
              
                </select>
              </div>
              <div>
                <label className="form-label">Status</label>

                <select
                  name="status"
                  className="form-control"
                  defaultValue={call[0]?.status?.id}
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

                <select
                  name="f_results"
                  className="form-control"
                  defaultValue={call[0]?.follow_up_call_results?.id}
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

              <div className="intro-x ">
                <label className="form-label">Cancellation reason </label>

                <select
                  name="cancel_reason"
                  className="form-control"
                  defaultValue={call[0]?.cancel_reason?.id}
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
    </>
  );
};

export default AddCalls;
