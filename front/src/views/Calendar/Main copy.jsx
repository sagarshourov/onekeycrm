import {
  Lucide,
  FullCalendarDraggable,
  TabGroup,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Litepicker,
  TomSelect,
  Alert,
  Modal,
  ModalBody,
} from "@/base-components";
import Calendar from "@/components/calendar/Main";
import { LoadingIcon } from "@/base-components";
import dom from "@left4code/tw-starter/dist/js/dom";
import axios from "axios";
import { adminApi } from "../../configuration";
import { useState } from "react";
import { helper } from "@/utils/helper";

import { useRecoilState, useRecoilStateLoadable } from "recoil";
import { eventListState } from "../../state/events-atom";
const token = localStorage.getItem("token");
const headers = {
  Authorization: `Bearer ${token}`,
  ContentType: "application/json",
};

import { filter } from "lodash";

function applySortFilters(array, searchValue) {
  return filter(array, (_items) => {
    if (_items !== null) {
      return _items?.title
        ? _items?.title.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1
        : true;
    }
  });
}

function event_format(data) {
  let obj = [];
  data.length > 0 &&
    data.map((dat, index) => {
      obj.push({
        id: dat.id,
        ev_id: dat.id,
        start: dat.values[0] && dat.values[0].value,
        title: dat.calls && dat.calls?.first_name + " " + dat.calls?.last_name,
        description:dat.values[2] ? dat.values[2].value : " ",
      });
    });

  return obj;
}

const Events = (props) => {
  const [eventDatas, setEventState] = useRecoilStateLoadable(eventListState);

  const [delConfirmationModal, setDelConfirmationModal] = useState(false);
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);

  const [date, setDate] = useState("");
  const [select, setSelect] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false);
  const [event_id, setEventId] = useState(false);

  const [search, setSearch] = useState("");
  const deleteEvent = async () => {
    const LOGIN_URL = adminApi() + "delete_event";

    setLoading(true);

    try {
      const response = await axios.post(
        LOGIN_URL,
        { event_id: event_id },
        {
          headers,
        }
      );

      if (response?.data?.success) {
        setLoading(false);
        setDelConfirmationModal(false);
        setDeleteConfirmationModal(false);
        setEventState(response?.data?.data);
      }
    } catch (err) {
      setLoading(false);
    }
  };

  const handelSave = async () => {
    if (select == "") {
      alert("Select user !");

      return false;
    }

    if (notes == "") {
      alert("Notes required !");

      return false;
    }

    setLoading(true);
    setSuccess(false);
    const LOGIN_URL = getAdmin() + "save_event";

    try {
      const response = await axios.post(
        LOGIN_URL,
        { user_id: select, date: date, notes: notes },
        {
          headers,
        }
      );

      if (response.data.success) {
        setNotes("");
        setSelect("");
        setSuccess(true);
        setLoading(false);
        setEventState(response?.data?.data);
      }

      //  (response.data);
    } catch (err) {
      setLoading(false);
    }
  };

  const handelSearch = (e) => {
   // console.log("search");
    setSearch(e.target.value);
  };

  let filterData = applySortFilters(event_format(eventDatas.contents), search);

   //console.log("filter data", filterData);

  return (
    <>
      <div className="intro-y flex flex-col sm:flex-row items-center mt-8">
        <h2 className="text-lg font-medium mr-auto">Users Events List</h2>
        <div className="w-full sm:w-auto flex mt-4 sm:mt-0"></div>
      </div>
      <div className="grid grid-cols-12 gap-5 mt-5">
        {/* BEGIN: Calendar Side Menu */}
        <TabGroup className="col-span-12 xl:col-span-4 2xl:col-span-3">
          <div className="box p-2 intro-y">
            <TabList className="nav-pills">
              <Tab className="w-full py-2" tag="button">
                Event List
              </Tab>
            </TabList>
          </div>
          <TabPanels className="mt-5 intro-y">
            <TabPanel>
              <FullCalendarDraggable
                id="calendar-events"
                className="h-[820px] overflow-y-auto scrollbar-hidden"
              >
                {eventDatas.state === "hasValue" &&
                  eventDatas?.contents.map((event, key) => {
                    return (
                      <div
                        key={key}
                        className="event box p-5 cursor-pointer mt-5 first:mt-0"
                      >
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-warning rounded-full mr-3"></div>
                          <div className="event__title font-medium truncate">
                            {event.calls &&
                              event.calls?.first_name +
                                " " +
                                event.calls?.last_name}
                          </div>
                          {/* <Lucide
                              icon="Edit"
                              className="w-4 h-4 text-slate-500 ml-auto"
                            /> */}
                        </div>
                        <div className="border-b border-t border-slate-200/60 dark:border-darkmode-400 py-5 my-5">
                          <div className="flex items-center">
                            <Lucide
                              icon="Calendar"
                              className="w-4 h-4 text-slate-500 mr-2"
                            />

                            {helper.formatDate(
                              event?.values[0]?.value,
                              "MMM D, YYYY"
                            )}
                          </div>

                          <div className="flex items-center mt-3">
                            <Lucide
                              icon="Map"
                              className="w-4 h-4 text-slate-500 mr-2"
                            />
                            {event?.values[2] && event?.values[2].value}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </FullCalendarDraggable>
            </TabPanel>
          </TabPanels>
        </TabGroup>
        {/* END: Calendar Side Menu */}
        {/* BEGIN: Calendar Content */}
        <div className="col-span-12 xl:col-span-8 2xl:col-span-9">
          <div className="box p-5">
            <div className="flex justify-center ...">
              <input
                type="text"
                className="form-control mb-5 w-96"
                placeholder="Search by user"
                onChange={handelSearch.bind(this)}
              />
            </div>

            {eventDatas.state == "hasValue" && (
              <Calendar
                type="2"
                deleteEvent={deleteEvent}
                setEventId={setEventId}
                events={filterData}
                loading={loading}
                deleteConfirmationModal={deleteConfirmationModal}
                setDeleteConfirmationModal={setDeleteConfirmationModal}
              />
            )}
          </div>
        </div>
        {/* END: Calendar Content */}

        <Modal
          show={delConfirmationModal}
          onHidden={() => {
            setDelConfirmationModal(false);
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
                  setDelConfirmationModal(false);
                }}
                className="btn btn-outline-secondary w-24 mr-1"
              >
                Close
              </button>
            </div>
          </ModalBody>
        </Modal>
      </div>
    </>
  );
};

export default Events;
