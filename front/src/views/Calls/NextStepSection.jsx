import { helper } from "@/utils/helper";
import { useState, useEffect } from "react";
const NextStepSection = (props) => {
  const { data, theme, title, handelGo } = props;

  const [rowCount, setRowCount] = useState(10);

  //console.log('next step',data);
  // function get_time(arr, group) {
  //   var time = "";
  //   if (arr.extra && arr.extra.length > 0) {
  //     arr.extra.map((dat, index) => {
  //      // console.log('sa', dat);
  //       if (dat.groups == group) {
  //         time = dat.values &&  helper.findVaue(dat.values, "next_step_time")
  //       }
  //     });
  //   }
  //   //console.log(date);
  //   return time;
  // }

  function get_time(arr, group) {
    return arr && arr.next_step_time;
  }

  const loadMore = () => {
    setRowCount(rowCount + 30);
  };

  return (
    <div className="overflow-x-auto mt-5">
      <table className="table box">
        <thead className={theme}>
          <tr>
            <th className="whitespace-nowrap"> {title} </th>
            <th>Time</th>
            <th>Sections</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data.slice(0, rowCount).map((val, index) => {
              return (
                <tr
                  key={index}
                  onClick={() => handelGo(val.sec_id, val)}
                  className="cursor-pointer"
                >
                  <td>{val?.email}</td>
                  <td>{get_time(val, "my_step")}</td>
                  <td>{val?.section_title}</td>
                </tr>
              );
            })}
        </tbody>
      </table>

      {data && data.length > 0 && data.length > rowCount && (
        <button className="btn btn-default m-5" onClick={loadMore}>
          Load more ...
        </button>
      )}
    </div>
  );
};

export default NextStepSection;
