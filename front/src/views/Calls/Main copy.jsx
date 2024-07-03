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
import dom from "@left4code/tw-starter/dist/js/dom";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

import { useRecoilStateLoadable, useRecoilValue } from "recoil";
import { callListState , perPageIndex , currentPageIndex , callSelectIndex} from "../../state/admin-atom";
import { allUserListState } from "../../state/admin-atom";

import { loginState } from "../../state/login-atom";

import Table from "./Table";

import axios from "axios";
import { adminApi, getBaseApi } from "../../configuration";

import { filter } from "lodash";
import { helper } from "@/utils/helper";
import NextStepSection from "./NextStepSection";
import CallSchedule from "./CallSchedule";
import classnames from "classnames";
import { settingState } from "../../state/setting-atom";
import CallViewModal from "./CallViewModal";

function get_single(arr, group) {
  var date = "";
  if (arr.extra && arr.extra.length > 0) {
    arr.extra.map((dat, index) => {
      if (dat.groups == group && dat.values[0] && dat.values[0].value) {
        date = dat.values[0].value;
      }
    });
  }
  //console.log(date);

  return Date.parse(date);
}

function sectionFind(array, id) {
  if (array.length == 0) return 0;
  var re = 0;
  array.map((arr, ind) => {
    if (arr.id === id) {
      re = id;

      // console.log(arr);
    }
  });

  return re;
}

function todayNextFilters(array, callSwitch, user_id) {
  if (array.length == 0) return;
  var today = new Date();

  var today = helper.formatDate(today, "YYYY-MM-DD");

  if (callSwitch) {
    return filter(array, (_items) => {
      //return Date.parse(_items.follow_up_date) === Date.parse(today)
      return (
        _items.field == "next_step_date" &&
        Date.parse(_items.value) === Date.parse(today) &&
        _items?.assigned_to?.id === user_id
      );
    });
  } else {
    return filter(array, (_items) => {
      return (
        _items.field == "next_step_date" &&
        Date.parse(_items.value) === Date.parse(today)
      );
    });
  }
}

function tomorrowNextFilters(array, callSwitch, user_id) {
  var tomorrow = new Date();

  tomorrow =
    tomorrow.getFullYear() +
    "-" +
    (tomorrow.getMonth() + 1) +
    "-" +
    (tomorrow.getDate() + 1);
  tomorrow = helper.formatDate(tomorrow, "YYYY-MM-DD");
  if (callSwitch) {
    return filter(array, (_items) => {
      //return Date.parse(_items.follow_up_date) === Date.parse(today)
      return (
        _items.field == "next_step_date" &&
        Date.parse(_items.value) === Date.parse(tomorrow) &&
        _items?.assigned_to?.id === user_id
      );
    });
  } else {
    return filter(array, (_items) => {
      return (
        _items.field == "next_step_date" &&
        Date.parse(_items.value) === Date.parse(tomorrow)
      );
    });
  }
}

function scheduleFilters(array, callSwitch, user_id) {
  if (array.length == 0) return;
  var today = new Date();

  var today = helper.formatDate(today, "YYYY-MM-DD");

  if (callSwitch) {
    var data = filter(array, (_items) => {
      //return Date.parse(_items.follow_up_date) === Date.parse(today)

      return (
        _items.field == "date" &&
        Date.parse(_items.value) === Date.parse(today) &&
        _items?.assigned_to?.id === user_id
      );
    });

    return data.sort((a, b) => parseInt(a.time) - parseInt(b.time));

    // return data;
  } else {
    var data = filter(array, (_items) => {
      //return Date.parse(_items.follow_up_date) === Date.parse(today)
      //return Date.parse(_items.call_schedule_date) === Date.parse(today);

      return (
        _items.field == "date" && Date.parse(_items.value) === Date.parse(today)
      );
    });

    return data.sort((a, b) => parseInt(a.time) - parseInt(b.time));

    //return data;
  }
}

