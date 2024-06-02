import { Lucide, LoadingIcon, Dropzone, Input } from "@/base-components";
import axios from "axios";
import { useRecoilValue } from "recoil";

import { useState, useRef } from "react";
import { getBaseApi } from "../../configuration";

const token = localStorage.getItem("token");

const UserMain = () => {
  const dropzoneSingleRef = useRef();
  const userData = useRecoilValue({});

  const [val, setValue] = useState(userData);
  const [edit, setEdit] = useState(true);
  const [editProfile, handelEditProfileClick] = useState(false);
  const [loading, setLoading] = useState(false);
  const handelEditClick = (val) => {
    handelEditProfileClick(false);
    setEdit(val);
  };

  const handelSave = async (e) => {
    e.preventDefault();

    if (val.password !== val.rpassword) {
      alert("Password and retype password not matching !");
      return;
    }

    setLoading(true);
    const LOGIN_URL = getBaseApi() + "save_user";

    const token = localStorage.getItem("token");

    const headers = {
      Authorization: `Bearer ${token}`,
      ContentType: "application/json",
    };

    try {
      const response = await axios.post(LOGIN_URL, val, {
        headers,
      });
      setLoading(false);
      setEdit(true);
      window.location.reload();
    } catch (err) {
      setLoading(false);
    }
  };

  const saveRadio = (gendar) => {
    setValue({ ...val, gendar: gendar });
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 md:col-span-9 xl:col-span-9">
        <div className="grid grid-cols-12 gap-6">
          {/* BEGIN: General Report */}
          <div className="col-span-12 mt-6">
            <div className="intro-y block sm:flex items-center h-20">
              <h2 className="text-lg font-medium truncate mr-5">Admin Profile</h2>
            </div>
            <div className="box intro-y p-5">
              <div className="flex justify-between border-b border-slate-200/60 dark:border-darkmode-400 pb-5 mb-5">
                <div className="font-medium truncate ">GENERALS</div>

                {!edit && (
                  <div className="flex">
                    <button
                      onClick={() => handelEditClick(true)}
                      className="btn btn-rounded-secondary w-24 mr-1 mb-2"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handelSave}
                      className="btn btn-rounded-primary  w-24 mr-1 mb-2"
                    >
                      Save
                      {loading && (
                        <LoadingIcon
                          icon="three-dots"
                          color="white"
                          className="w-4 h-4 ml-2"
                        />
                      )}
                    </button>
                  </div>
                )}

                <button className="" onClick={() => handelEditClick(false)}>
                  <Lucide icon="Edit" className="w-4 h-4 text-slate-500 " />
                </button>
              </div>
              <div className=" md:columns-3">
                <div>
                  <label htmlFor="regular-form-1" className="form-label">
                    First Name
                  </label>
                  <Input
                    setValue={setValue}
                    name="first_name"
                    value={val}
                    readOnly={edit}
                    type="text"
                    className="form-control"
                    placeholder="Type here"
                  />
                </div>
                <div>
                  <label htmlFor="regular-form-1" className="form-label">
                    Middle Name
                  </label>

                  <Input
                    setValue={setValue}
                    name="middle_name"
                    type="text"
                    value={val}
                    readOnly={edit}
                    className="form-control"
                    placeholder="Type here"
                  />
                </div>
                <div>
                  <label htmlFor="regular-form-1" className="form-label">
                    Last Name
                  </label>

                  <Input
                    setValue={setValue}
                    name="last_name"
                    type="text"
                    value={val}
                    readOnly={edit}
                    className="form-control"
                    placeholder="Last name"
                  />
                </div>
              </div>

              <div className="mt-5 mb-5  md:columns-3">
                <div>
                  <label htmlFor="regular-form-1" className="form-label">
                    Username
                  </label>
                  <Input
                    setValue={setValue}
                    type="text"
                    name="email"
                    value={val}
                    readOnly={true}
                    className="form-control"
                    placeholder="Enter Name"
                  />
                </div>
                <div>
                  <label htmlFor="regular-form-1" className="form-label">
                    Password
                  </label>

                  <Input
                    setValue={setValue}
                    type="password"
                    name="password"
                    value={val}
                    readOnly={edit}
                    className="form-control"
                    placeholder="Enter Password"
                  />
                </div>
                <div>
                  <label htmlFor="regular-form-1" className="form-label">
                    Re-type Password
                  </label>

                  <Input
                    setValue={setValue}
                    type="password"
                    name="rpassword"
                    value={val}
                    readOnly={edit}
                    className="form-control"
                    placeholder="Enter Password"
                  />
                </div>
              </div>

              <div className="mt-5 mb-5  md:columns-3">
                <div>
                  <label htmlFor="regular-form-1" className="form-label">
                    Date Of Birth
                  </label>

                  <Input
                    setValue={setValue}
                    type="date"
                    name="birth"
                    value={val}
                    readOnly={edit}
                    className="form-control"
                    placeholder=""
                  />
                </div>
                <div>
                  <label htmlFor="regular-form-1" className="form-label">
                    Gender
                  </label>
                  <div className="flex flex-col sm:flex-row mt-2">
                    <div className="form-check mr-2">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="gendar"
                        value="male"
                        checked={val.gendar == "male"}
                        onChange={() => saveRadio("male")}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="radio-switch-4"
                      >
                        Male
                      </label>
                    </div>
                    <div className="form-check mr-2 mt-2 sm:mt-0">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="gendar"
                        value="female"
                        checked={val.gendar == "female"}
                        onChange={() => saveRadio("female")}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="radio-switch-5"
                      >
                        Female
                      </label>
                    </div>
                  </div>
                </div>
                <div>
                  <label htmlFor="regular-form-1" className="form-label">
                    {""}
                  </label>
                </div>
              </div>
            </div>

            <div className="box intro-y p-5 mt-5 pb-5">
              <div className="flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5 mb-5">
                <div className="font-medium truncate ">Contact</div>
              </div>
              <div className=" mb-5 md:columns-3">
                <div>
                  <label htmlFor="regular-form-1" className="form-label">
                    Mobile Phone
                  </label>
                  <div className="input-group">
                    <div className="input-group-text">
                      <Lucide
                        icon="Phone"
                        className="w-4 h-4 text-slate-500 ml-auto"
                      />
                    </div>

                    <Input
                      setValue={setValue}
                      type="text"
                      name="user_phone"
                      value={val}
                      readOnly={edit}
                      className="form-control"
                      placeholder="Phone no."
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="regular-form-1" className="form-label">
                    Whatsapp
                  </label>
                  <div className="input-group">
                    <div className="input-group-text">
                      <Lucide
                        icon="PhoneCall"
                        className="w-4 h-4 text-slate-500 ml-auto"
                      />
                    </div>
                    <Input
                      setValue={setValue}
                      type="text"
                      name="whatsapp"
                      value={val}
                      readOnly={edit}
                      className="form-control"
                      placeholder="Phone no."
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="regular-form-1" className="form-label">
                    Email
                  </label>
                  <div className="input-group">
                    <div className="input-group-text">
                      <Lucide
                        icon="Mail"
                        className="w-4 h-4 text-slate-500 ml-auto"
                      />
                    </div>
                    <Input
                      setValue={setValue}
                      type="text"
                      name="email"
                      value={val}
                      readOnly={edit}
                      className="form-control"
                      placeholder="Email"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* END: General Report */}
        </div>
      </div>
      <div className="col-span-12 md:col-span-3 xl:col-span-3">
        <div className="border-l border-slate-300/50 h-full pt-6 pb-6">
          <div className="pl-6 grid grid-cols-12 gap-x-6 gap-y-8">
            {/* BEGIN: Attachments */}
            <div className="col-span-12 md:col-span-12 xl:col-span-12 col-span-12">
              <div className="mt-4">
                <div className="intro-x box h-screen">
                  <div className="flex justify-end">
                    <button
                      className="ml-auto mt-2 mr-2"
                      onClick={() => {
                        handelEditProfileClick(true);
                        setEdit(true);
                      }}
                    >
                      <Lucide icon="Edit" className="w-4 h-4 text-slate-500 " />
                    </button>
                  </div>

                  <div className="col-span-12 my-5 flex items-center">
                    <div className="image-fit w-40 h-40 rounded-full border-4 border-white shadow-md overflow-hidden m-auto">
                      <img
                        alt="Profile Image"
                        src={
                          getBaseApi() + "file/" + val?.profile_image?.file_path
                        }
                      />
                    </div>
                  </div>
                  {editProfile && (
                    <div className="col-span-12 my-5 flex items-center justify-center ">
                      <Dropzone
                        getRef={(el) => {
                          dropzoneSingleRef.current = el;
                        }}
                        options={{
                          url: getBaseApi() + "file_upload",
                          thumbnailWidth: 150,
                          maxFilesize: 5,
                          maxFiles: 1,
                          headers: { Authorization: `Bearer ${token}` },
                          params: { type: 2 },

                          init: function () {
                            this.on("addedfile", function (file) {}),
                              this.on("success", function (file, res) {
                                handelEditProfileClick(false);
                                // setValue([] res.data.file_path);
                                const obj = {
                                  profile_image: {
                                    file_path: res.data.file_path,
                                  },
                                };
                                setValue({
                                  ...val,
                                  ...obj,
                                });
                              });
                          },
                        }}
                        className="dropzone"
                      >
                        <div className="text-lg font-medium">
                          Drop files here or click to upload.
                        </div>
                        <div className="text-gray-600">
                          File size
                          <span className="font-medium">not</span> more than 5
                          MB
                        </div>
                      </Dropzone>
                    </div>
                  )}
                  <div className="col-span-12 my-5 flex items-center">
                    <h1 className=" m-auto text-2xl font-medium">
                      {val.first_name + " " + val.last_name}
                    </h1>
                    <div className="text-slate-500 text-xs mt-1"></div>
                  </div>

                  <div className="col-span-12 h-20"></div>
                  {val.user_phone !== null && (
                    <div className="col-span-12 pt-5  border-t flex items-center justify-center ">
                      <Lucide icon="Phone" className="w-6 h-6 mr-2" />+{" "}
                      {val?.user_phone}
                    </div>
                  )}
                  <div className="col-span-12 mt-4 mb-5 flex items-center justify-center ">
                    <Lucide icon="Mail" className="w-6 h-6 mr-2" />
                    {val?.email}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserMain;
