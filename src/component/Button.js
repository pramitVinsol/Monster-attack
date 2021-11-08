import React from "react";

const Button = (props) => (
  <button className={`btn btn-${props.type}`} onClick={props.clicked} disabled={props.isDisabled}>
    {props.children}
  </button>
);

Button.defaultProps = {
  children: '',
  clicked: () => {},
  type: '',
};

export default Button;