import { Route, Routes } from "react-router-dom";
import VacationForm from "./VacationForm/VacationForm";
import HomePage from "./HomePage/HomePage";
import Login from "../2-Login/Login";
import Register from "../3-Register/Register";
import Profile from "../Profile/Profile";
import Page404 from "./Page404/Page404";
import AdminPage from "./AdminPage/AdminPage";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserModel from "../../../models/user-model";
import { userActions } from "../../../store/user-state";
import GuestModal from "./HomePage/Modal/Modal";

function Main(): JSX.Element {
  const dispatch = useDispatch();
  const user: UserModel = useSelector((state: any) => state.user.user);
  const isModalVisible = useSelector((state: any) => state.modal.isVisible);

  useEffect(() => {
    if (user.id < 1) {
      const userToken = localStorage.getItem("userToken");
      if (userToken) dispatch(userActions.login(userToken));
    }
  }, [user, dispatch]);
  return (
    <div className="Main" style={{ marginTop: "5rem" }}>
      {isModalVisible && <GuestModal />}
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/user/profile/*" element={<Profile />} />
        <Route path="/vacation/add" element={<VacationForm />} />
        <Route path="/vacation/edit/:id" element={<VacationForm />} />
        <Route path="*" element={<Page404 />} />
      </Routes>
    </div>
  );
}

export default Main;
