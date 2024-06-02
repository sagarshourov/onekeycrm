import { useState } from "react";

import {
  Modal,
  ModalFooter,
  ModalHeader, ModalBody
} from "@/base-components";
import { filter } from "lodash";
import { helper } from "@/utils/helper";
import { Link } from "react-router-dom";
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
function filterById(array, id) {
  return filter(array, (_items) => {
    return _items.id == id;
  });
}

const HistoryViewModal = (props) => {
  const { historyModal, user, setting, data, handelHistoryModel } = props;
  const [loading, setLoading] = useState(false);

 // console.log("setting", setting);

  return (
    <Modal
      size="modal-xl"
      show={historyModal}
      onHidden={() => {
        handelHistoryModel(false);
      }}
      className="bg-gray"
    >
      <ModalHeader>
        <h2 className="font-medium text-base mr-auto">Changed Data</h2>

        <Link to={"#"} className="capitalize">
          Changed By : {user?.first_name} {user?.last_name}
        </Link>
      </ModalHeader>
      <ModalBody className="p-5">
        <div className="intro-y box p-5">
          <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
            {Object.keys(data).map((key, index) => {
              var val = data[key];

              if (key == "assigned_to") {
                var vals = filterById(setting[key], parseInt(val));
                val = vals[0]?.first_name + " " + vals[0]?.last_name;
               // console.log('assigned_to ',val);
              } else if (setting.hasOwnProperty(key)) {
                var vals = filterById(setting[key], parseInt(val));
                val = vals[0]?.title;
              } else if (key == "degree") {
                var vals = filterById(setting["applying_for"], parseInt(val));
                val = vals[0]?.title;
              } else if (key == "package") {
                var vals = filterById(setting["packages"], parseInt(val));
                val = vals[0]?.title;
              }

              return (
                <div className="intro-x " key={index}>
                  <label className="form-label text-base capitalize ">
                    {key.replace(/_/g, " ")}
                  </label>

                  <div className="bg-slate-100 p-2">
                    {val}
                  </div>


                  {/* <input
                    type="text"
                    name={key}
                    className="form-control"
                    defaultValue={val}
                  /> */}
                </div>
              );
            })}
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <button
          type="button"
          onClick={() => handelHistoryModel(false)}
          className="btn btn-outline-secondary w-20 mr-1"
        >
          Close
        </button>
      </ModalFooter>
    </Modal>
  );
};

export default HistoryViewModal;
