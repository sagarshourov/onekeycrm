import { Lucide } from "@/base-components";
import { helper } from "@/utils/helper";
import { loginState } from "../../state/login-atom";
const CallScheduleSection = (props) => {
  const { index, deleteCallSchedule, data } = props;

  //console.log('call schedule',data);

  return (
    <div className="grid grid-cols-1 border-t md:grid-cols-2 lg:grid-cols-2  mt-5 gap-4 px-5 py-4 relative">
      <div className="intro-y">
        <label className="form-label">Call Schedule Date</label>
        <input
          type="hidden"
          name={"call_schedule[" + index + "][created_at]"}
          defaultValue={
            data.created_at ? data.created_at : helper.formatCurrentDate()
          }
        />

        <input
          type="hidden"
          name={"call_schedule[" + index + "][user_id]"}
          defaultValue={data.user_id ? data.user_id : loginState.userId}
        />

        <input
          type="date"
          name={"call_schedule[" + index + "][date]"}
          className=" form-control"
          placeholder=""
          defaultValue={
            data.values && data.values[0] ? data.values[0].value : ""
          }
        />
      </div>
      <div className="intro-y">
        <label className="form-label">Call Schedule time</label>
        <input
          type="time"
          name={"call_schedule[" + index + "][time]"}
          className=" form-control"
          placeholder=""
          defaultValue={
            data.values && data.values[1] ? data.values[1].value : ""
          }
        />
      </div>

      <div>
        <label className="form-label mt-3 ">
          {" "}
          Add By{" "}
          <a className="text-info" href={"/profile/" + data?.user?.id}>
            {data.user && data?.user?.first_name + " " + data?.user?.last_name}
          </a>{" "}
          at {helper.formatDate(data?.created_at, "MMMM D, YYYY h:mm A")}
        </label>
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
