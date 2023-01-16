import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserModel from "../../../../models/user-model";
import { useForm } from "react-hook-form";
import service from "../../../../services/user-service";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../../../../store/user-state";
import Button from "../../../UI/Button/Button";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import { modalActions, ModalType } from "../../../../store/modal-state";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import "./ProfileEdit.css";

function ProfileEdit(): JSX.Element {
  interface UserEdit extends UserModel {
    prevPass: string;
  }
  const dispatch = useDispatch();
  const [showPass, setShowPass] = useState<boolean>(false);
  const [showNewPass, setShowNewPass] = useState<boolean>(false);
  const user = useSelector((state: any) => state.user.user);
  const { register, handleSubmit, reset } = useForm<UserEdit>();
  const [allUsernames, setAllUsernames] = useState<{}[]>([]);
  const [isValidUsername, setIsValidUsername] = useState<boolean>(true);
  const [error, setError] = useState<string>();
  const navigate = useNavigate();
  useEffect(() => {
    reset({ ...user, password: "", prevPass: "" });
    service.getAllUsernames().then((res) => {
      if (res.status === 200) {
        const uNames = res.data.map((u: any) => u.user_name);
        setAllUsernames(uNames);
        return;
      }
      setError("something went wrong, please try again later..");
    });
  }, [user, reset]);

  const submitForm = async (newUser: UserEdit) => {
    if (
      allUsernames.includes(newUser.user_name) &&
      newUser.user_name !== user.user_name
    ) {
      setIsValidUsername(false);
      return;
    }
    const result = await service.updateUser(newUser);
    if (result.status === 201) {
      dispatch(userActions.login(result.headers.authorization));
      navigate("/homepage");
      return;
    }
    if (result.status === 401) {
      setError(result.msg);
      return;
    }
    if (result.status === 403) {
      dispatch(modalActions.showModal(ModalType.EXPIRED));
      return;
    }
    setError("something went wrong, please try again later");
  };

  return (
    <div className="ProfileEdit flow">
      <form
        className="profile-edit-form"
        onSubmit={handleSubmit(submitForm)}
        autoComplete="off"
      >
        <ArrowCircleLeftIcon
          onClick={() => navigate("/user/profile")}
          sx={{ fontSize: "3rem" }}
          className="edit-form-arrow-back"
        />
        <h3>Edit your profile</h3>
        {error && <p style={{ color: "red" }}>{error}</p>}
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
        <div>
          {!isValidUsername && (
            <span className="uname_invalid">already exist...</span>
          )}
          <TextField
            required
            label="user name"
            size="small"
            fullWidth
            {...register("user_name")}
            onKeyPress={() => setIsValidUsername(true)}
            inputProps={{ minLength: 2, maxLength: 20 }}
          />
        </div>
        <div>
          <FormControl fullWidth required size="small">
            <InputLabel>previous password</InputLabel>
            <OutlinedInput
              type={showPass ? "text" : "password"}
              {...register("prevPass")}
              inputProps={{ minLength: 6, maxLength: 20 }}
              fullWidth
              label="previous password"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPass((prev) => !prev)}
                    edge="end"
                    sx={{ marginBottom: 4 }}
                  >
                    {showPass ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </div>
        <div>
          <FormControl fullWidth required size="small">
            <InputLabel>new password</InputLabel>
            <OutlinedInput
              type={showNewPass ? "text" : "password"}
              {...register("password")}
              inputProps={{ minLength: 6, maxLength: 20 }}
              fullWidth
              label="new password"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowNewPass((prev) => !prev)}
                    edge="end"
                    sx={{ marginBottom: 4 }}
                  >
                    {showNewPass ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </div>
        <Button value="save" />
      </form>
    </div>
  );
}

export default ProfileEdit;
