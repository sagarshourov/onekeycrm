import { Litepicker } from "@/base-components";

const MultiPicker = (props) => {
  const { daterange, handelRange, dateMode } = props;

  return (
    <Litepicker
      value={daterange}
      onChange={handelRange}
      placeholder = "Pick a Date Range"
      options={{
        // format: "YYYY-MM-DD",
        autoApply: false,
        singleMode: false,
        numberOfColumns:  2,
        numberOfMonths: 2,
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

export default MultiPicker;
