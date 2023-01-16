import { createSlice } from "@reduxjs/toolkit";
import VacationModel from "../models/vacation-model";

export enum categories {
  ALL = "all",
  FOLLOWED = "followed",
  SEARCHED = "searched",
}

export enum sorts {
  START = "start",
  FINISH = "finish",
  DESTINATION = "destination",
  PRICE = "price",
}

interface VacationState {
  vacations: VacationModel[];
  category: categories;
  sortBy: sorts;
  order: "ASC" | "DESC";
}

const initialVacationState: VacationState = {
  vacations: [],
  category: categories.ALL,
  sortBy: sorts.START,
  order: "ASC",
};

const vacationSlice = createSlice({
  name: "vacations",
  initialState: initialVacationState,
  reducers: {
    setVacations(state, action) {
      state.vacations = action.payload.vacations;
      if (action.payload.category) {
        state.category = action.payload.category;
        return;
      }
      state.category = categories.ALL;
    },
    follow(state, action) {
      state.vacations.forEach((v) => {
        if (v.id === action.payload.vacation_id)
          v.follower_id = action.payload.follower_id;
      });
    },
    unFollow(state, action) {
      state.vacations.forEach((v) => {
        if (v.id === action.payload) v.follower_id = 0;
      });
    },
    setSort(state, action) {
      state.sortBy = action.payload;
    },
    setOrder(state, action) {
      state.order = action.payload;
    },
  },
});

export const vacationActions = vacationSlice.actions;
export default vacationSlice.reducer;