function tomorrowScheduleFilters(array, callSwitch, user_id) {
  if (array.length == 0) return;

  var tomorrow = new Date();

  tomorrow =
    tomorrow.getFullYear() +
    "-" +
    (tomorrow.getMonth() + 1) +
    "-" +
    (tomorrow.getDate() + 1);

  tomorrow = helper.formatDate(tomorrow, "YYYY-MM-DD");

  if (callSwitch) {
    var data = filter(array, (_items) => {
      return (
        _items.field == "date" &&
        Date.parse(_items.value) === Date.parse(tomorrow) &&
        _items?.assigned_to?.id === user_id
      );
    });
    return data.sort((a, b) => parseInt(a.time) - parseInt(b.time));
  } else {
    var data = filter(array, (_items) => {
      return (
        _items.field == "date" &&
        Date.parse(_items.value) === Date.parse(tomorrow)
      );
    });
    return data.sort(
      (a, b) => parseInt(a.time) - parseInt(b.time)
    );
    //return data;
  }
}

function todayNextFilters(array, callSwitch, user_id) {
  if (array.length == 0) return;
  var today = new Date();

  var today = helper.formatDate(today, "YYYY-MM-DD");

  if (callSwitch) {
    return filter(array, (_items) => {
      //return Date.parse(_items.follow_up_date) === Date.parse(today)
      return (
        get_single(_items, "my_step") === Date.parse(today) &&
        _items?.assigned_to?.id === user_id
      );
    });
  } else {
    return filter(array, (_items) => {
      //return Date.parse(_items.follow_up_date) === Date.parse(today)
      return get_single(_items, "my_step") === Date.parse(today);
    });
  }
}

function tomorrowNextFilters(array, callSwitch, user_id) {
  var tomorrow = new Date();

  tomorrow =
    tomorrow.getFullYear() +
    "-" +
    (tomorrow.getMonth() + 1) +
    "-" +
    (tomorrow.getDate() + 1);

  tomorrow = helper.formatDate(tomorrow, "YYYY-MM-DD");

  // return filter(array, (_items) => {
  //   return get_single(_items, "my_step") === Date.parse(tomorrow);
  // });

  if (callSwitch) {
    return filter(array, (_items) => {
      //return Date.parse(_items.follow_up_date) === Date.parse(today)
      return (
        get_single(_items, "my_step") === Date.parse(tomorrow) &&
        _items?.assigned_to?.id === user_id
      );
    });
  } else {
    return filter(array, (_items) => {
      //return Date.parse(_items.follow_up_date) === Date.parse(today)
      return get_single(_items, "my_step") === Date.parse(tomorrow);
    });
  }
}

function scheduleFilters(array, callSwitch, user_id) {
  if (array.length == 0) return;
  var today = new Date();

  var today = helper.formatDate(today, "YYYY-MM-DD");

  // return filter(array, (_items) => {
  //   return Date.parse(_items.call_schedule_date) === Date.parse(today);
  // });

  if (callSwitch) {
    var data = filter(array, (_items) => {
      //return Date.parse(_items.follow_up_date) === Date.parse(today)
      return (
        Date.parse(_items.call_schedule_date) === Date.parse(today) &&
        _items?.assigned_to?.id === user_id
      );
    });

    return data.sort(
      (a, b) => parseInt(a.call_schedule_time) - parseInt(b.call_schedule_time)
    );

    // return data;
  } else {
    var data = filter(array, (_items) => {
      //return Date.parse(_items.follow_up_date) === Date.parse(today)
      return Date.parse(_items.call_schedule_date) === Date.parse(today);
    });

    return data.sort(
      (a, b) => parseInt(a.call_schedule_time) - parseInt(b.call_schedule_time)
    );

    //return data;
  }
}

