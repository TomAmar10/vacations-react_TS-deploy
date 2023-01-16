import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import UserModel, { Role } from "../../../models/user-model";
import service from "../../../services/user-service";
import Button from "../../UI/Button/Button";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../../../store/user-state";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import { modalActions, ModalType } from "../../../store/modal-state";
import "./Login.css";
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface Props {
  deletePage?: boolean;
  onClose?: Function;
}

function Login(props: Props): JSX.Element {
  const modalType = useSelector((state: any) => state.modal.modalType);
  const isModalVisible = useSelector((state: any) => state.modal.isVisible);
  const [showPass, setShowPass] = useState<boolean>(false);
  const user = useSelector((state: any) => state.user.user);
  const dispatch = useDispatch();
  const { register, handleSubmit, setFocus } = useForm<UserModel>();
  const [header, setHeader] = useState<string>("Welcome Back!");
  const [message, setMessage] = useState<string>("please enter your details");
  const [error, setError] = useState<string>();
  const navigate = useNavigate();

  useEffect(() => {
    handleMessage();
    setFocus("user_name");
    if (props.deletePage || isModalVisible) return;
    if (user.role < Role.Guest) navigate("/homepage");
  }, [user]);

  const handleMessage = () => {
    if (props.deletePage) {
      setHeader("Delete Page");
      return;
    }
    if (isModalVisible) {
      setMessage(
        modalType === ModalType.EXPIRED
          ? "please log in again to continue"
          : "to follow vacations you must log in"
      );
      setHeader(
        modalType === ModalType.EXPIRED ? "Hey Again!" : "Hello Guest!"
      );
    }
  };

  const submitForm = async (details: UserModel) => {
    props.deletePage ? await deleteAccount(details) : loginUser(details);
  };

  const loginUser = async (details: UserModel) => {
    const result = await service.login(details);
    if (result.status === 201) {
      dispatch(userActions.login(result.headers.authorization));
      dispatch(modalActions.hideModal());
      navigate("/homepage");
      return;
    }
    if (result.status === 401) {
      setError(result.msg);
      return;
    }
    setError("something went wrong, please try again later");
  };
  const deleteAccount = async (details: UserModel) => {
    details.image = user.image;
    details.id = user.id;
    const result = await service.deleteUser(details, user.token);
    if (result) {
      if (result.status === 401) setError(result.msg);
      else dispatch(modalActions.showModal(ModalType.EXPIRED));
      return;
    }
    dispatch(userActions.logout());
    navigate("/login");
  };

  return (
    <div className={`Login ${props.deletePage && "flow"}`}>
      {props.deletePage && (
        <ArrowCircleLeftIcon
          onClick={() => navigate("/user/profile")}
          sx={{
            color: "rgb(47, 47, 154)",
            fontSize: "3rem",
            ":hover": { fontSize: "3.1rem" },
          }}
          className="delete-form-arrow-back"
        />
      )}
      <form
        className="login-form"
        onSubmit={handleSubmit(submitForm)}
        autoComplete="off"
      >
        {isModalVisible && (
          <img
            src={require("../../../images/close-btn.png")}
            alt=""
            onClick={() => props.onClose && props.onClose()}
            className="close-modal-btn"
          />
        )}
        <h2>{header}</h2>
        <span style={{ color: error ? "red" : "black" }}>
          {error ? error : message}
        </span>
        <div>
          <TextField
            required
            onFocus={() => setError(undefined)}
            label="user name"
            size="small"
            fullWidth
            {...register("user_name")}
            inputProps={{ minLength: 4, maxLength: 20 }}
          />
        </div>
        <div>
          <FormControl fullWidth required size="small">
            <InputLabel>password</InputLabel>
            <OutlinedInput
              onFocus={() => setError(undefined)}
              type={showPass ? "text" : "password"}
              {...register("password")}
              inputProps={{ minLength: 6, maxLength: 20 }}
              fullWidth
              label="password"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPass((prev) => !prev)}
                    edge="end"
                  >
                    {showPass ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </div>
        <Button
          value={props.deletePage ? "delete" : "login"}
          style={{
            marginTop: "1rem",
            backgroundColor: props.deletePage ? "rgb(200, 10, 20)" : "",
          }}
        />
        {!props.deletePage && (
          <div>
            <NavLink to={"/register"} className="register-navlink">
              create new account
            </NavLink>
          </div>
        )}
      </form>
    </div>
  );
}

export default Login;
