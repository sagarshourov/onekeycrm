import { Lucide, Modal, LoadingIcon, ModalBody } from "@/base-components";

import { useState, useEffect } from "react";
import classnames from "classnames";
import {
  useRecoilStateLoadable,
  useSetRecoilState,
  useRecoilValue,
  useRecoilRefresher_UNSTABLE,
} from "recoil";
import {
  clientListState,
  pagOffset,
  pageLimit,
  searchAtom,
  clientUser,
  resultState
} from "../../state/admin-atom";
import { useParams, Link } from "react-router-dom";
import UsersTable from "./UsersTable";
import { settingState } from "../../state/setting-atom";
import axios from "axios";
import { adminApi } from "../../configuration";
import { loginState } from "../../state/login-atom";
import { filter } from "lodash";

// function applySortFilters(array, searchValue) {
//   return filter(array, (_items) => {
//     return (
//       (_items.email &&
//         _items.email.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1) ||
//       (_items.first_name &&
//         _items.first_name.toLowerCase().indexOf(searchValue.toLowerCase()) !==
//           -1) ||
//       (_items.phone_number &&
//         _items.phone_number.toLowerCase().indexOf(searchValue.toLowerCase()) !==
//           -1)
//     );
//   });
// }

function applyAllFilters(array, user_id, callSwitch) {
  if (array.length == 0) return;
  if (callSwitch) {
    return filter(array, (_items) => _items?.assigned_to?.id === user_id);
  } else {
    return array;
  }
}



const token = localStorage.getItem("token");

const headers = {
  Authorization: `Bearer ${token}`,
  ContentType: "application/json",
};

