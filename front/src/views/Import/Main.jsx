import { LoadingIcon, Alert, Lucide } from "@/base-components";

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
//import { useRecoilState, useRecoilValue } from "recoil";
import { loginState } from "../../state/login-atom";
import { filter } from "lodash";
import { useRecoilStateLoadable, useRecoilValue } from "recoil";
import { allUserListState } from "../../state/admin-atom";
import { adminApi } from "../../configuration";
import DropZoneCon from "./DropdoneCon";
import { settingState } from "../../state/setting-atom";
import axios from "axios";
import { useRef } from "react";
const token = localStorage.token && localStorage.getItem("token");

const headers = { Authorization: `Bearer ${token}` };
function applySortFilters(array) {
  return filter(array, (_items) => _items.is_admin !== 1);
}
function applySortFiltersResult(array, type) {
  return filter(array, (_items) => _items.id == type);
}
const Import = (props) => {
  let { type } = useParams();
  let navigate = useNavigate();
  const loginData = useRecoilValue(loginState);

  const [usersData, setUserState] = useRecoilStateLoadable(allUserListState);
  let empData = applySortFilters(usersData.contents);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [user_id, setUserId] = useState(0);
  const [file, setFile] = useState([]);

  const setting = useRecoilValue(settingState);

  const results = applySortFiltersResult(setting.results, type);

  const handelUser = (e) => {
    //console.log(e.target.value);
    setUserId(e.target.value);
    //console.log('user_id', user_id);
  };

  const ImportFile = async () => {
    
    // if (file.length > 0) {
    //   alert("File required !");

    //   return false;
    // }
    setLoading(true);
    // parseInt(logindata.role) !== 3 && (

    let userId = user_id;

    if (user_id == 0 && parseInt(loginData.role) !== 3) {
      alert("User required !");
    }

    if (parseInt(loginData.role) === 3) {
      userId = parseInt(loginData.userId);
    }

    const userApiUrl = adminApi() + "import";

    try {
      //const response = await axios.get(userApiUrl, { headers });
      var data = {
        user_id: userId,
        file_name: file[1],
        file_path: file[0],
        type: type,
      };
      const response = await axios.post(userApiUrl, data, {
        headers,
      });

      // console.log('res',response);
      if (response.data.success) {
        setSuccess(true);
        setTimeout(function () {
          window.location.reload();
        }, 500);
        setLoading(false);
      }
      return response.data || [];
    } catch (error) {
      // throw new Error(`Error in 'axiosGetJsonData(${userApiUrl})':` + error);

      alert("Something wrong ! Try again later . ");

      setLoading(false);
    }
    // console.log('file',file);
    // console.log('user_id', user_id);
  };

  // console.log('role', logindata);

  return (
    <>
      <div className="intro-y flex flex-col sm:flex-row items-center mt-8 mb-3">
        <h2 className="text-lg font-medium mr-auto">
          {" "}
          Import <b className="text-warning">{results[0]?.title} </b> Calls From
          Excel{" "}
        </h2>
        {success && (
          <Alert className="alert-success mb-2 w-96 my-5">
            <div className="flex items-center">
              <div className="font-medium text-white text-lg">Success !</div>
            </div>
          </Alert>
        )}
        {parseInt(loginData.role) !== 3 ? (
          <div className="w-full sm:w-auto flex mt-4 sm:mt-0">
            <select
              id="user"
              onClick={(e) => handelUser(e)}
              className="form-control"
            >
              <option value="0">Select..</option>
              {usersData.state == "hasValue" &&
                empData.map((user, index) => {
                  return (
                    <option key={index} value={user.id}>
                      {user.first_name} {user.last_name}
                    </option>
                  );
                })}
            </select>
            <button
              onClick={ImportFile}
              className="btn btn-primary shadow-md mr-2"
            >
              <Lucide icon="UserPlus" className="w-4 h-4 mr-2" />
              Run Import{" "}
              {loading && (
                <LoadingIcon
                  icon="three-dots"
                  color="white"
                  className="w-4 h-4 ml-2"
                />
              )}
            </button>
          </div>
        ) : (
          <div className="w-full sm:w-auto flex mt-4 sm:mt-0">
            <button
              onClick={ImportFile}
              className="btn btn-primary shadow-md mr-2"
            >
              <Lucide icon="UserPlus" className="w-4 h-4 mr-2" /> Import{" "}
              {loading && (
                <LoadingIcon
                  icon="three-dots"
                  color="white"
                  className="w-4 h-4 ml-2"
                />
              )}
            </button>
          </div>
        )}
      </div>
      {usersData.state == "hasValue" && (
        <DropZoneCon setFile={setFile} user_id={loginData.userId} />
      )}
    </>
  );
};

export default Import;
