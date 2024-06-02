import {
  Lucide,
  Modal,
  LoadingIcon,
  ModalBody
} from "@/base-components";

import { useState } from "react";
import { useRecoilStateLoadable, useRecoilValue } from "recoil";

import { loginState } from "../../state/login-atom";
import ConTable from "./ConTable";
import { filter } from "lodash";

import { SlackConvrsionList } from "../../state/slack-state";
import SlackB from "slack";
//console.log(process.env.token);

function applySortFilters(array, searchValue) {
  return filter(array, (_items) => {
    return _items.is_archived === false;
  });
}

const AdminUsers = (props) => {
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);

  const [rowCount, setRowCount] = useState(10);

  const [search, setSearch] = useState("");
  const [aheck, setAcheck] = useState(false);
  const [conId, setConId] = useState("");
  const [loading, setLoading] = useState(false);

  const [allCheck, setAllCheck] = useState([]);
  const [slackConList, setData] = useRecoilStateLoadable(SlackConvrsionList);
  const logindata = useRecoilValue(loginState);

  const [newConModal, setNewConModal] = useState(false);
  var bot = new SlackB({ token: process.env.token });
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

  let filterData = applySortFilters(slackConList.contents, search);

  const createChannel = async (e) => {
    e.preventDefault();
    setLoading(true);
   // console.log(e);
    var data = new FormData(e.target);
    var name = Object.fromEntries(data).channel_name;

    try {
      const response = await bot.conversations.create({
        name: name,
      });
    //  console.log(response);

      if (response.ok) {
        setData({ ...slackConList.contents, ...response });

        // console.log('slack',slackConList.contents);

        // console.log('slack',response.channel);
        setLoading(false);
        setNewConModal(false);
      }
    } catch (err) {
      //console.log(err);
      setLoading(false);
    }

    return false;
  };

  const deleteCon = async () => {
  //  console.log("Con ID", conId);

    try {
      const response = await bot.conversations.archive({
        channel: conId,
      });
    //  console.log(response);

      if (response.ok) {
        // console.log('slack',slackConList.contents);

        // console.log('slack',response.channel);
        setLoading(false);
        setDeleteConfirmationModal(false);
        window.location.reload();
      }
    } catch (err) {
     // console.log(err);
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="intro-y text-lg font-medium mt-10 ">Slack Channel List</h2>
      <div className=" mt-5">
        <div className="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
            <button
              onClick={() => setNewConModal(true)}
              className="btn btn-elevated-primary shadow-md mr-2 py-2"
            >
              Create New Channel
            </button>
          </div>
          <div className="hidden md:block mx-auto text-slate-500">
            Showing {filterData.length} out of{" "}
            {slackConList.state === "hasValue" &&
              slackConList.contents["length"]}
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
          {slackConList.state === "hasValue" && (
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
              <ConTable
                rowCount={rowCount}
                setDeleteConfirmationModal={setDeleteConfirmationModal}
                users={filterData}
                setConId={setConId}
                allCheck={allCheck}
                setAllCheck={setAllCheck}
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

      <Modal
        show={newConModal}
        onHidden={() => {
          setNewConModal(false);
        }}
      >
        <ModalBody className="p-0">
          <form onSubmit={(e) => createChannel(e)}>
            <div className="p-5 text-center">
              <div className="text-2xl mt-5 mb-5">Create New Channel</div>
              <div className="p-5">
                <div className="form-inline">
                  <label
                    htmlFor="horizontal-form-1"
                    className="form-label sm:w-30"
                  >
                    Channel Name
                  </label>
                  <input
                    type="text"
                    name="channel_name"
                    className="form-control"
                  />
                </div>
              </div>
            </div>
            <div className="px-5 pb-8 text-center">
              <button
                type="button"
                onClick={() => {
                  setNewUserModal(false);
                }}
                className="btn btn-outline-secondary w-24 mr-1"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-success text-white w-24">
                Create Chanel
                {loading && (
                  <LoadingIcon
                    icon="three-dots"
                    color="white"
                    className="w-4 h-4 ml-2"
                  />
                )}
              </button>
            </div>
          </form>
        </ModalBody>
      </Modal>
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
              onClick={deleteCon}
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
