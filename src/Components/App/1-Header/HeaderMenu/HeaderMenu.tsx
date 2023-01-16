import * as React from "react";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import { useState } from "react";
import { Role } from "../../../../models/user-model";
import { useDispatch } from "react-redux";
import { userActions } from "../../../../store/user-state";
import { vacationActions } from "../../../../store/vacation-state";
import "./HeaderMenu.css";
import config from "../../../../utils/config";

function HeaderMenu(props: any) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState<boolean>();
  const [currProfile, setCurrProfile] = useState<string>(
    `${config.address}/profile.png`
  );

  React.useEffect(() => {
    setCurrProfile(`${config.address}/${props.user.image}`);
  }, [props]);

  const logOutClicked = () => {
    dispatch(userActions.logout());
    dispatch(vacationActions.setVacations([]));
    navigate("/login");
  };

  const navigateTo = (path: string) => {
    setIsVisible(false);
    navigate(path);
  };

  return (
    <React.Fragment>
      <div className="profile-btn-container">
        <img
          src={currProfile}
          alt=""
          className="profile-btn-img"
          onClick={() => setIsVisible((prev) => !prev)}
        />
      </div>
      {isVisible && (
        <React.Fragment>
          <div
            className="header-menu-container"
            onClick={() => setIsVisible(false)}
          ></div>
          <div className="header-menu">
            <div
              className="menu-item"
              onClick={() => navigateTo("/user/profile")}
            >
              <img src={currProfile} alt="" className="menu-profile-img" />
              <div>My profile</div>
            </div>
            <hr />
            <div className="menu-item" onClick={() => navigateTo("/homepage")}>
              <img src={require("../../../../images/home.png")} alt="" />
              <div>Home Page</div>
            </div>
            <hr />
            {props.user.role === Role.Admin && (
              <React.Fragment>
                <div className="menu-item" onClick={() => navigateTo("/admin")}>
                  <img src={require("../../../../images/admin.png")} alt="" />
                  <div>Admin Page</div>
                </div>
                <hr />
              </React.Fragment>
            )}
            <div className="menu-item" onClick={logOutClicked}>
              <LogoutIcon
                sx={{ width: "2rem", height: "1.8rem", marginRight: "1rem" }}
              />
              <div>Logout</div>
            </div>
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

export default HeaderMenu;
