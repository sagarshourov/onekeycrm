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

import { useParams, Link } from "react-router-dom";

import {
  useRecoilStateLoadable,
  useSetRecoilState,
  useRecoilValue,
} from "recoil";
import {
  searchListState,
  pagOffset,
  pageLimit,
  searchAtom,
  columnState,
  valueState,
} from "../../state/admin-atom";

import { loginState } from "../../state/login-atom";

import SearchTable from "./SearchTable";

import axios from "axios";
import { adminApi } from "../../configuration";

import { filter } from "lodash";
import { helper } from "@/utils/helper";
import { settingState } from "../../state/setting-atom";

function todayFilters(array) {
  // var today = "";

  var today = new Date();

  var today = helper.formatDate(today, "YYYY-MM-DD");

  return filter(array, (_items) => {
    return Date.parse(_items.follow_up_date) === Date.parse(today);
  });
}

function towFilters(array) {
  var tomorrow = new Date();

  tomorrow =
    tomorrow.getFullYear() +
    "-" +
    (tomorrow.getMonth() + 1) +
    "-" +
    (tomorrow.getDate() + 1);

  tomorrow = helper.formatDate(tomorrow, "YYYY-MM-DD");

  return filter(array, (_items) => {
    return Date.parse(_items.follow_up_date) === Date.parse(tomorrow);
  });
}

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

  const [callData, setCallState] = useRecoilStateLoadable(searchListState);
  const [rowCount, setRowCount] = useState(10);
  const [search, setSearch] = useState("");
  const [aheck, setAcheck] = useState(false);
  const [call_id, setCallId] = useState(0);
  const [loading, setLoading] = useState(false);

  const [historyModal, setHistoryModal] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [historyTitle, setHistoryTitle] = useState("");

  const [allCheck, setAllCheck] = useState([]);

  const logindata = useRecoilValue(loginState);

  const [histoyText, setHistoryText] = useState("");
  const [row, setRow] = useState([]);
  const [rowId, setRowID] = useState(0);

  const [secTitle, setSecTitle] = useState("");

  const setting = useRecoilValue(settingState);

  const setPageOffset = useSetRecoilState(pagOffset);
  const searchQuery = useSetRecoilState(searchAtom);
  const limitQuery = useSetRecoilState(pageLimit);

  const columnQuery = useSetRecoilState(columnState);
  const valueQuery = useSetRecoilState(valueState);

  const handelGo = (section) => {
    document.getElementsByClassName(
      "item" + section
    )[0].parentNode.style.display = "block";
  };

  const dragStart = (e, id) => {
    setRow(e.target);
    setRowID(id);
  };
  const dragover = (e) => {
   // console.log("over");
    e.preventDefault();
    let children = Array.from(e.target.parentNode.parentNode.children);
    // console.log("children", children);
    // console.log("row", row);

    // console.log("parent", e.target.parentNode);

    if (children.indexOf(e.target.parentNode) > children.indexOf(row)) {
      e.target.parentNode.after(row);
    } else {
      e.target.parentNode.before(row);
    }
  };

  const headers = {
    Authorization: `Bearer ${logindata?.token}`,
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
  const tableDragOver = (e, section) => {
    e.preventDefault();

    updateFunc(rowId, "sections", section);
  };

  const AllTableDrop = (e) => {
    e.preventDefault();
    updateFunc(rowId, "sections", null);
  };

  const allowDrop = (ev) => {
    ev.preventDefault();
  };

  const handelPageCount = (e) => {
    setRowCount(parseInt(e.target.value));

    limitQuery(parseInt(e.target.value));
  };

  const handelLoad = () => {
    let count = rowCount + 20;

    setRowCount(count);
    limitQuery(parseInt(count));
  };

  const handelSearch = (e) => {
    setSearch(e.target.value);
  };

  const searchCall = () => {
    console.log('serach click');
    // valueQuery(null);
    if (search == "") {
      searchQuery(0);
      setSearch("");
    } else {
      searchQuery(0);
      setSearch("");
      limitQuery(500);
      setRowCount(500);
      searchQuery(search);
    }
    setSecTitle("Search Result ");
  };

  const resetCall = () => {
    searchQuery(0);
    valueQuery(null);
    setSearch("");
    limitQuery(20);
  };

  const handelSection = (e) => {
    valueQuery(e.target.value);
    setSearch("");
    searchQuery(0);

    setSecTitle(e.target.selectedOptions[0].text);
  };

  const deleteAdmin = async () => {
    setLoading(true);
    const URL = adminApi() + "calls/" + call_id;

    try {
      const response = await axios.delete(URL, {
        headers,
        data: allCheck,
      });

      if (response?.data?.success) {
        setCallState(response?.data?.data);

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
        setCallState(response?.data?.data);
        setAllCheck([]);
        setAcheck(false);
      }
    } catch (err) {
      setLoading(false);
    }
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

  const exportCsv = async () => {
    const URL = adminApi() + "call_export";
    setLoading(true);
    try {
      const response = await axios.post(
        URL,
        { ids: allCheck , result : 'all'},
        {
          headers,
        }
      );
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="intro-y text-lg font-medium mt-10 ">Search Call List</h2>

      <div className="col-span-1 lg:order-1 order-2 lg:col-span-3">
        <div className="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2">
          <div className="lg:basis-8/12 grid grid-cols-4 lg:grid-cols-6 gap-2">
            <Link
              className="btn btn-elevated-primary shadow-md mr-2 py-2"
              to="/calls/add"
            >
              Add New Call
            </Link>

            {/* <button
              className="btn btn-elevated-secondary shadow-md mr-2 py-2"
              onClick={exportCsv}
            >
              Export Excel
            </button> */}

            {allCheck.length == 1 && (
              <Link
                className="btn btn-elevated-pending shadow-md mr-2 py-2"
                to={"/calls/edit/" + allCheck[0]}
              >
                Edit
              </Link>
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
                <select
                  name="sections"
                  onChange={(e) => bulkUpdate(e.target.name, e.target.value)}
                  className="form-select"
                >
                  <option value="0">Move..</option>

                  {setting.sections &&
                    setting.sections.map((val, indx) => (
                      <option key={indx} value={val?.id}>
                        {val?.title}
                      </option>
                    ))}
                </select>
              </>
            )}
          </div>
          {/* <div className="hidden md:block mx-auto text-slate-500">
               {filterData.length} {" /"}
              {callData.state === "hasValue" && callData.contents["length"]}
            </div> */}

          <div className="lg:basis-4/12   grid  grid-cols-1 lg:grid-cols-4 gap-3">
            <select
              onChange={(e) => handelSection(e)}
              className="w-full  form-select box mt-3 sm:mt-0"
            >
              <option value="null">Non Section</option>
              {setting.sections &&
                setting.sections.map((val, indx) => (
                  <option key={indx} value={val?.id}>
                    {val?.title}
                  </option>
                ))}
            </select>
            {/* <select
              onChange={handelPageCount.bind(this)}
              className="w-full  form-select box mt-3 sm:mt-0"
            >
              <option value="20">20</option>
              <option value="25">25</option>
              <option value="35">35</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select> */}

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

        <div className="intro-y mt-5 col-span-12 ">
          {callData.state === "hasValue" ? (
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
              <div
                onDrop={(e) => AllTableDrop(e)}
                onDragOver={(e) => allowDrop(e)}
              >
                <AccordionGroup className="accordion-boxed ">
                  <AccordionItem className="box">
                    <Accordion>{secTitle}</Accordion>
                    <AccordionPanel className="text-slate-600 dark:text-slate-500 leading-relaxed">
                      <SearchTable
                        rowCount={rowCount}
                        setDeleteConfirmationModal={setDeleteConfirmationModal}
                        users={callData.contents}
                        setUserId={setCallId}
                        setCallState={setCallState}
                        allCheck={allCheck}
                        setAllCheck={setAllCheck}
                        updateFunc={updateFunc}
                        aheck={aheck}
                        setAcheck={setAcheck}
                        setHistory={setHistory}
                        theme="bg-lite text-black"
                        dragStart={dragStart}
                        dragover={dragover}
                        tableDragOver={tableDragOver}
                        section={0}
                        setting={setting}
                        loadMore={handelLoad}
                      />
                    </AccordionPanel>
                  </AccordionItem>
                </AccordionGroup>
              </div>
            </>
          ) : (
            <h1 className="p-5">Loading...</h1>
          )}
        </div>

        {/* END: Data List */}
        {/* BEGIN: Pagination */}

        {/* {callData.state === "hasValue" && (
            <div className="intro-y col-span-12 flex flex-wrap sm:flex-row sm:flex-nowrap items-center">
              <button onClick={handelLoad} className="btn">
                Load more..
              </button>
            </div>
          )} */}

        {/* END: Pagination */}
      </div>

      {/* Grid */}
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