function tomorrowScheduleFilters(array, callSwitch, user_id) {
  if (array.length == 0) return;

  var tomorrow = new Date();

  tomorrow =
    tomorrow.getFullYear() +
    "-" +
    (tomorrow.getMonth() + 1) +
    "-" +
    (tomorrow.getDate() + 1);

  tomorrow = helper.formatDate(tomorrow, "YYYY-MM-DD");

  if (callSwitch) {
    var data = filter(array, (_items) => {
      return (
        Date.parse(_items.call_schedule_date) === Date.parse(tomorrow) &&
        _items?.assigned_to?.id === user_id
      );
    });
    return data.sort(
      (a, b) => parseInt(a.call_schedule_time) - parseInt(b.call_schedule_time)
    );
  } else {
    var data = filter(array, (_items) => {
      return Date.parse(_items.call_schedule_date) === Date.parse(tomorrow);
    });
    return data.sort(
      (a, b) => parseInt(a.call_schedule_time) - parseInt(b.call_schedule_time)
    );
    //return data;
  }
}

function applyAllFilters(
  array,
  searchValue,
  sections,
  user_id,
  priority,
  order
) {
  //console.log("priority", priority);
  if (array.length == 0) return;
  let filteredArray = [];
  if (user_id !== 0) {
    filteredArray = filter(array, (_items) => {
      if (
        _items.sections !== sectionFind(sections, _items.sections) &&
        _items.p_sort &&
        _items.p_sort.id == priority &&
        (_items.results.id == 3 || _items.results.id == 6) &&
        _items?.assigned_to?.id === user_id
      ) {
        return true;
      } else if (parseInt(priority) !== 0) {
        return false;
      }

      return (
        _items.sections !== sectionFind(sections, _items.sections) &&
        _items?.assigned_to?.id === user_id &&
        _items.results &&
        (_items.results.id == 3 || _items.results.id == 6) &&
        ((_items.email &&
          _items.email.toLowerCase().indexOf(searchValue.toLowerCase()) !==
          -1) ||
          (_items.first_name &&
            _items.first_name
              .toLowerCase()
              .indexOf(searchValue.toLowerCase()) !== -1) ||
          (_items.phone_number &&
            _items.phone_number
              .toLowerCase()
              .indexOf(searchValue.toLowerCase()) !== -1))
      );
    });
  } else {
    filteredArray = filter(array, (_items) => {
      if (
        _items.sections !== sectionFind(sections, _items.sections) &&
        _items.p_sort &&
        _items.p_sort.id == priority &&
        (_items.results.id == 3 || _items.results.id == 6)
      ) {
        return true;
      } else if (parseInt(priority) !== 0) {
        return false;
      }
      return (
        _items.sections !== sectionFind(sections, _items.sections) &&
        _items.results &&
        (_items.results.id == 3 || _items.results.id == 6) &&
        ((_items.email &&
          _items.email.toLowerCase().indexOf(searchValue.toLowerCase()) !==
          -1) ||
          (_items.first_name &&
            _items.first_name
              .toLowerCase()
              .indexOf(searchValue.toLowerCase()) !== -1) ||
          (_items.phone_number &&
            _items.phone_number
              .toLowerCase()
              .indexOf(searchValue.toLowerCase()) !== -1))
      );
    });
  }

  if (order == "asc") {
    return filteredArray.reverse();
  }

  return filteredArray;
}

