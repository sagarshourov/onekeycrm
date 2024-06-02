import { Lucide, Checkbox } from "@/base-components";

import { Link } from "react-router-dom";
import { recorder } from "./lib/script";

const UsersTable = (props) => {
  const {
    users,
    rowCount,
    allCheck,
    setAllCheck,
    aheck,
    setAcheck,
    theme,
    dragStart,
    setAllNumber,
  } = props;

  const handelAllCheck = (e) => {
    const { checked } = e.target;

    if (checked) {
      let id = [];
      let phone_number = [];

      users.map((li) => {
        id.push(li.id);

        if (li.phone_number) {
          phone_number.push(li.phone_number);
        }
      });

      setAllNumber(phone_number);

      setAllCheck(id);

      // setAllCheck(users.map((li) => li.id));
      setAcheck(true);
    } else {
      setAllCheck([]);
      setAcheck(false);
    }
  };

  const handelSingleCheck = (e) => {
    const { id, checked } = e.target;
    setAllCheck([...allCheck, parseInt(id)]);
    if (!checked) {
      setAllCheck(allCheck.filter((item) => item !== parseInt(id)));
    }
  };

  const handelCall = (phone_number, user_id, id) => {
    // window.open("https://wa.me/" + phone_number);

    phone_number = parseInt(phone_number.replace(/[^A-Z0-9]/gi, ""));

    // console.log("phone_number", phone_number);
    var myWindow = window.open(
      "https://wa.me/" + "+" + phone_number,
      "",
      "toolbar=no,status=no,menubar=no,location=center,scrollbars=no,resizable=no,height=100,width=100"
    );

    setTimeout(function () {
      myWindow.close();
    }, 1000);
    // myWindow.close();

    // myWindow.document.write('<script>window.location.href="https://wa.me/'+phone_number+'";  setTimeout(function(){  window.close(); },1000) ;  </script>');

    recorder.start(user_id, id);
  };

  const stopCall = () => {
    recorder.stop();
  };

  return (
    <div className="overflow-auto relative">
      {/* <button className="btn btn-danger text-white" onClick={stopCall}>
        Stop recording
      </button> */}
      {/* <a id="download" className="btn btn-success text-white ml-5" href="#">
        Download
      </a> */}
      <table className="table  mt-2">
        <thead className={theme}>
          <tr>
            <th className="whitespace-nowrap">
              <div className=" mt-2">
                <Checkbox
                  className="form-check-input"
                  key={0}
                  type="checkbox"
                  name="allcheck"
                  id={0}
                  handleClick={handelAllCheck}
                  isChecked={aheck}
                />
              </div>
            </th>

            <th className="whitespace-nowrap">No</th>
            <th className="whitespace-nowrap">Client</th>
            <th className=" whitespace-nowrap">Phone</th>
            <th className="whitespace-nowrap">Call</th>
            {/* <th className="whitespace-nowrap">Chat</th> */}
            <th className="whitespace-nowrap">History</th>
          </tr>
        </thead>
        <tbody>
          {users.slice(0, rowCount).map((user, key) => {
            let count = key + 1;

            var team_id = user?.user?.team;

            let dark = "";
            if (
              user?.gpa &&
              team_id &&
              parseFloat(user.gpa) < 2.5 &&
              team_id == 2
            ) {
              dark = " alert-danger-soft ";
            } else if (
              user?.gpa &&
              team_id &&
              parseFloat(user.gpa) < 13 &&
              team_id == 1
            ) {
              dark = " alert-danger-soft ";
            } else {
              dark = " bg-white";
            }
            return (
              <tr
                key={key}
                className={"border-t pt-2" + dark}
                draggable={true}
                onDragStart={(e) => dragStart(e, user.id)}
                // onDragOver={(e) => dragover(e)}
              >
                <td>
                  <div className="form-check mt-2">
                    <Checkbox
                      className="form-check-input "
                      key={key}
                      type="checkbox"
                      name="select"
                      id={user.id}
                      handleClick={handelSingleCheck}
                      isChecked={allCheck.includes(user.id)}
                    />
                  </div>
                </td>
                <td className="w-40">{count}</td>
                <td>
                  {user.first_name} {user.last_name}
                  <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                    {user.email}
                  </div>
                </td>

                <td>{user.whatsapp ? user?.whatsapp : user?.phone_number}</td>
                <td>
                  <button
                    onClick={(e) =>
                      handelCall(
                        user.whatsapp ? user?.whatsapp : user?.phone_number,
                        user?.user_id,
                        user?.id
                      )
                    }
                    className="btn btn-success mr-1 mb-2"
                  >
                    <Lucide icon="PhoneCall" className="w-5 h-5 text-white" />
                  </button>
                </td>
                {/* <td>
                  <button className="btn btn-success mr-1 mb-2">
                    <Lucide
                      icon="MessageCircle"
                      className="w-5 h-5 text-white"
                    />
                  </button>
                </td> */}
                <td>
                  <Link
                    to={"/whatsapp/message/history/" + user?.id}
                    className="btn btn-primary mr-1 mb-2"
                  >
                    View
                    <Lucide icon="Video" className="w-5 h-5 ml-3 text-white" />
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
