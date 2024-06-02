// import "@fullcalendar/core/vdom";
// import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

import tippy from "tippy.js";
import { Lucide, Modal, ModalBody } from "@/base-components";
import { LoadingIcon } from "@/base-components";
import { useState } from "react";

const Main = (props) => {
  const {
    type,
    events,
    deleteEvent,
    setEventId,
    deleteConfirmationModal,
    setDeleteConfirmationModal,
    loading,
  } = props;

 
  const [modelTitle, setModelTitle] = useState("");
  const [modelDescription, setModelDescription] = useState("");

  const [callId, setCallId] = useState(0);
  // const options = {
  //   plugins: [interactionPlugin, dayGridPlugin, listPlugin],
  //   droppable: false,
  //   headerToolbar: {
  //     left: "prev, next, today",
  //     center: "title",
  //     right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
  //   },
  //   aspectRatio: 1.5,
  //   height: "auto",
  //   navLinks: false,
  //   editable: true,
  //   events: events,
  //   eventClick: function (info) {
  //     console.log("ev");

  //     setModelDescription(info.event._def.extendedProps.description);
  //     setModelTitle(info.event.title);
  //     setDeleteConfirmationModal(true);
  //     setEventId(info.event._def.extendedProps.ev_id);
  //   },
  //   eventDidMount: function (info) {
  //     var tooltip = tippy(info.el, {
  //       content: info.event.extendedProps.description,
  //       placement: "right",
  //       interactive: true,
  //       theme: "light",
  //     });
  //   },
  // };

  return (
    <>
      {/* <FullCalendar options={options} /> */}

      <FullCalendar
        plugins={[dayGridPlugin, listPlugin, timeGridPlugin]}
        initialView="dayGridMonth"
        weekends={true}
        events={events}
        headerToolbar={{
          left: "prev, next, today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
        }}
        eventDidMount={(info) => {
          var tooltip = tippy(info.el, {
            content: info.event.extendedProps.description,
            placement: "right",
            interactive: true,
            theme: "light",
          });
        }}
        eventClick={(info) => {
          setModelDescription(info.event._def.extendedProps.description);
          setModelTitle(info.event.title);
          setDeleteConfirmationModal(true);
          setEventId(info.event._def.extendedProps.ev_id);
          setCallId(info.event._def.extendedProps.ev_id);
        }}
      />

      <Modal
        show={deleteConfirmationModal}
        onHidden={() => {
          setDeleteConfirmationModal(false);
        }}
      >
        <ModalBody className="p-0">
          <div className="p-5 text-center">
            <Lucide
              icon="Calendar"
              className="w-16 h-16 text-info mx-auto mt-3"
            />
            <div className="text-3xl mt-5">{modelTitle}</div>
            <div className="text-slate-500 mt-2">{modelDescription}</div>
          </div>
          <div className="px-5 pb-8 text-center">

            <a href={"calls/edit/"+callId} className="btn btn-outline-success mr-3">Edit</a>
            <button
              type="button"
              onClick={() => {
                setDeleteConfirmationModal(false);
              }}
              className="btn btn-outline-secondary w-24 mr-1"
            >
              Cancel
            </button>
            {type == 1 && (
              <button
                type="button"
                onClick={deleteEvent}
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
            )}
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default Main;
