// jshint esversion: 6

import React from "react";
import "../index.css";

const Alert = (props) => {
  const { type, msg } = props;
  return (
    alert && (
      <div className={`alert alert-${type}`}>
        <img
          style={{ height: "25px", margin: "0 10px 0 10px" }}
          src={`../images/${type}.png`}
          alt=""
        />
        <span style={{ marginRight: "10px", fontSize: "20px" }}>{msg}</span>
      </div>
    )
  );
};

export default Alert;
