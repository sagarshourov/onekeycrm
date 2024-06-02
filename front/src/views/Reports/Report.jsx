import {
  Lucide,
  Modal,
  LoadingIcon,
  ModalBody,
  Litepicker,
} from "@/base-components";

import { useState } from "react";
import { useParams, Link } from "react-router-dom";

import { useRecoilStateLoadable, useRecoilValue } from "recoil";
import { callListState } from "../../state/admin-atom";

import { loginState } from "../../state/login-atom";

import Table from "./Table";

import axios from "axios";
import { adminApi } from "../../configuration";

import { filter } from "lodash";


function applySortFilters(array, searchValue, sec) {
  //console.log(sec);
  if (sec == "all") {
    return filter(array, (_items) => {
      return _items.email
        ? _items.email.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1
        : true;
    });
  } else {
    return filter(array, (_items) => {
      if (_items.email) {
        return (
          _items.sections == parseInt(sec) &&
          _items.email.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1
        );
      } else {
        return true;
      }
    });
  }
}

const AdminUsers = (props) => {
  let { id } = useParams();
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);

  const [callData, setCallState] = useRecoilStateLoadable(callListState);
  const [rowCount, setRowCount] = useState(10);
  const [formdata, setFormdata] = useState([]);
  const [search, setSearch] = useState("");
  const [aheck, setAcheck] = useState(false);
  const [call_id, setCallId] = useState(0);
  const [loading, setLoading] = useState(false);

  const [allCheck, setAllCheck] = useState([]);

  const logindata = useRecoilValue(loginState);

  const [daterange, setDaterange] = useState("");

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

  const handelLoad = () => {
    let count = rowCount + 20;

    setRowCount(count);
  };

  const handelSearch = (e) => {
    setSearch(e.target.value);
  };

  let filterData = applySortFilters(callData.contents, search, id);

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

  const bulkUpdate = async (name, value) => {
    const URL = adminApi() + "calls/0";
    setLoading(true);

    try {
      const response = await axios.put(
        URL,
        { ids: allCheck, name: name, value: value },
        {
          headers,
        }
      );

      if (response?.data?.success) {
        setLoading(false);
        setCallState(response?.data?.data);
        setAllCheck([]);
        setAcheck(false);
      }
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="intro-y text-lg font-medium mt-10 ">
      Generate {id == 1 ? "Status" : id == 2 ? "Follow up" : "Custom"} Report{" "}
      </h2>
      <div className=" mt-5">
        <div className="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2">
          <div className="grid grid-cols-3 lg:grid-cols3 gap-4">
            <Litepicker
              value={daterange}
              onChange={setDaterange}
              options={{
                autoApply: false,
                singleMode: false,
                numberOfColumns: 2,
                numberOfMonths: 2,
                showWeekNumbers: true,
                dropdowns: {
                  minYear: 1990,
                  maxYear: null,
                  months: true,
                  years: true,
                },
              }}
              className="form-control w-56 block mx-auto"
            />

            <select className="form-control">
              <option>Select Employee..</option>
            </select>

            <button className="btn btn-elevated-primary shadow-md mr-2 py-2">
              Run Report
            </button>
          </div>
          <div className="hidden md:block mx-auto text-slate-500">
            Showing {filterData.length} out of{" "}
            {callData.state === "hasValue" && callData.contents["length"]}
          </div>

          <div className="grid  grid-cols-2 pr-10">
            <select
              onChange={handelPageCount.bind(this)}
              className="w-20 form-select box mt-3 sm:mt-0"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="35">35</option>
              <option value="50">50</option>
            </select>
            

            <div className="w-full sm:w-auto mt-3 sm:mt-0 sm:ml-auto md:ml-0">
              <div className="w-56 relative text-slate-500">
                <input
                  onChange={handelSearch.bind(this)}
                  type="text"
                  className="form-control w-56 box pr-10"
                  placeholder="Search..."
                />
                <Lucide
                  icon="Search"
                  className="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0"
                />
              </div>
            </div>
          </div>
        </div>
        {/* BEGIN: Data List */}

        <div className="intro-y col-span-12 overflow-auto relative">
          {callData.state === "hasValue" && (
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
          )}
        </div>
        {/* END: Data List */}
        {/* BEGIN: Pagination */}
        <div className="intro-y col-span-12 flex flex-wrap sm:flex-row sm:flex-nowrap items-center">
          <button onClick={handelLoad} className="btn">
            Load more..
          </button>
        </div>
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

export default AdminUsers;
