import { createElement, useRef, createRef, useEffect } from "react";
import PropTypes from "prop-types";

function Input(props) {
  const onInputChange = (e) => {
   

    const obj = { [props.name]: e.target.value };

    props.setValue({
      ...props.value,
      ...obj,
    });
  };

  return (
    <input
      className={props.className}
      readOnly={props.readOnly}
      placeholder={props.placeholder}
      defaultValue={props.value[props.name]}
      type={props.type}
      onChange={(e) => onInputChange(e)}
      name={props.name}
    />
  );
}

Input.propTypes = {
  className: PropTypes.string,
  value: PropTypes.object,
  readOnly: PropTypes.bool,
  changeFunc: PropTypes.func,
  name: PropTypes.string,
  type: PropTypes.string,
};

Input.defaultProps = {
  className: "",
  value: {},
  readOnly: false,
  changeFunc: () => {},
  name: "",
  type: "",
};

export default Input;
