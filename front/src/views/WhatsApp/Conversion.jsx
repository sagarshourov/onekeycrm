import {
  Lucide,
  Modal,
  LoadingIcon,
  ModalBody,
  AccordionPanel,
  Accordion,
  AccordionGroup,
  AccordionItem,
} from "@/base-components";
import { useState } from "react";
import { useParams } from "react-router-dom";

import { useRecoilStateLoadable, useRecoilValue } from "recoil";
import { callListState } from "../../state/admin-atom";

import { loginState } from "../../state/login-atom";

import Table from "./Table";

import axios from "axios";
import { adminApi } from "../../configuration";

import { filter } from "lodash";
import { helper } from "@/utils/helper";

import { settingState } from "../../state/setting-atom";

function applySortFilters(array, searchValue, sec) {
  // console.log(sec);
  if (sec == "no") {
    return filter(array, (_items) => {
      return (
        _items.email.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1
      );
    });
  } else if (sec == "all") {
    return filter(array, (_items) => {
      return (
        (_items.email &&
          _items.email.toLowerCase().indexOf(searchValue.toLowerCase()) !==
            -1) ||
        (_items.first_name &&
          _items.first_name.toLowerCase().indexOf(searchValue.toLowerCase()) !==
            -1) ||
        (_items.phone_number &&
          _items.phone_number
            .toLowerCase()
            .indexOf(searchValue.toLowerCase()) !== -1)
      );
    });
  } else {
    return filter(array, (_items) => {
      if (_items.email) {
        return (
          (_items.email &&
            _items.email.toLowerCase().indexOf(searchValue.toLowerCase()) !==
              -1) ||
          (_items.first_name &&
            _items.first_name
              .toLowerCase()
              .indexOf(searchValue.toLowerCase()) !== -1) ||
          (_items.phone_number &&
            _items.phone_number
              .toLowerCase()
              .indexOf(searchValue.toLowerCase()) !== -1)
        );
      } else {
        return true;
      }
    });
  }
}

function findByValue(array, field) {
  return filter(array, (_items) => {
    return _items.field == field;
  });
}

