import { useParams } from "react-router-dom";
import { useRecoilValueLoadable } from "recoil";
import { getBaseApi } from "../../configuration";
import { CallRecordHistory } from "../../state/whatsapp-state";
import { useEffect, Suspense } from "react";
import { recordHistory } from "../../service/whatsapp";

const HistoryView = () => {
  let { id } = useParams();

  //const [callData, setCallData] = useRecoilStateLoadable(CallRecordHistory(id))

  const callData = useRecoilValueLoadable(CallRecordHistory(id));

  const getHistory = async (ids) => {
    const data = await recordHistory(ids);

    return data;
  };

  useEffect(() => {
    let data = getHistory(id);
   // console.log("get history", data);
  }, []);

  //

  // console.log(callData);

  return (
    <>
      <div className="intro-y flex flex-col sm:flex-row items-center mt-8">
        <h2 className="text-lg font-medium mr-auto">Record History</h2>
      </div>
      <Suspense fallback={<span>Loading...</span>}>
        <div className="box grid grid-cols-4 gap-4 mt-5 p-5">
          {callData.state == "hasValue" &&
            callData.contents.map((file, key) => {
              return (
                <div key={key} className="inbox">
                  <video width="320" height="240" controls>
                    <source
                      src={getBaseApi() + "file/" + file.file_path}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                </div>
              );
            })}
        </div>
      </Suspense>
    </>
  );
};

export default HistoryView;
