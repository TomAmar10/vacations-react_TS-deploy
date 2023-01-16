import React from "react";
import { NavLink } from "react-router-dom";
import { Role } from "../../../models/user-model";
import { useNavigate } from "react-router-dom";
import Button from "../../UI/Button/Button";
import SearchBar from "../../UI/SearchBar/SearchBar";
import HeaderMenu from "./HeaderMenu/HeaderMenu";
import { useDispatch, useSelector } from "react-redux";
import { vacationActions as actions } from "../../../store/vacation-state";
import { categories } from "../../../store/vacation-state";
import service from "../../../services/vacation-service";
import "./Header.css";

function Header(): JSX.Element {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user.user);
  const currURL = document.URL.substring(document.URL.lastIndexOf("/") + 1);
  const navigate = useNavigate();

  const searchVacation = async (i: string) => {
    const userInput = upperCaseVacation(i);
    const result = await service.getVacationByName(userInput);
    if (!result.length) return;
    const searched = result.filter((v) => v.destination === userInput);
    dispatch(
      actions.setVacations({
        vacations: searched,
        category: categories.SEARCHED,
      })
    );
    navigate("/homepage");
  };

  const upperCaseVacation = (v: string) => {
    return v
      .split(" ")
      .map((u) => u[0].toUpperCase() + u.slice(1))
      .join(" ");
  };

  const logoClick = async () => {
    navigate("/homepage");
    const result = await service.getSorted(user.id, "start", "ASC");
    if (result.status === 200) {
      dispatch(
        actions.setVacations({
          vacations: result.data,
          category: categories.ALL,
        })
      );
      navigate("/homepage");
      return;
    }
    dispatch(actions.setVacations({ vacations: [], category: categories.ALL }));
  };

  return (
    <React.Fragment>
      <div className="Header">
        <div className="left-right-container">
          <div className="header-left-side">
            <div className="logo-area">
              <img
                src={require("../../../images/icon1.png")}
                alt=""
                onClick={logoClick}
                className="hovered-logo"
              />
              <h1 onClick={logoClick}>InsTravel</h1>
            </div>
          </div>
          <div className="header-right-side">
            <SearchBar onSearch={searchVacation} />
            {user.role !== Role.Guest ? (
              <HeaderMenu user={user} />
            ) : (
              <NavLink to={currURL === "login" ? "/register" : "/login"}>
                <Button value={currURL === "login" ? "register" : "login"} />
              </NavLink>
            )}
          </div>
        </div>
      </div>
      <div className="header-padding"></div>
    </React.Fragment>
  );
}

export default Header;
