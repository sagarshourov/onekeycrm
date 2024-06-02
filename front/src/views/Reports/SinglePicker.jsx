import { Litepicker } from "@/base-components";

const SinglePicker = (props) => {
  const { daterange, handelRange, dateMode } = props;

  return (
    <Litepicker
      value={daterange}
      onChange={handelRange}
      options={{
        // format: "YYYY-MM-DD",
        autoApply: false,
        singleMode: true,
        numberOfColumns: 1,
        numberOfMonths: 1,
        showWeekNumbers: true,
        dropdowns: {
          minYear: 1990,
          maxYear: 2030,
          months: true,
          years: true,
        },
      }}
      className="form-control "
    />
  );
};

export default SinglePicker;
