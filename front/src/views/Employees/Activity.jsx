
import { useState } from "react";

import { useRecoilStateLoadable } from "recoil";

import ActivityTable from "./ActivityTable";

import { getBaseApi } from "../../configuration";

import { activitySelect } from "../../state/users-atom";
import { allUserListState } from "../../state/admin-atom";

import { filter } from "lodash";
import { useParams } from "react-router-dom";

function getSingleUser(array, user_id) {
  return filter(array, (item) => item.id === user_id);
}

const UsersView = (props) => {
  let { id } = useParams();
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);

  const [rowCount, setRowCount] = useState(10);

  const [selectedId, setSelected] = useState(0);

  const [activity, SetActivity] = useRecoilStateLoadable(activitySelect(id));
  const [userData, setUserData] = useRecoilStateLoadable(allUserListState);
  //console.log(userData);



  const user = getSingleUser(userData.contents, parseInt(id));


  const handelLoad = () => {
    let count = rowCount + 20;

    setRowCount(count);
  };

  return (
    <>
      <div className="flex justify-center mt-4">
        <div className="image-fit w-40 h-40 rounded-full border-4 border-white shadow-md overflow-hidden m-auto">
          <img alt="Profile Image" src={getBaseApi() + "file/"+user[0]?.profile?.file_path} />
        </div>
      </div>
      <div className="flex justify-center ">
        <h2 className="intro-y text-lg font-medium mt-5 text-center">
        {userData.state =="hasValue" && user[0]?.first_name+" "+user[0]?.last_name }
        </h2>
      </div>

      <div className="grid grid-cols-12 gap-6 mt-5">
        {/* BEGIN: Data List */}

        <div className="intro-y col-span-12 overflow-auto lg:overflow-visible">
          {activity.state == "hasValue" && (
            <ActivityTable
              rowCount={rowCount}
              setSelected={setSelected}
              setDeleteConfirmationModal={setDeleteConfirmationModal}
              users={activity.contents}
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
    </>
  );
};

export default UsersView;
