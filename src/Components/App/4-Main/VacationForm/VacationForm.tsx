import React, { SyntheticEvent, useEffect, useState } from "react";
import VacationModel from "../../../../models/vacation-model";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import service from "../../../../services/vacation-service";
import Button from "../../../UI/Button/Button";
import { useDispatch, useSelector } from "react-redux";
import VacationBox from "../HomePage/VacationBox/VacationBox";
import "./VacationForm.css";
import { modalActions, ModalType } from "../../../../store/modal-state";
import { TextField } from "@mui/material";
import config from "../../../../utils/config";
import Spinner from "../../../UI/Spinner/Spinner";

function VacationForm(): JSX.Element {
  const dispatch = useDispatch();
  const defaultImage = require("../../../../images/vacation-bg.jpg");
  const urlPath = `${config.address}/`;
  const currDate = new Date().toISOString().split("T")[0];
  const user = useSelector((state: any) => state.user.user);
  const [userImage, setUserImage] = useState<any>();
  const [returnDate, setReturnDate] = useState(currDate);
  const [isLoading, setIsLoading] = useState(false);
  const [prevVacation, setPrevVacation] = useState(new VacationModel());
  const [imgName, setImgName] = useState<string>(defaultImage);
  const [error, setError] = useState<string>();
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm<VacationModel>();
  const params = useParams();

  useEffect(() => {
    if (params.id) {
      service
        .getVacation(+params.id)
        .then((res) => {
          setPrevVacation(res);
          reset(res);
          setImgName(urlPath + res.image);
        })
        .then(() => setIsLoading(true));
      return;
    }
    setIsLoading(true);
  }, [params.id, reset, urlPath, user]);

  const handleDatesMinimum = (args: SyntheticEvent) => {
    handleChanges(args, "start");
    const value = (args.target as HTMLInputElement).value;
    const nextDay = new Date(value).getDate() + 1;
    const minReturnDate = new Date(new Date(value).setDate(nextDay))
      .toISOString()
      .split("T")[0];
    setReturnDate(minReturnDate);
  };

  const handleImageChange = (args: SyntheticEvent) => {
    const value = (args.target as HTMLInputElement).files;
    setUserImage(value);
    if (value && value[0]) {
      const newImg = URL.createObjectURL(value[0]);
      setImgName(newImg);
    } else {
      if (params.id) {
        setImgName(urlPath + prevVacation.image);
      } else setImgName(defaultImage);
    }
  };

  const handleChanges = (args: SyntheticEvent, myString: string) => {
    if (error) setError(undefined);
    let value: any = (args.target as HTMLInputElement).value;
    const newV: any = { ...prevVacation };
    for (var i = 0; i < Object.keys(newV).length; i++) {
      if (myString === Object.keys(newV)[i]) {
        newV[Object.keys(newV)[i]] = value;
      }
    }
    setPrevVacation(newV);
  };

  const send = async (newV: VacationModel) => {
    // loop below is for submitting with enter key press.
    Object.keys(newV).forEach((key: any) => {
      if (!(newV as any)[key]) {
        (newV as any)[key] = (prevVacation as any)[key];
      }
    });
    newV.destination = upperCaseVacation(newV.destination);
    if (userImage) newV.image = userImage[0];
    newV.prevImgName = prevVacation.image;
    const result = params.id
      ? await service.updateVacation(newV, prevVacation.id, user.token)
      : await service.addVacation(newV, user.token);
    if (result.status === 200 || 201) {
      navigate("/homepage");
      return;
    }
    if (result.status === 403)
      dispatch(modalActions.showModal(ModalType.EXPIRED));
    else setError(result.data.msg);
  };

  const upperCaseVacation = (v: string) => {
    return v
      .split(" ")
      .map((u) => u[0].toUpperCase() + u.slice(1))
      .join(" ");
  };

  return (
    <React.Fragment>
      {isLoading ? (
        <div className="VacationForm flow">
          <form onSubmit={handleSubmit(send)} autoComplete="off">
            <h2> {params.id ? "Edit vacation" : "Add vacation"} </h2>
            <p className="error-message">{error && error}</p>
            <div>
              <TextField
                required
                label="Destination"
                {...register("destination")}
                onKeyUp={(e) => handleChanges(e, "destination")}
                size="small"
                fullWidth
                inputProps={{ minLength: 2, maxLength: 15 }}
              />
            </div>
            <div>
              <TextField
                required
                label="Description"
                {...register("description")}
                onKeyUp={(e) => handleChanges(e, "description")}
                size="small"
                fullWidth
                inputProps={{ maxLength: 100 }}
              />
            </div>
            <div>
              <TextField
                required
                label="__ Start"
                {...register("start")}
                onChangeCapture={handleDatesMinimum}
                size="small"
                fullWidth
                type="date"
                inputProps={{ maxLength: 100, min: currDate }}
              />
            </div>
            <div>
              <TextField
                required
                label="__ Finish"
                {...register("finish")}
                onChangeCapture={(e) => handleChanges(e, "finish")}
                size="small"
                fullWidth
                type="date"
                inputProps={{ maxLength: 100, min: returnDate }}
              />
            </div>
            <div>
              <TextField
                required
                label="Price"
                {...register("price", { valueAsNumber: true })}
                onKeyUp={(e) => handleChanges(e, "price")}
                size="small"
                fullWidth
                type="number"
                inputProps={{ max: 99999, min: 1 }}
              />
            </div>
            <div className="vacation-image-area">
              <input
                type="file"
                accept=".jpg, .jpeg, .png, .webp"
                required={params.id ? false : true}
                onChange={handleImageChange}
              />
            </div>
            <div>
              <Button value={params.id ? "save" : "add"} />
            </div>
          </form>
          {prevVacation && (
            <VacationBox vacation={prevVacation} imgToShow={imgName} />
          )}
        </div>
      ) : (
        <div className="img-loading-spinner">
          <Spinner />
        </div>
      )}
    </React.Fragment>
  );
}

export default VacationForm;
