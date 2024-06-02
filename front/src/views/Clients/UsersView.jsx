import {
  Lucide,
  Modal,
  ModalBody,
  ModalFooter,
} from "@/base-components";

import { useState } from "react";

import { useRecoilValue, useRecoilStateLoadable } from "recoil";
import {
  adminUserListState,
  assignSelect,
  allUserListState,
} from "../../state/admin-atom";
import UsersViewTable from "./UsersViewTable";

import axios from "axios";
import { adminApi, getBaseApi } from "../../configuration";

import { LoadingIcon } from "@/base-components";

import { filter } from "lodash";
import { useParams } from "react-router-dom";
function applySortFilters(array, searchValue) {
  return filter(array, (_items) => {
    if (_items.users !== null) {
      return (
        _items.users.email.toLowerCase().indexOf(searchValue.toLowerCase()) !==
          -1 ||
        _items.users.first_name
          .toLowerCase()
          .indexOf(searchValue.toLowerCase()) !== -1
      );
    }
  });

}

function getSingleUser(array, user_id) {
  return filter(array, (item) => item.id === user_id);
}

const UsersView = (props) => {
  let { id } = useParams();
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const [newUserModal, setNewUserModal] = useState(false);

  const [adminData, setAdminStat] = useRecoilStateLoadable(adminUserListState);

  const [usersData, setUserData] = useRecoilStateLoadable(allUserListState);

  const assignUser = useRecoilValue(assignSelect(id));

  const [rowCount, setRowCount] = useState(10);
  const [formdata, setFormdata] = useState([]);
  const [search, setSearch] = useState("");

  const [selectMultiple, setSelectMultiple] = useState([]);

  const [loading, setLoading] = useState(false);

  const [selectedId, setSelected] = useState(0);

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

  let assignData = applySortFilters(assignUser, search);

  let admin = getSingleUser(adminData.contents, parseInt(id));

  const assignAdminUser = async () => {
    const URL = adminApi() + "assign_admin_users";
  
    const token = localStorage.getItem("token");

    const headers = {
      Authorization: `Bearer ${token}`,
      ContentType: "application/json",
    };

    setLoading(true);

    try {
      const response = await axios.post(
        URL,
        { user_id: id, data: [selectMultiple] },
        {
          headers,
        }
      );

      if (response.data.success) {
        window.location.reload();
      } else {
        alert("Something is wrong please try again later!");
      }
    } catch (err) {
      setLoading(false);
    }
  };

  const deleteAssign = async () => {
    const URL = adminApi() + "delete_admin_users";

    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
      ContentType: "application/json",
    };

    setLoading(true);

    try {
      const response = await axios.post(
        URL,
        { admin_id: id, user_id: selectedId },
        {
          headers,
        }
      );

      if (response.data.success) {
        window.location.reload();
      } else {
        alert("Something is wrong please try again later!");
      }
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-center mt-4">
        <div className="image-fit w-40 h-40 rounded-full border-4 border-white shadow-md overflow-hidden m-auto">
          <img
            alt="Profile Image"
            src={getBaseApi() + "file/" + admin[0]?.profile[0]?.file_path}
          />
        </div>
      </div>
      <div className="flex justify-center ">
        <h2 className="intro-y text-lg font-medium mt-5 text-center">
          {admin[0]?.first_name} {admin[0]?.last_name}
        </h2>
      </div>

      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="intro-y box p-5 col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2">
          <button
            className="btn btn-primary shadow-md mr-2"
            onClick={() => setNewUserModal(true)}
          >
            Add New User
          </button>

          <div className="hidden md:block mx-auto text-slate-500">
            Showing {assignData.length} out of{" "}
            {assignUser.state === "hasValue" && assignUser.contents["length"]}
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
        </div>
        {/* BEGIN: Data List */}

        <div className="intro-y col-span-12 overflow-auto lg:overflow-visible">
          {assignUser.length > 0 && (
            <UsersViewTable
              rowCount={rowCount}
              setSelected={setSelected}
              setDeleteConfirmationModal={setDeleteConfirmationModal}
              users={assignData}
            />
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
              type="button"
              onClick={deleteAssign}
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

      <Modal
        show={newUserModal}
        onHidden={() => {
          setNewUserModal(false);
        }}
      >
        <ModalBody className="p-0">
          <h3 className="text-3xl p-5 text-center">Add new users</h3>

          <div className="p-5 h-max">
            <select
              className="form-control w-full"
              onChange={(e) => setSelectMultiple(e.target.value)}
            >
              <option>Select...</option>
              {
                usersData.state === "hasValue" &&
                  usersData.contents.length > 0 &&
                  usersData.contents.map((user, index) => {
                    return (
                      <option key={index} value={user.id}>
                        {user.first_name} ({user.email})
                      </option>
                    );
                  })

                // <TomSelect
                //   value={selectMultiple}
                //   onChange={setSelectMultiple}
                //   options={{
                //     placeholder: "Select Users",
                //     plugins: {
                //       dropdown_header: {
                //         title: "Users",
                //       },
                //     },
                //   }}
                //   className="w-full"
                //   multiple
                // >
                //   {usersData.contents.map((user, index) => {
                //     return (
                //       <option key={index} value={user.id}>
                //         {user.first_name}
                //       </option>
                //     );
                //   })}
                // </TomSelect>
              }
            </select>
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="px-5 mt-5 pb-8 text-center">
            <button
              type="button"
              onClick={() => {
                setNewUserModal(false);
              }}
              className="btn btn-outline-secondary w-24 mr-1"
            >
              Cancel
            </button>
            <button
              onClick={assignAdminUser}
              type="button"
              className="btn btn-primary w-24"
            >
              Save
              {loading && (
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
    </>
  );
};

export default UsersView;
