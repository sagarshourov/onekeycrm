import {
  Litepicker,
  LoadingIcon,
  Lucide,
  Modal,
  ModalBody,
} from "@/base-components";
import { useState } from "react";
import Select from "react-tailwindcss-select";

import {
  useRecoilStateLoadable,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import {
  allUserListState,
  reportCount,
  reportListState,
  reportUser,
} from "../../state/admin-atom";

import { loginState } from "../../state/login-atom";

import CustomTable from "./CustomTable";

import axios from "axios";
import { adminApi } from "../../configuration";

import { filter } from "lodash";

//console.log("report", Date.parse("2022-12-21 10:31:12"));

function applySortFilters(array, min, max, user_id) {
  return filter(array, (_items) => {
    return (
      _items.user_id === user_id &&
      Date.parse(_items.created_at) >= min &&
      Date.parse(_items.created_at) <= max
    );
  });
}

const r_fields = [
  "id",
  "ag",
  "created_at",
  "updated_at",
  "deleted_at",
  "user",
  "f_results",
  "section",
  "sections",
  "extra",
  "user_id",
  "last_contact",
  "last_status_date",
  "note",
  "history",
];

const CustomMain = (props) => {
  // let { id } = useParams();
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);

  const [callData, setCallState] = useRecoilStateLoadable(reportListState);

  const setReportCount = useSetRecoilState(reportCount);
  const setReportUser = useSetRecoilState(reportUser);

  const [dateRange, setDateRange] = useState("");

  const [usersData, setUserState] = useRecoilStateLoadable(allUserListState);
  const loginData = useRecoilValue(loginState);
  const [rowCount, setRowCount] = useState(10);

  const [aheck, setAcheck] = useState(false);
  const [call_id, setCallId] = useState(0);
  const [loading, setLoading] = useState(false);

  const [allCheck, setAllCheck] = useState([]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [user_id, selectUser] = useState(0);

  const [cols, setCol] = useState(null);

  const handleChange = (value) => {
   // console.log("col", value);
    setCol(value);
  };

  const headers = {
    Authorization: `Bearer ${loginData?.token}`,
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
      console.log(response);
      if (response?.data?.success) {
        setLoading(false);
        setCallState(response?.data?.data);
      }
    } catch (err) {
      setLoading(false);
    }
  };

  const handelLoad = (rowCount) => {
    //let count = rowCount + 20;

    setRowCount(rowCount);

    setReportCount(rowCount);
  };

  const handelRange = (date) => {
    setDateRange(date);
    var spilt = date.split("-");
    setStartDate(Date.parse(spilt[0]));
    setEndDate(Date.parse(spilt[1]));
  };
  const handelUserSelect = (e) => {
    selectUser(e.target.value);

    setReportUser(e.target.value);

    // setEmpName(e.target.selectedOptions[0].text);
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

  let filterData = applySortFilters(
    callData.contents,
    startDate,
    endDate,
    parseInt(user_id)
  );

  const options = () => {
    // No, Client, Call Schedule Date, Case Type, Age, First Call Date, First Call Note, Package, Agreement Sent, Agreement Signed, Status, Next Step Date, Next Step Note,

    //Follow Up Date, Follow Up Note,Cancel Reason, Cancel Date,

    let data = [
      // {value : 'id' , label : 'ID'},
      { value: "first_name", label: "First Name" },
      { value: "last_name", label: "Last Name" },
      { value: "email", label: "E-mail" },
      { value: "call_schedule_date", label: "Call Schedule Date" },
      { value: "case_type", label: "Case Type" },
      { value: "age", label: "Age" },
      { value: "first_contact", label: "First Call Date" },
      { value: "first_call_notes", label: "First Call Note" },
      { value: "package", label: "Package" },
      { value: "ag", label: "Agreement Sent" },
      { value: "agreed_to_signed", label: "Agreement Signed" },
      { value: "statu", label: "Status" },

      { value: "next_step_date", label: "Next Step Date" },
      { value: "follow_up_date", label: "Follow Up Date" },
      { value: "follow_up_note", label: "Follow Up Note" },

      { value: "cancel_reason", label: "Cancel Reason" },
      { value: "cancel_date", label: "Cancel Date" },
      { value: "assigned_to", label: "Assigned To" },
    ];

    return data;
  };

  // const options = () => {
  //   let data = [];

  //   callData.contents[0] &&
  //     Object.keys(callData.contents[0]).map((val, index) => {
  //       // console.log('val',val);

  //       if (r_fields.includes(val)) {
  //       } else {
  //         data.push({ value: val, label: val.replaceAll("_", " ") });
  //       }
  //     });

  //   return data;
  // };

  // };

  return (
    <>
      <h2 className="intro-y text-lg font-medium mt-10 ">
        Generate Custom Report
      </h2>
      <div className="intro-x  mt-5">
        <div className="flex p-5  box">
          <div className="flex-3 pl-2 pr-3">
            <Litepicker
              value={dateRange}
              onChange={handelRange}
              options={{
                // format: "YYYY-MM-DD",
                autoApply: false,
                singleMode: false,
                numberOfColumns: 2,
                numberOfMonths: 2,
                showWeekNumbers: true,
                dropdowns: {
                  minYear: 1990,
                  maxYear: 2030,
                  months: true,
                  years: true,
                },
              }}
              className="form-control  block mx-auto"
            />
          </div>
          <div className="flex-3 pl-2 pr-2">
            <select
              className="form-control"
              onChange={(e) => handelUserSelect(e)}
            >
              <option>Select Employee..</option>

              {usersData.state == "hasValue" &&
                usersData.contents.map((user, index) => {
                  return (
                    <option key={index} value={user.id}>
                      {user?.first_name + " " + user?.last_name} ({user?.email})
                    </option>
                  );
                })}
            </select>
          </div>

          <div className="flex-2 pl-3">
            {callData.state == "hasValue" && (
              <Select
                primaryColor={"indigo"}
                value={cols}
                onChange={handleChange}
                options={options()}
                isMultiple={true}
                classNames={{
                  menu: "absolute z-50 w-48 bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700",
                  tagItem: ({ isDisabled }) =>
                    " bg-gray-200 rounded m-1 p-1 flex  ",
                  menuButton: ({ isDisabled }) =>
                    `flex  text-sm text-gray-500 border border-gray-300 rounded shadow-sm transition-all duration-300 focus:outline-none ${
                      isDisabled
                        ? "bg-gray-200"
                        : "bg-white hover:border-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-500/20"
                    }`,
                }}
              />
            )}
          </div>
        </div>

        <div className="intro-y col-span-12 overflow-auto relative">
          {callData.state === "hasValue" && filterData.length > 0 ? (
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
              <CustomTable
                rowCount={20}
                setDeleteConfirmationModal={setDeleteConfirmationModal}
                users={filterData}
                setUserId={setCallId}
                setCallState={setCallState}
                allCheck={allCheck}
                setAllCheck={setAllCheck}
                updateFunc={updateFunc}
                aheck={aheck}
                setAcheck={setAcheck}
                cols={cols}
                emp={usersData}
              />
            </>
          ) : (
            <></>
          )}
        </div>
        {/* END: Data List */}
        {/* BEGIN: Pagination */}
        {filterData.length > 0 && (
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

export default CustomMain;
