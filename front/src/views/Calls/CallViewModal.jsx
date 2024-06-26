import { useState } from "react";
import axios from "axios";

import {
  Lucide,
  Modal,
  ModalFooter,
  ModalHeader,
  LoadingIcon,
  ModalBody,
} from "@/base-components";
import { getBaseApi } from "../../configuration";
import { helper } from "@/utils/helper";
import { Link } from "react-router-dom";
import { loginState } from "../../state/login-atom";
import { useRecoilValue } from "recoil";
import { adminApi } from "../../configuration";
function extra_title(arr, group, index) {
  var value = "";
  if (arr.extra && arr.extra.length > 0) {
    arr.extra.map((dat, key) => {
      //   console.log("value dat", dat);
      if (dat.groups == group && dat.values[index]?.value) {
        value = dat.values[index]?.value;
      }
    });
  }

  if (index === 0 && value !== "") {
    return helper.formatDate(value, "MMM D, YYYY");
  }

  // console.log("value", value);

  return value;
}


function get_value(arr, group, key) {

  console.log('d',arr);
  var time = "";
  if (arr.extra && arr.extra.length > 0) {
    arr.extra.map((dat, index) => {
  
      if (dat.groups == group) {
        time = dat.values &&  helper.findVaue(dat.values, key)
        console.log('match', dat.values);
        
      }
    });
  }
  //console.log(date);
  return time;
}

