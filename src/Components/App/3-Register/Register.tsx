import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserModel from "../../../models/user-model";
import { useForm } from "react-hook-form";
import service from "../../../services/user-service";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../../../store/user-state";
import Button from "../../UI/Button/Button";
import "./Register.css";

interface registerUser extends UserModel {
  confirmPass: string;
}
function Register(): JSX.Element {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user.user);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { register, handleSubmit, setFocus } = useForm<registerUser>();
  const [allUsernames, setAllUsernames] = useState<{}[]>([]);
  const [isValidUsername, setIsValidUsername] = useState(true);
  const [isValidPass, setIsValidPass] = useState(true);
  const [error, setError] = useState<string>();
  const [userImage, setUserImage] = useState<any>();
  const navigate = useNavigate();

  useEffect(() => {
    setFocus("first_name");
    if (user.id > 0) {
      navigate("/homepage");
      return;
    }
    service.getAllUsernames().then((res) => {
      if (res.status === 200) {
        setAllUsernames(res.data);
        return;
      }
      if (res.status === 204) return;
      setError("something went wrong, please try again later");
    });
  }, [navigate, setFocus, user]);

  const submitForm = (newUser: registerUser) => {
    if (error) return;
    if (newUser.password !== newUser.confirmPass) {
      setIsValidPass(false);
      return;
    }

    if (allUsernames.find((u: any) => u.user_name === newUser.user_name)) {
      setIsValidUsername(false);
      return;
    }
    newUser.first_name = upperCaseFirstLetter(newUser.first_name);
    newUser.last_name = upperCaseFirstLetter(newUser.last_name);
    if (userImage) newUser.image = userImage[0];
    service
      .register(newUser)
      .then((res) => {
        if (res.msg) throw new Error(res.msg);
        dispatch(userActions.login(res));
        navigate("/homepage");
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  const upperCaseFirstLetter = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  return (
    <div className="Register">
      <form className="register-form" onSubmit={handleSubmit(submitForm)}>
        <h2>Hello !</h2>
        {error && <h4 style={{ color: "red" }}>{error}</h4>}
        <div>
          <TextField
            required
            label="first name"
            size="small"
            fullWidth
            {...register("first_name")}
            inputProps={{ minLength: 2, maxLength: 20 }}
          />
        </div>
        <div>
          <TextField
            required
            label="last name"
            {...register("last_name")}
            size="small"
            fullWidth
            inputProps={{ minLength: 2, maxLength: 20 }}
          />
        </div>
        <div className="register-input-area">
          {!isValidUsername && <p>already exist... </p>}
          <TextField
            required
            label="user name"
            size="small"
            fullWidth
            {...register("user_name")}
            onFocus={() => setIsValidUsername(true)}
            inputProps={{ minLength: 4, maxLength: 20 }}
          />
        </div>
        <div>
          <FormControl fullWidth required size="small">
            <InputLabel>password</InputLabel>
            <OutlinedInput
              type={showPass ? "text" : "password"}
              {...register("password")}
              inputProps={{
                minLength: 6,
                maxLength: 20,
              }}
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
        <div className="register-input-area">
          {!isValidPass && <p>must be the same as password... </p>}
          <FormControl fullWidth required size="small">
            <InputLabel>confirm password</InputLabel>
            <OutlinedInput
              type={showConfirm ? "text" : "password"}
              {...register("confirmPass")}
              inputProps={{ minLength: 6, maxLength: 20 }}
              fullWidth
              onKeyDown={() => setIsValidPass(true)}
              label="new password"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirm((prev) => !prev)}
                    edge="end"
                  >
                    {showConfirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </div>
        <div
          className={`register-image-area ${
            userImage && userImage.length ? "uploaded" : ""
          }`}
        >
          <input
            type="file"
            onChange={(e) => setUserImage((e.target as HTMLInputElement).files)}
          />
        </div>
        <Button value="register" style={{ marginTop: "2rem" }} />
      </form>
    </div>
  );
}

export default Register;
