import { useEffect, useState } from "react";
import Button from "../../../UI/Button/Button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../../../../store/user-state";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import service from "../../../../services/user-service";
import { modalActions, ModalType } from "../../../../store/modal-state";
import "./ChangePicture.css";
import config from "../../../../utils/config";

function ChangePicture(): JSX.Element {
  const urlPath = `${config.address}/`;
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user.user);
  const [isEmpty, setIsEmpty] = useState<boolean>(false);
  const [userImage, setUserImage] = useState<any>();
  const [imgToShow, setImgToShow] = useState<string>();
  const navigate = useNavigate();

  useEffect(() => {
    setImgToShow(urlPath + user.image);
    if (user.image === "profile.png") setIsEmpty(true);
  }, [user, dispatch, navigate]);

  const changePicture = (e: any) => {
    setIsEmpty(false);
    if (!e.target.files.length) {
      setImgToShow(urlPath + user.image);
      setUserImage(undefined);
      return;
    }
    const image = e.target.files[0];
    setUserImage(image);
    const url = URL.createObjectURL(image);
    setImgToShow(url);
  };

  const submitChange = async (e: any) => {
    e.preventDefault();
    if (userImage || isEmpty) {
      const newUser = { ...user };
      newUser.prevImgName = user.image;
      newUser.image = userImage;
      const result = await service.updateUserProfile(newUser);
      if (result.status === 201) {
        dispatch(userActions.login(result.headers.authorization));
        navigate("/user/profile");
        return;
      }
      if (result.status === 403)
        dispatch(modalActions.showModal(ModalType.EXPIRED));
      else navigate("/homepage");
    }
  };

  const removeImage = () => {
    setImgToShow(urlPath + "profile.png");
    setUserImage(null);
    setIsEmpty(true);
  };

  return (
    <div className="change-picture-container flow">
      <div className="ChangePicture">
        <ArrowCircleLeftIcon
          onClick={() => navigate("/user/profile")}
          sx={{
            color: "rgb(47, 47, 154)",
            fontSize: "3rem",
            ":hover": { fontSize: "3.1rem" },
          }}
          className="change-profile-arrow-back"
        />
        <div className="image-to-show-bg">
          <img className="profile-image-change" src={imgToShow} alt="" />
          {!isEmpty && (
            <img
              src={require("../../../../images/delete.png")}
              className="remove-profile-btn"
              onClick={removeImage}
              alt=""
            />
          )}
        </div>
        {isEmpty && <span className="no-image-span">no image</span>}
        <form>
          <input type="file" onChange={changePicture} />
          <div>
            <Button value="update" onClick={submitChange} />
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePicture;
