import React from "react";
import logoBurger from "../../assets/images/burger-logo.png";
import classes from "./Logo.module.css";

const logo = props => (
  <div className={classes.Logo}>
    <img src={logoBurger} alt="" />
  </div>
);

export default logo;
