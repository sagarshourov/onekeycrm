import { helper } from "@/utils/helper";

const NextStepSection = (props) => {
  const { data, theme, title, handelGo } = props;



  function get_time(arr, group) {
    var time = "";
    if (arr.extra && arr.extra.length > 0) {
      arr.extra.map((dat, index) => {
        console.log('sa', dat);
        if (dat.groups == group) {
          time = dat.values &&  helper.findVaue(dat.values, "next_step_time")
        }
      });
    }
    //console.log(date);
    return time;
  }

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
            data.map((val, index) => (
              <tr
                key={index}
                 onClick={() => handelGo(val.sections , val)}
                className="cursor-pointer"
              >
                <td>{val?.email}</td>
                <td>{get_time(val, "my_step")}</td>
                <td>{val?.section?.title}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default NextStepSection;
