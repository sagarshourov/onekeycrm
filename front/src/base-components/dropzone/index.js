// import Dropzone from "dropzone";
// const init = (el, props) => {
//   Dropzone.autoDiscover = false;
//   el.dropzone = new Dropzone(el, props.options);
// };
// export { init };


import Dropzone from "dropzone";

const init = (el, props) => {
try {
Dropzone.autoDiscover = false;
el.dropzone = new Dropzone(el, props.options);
} catch (error) {
  console.log('drop',error);
 }
};

export { init };