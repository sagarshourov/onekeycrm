import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import classnames from "classnames";
import { Lucide } from "@/base-components";
import { helper } from "@/utils/helper";
import {
  useRecoilRefresher_UNSTABLE,
  useSetRecoilState,
  useRecoilStateLoadable,
  useRecoilValue 
} from "recoil";
import { singleCallState, callIdState } from "../../state/admin-atom";

//Plus

import EditCallCon from "./editcall/EditCallCon";

import HistoryViewModal from "./editcall/HistoryViewModal";
import { settingState } from "../../state/setting-atom";
const EditCalls = (props) => {
  let { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const [historyModal, setHistoryModal] = useState(false);

  const [historyData, setHistoryData] = useState([]);

  const [historyUser, setHistoryUser] = useState([]);
  const setting = useRecoilValue(settingState);
  const [singleCall, setSingleCallState] =
    useRecoilStateLoadable(singleCallState);
  const setCallId = useSetRecoilState(callIdState);

  const resetSingleCall = useRecoilRefresher_UNSTABLE(singleCallState);
  //const resetcallIdState = useResetRecoilState(callIdState);
  useEffect(() => {
    //console.log("set state");
    setCallId(id);
    return () => {
      resetSingleCall();
      //resetcallIdState();
      //console.log("cleaned up");
    };
  }, [id]);

  //console.log('singleCall', singleCall);

  const showHistoryFunc = () => {
    //console.log("show history");
    setShowHistory(true);
  };
  const showContent = (data) => {
    //console.log("Show content",data);
    setHistoryModal(true);

    setHistoryData(JSON.parse(data.data));
    setHistoryUser(data.user);
  };

  const handelHistoryModel = (show) => {
    setHistoryModal(show);
  };

  return (
    <>
      <div className="intro-y  flex justify-between mt-10">
        <h2 className="intro-y text-lg font-medium ">Edit Calls</h2>

        <button
          onClick={showHistoryFunc}
          className="btn btn-rounded btn-warning-soft w-24 mr-1 mb-2"
        >
          <Lucide icon="Activity" className="w-4 h-4 mr-2" /> History
        </button>
      </div>

      <div
        className={
          showHistory
            ? "fixed top-0 right-0 z-[100] w-64 h-screen p-4 box overflow-y-auto transition-transform  bg-gray-100 dark:bg-gray-800"
            : "fixed top-0 right-0 z-[100] w-64 h-screen p-4 box overflow-y-auto translate-x-full transition-transform  bg-white dark:bg-gray-800"
        }
      >
        <h5
          id="drawer-navigation-label"
          className="text-base font-semibold text-gray-500 uppercase dark:text-gray-400"
        >
          Changes History
        </h5>
        <button
          type="button"
          onClick={(e) => setShowHistory(false)}
          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 right-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
        >
          X<span className="sr-only">Close menu</span>
        </button>
        <div className="py-4 overflow-y-auto">
          {singleCall.state == "hasValue" &&
            singleCall.contents.versions &&
            singleCall.contents.versions.map((data, index) => (
              <div
                key={index}
                className="intro-x hover:cursor-pointer"
                onClick={(e) => showContent(data)}
              >
                <div className="box px-5 py-3 flex items-center mb-3">
                  <div className="mr-auto">
                    <div className="font-medium">
                      {" "}
                      {helper.formatDate(
                        data?.created_at,
                        "MMMM D, YYYY h:mm A"
                      )}
                    </div>
                    <div className="text-slate-500 text-xs mt-1 capitalize">
                      {data?.user?.first_name} {data?.user?.last_name}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {singleCall.state == "hasValue" ? ( //need to set up single call state
        <EditCallCon
          calls={singleCall.contents}
          setCallId={setCallId}
          setSingleCallState={setSingleCallState}
          setting={setting}
        />
      ) : (
        <p>Loading ...</p>
      )}

      <HistoryViewModal
        historyModal={historyModal}
        handelHistoryModel={handelHistoryModel}
        data={historyData}
        user={historyUser}
        setting={setting}
      />
    </>
  );
};

export default EditCalls;
