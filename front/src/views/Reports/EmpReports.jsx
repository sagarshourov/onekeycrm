import {
  Accordion,
  AccordionGroup,
  AccordionItem,
  AccordionPanel,
  Alert, LoadingIcon,
  Lucide,
  Modal,
  ModalBody
} from "@/base-components";
import { helper } from "@/utils/helper";
import classnames from "classnames";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  useRecoilStateLoadable,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import { allUserListState } from "../../state/admin-atom";
import { loginState } from "../../state/login-atom";
import {
  aCancel,
  aResult,
  empReportSelect,
  pEndDate,
  pLimit,
  pOffset,
  pStartDate,
  pType
} from "../../state/report-atom";
import Table from "./Table";

import axios from "axios";
import { filter } from "lodash";
import { adminApi } from "../../configuration";
import { settingState } from "../../state/setting-atom";
import MultiPicker from "./MultiPicker";
import SinglePicker from "./SinglePicker";

//console.log("report", Date.parse("2022-12-21 10:31:12"));

function findEmp(array, user_id) {
  var state = false;

  array !== null &&
    array.map((val, key) => {
      if (val.value === user_id) state = true;
    });

  return state;
}

function filterSection(array, sec) {
  return filter(array, (_items) => _items?.results === sec);
}

const options = (datas) => {
  let data = [];
  datas.map((val, index) => {
    // console.log('val',val);
    data.push({ value: val.id, label: val.first_name + " " + val.last_name });
  });

  return data;
};

