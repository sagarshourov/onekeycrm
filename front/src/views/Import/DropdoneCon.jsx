import {
  Dropzone
} from "@/base-components";
import { adminApi } from "../../configuration";
import { useRef } from "react";
const token = localStorage.token && localStorage.getItem("token");
const DropZoneCon = (props) => {
  const dropzoneSingleRef = useRef();
 // console.log('props', props.user_id);
  const getUserId = () => {
    var user = document.getElementById("user");
    return user.value;
  }
  
  return (
    <Dropzone
      getRef={(el) => {
        dropzoneSingleRef.current = el;
      }}
      options={{
        url: adminApi() + "call/import_file",
        thumbnailWidth: 150,
        maxFiles: 1,
        headers: { Authorization: `Bearer ${token}` },
        params: { user_id: props.user_id },
        init: function () {
          this.on("addedfile", function (file) {

          }),
            this.on("success", function (file, res) {
              props.setFile(res.data);
             // console.log(res);
              setTimeout(function () {
                //  window.location.reload();
              }, 500);
            });
        },
      }}
      className="dropzone"
    >
      <div className="text-lg font-medium">
        Drop files here or click to upload.
      </div>
      <div className="text-gray-600">
        This is just a demo dropzone. Selected files are
        <span className="font-medium">not</span> actually uploaded.
      </div>
    </Dropzone>
  );
}
export default DropZoneCon;