function applySortFilters(array, searchValue, sec, user_id, priority) {
  if (array.length == 0) return;
  // if (sec == "no") {
  //   return filter(array, (_items) => {
  //     return (
  //       _items.user_id == user_id || _items.email.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1
  //     );
  //   });
  // } else

  if (user_id !== 0) {
    return filter(array, (_items) => {
      // if (_items.email) {
      if (
        _items.sections == parseInt(sec) &&
        _items.p_sort &&
        _items.p_sort.id == priority &&
        (_items.results.id == 3 || _items.results.id == 6) &&
        _items?.assigned_to?.id === user_id
      ) {
        return true;
      } else if (parseInt(priority) !== 0) {
        return false;
      }
      return (
        _items.sections == parseInt(sec) &&
        _items?.assigned_to?.id === user_id &&
        (_items.results.id == 3 || _items.results.id == 6) &&
        ((_items.email &&
          _items.email.toLowerCase().indexOf(searchValue.toLowerCase()) !==
          -1) ||
          (_items.first_name &&
            _items.first_name
              .toLowerCase()
              .indexOf(searchValue.toLowerCase()) !== -1) ||
          (_items.phone_number &&
            _items.phone_number
              .toLowerCase()
              .indexOf(searchValue.toLowerCase()) !== -1))
      );
      // } else {
      //   return true;
      // }
    });
  } else {
    return filter(array, (_items) => {
      // if (_items.email) {
      if (
        _items.sections == parseInt(sec) &&
        _items.p_sort &&
        _items.p_sort.id == priority &&
        (_items.results.id == 3 || _items.results.id == 6)
      ) {
        return true;
      } else if (parseInt(priority) !== 0) {
        return false;
      }
      return (
        _items.sections == parseInt(sec) &&
        (_items.results.id == 3 || _items.results.id == 6) &&
        ((_items.email &&
          _items.email.toLowerCase().indexOf(searchValue.toLowerCase()) !==
          -1) ||
          (_items.first_name &&
            _items.first_name
              .toLowerCase()
              .indexOf(searchValue.toLowerCase()) !== -1) ||
          (_items.phone_number &&
            _items.phone_number
              .toLowerCase()
              .indexOf(searchValue.toLowerCase()) !== -1))
      );
      // } else {
      //   return true;
      // }
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

 // const [callData, setCallState] = useRecoilStateLoadable(callListState);
  const [usersData, setUserState] = useRecoilStateLoadable(allUserListState);

  const [callData, setCallState] = useRecoilStateLoadable(callSelectIndex);
  console.log('callData',callData);
  const [currentPage, setCurrentPage] = useRecoilStateLoadable(currentPageIndex);

  const [perPage, setPerPage] = useRecoilStateLoadable(perPageIndex);
  

  const [rowCount, setRowCount] = useState(30);

  const [search, setSearch] = useState("");
  const [aheck, setAcheck] = useState(false);
  const [call_id, setCallId] = useState(0);
  const [loading, setLoading] = useState(false);

  const [historyModal, setHistoryModal] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [historyTitle, setHistoryTitle] = useState("");

  const [allCheck, setAllCheck] = useState([]);

  const logindata = useRecoilValue(loginState);

  //console.log('logindata',logindata);

  const [historyText, setHistoryText] = useState("");
  const [row, setRow] = useState([]);
  const [rowId, setRowID] = useState(0);
  const [callSwitch, setCallSwitch] = useState(false);
  const [order, setOrder] = useState("desc");

  const [showCallVew, setCallView] = useState(false);

  const [sections, setSection] = useState(0);
  const [priority, setPriority] = useState(0); //set by filter priority
  const [employee, setEmployee] = useState(0);
  const handelCallModel = (show) => {
    setCallView(show);
  };
  const [singleCall, setSingleCall] = useState([]);

  const setting = useRecoilValue(settingState);

  // console.log("logindata", logindata.role);

  const backToTop = () => {
    //console.log("loginData");
    window.scroll({ top: 0, behavior: "smooth" });
  };

  const exportExcel = () => {
    // console.log("Export Excel");

    window.open(getBaseApi() + "call/export", "_blank");
  };

  const handelGo = (section, call) => {
    //console.log("handel go", call);
    setSingleCall(call);
    handelCallModel(true);

    document.getElementsByClassName(
      "item" + section
    )[0].parentNode.style.display = "block";
  };

  const dragStart = (e, id) => {
    setRow(e.target);
    setRowID(id);
  };
  const dragover = (e) => {
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

    //console.log('tableDragOver',section);

    //console.log('sec',sections);

    if (section !== sections) {
      updateFunc(rowId, "sections", section);
    }
  };

  const AllTableDrop = (e) => {
    e.preventDefault();
    // console.log('AllTableDrop',sections);

    if (sections !== 0) {
      updateFunc(rowId, "sections", null);
    }
  };

  const allowDrop = (ev) => {
    ev.preventDefault();
  };

  const handelPageCount = (e) => {
    setRowCount(parseInt(e.target.value));
  };

  const handelSearch = (e) => {
    setSearch(e.target.value);
  };

  //let filterData = applySortFilters(callData.contents, search, id, 0);

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
    var dataz = findByValue(data, field);
    setHistoryTitle(field);
    setHistoryData(dataz);
    //console.log('his',data);
    setHistoryModal(true);
  };

  const saveHistory = async () => {
    //console.log('historyData',historyData);

    if (historyText == "") {
      alert("Text Required!");
    }
    setLoading(true);
    const URL = adminApi() + "call_single/" + call_id;
    try {
      const response = await axios.put(
        URL,
        {
          name: historyTitle,
          value: historyText,
          type: 2,
          user_id: logindata.userId,
        },
        {
          headers,
        }
      );

      if (response?.data?.success) {
        setCallState(response?.data?.data);
        setHistoryModal(false);
        setLoading(false);
        historyText("");
      } else {
        alert("Something is wrong please try again later!");
      }
    } catch (err) {
      setLoading(false);
    }
  };

  const [offset, setOffset] = useState(false);

  useEffect(() => {
    var warper = dom(".wrapper")[0];
    const onScroll = () => setOffset(window.pageYOffset);

    if (logindata.role === 2) setCallSwitch(true);
    // // clean up code
    // window.removeEventListener("scroll", onScroll);
    warper.addEventListener(
      "scroll",
      function () {
        if (warper.scrollTop > 150) {
          setOffset(true);
        } else {
          setOffset(false);
        }
      },
      { passive: true }
    );
    return () => warper.removeEventListener("scroll", onScroll);
  }, []);

  const CallSwitch = () => {
    setCallSwitch(() => !callSwitch);
  };
  const filterByPriority = (val) => {
    //console.log("prio", val);
    setPriority(val);
  };

  const EmployeeFilter = (val) => {
    //console.log("emp", val);
    setEmployee(parseInt(val));
  };

  // <button className="btn btn-pending w-32 mr-2 mb-2">
  //   <Lucide icon="Download" className="w-4 h-4 mr-2" /> Pending
  // </button>;

  //console.log("offset", offset);
  // console.log("userdata", usersData);
  return (
    <div className="">
      <h2 className="intro-y text-lg font-medium mt-10 ">Call List</h2>
      <div className={offset ? "fixed top-0 bg-white p-5 z-50 box " : ""}>
        <div className="intro-y   col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2">
          {/* <div className="bg-info bg-danger bg-success bg-warning bg-yellow-400 bg-secondary bg-purple-600 z-10 z-50"></div> */}
          <div className=" lg:basis-9/12 grid grid-cols-2 md:grid-cols-5 lg:grid-cols-8 gap-2 ">
            {allCheck.length == 0 && (
              <Link
                className="btn btn-primary shadow-md mr-2 py-1"
                to="/calls/add"
              >
                <Lucide icon="Plus" className="w-4 h-4 mr-2" /> Add New
              </Link>
            )}

            <select
              name="p_sort"
              onChange={(e) => filterByPriority(e.target.value)}
              className="form-select"
            >
              <option value="0">Select Priority..</option>

              {setting.priorities &&
                setting.priorities.map((val, indx) => (
                  <option key={indx} value={val?.id}>
                    {val?.title}
                  </option>
                ))}
            </select>

            {allCheck.length == 1 && (
              <Link
                className="btn btn-pending shadow-md mr-2 py-1"
                to={"/calls/edit/" + allCheck[0]}
              >
                <Lucide icon="Pencil" className="w-4 h-4 mr-2" /> Edit
              </Link>
            )}

            {allCheck.length > 0 ? (
              <>
                <button
                  onClick={() => setDeleteConfirmationModal(true)}
                  className="btn btn-danger"
                >
                  <Lucide icon="Trash" className="w-4 h-4 mr-2" /> Delete
                </button>

                <>
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
                    name="assigned_to"
                    onChange={(e) => bulkUpdate(e.target.name, e.target.value)}
                    className="form-select"
                  >
                    <option value="0">Assign Employee</option>
                    {usersData.state === "hasValue" &&
                      usersData.contents.map((val, indx) => (
                        <option key={indx} value={val?.id}>
                          {val?.first_name} {val?.last_name}
                        </option>
                      ))}
                  </select>
                </>

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
            ) : (
              logindata.role === 1 && (
                <>
                  {/* <Link
                    className="btn btn-success text-white shadow-md mr-2 py-1"
                    to="/calls/import"
                  >
                    Import 
                  </Link> */}

                  <button
                    onClick={exportExcel}
                    className="btn btn-warning text-white shadow-md mr-2 py-1"
                  >
                    <Lucide icon="Archive" className="w-4 h-4 mr-2" /> Export
                  </button>
                </>
              )
            )}

            {logindata.role !== 3 && (
              <>
                {allCheck.length == 0 && (
                  <select
                    name="assigned_to"
                    onChange={(e) => EmployeeFilter(e.target.value)}
                    className="form-select"
                  >
                    <option value="0">Employees ..</option>
                    {usersData.state === "hasValue" &&
                      usersData.contents.map((val, indx) => (
                        <option key={indx} value={val?.id}>
                          {val?.first_name} {val?.last_name}
                        </option>
                      ))}
                  </select>
                )}

                <div
                  onClick={CallSwitch}
                  className="dark-mode-switcher col-span-2  cursor-pointer shadow-md  bottom-0 left-0 box border rounded-full w-36 h-10 flex items-center justify-center z-50 "
                >
                  <div className="mr-4 text-slate-600 dark:text-slate-200">
                    Switch Calls
                  </div>
                  <div
                    className={classnames({
                      "dark-mode-switcher__toggle border": true,
                      "dark-mode-switcher__toggle--active": callSwitch,
                    })}
                  ></div>
                </div>

              </>
            )}
            {(allCheck.length == 0 && logindata.role === 1) && (
              <div className="mr-1">
                {order == "desc" ? (
                  <button
                    onClick={() => setOrder("asc")}
                    className="btn btn-outline-secondary "
                  >
                    {" "}
                    <Lucide
                      icon="ArrowUp"
                      className="w-4 h-4 mr-2"
                    /> Ascending{" "}
                  </button>
                ) : (
                  <button
                    onClick={() => setOrder("desc")}
                    className="btn btn-outline-secondary"
                  >
                    <Lucide icon="ArrowDown" className="w-4 h-4 mr-2" />
                    Descending{" "}
                  </button>
                )}
              </div>
            )}
          </div>
          {/* <div className="hidden md:block mx-auto text-slate-500">
               {filterData.length} {" /"}
              {callData.state === "hasValue" && callData.contents["length"]}
            </div> */}

          <div className="lg:basis-3/12 mt-3 lg:mt-0  grid grid-cols-2  md:grid-cols-7 gap-2">
            <select
              onChange={handelPageCount.bind(this)}
              className="form-select box lg:col-span-2"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="35">35</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>

            <div className="lg:col-span-5 ">
              <input
                onChange={handelSearch.bind(this)}
                type="text"
                className="form-control  box"
                placeholder="Search..."
              />
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4  gap-4 mt-5">
        <div className="col-span-1 lg:order-1 order-2 lg:col-span-3 z-10">
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
                      <Accordion>Non Section</Accordion>
                      <AccordionPanel className="text-slate-600 dark:text-slate-500 leading-relaxed">
                        <Table
                          rowCount={rowCount}
                          setDeleteConfirmationModal={
                            setDeleteConfirmationModal
                          }
                          calls={applyAllFilters(
                            callData.contents,
                            search,
                            setting.sections,
                            callSwitch ? logindata.userId : employee,
                            priority,
                            order
                          )}
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
                          setSection={setSection}
                          setting={setting}
                          setLoading={setLoading}
                          headers={headers}
                          setCurrentPage={setCurrentPage}
                          currentPage={parseInt(currentPage.contents)}
                          perPage={perPage.contents}
                        />
                      </AccordionPanel>
                    </AccordionItem>
                  </AccordionGroup>
                </div>

                {callData.state === "hasValue" &&
                  setting.sections &&
                  setting.sections.map((val, indx) => {
                    let calls = applySortFilters(
                      callData.contents,
                      search,
                      val?.id,
                      callSwitch ? logindata.userId : employee,
                      priority
                    );
                    // if (calls.length == 0) return;

                    var isOpen = null;

                    if (search !== "" && calls.length > 0) {
                      isOpen = 0;
                    }

                    return (
                      <div
                        key={indx}
                        onDrop={(e) => tableDragOver(e, val?.id)}
                        onDragOver={(e) => allowDrop(e)}
                      >
                        <AccordionGroup
                          draggable={true}
                          className="accordion-boxed mt-5"
                          selectedIndex={isOpen}
                        >
                          <AccordionItem className={"box "}>
                            <Accordion>{val?.title}</Accordion>
                            <AccordionPanel
                              id={"item" + val?.id}
                              className={
                                "text-slate-600 dark:text-slate-500 leading-relaxed  item" +
                                val?.id
                              }
                            >
                              <Table
                                rowCount={rowCount}
                                setDeleteConfirmationModal={
                                  setDeleteConfirmationModal
                                }
                                calls={calls}
                                setUserId={setCallId}
                                setCallState={setCallState}
                                allCheck={allCheck}
                                setAllCheck={setAllCheck}
                                updateFunc={updateFunc}
                                aheck={aheck}
                                setAcheck={setAcheck}
                                setHistory={setHistory}
                                theme={val?.theme}
                                dragStart={dragStart}
                                dragover={dragover}
                                tableDragOver={tableDragOver}
                                section={val?.id}
                                setSection={setSection}
                                setting={setting}
                                setLoading={setLoading}
                                headers={headers}
                                setCurrentPage={setCurrentPage}
                                currentPage={parseInt(currentPage.contents)}
                                perPage={perPage.contents}
                                
                              />
                            </AccordionPanel>
                          </AccordionItem>
                        </AccordionGroup>
                      </div>
                    );
                  })}
              </>
            ) : (
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

        <div className="col-span-1 lg:order-2 order-1 pt-12">
          {callData.state === "hasValue" && (
            <>
              <CallSchedule
                title="Today's Call Schedule"
                theme=" bg-warning text-white"
                handelGo={handelGo}
                data={scheduleFilters(
                  callData.contents,
                  callSwitch,
                  logindata.userId
                )}
              />

              <CallSchedule
                title="Tomorrow Call Schedule"
                theme=" table-dark text-white"
                handelGo={handelGo}
                data={tomorrowScheduleFilters(
                  callData.contents,
                  callSwitch,
                  logindata.userId
                )}
              />

              {/* <FollowUp
                title="Today’s Follow Ups"
                theme="table-dark"
                handelGo={handelGo}
                data={todayFollowFilters(
                  callData.contents,
                  callSwitch,
                  logindata.userId
                )}
              />

              <FollowUp
                title="Tomorrow’s Follow Ups"
                theme="table-light"
                handelGo={handelGo}
                data={towFilters(
                  callData.contents,
                  callSwitch,
                  logindata.userId
                )}
              /> */}
              <NextStepSection
                title="Today's Next Step"
                theme=" bg-success text-white"
                handelGo={handelGo}
                data={todayNextFilters(
                  callData.contents,
                  callSwitch,
                  logindata.userId
                )}
              />

              <NextStepSection
                title="Tomorrow’s Next Step"
                theme=" table-light text-white"
                handelGo={handelGo}
                data={tomorrowNextFilters(
                  callData.contents,
                  callSwitch,
                  logindata.userId
                )}
              />
            </>
          )}
        </div>
      </div>

      <CallViewModal
        showCallVew={showCallVew}
        setCallView={setCallView}
        handelCallModel={handelCallModel}
        data={singleCall}
      />
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
                defaultValue={historyText}
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
                if (value?.value == null) return;

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

      {/* <button className="backToTop-btn k-button " onClick={() => backToTop()}>
        <div className="d-none d-xl-block mr-1">Top</div>
      </button> */}
    </div>
  );
};

export default AdminUsers;
