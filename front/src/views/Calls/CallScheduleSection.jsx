import { Lucide } from "@/base-components";


const CallScheduleSection = (props) => {
  const {index, deleteCallSchedule, data } = props;


  //console.log('call schedule',data);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2  mt-5 gap-4 px-5 py-4 relative">
      <div className="intro-y">
        <label className="form-label">Call Schedule Date</label>
        <input
          type="date"
          name={"call_schedule[" + index + "][date]"}
          className=" form-control"
          placeholder=""
          defaultValue={data.values && data.values[0] ? data.values[0].value : ""}
        />
      </div>
      <div className="intro-y">
        <label className="form-label">Call Schedule time</label>
        <input
          type="time"
          name={"call_schedule[" + index + "][time]"}
          className=" form-control"
          placeholder=""

          defaultValue={data.values && data.values[1] ? data.values[1].value : ""}
        />
      </div>

      <button
        type="button"
        className="btn-close absolute right-5 top-2"
        aria-label="Close"
        onClick={() => deleteCallSchedule(data.id)}
      >
        <Lucide icon="X" className="w-4 h-4" />
      </button>
    </div>
  );
};

export default CallScheduleSection;