const ClientMain = (props) => {
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const [newUserModal, setNewUserModal] = useState(false);
  const [usersData, setUserState] = useRecoilStateLoadable(clientListState);

  const setPageOffset = useSetRecoilState(pagOffset);
  const searchQuery = useSetRecoilState(searchAtom);
  const limitQuery = useSetRecoilState(pageLimit);

  const cliUser = useSetRecoilState(clientUser);

  const [rowCount, setRowCount] = useState(200);
  const [formdata, setFormdata] = useState([]);
  const [search, setSearch] = useState("");
  const [user_id, setUserId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [allCheck, setAllCheck] = useState([]);
  const loginData = useRecoilValue(loginState);
  const setting = useRecoilValue(settingState);
  const [callSwitch, setCallSwitch] = useState(false);
  const refreshCall = useRecoilRefresher_UNSTABLE(clientListState);

  const setResultID = useSetRecoilState(resultState);

  //const resetcallIdState = useResetRecoilState(callIdState);
  useEffect(() => {
    if (loginData.role === 2) {
      setCallSwitch(true);
      cliUser(loginData.userId);
    }
    setResultID(2);
    return () => {
      //console.log("releasing Clients....");
      setPageOffset(0);
      searchQuery(0);
      limitQuery(20);
      refreshCall();
      cliUser(0);
      //setResultID(0);
    };
  }, []);

  const handelPageCount = (e) => {
    setRowCount(parseInt(e.target.value));
    limitQuery(parseInt(e.target.value));
  };

  // const handelLoad = () => {
  //   let count = rowCount + 20;

  //   setRowCount(count);
  // };

  const handelLoad = (rowCount) => {
    //let count = rowCount + 20;

    setRowCount(rowCount);

    setPageOffset(rowCount);
  };

  const handelSearch = (e) => {
    setSearch(e.target.value);
  };

  const searchCall = () => {
    if (search == "") {
      searchQuery(0);
      setSearch("");
    } else {
      searchQuery(search);
    }
  };

  const resetCall = () => {
    searchQuery(0);
    setSearch("");
  };

  //console.log("searching", search);

  const deleteAdmin = async () => {
    setLoading(true);
    const URL = adminApi() + "calls/0";
    try {
      const response = await axios.delete(URL, {
        headers,
        data: allCheck,
      });

      if (response?.data?.success) {
       // console.log("success", response.data.data);

        //setUserState(response?.data?.data);
        window.location.reload();
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
        window.location.reload();
      }
    } catch (err) {
      setLoading(false);
    }
  };
  const CallSwitch = () => {
    setCallSwitch(() => !callSwitch);

    if (callSwitch) {
      cliUser(0);
    } else {
      cliUser(loginData.userId);
    }
  };
  return (
    <>
      <h2 className="intro-y text-lg font-medium mt-10 ">Clients Call List</h2>
      <div className="grid grid-cols-12 gap-6 mt-5">
        {/* <div className="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2">
          <div className="hidden md:block mx-auto text-slate-500">
            Showing {filterData.length} out of{" "}
            {usersData.state === "hasValue" && usersData.contents["length"]}
          </div>
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
        </div> */}

        <div className="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2">
          <div className=" lg:basis-8/12 grid grid-cols-1 lg:grid-cols-6 gap-2">
            <Link
              className="btn btn-elevated-primary shadow-md mr-2 py-2"
              to="/calls/add"
            >
              Add New Call
            </Link>
            {loginData.role === 1 && (
                <>
                  <Link
                    className="btn btn-elevated-success text-white shadow-md mr-2 py-2"
                    to={"/import/2"}
                  >
                    Import Excel
                  </Link>

                  {/* <button
               
                    className="btn btn-elevated-warning text-white shadow-md mr-2 py-2"
                  >
                    Export Excel
                  </button> */}
                </>
              )}


            {allCheck.length > 0 && (
              <>
                <button
                  onClick={() => setDeleteConfirmationModal(true)}
                  className="btn btn-elevated-danger"
                >
                  Delete
                </button>
                <select
                  name="results"
                  onChange={(e) => bulkUpdate(e.target.name, e.target.value)}
                  className="form-select"
                >
                  <option value="0">Results..</option>

                  {setting.results &&
                    setting.results.map((val, indx) => (
                      <option key={indx} value={val?.id}>
                        {val?.title}
                      </option>
                    ))}

                  {/* 
                    <option value="3">Open</option>
                    <option value="4">No Answer</option>
                    <option value="1">Cancel </option>
                    <option value="2">Client</option> */}
                </select>
                <Link
                  className="btn btn-elevated-primary shadow-md mr-2 py-2"
                  to={"/calls/edit/" + allCheck[0]}
                >
                  Edit Call
                </Link>
              </>
            )}
          </div>
          {/* <div className="hidden md:block mx-auto text-slate-500">
               {filterData.length} {" /"}
              {callData.state === "hasValue" && callData.contents["length"]}
            </div> */}

          <div className="lg:basis-2/12   grid  grid-cols-1 lg:grid-cols-1 gap-3">
            {loginData.role !== 3 && (
              <div
                onClick={CallSwitch}
                className="dark-mode-switcher cursor-pointer shadow-md box border rounded-full w-36  h-10 flex items-center justify-center z-50 "
              >
                <div className="mr-4 text-slate-600 dark:text-slate-200">
                  Switch Calls
                </div>
                <div
                  className={classnames({
                    "dark-mode-switcher__toggle border": true,
                    "dark-mode-switcher__toggle--active": callSwitch,
                  })}
                ></div>
              </div>
            )}
          </div>

          <div className="lg:basis-4/12   grid  grid-cols-1 lg:grid-cols-4 gap-3">
            <select
              onChange={handelPageCount.bind(this)}
              className="w-full  form-select box mt-3 sm:mt-0"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="35">35</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>

            <div className="w-full">
              <div className=" text-slate-500">
                <input
                  onChange={handelSearch.bind(this)}
                  type="text"
                  className="form-control  box"
                  placeholder="Search..."
                />
              </div>
            </div>

            <button onClick={searchCall} className="btn-primary">
              Search{" "}
            </button>

            <button onClick={resetCall} className="btn-danger text-white">
              Reset Search{" "}
            </button>
          </div>
        </div>

        {/* BEGIN: Data List */}

        <div className="intro-y col-span-12  overflow-auto ">
          {usersData.state === "hasValue" ? (
            <UsersTable
              rowCount={rowCount}
              setDeleteConfirmationModal={setDeleteConfirmationModal}
              users={applyAllFilters(usersData.contents,loginData.userId, callSwitch)}
              setUserId={setUserId}
              allCheck={allCheck}
              setAllCheck={setAllCheck}
            />
          ) : (
            "Loading..."
          )}
        </div>
        {/* END: Data List */}
        {/* BEGIN: Pagination */}
        {usersData.state === "hasValue" && usersData.contents.length > 0 && (
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

export default ClientMain;
