import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import Button from "../../../UI/Button/Button";
import "./ProfileDetails.css";

function ProfileDetails(): JSX.Element {
  const user = useSelector((state: any) => state.user.user);
  return (
    <React.Fragment>
      <div className="ProfileDetails flow">
        <div>
          <label>First Name: </label>
          <span>{user?.first_name}</span>
        </div>
        <hr />
        <div>
          <label>Last Name: </label>
          <span>{user?.last_name}</span>
        </div>
        <hr />
        <div>
          <label>User Name: </label>
          <span>{user?.user_name}</span>
        </div>
        <NavLink to={"/user/profile/edit"} className="navLink">
          <Button value="edit profile" />
        </NavLink>
      </div>
    </React.Fragment>
  );
}

export default ProfileDetails;
