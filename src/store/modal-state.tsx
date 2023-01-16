import { createSlice } from "@reduxjs/toolkit";
import VacationModel from "../models/vacation-model";

export enum ModalType {
  EXPIRED = 1,
  GUEST = 2,
  ADMIN = 3,
}

interface ModalState {
  isVisible: boolean;
  modalType: ModalType;
  currVacation: VacationModel | null;
}

const initialModalState: ModalState = {
  isVisible: false,
  modalType: ModalType.GUEST,
  currVacation: null,
};

const modalSlice = createSlice({
  name: "modal",
  initialState: initialModalState,
  reducers: {
    hideModal(state) {
      state.modalType = ModalType.GUEST;
      state.isVisible = false;
    },
    showModal(state, action) {
      state.modalType = action.payload;
      state.isVisible = true;
    },
    adminModal(state, action) {
      state.currVacation = action.payload;
      state.modalType = ModalType.ADMIN;
      state.isVisible = true;
    },
  },
});

export const modalActions = modalSlice.actions;
export default modalSlice.reducer;
