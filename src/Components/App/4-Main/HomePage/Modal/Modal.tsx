import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import service from "../../../../../services/vacation-service";
import { modalActions, ModalType } from "../../../../../store/modal-state";
import { userActions } from "../../../../../store/user-state";
import Button from "../../../../UI/Button/Button";
import Login from "../../../2-Login/Login";
import "./Modal.css";

interface Props {
  onDelete?: Function;
}

function Modal(props: Props): JSX.Element {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user.user);
  const currVacation = useSelector((state: any) => state.modal.currVacation);
  const modalType = useSelector((state: any) => state.modal.modalType);
  const [error, setError] = useState<string>();

  const deleteVacation = async () => {
    const result = await service.deleteVacation(currVacation.id, user.token);
    if (!result) {
      if (props.onDelete) props.onDelete();
      dispatch(modalActions.hideModal());
      return;
    }
    if (result.status === 403)
      dispatch(modalActions.showModal(ModalType.EXPIRED));
    else setError(result.data.msg);
  };

  const closeModal = () => {
    if (modalType === ModalType.EXPIRED) {
      dispatch(userActions.logout());
      navigate("/homepage");
    }
    dispatch(modalActions.hideModal());
  };

  return (
    <React.Fragment>
      <div className="Modal">
        {modalType === ModalType.ADMIN ? (
          <div className="ModalAdmin">
            <div className="delete-confirmation">
              <h2>Are you sure?</h2>
              <p>{error && error}</p>
              <div>
                clicking confirm will delete{" "}
                <span>{currVacation.destination}</span> vacation
              </div>
              <Button value="confirm" onClick={deleteVacation} />
              <Button value="cancel" onClick={closeModal} />
            </div>
          </div>
        ) : (
          <Login onClose={closeModal} />
        )}
      </div>
      <div className="guest-modal-background" onClick={closeModal}></div>
    </React.Fragment>
  );
}

export default Modal;
