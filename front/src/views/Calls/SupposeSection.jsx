
const SupposeSection = (props) => {
  const { data } =
    props;



  //console.log("followup", props.data);

  return (
    <div className=" p-5 mt-5   bg-slate-100 dark:bg-gray-900 relative">
      <h3 className="text-xl pb-5 text-center font-bold dark:text-white">
        Suppose Information
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-4  gap-4 ">
        <div className="intro-x ">
          <label className="form-label">First Name </label>
          <input
            type="text"
            className="form-control"
            name={"suppose[0][first_name]"}
            defaultValue={data[0] ? data[0].values[0]?.value : ''}
          />
        </div>
        <div className="intro-x ">
          <label className="form-label">Last Name </label>
          <input type="text" className="form-control" name={"suppose[0][last_name]"}  defaultValue={data[0] ? data[0].values[1]?.value : ''}/>
        </div>
        <div className="intro-x ">
          <label className="form-label"> Last level of education </label>
          <input type="text" className="form-control" name={"suppose[0][degree]"}  defaultValue={data[0] ? data[0].values[2]?.value : ''} />
        </div>
        <div className="intro-x ">
          <label className="form-label">GPA </label>
          <input type="text" className="form-control" name={"suppose[0][gpa]"}  defaultValue={data[0] ? data[0].values[3]?.value : ''} />
        </div>
      </div>
    </div>
  );
};

export default SupposeSection;