const AdminUsers = (props) => {
  let { id } = useParams();
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);

  const [callData, setCallState] = useRecoilStateLoadable(callListState);
  const [rowCount, setRowCount] = useState(10);
  const [search, setSearch] = useState("");
  const [aheck, setAcheck] = useState(false);
  const [call_id, setCallId] = useState(0);
  const [loading, setLoading] = useState(false);

  const [historyModal, setHistoryModal] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [historyTitle, setHistoryTitle] = useState("");

  const [allCheck, setAllCheck] = useState([]);

  const [allNumber, setAllNumber] = useState([]);

  const logindata = useRecoilValue(loginState);

  const [histoyText, setHistoryText] = useState("");

  const setting = useRecoilValue(settingState);

  const [template, setTemplate] = useState("");

  const [msgSuccess, setMsgSuccess] = useState(false);

  const [err, setErr] = useState("");
  const handelLoad = () => {
    let count = rowCount + 100;

    setRowCount(count);
  };
  const token =
    "EAAX23vGL2ugBAEEneE2Il5NxZCn4cuZB2nliDXadt9RbMjBeGkc8VeDZCl8Y1y9iHNBl6M9YQKoedL1mtZB2eaLoR5HQdtjerIx5p3zAC7NNPhvMCSMjSTpbZCbIk9w9XlPzlreqkRJQ3ICyIVYq1rCvNZC722MZAdIePu3CN9XxBAuAfi63jG3fnc9IzjZALnneJc2ng9xP9AZDZD";

  const headers = {
    Authorization: "Bearer " + token,
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

  const handelSearch = (e) => {
    setSearch(e.target.value);
  };

  const sendMessage = async () => {
    setLoading(true);
    const URL = "https://graph.facebook.com/v15.0/116203211365460/messages";
    let data = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: "",
      type: "template",
      template: {
        name: "hello_world",
        language: {
          code: "en_US",
        },
      },
    };

    if (template == "") {
      alert("Select a template Please");
      return false;
    }

    let count = 1;

    allCheck.length > 0 &&
      callData.contents.map(async (dat, index) => {
        if (allCheck.includes(dat.id)) {
          //console.log(data.phone_number);
          setLoading(true);
          data.to = dat.phone_number;

          if (template == "one_time_password") {
            data.template = {
              name: "one_time_password",
              language: {
                code: "en_US",
              },
              components: [
                {
                  type: "body",
                  parameters: [
                    {
                      type: "text",
                      text: dat.first_name ? dat.first_name : "User",
                    },
                    {
                      type: "text",
                      text: Math.floor(1000 + Math.random() * 9000),
                    },
                  ],
                },
              ],
            };
          } else if (template == "inviting_join_team") {
            data.template = {
              name: "inviting_join_team",
              language: {
                code: "en_US",
              },
              components: [
                {
                  type: "body",
                  parameters: [
                    {
                      type: "text",
                      text: dat.first_name ? dat.first_name : "User",
                    },
                  ],
                },
              ],
            };
          } else {
            data.template = {
              name: "hello_world",
              language: {
                code: "en_US",
              },
            };
          }

          try {
            let response = await axios({
              method: "POST", // Required, HTTP method, a string, e.g. POST, GET
              url: URL + "?access_token=" + token,
              data,
              headers: { "Content-Type": "application/json" },
            });

            if (allCheck.length == count) {
              setLoading(false);
              //setDeleteConfirmationModal(false);
              setMsgSuccess(true);
              setAllCheck([]);
            }
            count++;
          } catch (err) {
            setLoading(false);
            err?.response?.data?.error?.error_data?.details &&
              setErr(
                dat.phone_number +
                  "->" +
                  err.response.data.error.error_data.details
              );
            setAllCheck([]);
          }
        }
      });
  };

  const setHistory = async (field, data, id) => {
    setCallId(id);
    var data = findByValue(data, field);
    setHistoryTitle(field);
    setHistoryData(data);
   // console.log(data);
    setHistoryModal(true);
  };

  const saveHistory = async () => {
    if (histoyText == "") {
      alert("Text Required!");
    }
    setLoading(true);
    const URL = adminApi() + "calls/" + call_id;
    try {
      const response = await axios.put(
        URL,
        { name: historyTitle, value: histoyText, type: 2 },
        {
          headers,
        }
      );

      if (response?.data?.success) {
        setCallState(response?.data?.data);
        setHistoryModal(false);
        setLoading(false);
        histoyText("");
      } else {
        alert("Something is wrong please try again later!");
      }
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="intro-y text-lg font-medium mt-10 ">Send Bulk Message</h2>

      <div className="col-span-1 lg:order-1 order-2 lg:col-span-3">
        <div className="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2">
          <div className="lg:basis-9/12 grid grid-cols-4 lg:grid-cols-5 gap-2">
            {allCheck.length > 0 && (
              <>
                <select
                  name="results"
                  onChange={(e) => setTemplate(e.target.value)}
                  className="form-select"
                >
                  <option value="0">Select Template..</option>

                  <option value="one_time_password">One Time Password</option>
                  <option value="inviting_join_team ">
                    Team Joining Invitation
                  </option>

                  <option value="hello_world ">Hello World</option>
                </select>
                <button
                  onClick={() => setDeleteConfirmationModal(true)}
                  className="btn btn-elevated-success text-white"
                >
                  Send Message
                </button>
              </>
            )}
          </div>
          {/* <div className="hidden md:block mx-auto text-slate-500">
               {filterData.length} {" /"}
              {callData.state === "hasValue" && callData.contents["length"]}
            </div> */}

          <div className="lg:basis-2/12   grid  grid-cols-2">
            <select
              onChange={handelPageCount.bind(this)}
              className="w-full lg:w-20 form-select box mt-3 sm:mt-0"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="35">35</option>
              <option value="50">50</option>
            </select>

            <div className="w-full sm:w-auto mt-3 sm:mt-0 sm:ml-auto md:ml-0">
              <div className="relative w-52 text-slate-500">
                <input
                  onChange={handelSearch.bind(this)}
                  type="text"
                  className="form-control w-52 box"
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

        <div className="intro-y mt-5 col-span-12 ">
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
              <div>
                <Table
                  rowCount={rowCount}
                  setDeleteConfirmationModal={setDeleteConfirmationModal}
                  users={applySortFilters(callData.contents, search, "all")}
                  setUserId={setCallId}
                  setCallState={setCallState}
                  allCheck={allCheck}
                  setAllCheck={setAllCheck}
                  setAllNumber={setAllNumber}
                  updateFunc={updateFunc}
                  aheck={aheck}
                  setAcheck={setAcheck}
                  setHistory={setHistory}
                  theme="bg-lite text-black"
                  setting={setting}
                />
              </div>
            </>
          )}
        </div>

        {/* END: Data List */}
        {/* BEGIN: Pagination */}

        {callData.state === "hasValue" && (
            <div className="intro-y col-span-12 mt-3 flex flex-wrap sm:flex-row sm:flex-nowrap items-center">
              <button onClick={handelLoad} className="btn">
                Load more..
              </button>
            </div>
          )}

        {/* END: Pagination */}
      </div>

      {/* Grid */}
      {/* BEGIN: Delete Confirmation Modal */}
      <Modal
        show={deleteConfirmationModal}
        onHidden={() => {
          setDeleteConfirmationModal(false);
          setMsgSuccess(false);
          setErr("");
        }}
      >
        <ModalBody className="p-0">
          {msgSuccess ? (
            <>
              <div className="p-5 text-center">
                <Lucide
                  icon="CheckCircle"
                  className="w-16 h-16 text-success mx-auto mt-3"
                />
                <div className="text-3xl mt-5">Message Sent Successfully !</div>
              </div>
              <div className="px-5 pb-8 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setDeleteConfirmationModal(false);
                    setMsgSuccess(false);
                    setErr("");
                  }}
                  className="btn btn-outline-secondary w-24 mr-1"
                >
                  Close
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="p-5 text-center">
                <Lucide
                  icon="Send"
                  className="w-16 h-16 text-warning  mx-auto mt-3"
                />
                <div className="text-3xl mt-5">Are you sure?</div>
                <div className="text-slate-500 mt-2">
                  Do you really want to send bulk message? <br />
                </div>
              </div>
              <div className="px-5 pb-8 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setDeleteConfirmationModal(false);
                    setMsgSuccess(false);
                    setErr("");
                  }}
                  className="btn btn-outline-secondary w-24 mr-1"
                >
                  Cancel
                </button>
                <button
                  onClick={sendMessage}
                  type="button"
                  className="btn text-white btn-warning"
                >
                  Send Message
                  {loading && (
                    <LoadingIcon
                      icon="three-dots"
                      color="white"
                      className="w-4 h-4 ml-2"
                    />
                  )}
                </button>
              </div>
              <div className="px-5 pb-8 text-center  text-danger">{err}</div>
            </>
          )}
        </ModalBody>
      </Modal>
      {/* END: Delete Confirmation Modal */}

      <Modal
        size="modal-lg"
        show={historyModal}
        onHidden={() => {
          setHistoryModal(false);
        }}
      >
        <ModalBody className="p-0">
          <div className="p-5 text-center">
            <div className="text-xl capitalize mb-5">
              {historyTitle.replaceAll("_", " ")}
            </div>
            <div className="col-12">
              <textarea
                defaultValue={histoyText}
                className="form-control"
                onChange={(e) => setHistoryText(e.target.value)}
              ></textarea>
            </div>
            <div className="px-5 pb-8 mt-5 text-center">
              <button
                type="button"
                onClick={() => {
                  setHistoryModal(false);
                }}
                className="btn btn-outline-secondary w-24 mr-1"
              >
                Close
              </button>
              <button
                onClick={saveHistory}
                type="button"
                className="btn btn-success text-white w-24"
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

            <AccordionGroup className="accordion-boxed ">
              {historyData.map((value, index) => {
                return (
                  <AccordionItem key={index}>
                    <Accordion>
                      {helper.formatDate(
                        value?.updated_at,
                        "MMM D, YYYY h:mm A"
                      )}
                    </Accordion>
                    <AccordionPanel className="text-slate-600 dark:text-slate-500 leading-relaxed">
                      {value?.value}
                    </AccordionPanel>
                  </AccordionItem>
                );
              })}
            </AccordionGroup>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default AdminUsers;
