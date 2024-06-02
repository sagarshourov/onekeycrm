import {
  Lucide,
  Modal,
  LoadingIcon,
  ModalBody,
  Alert,
} from "@/base-components";

import { useState } from "react";

import { useRecoilStateLoadable, useRecoilValue } from "recoil";
import { callListState, allUserListState } from "../../state/admin-atom";

import { loginState } from "../../state/login-atom";

import Table from "./Table";

import axios from "axios";
import { adminApi } from "../../configuration";

import { filter } from "lodash";

//console.log("report", Date.parse("2022-12-21 10:31:12"));

// function applySortFilters(array, searchValue, status, min, max, user_id) {
//   return filter(array, (_items) => {
//     return (
//       _items.status &&
//       _items.status.id === status &&
//       _items.user_id === user_id &&
//       Date.parse(_items.created_at) >= min &&
//       Date.parse(_items.created_at) <= max
//     );
//   });
// }

function applyFilters(array, field, compere, search) {
  // console.log("field", field);

  return filter(array, (_items) => {
    //console.log(_items.first_name);

    return _items[field].toLowerCase().indexOf(search) > -1;
  });
}

const r_fields = [
  "id",
  "created_at",
  "updated_at",
  "deleted_at",
  "user",

  "section",
  "extra",
];

const CustomMain = (props) => {
  // let { id } = useParams();
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);

  const [callData, setCallState] = useRecoilStateLoadable(callListState);

  const [usersData, setUserState] = useRecoilStateLoadable(allUserListState);
  const loginData = useRecoilValue(loginState);
  const [rowCount, setRowCount] = useState(10);

  const [aheck, setAcheck] = useState(false);
  const [call_id, setCallId] = useState(0);
  const [loading, setLoading] = useState(false);

  const [allCheck, setAllCheck] = useState([]);

  const [field, setField] = useState("first_name");
  const [compere, setCompere] = useState("like");
  const [value, setValue] = useState("");

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
      //console.log(response);
      if (response?.data?.success) {
        setLoading(false);
        setCallState(response?.data?.data);
      }
    } catch (err) {
      setLoading(false);
    }
  };

  const handelLoad = () => {
    let count = rowCount + 20;

    setRowCount(count);
  };

  const handelRange = (e) => {
    if (e.target.name == "field") {
      setField(e.target.value);
    } else if (e.target.name == "compere") {
      setCompere(e.target.value);
    } else if (e.target.name == "value") {
      setValue(e.target.value);
    }
    //console.log("name", e.target.name);
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

  const handelFilter = (e) => {
    e.preventDefault();
    var data = new FormData(e.target);

    //console.log(Object.fromEntries(data));
  };

  let filterData = applyFilters(callData.contents, field, compere, value);

  return (
    <>
      <h2 className="intro-y text-lg font-medium mt-10 ">
        Generate Custom Report
      </h2>
      <div className="intro-x p-5 box mt-5">
        <div className="flex flex-col sm:flex-row sm:items-end xl:items-start">
          <form className="xl:flex sm:mr-auto">
            <div className="sm:flex items-center sm:mr-4">
              <label className="w-12 flex-none xl:w-auto xl:flex-initial mr-2">
                Field
              </label>
              <select
                name="field"
                onChange={(e) => handelRange(e)}
                className="form-select capitalize w-full sm:w-32 2xl:w-full mt-2 sm:mt-0 sm:w-auto"
              >
                {callData.state == "hasValue" &&
                  Object.keys(callData.contents[0]).map((val, index) => {
                    if (r_fields.includes(val)) {
                      return null;
                    }

                    return (
                      <option key={index} value={val}>
                        {val.replaceAll("_", " ")}
                      </option>
                    );
                  })}
              </select>
            </div>
            <div className="sm:flex items-center sm:mr-4 mt-2 xl:mt-0">
              <label className="w-12 flex-none xl:w-auto xl:flex-initial mr-2">
                Type
              </label>
              <select
                onChange={(e) => handelRange(e)}
                name="compere"
                className="form-select w-full mt-2 sm:mt-0 sm:w-auto"
              >
                <option value="like">like</option>
                <option value="=">=</option>
                <option value="<">&lt;</option>
                <option value="<=">&lt;=</option>
                <option value=">">&gt;</option>
                <option value=">=">&gt;=</option>
                <option value="!=">!=</option>
              </select>
            </div>
            <div className="sm:flex items-center sm:mr-4 mt-2 xl:mt-0">
              <label className="w-12 flex-none xl:w-auto xl:flex-initial mr-2">
                Value
              </label>
              <input
                onChange={(e) => handelRange(e)}
                type="text"
                name="value"
                className="form-control sm:w-40 2xl:w-full mt-2 sm:mt-0"
                placeholder="Search..."
              />
            </div>
            <div className="mt-2 xl:mt-0">
              {/* <button type="submit" className="btn btn-primary w-full sm:w-16">
                Go
              </button> */}
              {/* <button
                id="tabulator-html-filter-reset"
                type="button"
                className="btn btn-secondary w-full sm:w-16 mt-2 sm:mt-0 sm:ml-1"
              >
                Reset
              </button> */}
            </div>
          </form>
          <div className="flex mt-5 sm:mt-0">
            <button
              id="tabulator-print"
              className="btn btn-outline-secondary w-1/2 sm:w-auto mr-2"
            >
              <Lucide icon="Printer" className="w-4 h-4 mr-2" /> Print
            </button>
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
              <Table
                rowCount={rowCount}
                setDeleteConfirmationModal={setDeleteConfirmationModal}
                users={filterData}
                setUserId={setCallId}
                setCallState={setCallState}
                allCheck={allCheck}
                setAllCheck={setAllCheck}
                updateFunc={updateFunc}
                aheck={aheck}
                setAcheck={setAcheck}
              />
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
        {/* {filterData.length > 0 && (
          <div className="intro-y col-span-12 flex flex-wrap sm:flex-row sm:flex-nowrap items-center">
            <button onClick={handelLoad} className="btn">
              Load more..
            </button>
          </div>
        )} */}
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
