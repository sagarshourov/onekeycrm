import { Lucide } from "@/base-components";

const FollowUpSection = (props) => {
  const { index, data, setting, deleteFollowUp, handelSelect, onChange } =
    props;

  //console.log("followup", data);

  return (
    <div className="p-2 lg:p-5 md:mt-5  border-t relative">
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 ">
        <div className="intro-x ">
          <label className="form-label"> Follow Up Call Date</label>
          <div className="relative w-full">
            <div className="absolute rounded-l w-10 h-full flex items-center justify-center bg-slate-100 border text-slate-500 dark:bg-darkmode-700 dark:border-darkmode-800 dark:text-slate-400">
              <Lucide icon="Calendar" className="w-4 h-4" />
            </div>
            <input
              type="date"
              name={"follow_up[" + index + "][follow_up_date]"}
              className=" pl-12 form-control"
              onChange={(e) => onChange(e.target.value, index, 0)}
              defaultValue={data.values && data.values[0] ? data.values[0].value : ""}
            />
          </div>
        </div>

        <div className="intro-x ">
          <label className="form-label">Follow Up Call Results</label>

          <select
            onChange={(e) => handelSelect(e, index)}
            name={"follow_up[" + index + "][f_results]"}
            className="form-control"
            defaultValue={data.values && data.values[1] ? data.values[1].value : ""}
          >
            <option value="0">Select...</option>

            {setting.results &&
              setting.results.map((val, indx) => (
                <option key={indx} value={val.id}>
                  {val?.title}
                </option>
              ))}
          </select>
        </div>

        <div className="intro-y lg:col-span-4">
          <label className="form-label">Follow up Notes</label>
          <textarea
            name={"follow_up[" + index + "][follow_up_notes]"}
            className="form-control"
            placeholder=""
            onChange={(e) => onChange(e.target.value, index, 2)}
            defaultValue={data.values && data.values[2] ? data.values[2].value : ""}
          />
        </div>
        {/* <div className="intro-y">
          <label className="form-label"> Agreed to Pay</label>
          <select
            name={"follow_up[" + index + "][agreed_to_pay]"}
            className="form-control"
            value={data.values && data.values[3] ? data.values[3].value : ""}
            onChange={(e) => onChange(e.target.value, index, 3)}
          >
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>
        </div>
        <div className="intro-y">
          <label className="form-label"> Payment Method</label>
          <select
            className="form-control"
            name={"follow_up[" + index + "][payment_method]"}
            value={data.values && data.values[4] ? data.values[4].value : ""}
            onChange={(e) => onChange(e.target.value, index, 4)}
          >
            <option value="0">Select ... </option>

            {setting.payment_method &&
              setting.payment_method.map((val, indx) => (
                <option key={indx} value={val.id}>
                  {val?.title}
                </option>
              ))}
          </select>
        </div> */}
      </div>
      <button
        type="button"
        className="btn-close absolute right-5 top-2"
        aria-label="Close"
        onClick={() => deleteFollowUp(data.id)}
      >
        <Lucide icon="X" className="w-4 h-4" />
      </button>
    </div>
  );
};

export default FollowUpSection;