const CallViewModal = (props) => {
  const { showCallVew, setCallView, data, handelCallModel } = props;
  const [loading, setLoading] = useState(false);
  const logindata = useRecoilValue(loginState);
 // console.log('single call',data);

  const transferCall = async (callId) => {
 //   console.log("call", callId);

    const URL = adminApi() + "notifications";

    try {
      const response = await axios.post(
        URL,
        {
          type: 1,
          content: "Client Recovering Request",
          call_id: callId,
          user_id: logindata.userId,
          is_read: 0,
        },
        {
          //user id is creator of notifications
          headers,
        }
      );
      //console.log(response);
      if (response?.data?.success) {
        setLoading(false);
        window.location.reload();
      }
    } catch (err) {
      if (!err?.response?.data?.success) {
      }

      setLoading(false);
    }
  };

  return (
    <Modal
      size="modal-xl"
      show={showCallVew}
      onHidden={() => {
        handelCallModel(false);
      }}
      className="bg-gray"
    >
      <ModalHeader>
        <h2 className="font-medium text-base mr-auto">Single Call View</h2>

        {logindata.role == 3 && (
          <>
            {" "}
            {data?.assigned_to?.id == logindata.userId ? (
              <Link to={"/calls/edit/" + data.id}>Edit</Link>
            ) : (
              <button
                onClick={() => transferCall(data.id)}
                className="btn btn-primary"
              >
                Transfer Customer To Me{" "}
                {loading && (
                  <LoadingIcon
                    icon="three-dots"
                    color="white"
                    className="w-4 h-4 ml-2"
                  />
                )}
              </button>
            )}
          </>
        )}

        {logindata.role != 3 && <Link to={"/calls/edit/" + data.id}>Edit</Link>}
      </ModalHeader>
      <ModalBody className="p-5">
        <div className="intro-y box p-5">
          <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
            <div className="intro-x ">
              <label className="form-label text-base">First Name</label>
              <input
                type="text"
                name="first_name"
                className="form-control"
                placeholder=""
                defaultValue={data?.first_name}
              />
            </div>
            <div className="intro-x ">
              <label className="form-label text-base">Last Name</label>
              <input
                type="text"
                name="last_name"
                className="form-control"
                placeholder=""
                defaultValue={data?.last_name}
              />
            </div>
            <div className="intro-x ">
              <label className="form-label text-base">Email</label>
              <input
                className=" form-control"
                type="text"
                name="email"
                placeholder=""
                defaultValue={data?.email}
              />
            </div>
            <div className="intro-x ">
              <label className="form-label text-base">Assigned to</label>
              <input
                className=" form-control"
                type="text"
                name="assigned_to"
                defaultValue={data?.assigned_to?.first_name}
              />
            </div>
            <div className="intro-x ">
              <label className="form-label text-base">Priority</label>

              <input
                className=" form-control"
                type="text"
                name="priority"
                defaultValue={data?.priority}
              />
            </div>
            <div className="intro-x ">
              <label className="form-label text-base">WhatsApp Number</label>

              <input
                className=" form-control"
                type="text"
                name="whatsapp"
                defaultValue={data?.whatsapp}
              />
            </div>

            <div className="intro-x ">
              <label className="form-label text-base">Age</label>

              <input
                className=" form-control"
                type="text"
                name="age"
                defaultValue={data?.age}
              />
            </div>

            <div className="intro-x ">
              <label className="form-label text-base">Priority</label>

              <input
                className=" form-control"
                type="text"
                name="priority"
                defaultValue={data?.priority}
              />
            </div>

            <div className="intro-x ">
              <label className="form-label text-base">Call Schedule Date</label>

              <input
                className=" form-control"
                type="text"
                name="call_schedule_date"
                defaultValue={
                  data?.call_schedule_date &&
                  helper.formatDate(data?.call_schedule_date, "MMM D, YYYY")
                }
              />
            </div>

            <div className="intro-x ">
              <label className="form-label text-base">First Call Date</label>

              <input
                className=" form-control"
                type="text"
                name="first_contact"
                defaultValue={
                  data?.first_contact &&
                  helper.formatDate(data?.first_contact, "MMM D, YYYY")
                }
              />
            </div>

            <div className="intro-x ">
              <label className="form-label text-base">First Call Note</label>
              <div className="form-control box p-3">
                {data?.first_call_notes}
              </div>
            </div>

            <div className="intro-x ">
              <label className="form-label text-base">Package</label>

              <input
                className=" form-control"
                type="text"
                name="field_study"
                defaultValue={data?.package?.title}
              />
            </div>

            <div className="intro-x ">
              <label className="form-label text-base">Agreement Sent</label>

              <h3>{data.ag === 0 ? "No" : "Yes"}</h3>
            </div>

            <div className="intro-x ">
              <label className="form-label text-base"> Agreement Signed</label>

              <h3>{data.agreed_to_signed === 0 ? "No" : "Yes"}</h3>
            </div>

            <div className="intro-x ">
              <label className="form-label text-base">Status</label>

              <h3>{data?.statu?.title}</h3>
            </div>

            <div className="intro-x ">
              <label className="form-label text-base"> Next Step Date</label>

              <input
                className=" form-control"
                type="text"
                name="field_study"
                defaultValue={extra_title(data, "my_step", 0)}
              />
            </div>

            <div className="intro-x ">
              <label className="form-label text-base"> Next Step Note</label>
              <div className="form-control box p-3">
                {" "}
                {get_value(data, "my_step", 'next_step_notes')}{" "}
              </div>
            </div>

            <div className="intro-x ">
              <label className="form-label text-base"> Follow up date</label>
              <div className="form-control box p-3">
                {" "}
                {data?.follow_up_date &&
                  helper.formatDate(data?.follow_up_date, "MMM D, YYYY")}
              </div>
            </div>

            <div className="intro-x ">
              <label className="form-label text-base">Follow up note</label>

              <div className="form-control box p-3">
                {" "}
                {data?.follow_up_notes}{" "}
              </div>
            </div>

            <div className="intro-x ">
              <label className="form-label text-base">Feedback</label>
              <div className="form-control box p-3"> {data?.feedbacks} </div>
            </div>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <button
          type="button"
          onClick={() => handelCallModel(false)}
          className="btn btn-outline-secondary w-20 mr-1"
        >
          Close
        </button>
      </ModalFooter>
    </Modal>
  );
};

export default CallViewModal;
