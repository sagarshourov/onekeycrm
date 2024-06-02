import { Lucide, Litepicker, Input } from "@/base-components";

import { useState } from "react";

const Confirmed = (props) => {
  const { index, data, setting, deleteConGpa, handelSelect, team, onChange } =
    props;

  //console.log("followup", data);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 bg-slate-100 mt-5 gap-4 px-5 py-4 relative">
      <div className="intro-x">
        <label className="form-label">Confirmed education Level</label>
        <select
          name={"con_gpa[" + index + "][applying_for]"}
          className="form-control"
          onChange={(e) => onChange(e.target.value, index, 0)}
          defaultValue={data.values && data.values[0] ? data.values[0].value : ""}
        >
          <option value="0">Select...</option>
          {setting.applying_for &&
            setting.applying_for.map((val, indx) => (
              <option key={indx} value={val?.id}>
                {val?.title}
              </option>
            ))}
        </select>
      </div>
      <div className="intro-x">
        <label className="form-label">Confirmed GPA</label>

        <input
          type="text"
          className="form-control"
          placeholder=""
          name={"con_gpa[" + index + "][confirmed_gpa]"}
          onChange={(e) => onChange(e.target.value, index, 1)}
          defaultValue={data.values && data.values[1] ? data.values[1].value : ""}
        />
      </div>
      {/* {parseInt(team) === 1 &&
        data.values &&
        parseInt(data.values[1].value) < 13.5 && (
          <div className="intro-x">
            <label className="form-label">Offered</label>

            <select
              className="form-control"
              name={"con_gpa[" + index + "][offered]"}

              defaultValue={data.values && data.values[2] ? data.values[2].value : ""}  

            >
              <option value="1">Certificate</option>
              <option value="2">English Courses</option>
            </select>
          </div>
        )} */}

      <button
        type="button"
        className="btn-close absolute right-5 top-2"
        aria-label="Close"
        onClick={() => deleteConGpa(data.id)}
      >
        <Lucide icon="X" className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Confirmed;