const EmpReports = (props) => {
  // let { id } = useParams();
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);

  const [callData, setCallState] = useRecoilStateLoadable(empReportSelect);
  const [usersData, setUserState] = useRecoilStateLoadable(allUserListState);

  //atoms

  const sStartDate = useSetRecoilState(pStartDate);

  const sEndDate = useSetRecoilState(pEndDate);

  const setAtomResult = useSetRecoilState(aResult);
  const setAtomCancel = useSetRecoilState(aCancel);

  const setType = useSetRecoilState(pType);
  const setPageLimit = useSetRecoilState(pLimit);

  const setPageOffset = useSetRecoilState(pOffset);

  const setting = useRecoilValue(settingState);

  const logindata = useRecoilValue(loginState);

  const [rowCount, setRowCount] = useState(10);

  const [aheck, setAcheck] = useState(false);
  const [call_id, setCallId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [allCheck, setAllCheck] = useState([]);
  const [daterange, setDaterange] = useState("");

  const [result, setResult] = useState(0);
  const [cancel, setCancel] = useState(0);

  const [status, setStatus] = useState(0);
  const [callSwitch, setCallSwitch] = useState(false);
  const [offset, setOffset] = useState(false);
  const [dateMode, setDateMode] = useState(false);

  const [empName, setEmpName] = useState("");
  const [emp, setEmp] = useState(null);

  useEffect(() => {
    var warper = dom(".wrapper")[0];
    const onScroll = () => setOffset(window.pageYOffset);
    // // clean up code
    // window.removeEventListener("scroll", onScroll);
    warper.addEventListener(
      "scroll",
      function () {
        if (warper.scrollTop > 150) {
          setOffset(true);
        } else {
          setOffset(false);
        }
      },
      { passive: true }
    );

    return () => {
      sStartDate("2022-01-01");
      sEndDate("2028-01-01");
      setAtomResult(0);
      setAtomCancel(0);
      setType(0);
      setPageLimit(200);

      warper.removeEventListener("scroll", onScroll);
    };
  }, []);

  const headers = {
    Authorization: `Bearer ${logindata?.token}`,
    ContentType: "application/json",
  };

  const updateFunc = async (id, name, value) => {
    const URL = adminApi() + "calls/" + id;
    setLoading(true);

    try {
      const response = await axios.put(
        URL,
        { name: name, value: value },
        {
          headers,
        }
      );
      // console.log(response);
      if (response?.data?.success) {
        setLoading(false);
        setCallState(response?.data?.data);
      }
    } catch (err) {
      setLoading(false);
    }
  };

  const handelPageCount = (e) => {
    setRowCount(parseInt(e.target.value));
  };

  // const handelLoad = () => {
  //   let count = rowCount + 20;

  //   setRowCount(count);
  //  // setPageLimit(count);

  //   setPageOffset(rowCount);
  // };

  const handelLoad = (rowCount) => {
    //let count = rowCount + 20;

    setRowCount(rowCount);

    setPageOffset(rowCount);
  };

  const handelRange = (date) => {


    setDaterange(date);

    if (dateMode) {
      sStartDate(helper.formatDate(date, "YYYY-MM-DD"));
      sEndDate(helper.formatDate(date, "YYYY-MM-DD"));

      //setStartDate(Date.parse(date));

      // setEndDate(endDate);
    } else {
      var spilt = date.split("-");

      var startDate = Date.parse(spilt[0]);

      var endDate = Date.parse(spilt[1]);

      sStartDate(helper.formatDate(startDate, "YYYY-MM-DD"));
      sEndDate(helper.formatDate(endDate, "YYYY-MM-DD"));

      // setStartDate(startDate);

      // setEndDate(endDate);
    }

    //  console.log("change date");
  };

  const deleteAdmin = async () => {
    setLoading(true);
    const URL = adminApi() + "calls/" + call_id;

    try {
      const response = await axios.delete(URL, {
        headers,
        data: allCheck,
      });

      if (response?.data?.success) {
        setCallState(response?.data?.data);
        setDeleteConfirmationModal(false);
        setLoading(false);
      } else {
        alert("Something is wrong please try again later!");
      }
    } catch (err) {
      setLoading(false);
    }
  };

  const handelStatus = (e) => {
    var val = parseInt(e.target.value);
    setStatus(val);
    setType(val);
  };

  const handelResult = (e) => {
    var val = parseInt(e.target.value);
    setResult(val);
    setAtomResult(val);
    if (val !== 1) {
      setAtomCancel(0);
      setCancel(0);
    }

 
  };

  const handelCancel = (e) => {
   
    setCancel(e.target.value);
    setAtomCancel(e.target.value);

    setResult(1);
    setAtomResult(1);
  };

  const CallSwitch = () => {
    setCallSwitch(() => !callSwitch);
    setDateMode(true);
    if (callSwitch) {
      setDateMode(false);
    } else {
      setDateMode(true);
    }
  };

  return (
    <>
      <h2 className="intro-y text-lg font-medium mt-10 ">
        {" "}
        Generate{" "}
        {status == 1
          ? "Hot "
          : status == 2
          ? "Warm "
          : status == 3
          ? "Cold "
          : status == 10
          ? "Agreement sent "
          : status == 11
          ? "Agreement Signed "
          : status == 12
          ? "First Call"
          : status == 13
          ? "Follow Up "
          : status == 14
          ? "Cancel "
          : ""}{" "}
        Report{" "}
      </h2>
      <div className=" mt-5">
        <div className="intro-y flex flex-row mt-2">
          <div className="basis-full lg:basis-7/12 grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div
              onClick={CallSwitch}
              className="dark-mode-switcher cursor-pointer shadow-md box border rounded-full w-auto  h-10 flex items-center justify-center z-50 "
            >
              <div className="mr-4 text-slate-600 dark:text-slate-200">
                Single Date
              </div>
              <div
                className={classnames({
                  "dark-mode-switcher__toggle border": true,
                  "dark-mode-switcher__toggle--active": callSwitch,
                })}
              ></div>
            </div>
            <div>
              {dateMode ? (
                <SinglePicker
                  daterange={daterange}
                  handelRange={handelRange}
                  dateMode={dateMode}
                />
              ) : (
                <MultiPicker
                  daterange={daterange}
                  handelRange={handelRange}
                  dateMode={dateMode}
                />
              )}
            </div>
            <div>
              <select
                className="form-control"
                onChange={(e) => handelStatus(e)}
              >
                <option>Select Report Type..</option>
                <option value="10">Agreement sent</option> {/*fake value */}
                <option value="11">Agreement Signed</option> {/*fake value */}
                <option value="1">Hot Report</option>
                <option value="2">Warm Report</option>
              </select>
            </div>

            <div>
              <select
                className="form-control"
                onChange={(e) => handelResult(e)}
                value={result}
              >
                <option value="0">Select Result ..</option>
                <option value="3">Open Call</option>
                <option value="1">Cancel List</option>
                <option value="2">Client List</option>
              </select>
            </div>

           
            <div>
              <select
                required
                name="cancel_reason"
                onChange={(e) => handelCancel(e)}
                className="form-control"
                value={cancel}
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

          <div className="basis-full lg:basis-5/12 flex flex-row-reverse pl-10">
            <div>
              <select
                onChange={handelPageCount.bind(this)}
                className="w-20 form-select box mt-3 sm:mt-0 mx-5"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="35">35</option>
                <option value="50">50</option>
              </select>
            </div>
          </div>
        </div>
        {/* BEGIN: Data List */}
        <div
          className={offset ? "fixed w-full top-0 bg-white p-5 z-50 box " : ""}
        >
          <div className="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2">
            <div className="basis-full lg:basis-4/12 ">
              {allCheck.length > 0 && (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 content-end">
                  <button
                    onClick={() => setDeleteConfirmationModal(true)}
                    className="btn btn-elevated-danger"
                  >
                    Delete
                  </button>

                  <Link
                    className="btn btn-elevated-primary shadow-md mr-2 py-2"
                    to={"/calls/edit/" + allCheck[0]}
                  >
                    Edit Call
                  </Link>
                </div>
              )}
            </div>

            <div className="basis-full lg:basis-3/12  grid  grid-cols-1 lg:grid-cols-1 gap-3">
              {callData.contents.length > 0 && (
                <Alert className="alert-dark mb-2 w-auto my-5">
                  <div className="flex items-center">
                    <div className="font-medium text-lg">
                      {status == 1
                        ? "Hot"
                        : status == 2
                        ? "Warm"
                        : status == 3
                        ? "Cold"
                        : status == 10
                        ? "Agreement sent"
                        : status == 11
                        ? "Agreement Signed"
                        : status == 12
                        ? "First Call"
                        : status == 13
                        ? "Follow Up "
                        : status == 14
                        ? "Cancel "
                        : ""}{" "}
                      Report ({daterange})
                    </div>
                  </div>
                  <div className="mt-3 text-center">{empName}</div>
                </Alert>
              )}
            </div>
            <div className="lg:basis-4/12 basis-full   grid  grid-cols-1 lg:grid-cols-6 gap-3"></div>
          </div>
        </div>

        <div className="intro-y col-span-12 overflow-auto relative">
          {callData.state === "loading" && (
            <div className="h-full w-full bg-gray-50/75 grid  absolute z-[100]">
              <div className="w-24 h-24 place-self-center">
                <LoadingIcon
                  icon="three-dots"
                  color="gray"
                  className="w-4 h-4 ml-2"
                />
              </div>
            </div>
          )}

          {callData.state === "hasValue" && callData.contents.length > 0 ? (
            <>
              {loading && (
                <div className="h-full w-full bg-gray-50/75 grid  absolute z-[100]">
                  <div className="w-24 h-24 place-self-center">
                    <LoadingIcon
                      icon="three-dots"
                      color="gray"
                      className="w-4 h-4 ml-2"
                    />
                  </div>
                </div>
              )}

              <AccordionGroup className="accordion-boxed mt-5">
                <AccordionItem className="box">
                  <Accordion>
                    {result === 1
                      ? "Cancel "
                      : result === 2
                      ? "Client "
                      : result === 3
                      ? "Open "
                      : ""}
                    Calls
                  </Accordion>
                  <AccordionPanel className="text-slate-600 dark:text-slate-500 leading-relaxed">
                    <Table
                      setDeleteConfirmationModal={setDeleteConfirmationModal}
                      users={callData.contents}
                      setUserId={setCallId}
                      setCallState={setCallState}
                      allCheck={allCheck}
                      setAllCheck={setAllCheck}
                      updateFunc={updateFunc}
                      aheck={aheck}
                      setAcheck={setAcheck}
                      emp={usersData}
                    />
                  </AccordionPanel>
                </AccordionItem>
              </AccordionGroup>
            </>
          ) : (
            <div className="flex justify-center ">
              <Alert className="alert-secondary mb-2 w-96 my-5">
                <div className="flex items-center">
                  <div className="font-medium text-lg">Generate New Report</div>
                </div>
                <div className="mt-3">
                  To Generate new report please select all of the options.
                </div>
              </Alert>
            </div>
          )}
        </div>
        {/* END: Data List */}
        {/* BEGIN: Pagination */}
        

        {callData.state === "hasValue" && (
          <div className="intro-y  mt-5 col-span-12 flex flex-wrap sm:flex-row sm:flex-nowrap items-center">
            <button
              onClick={() => handelLoad(rowCount - 20)}
              className="btn"
              disabled={rowCount < 21 ? true : false}
            >
              Prev
            </button>
            <button
              onClick={() => handelLoad(rowCount + 20)}
              className="btn ml-5"
            >
              Next
            </button>
          </div>
        )}

        {/* END: Pagination */}
      </div>
      {/* BEGIN: Delete Confirmation Modal */}
      <Modal
        show={deleteConfirmationModal}
        onHidden={() => {
          setDeleteConfirmationModal(false);
        }}
      >
        <ModalBody className="p-0">
          <div className="p-5 text-center">
            <Lucide
              icon="XCircle"
              className="w-16 h-16 text-danger mx-auto mt-3"
            />
            <div className="text-3xl mt-5">Are you sure?</div>
            <div className="text-slate-500 mt-2">
              Do you really want to delete these records? <br />
              This process cannot be undone.
            </div>
          </div>
          <div className="px-5 pb-8 text-center">
            <button
              type="button"
              onClick={() => {
                setDeleteConfirmationModal(false);
              }}
              className="btn btn-outline-secondary w-24 mr-1"
            >
              Cancel
            </button>
            <button
              onClick={deleteAdmin}
              type="button"
              className="btn btn-danger w-24"
            >
              Delete
              {loading && (
                <LoadingIcon
                  icon="three-dots"
                  color="white"
                  className="w-4 h-4 ml-2"
                />
              )}
            </button>
          </div>
        </ModalBody>
      </Modal>
      {/* END: Delete Confirmation Modal */}
    </>
  );
};

export default EmpReports;
