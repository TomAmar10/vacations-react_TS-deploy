import { IconButton, InputBase, Paper, Slider } from "@mui/material";
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch, useSelector } from "react-redux";
import SortItem from "./SortItem/SortItem";
import VacationModel from "../../../../../models/vacation-model";
import { sorts } from "../../../../../store/vacation-state";
import service from "../../../../../services/vacation-service";
import {
  categories,
  vacationActions,
} from "../../../../../store/vacation-state";
import "./HeaderFilters.css";

function HeaderFilters(): JSX.Element {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user.user);
  const category = useSelector((state: any) => state.vacations.category);
  const sortBy = useSelector((state: any) => state.vacations.sortBy);
  const order = useSelector((state: any) => state.vacations.order);
  const [userPrice, setPrice] = useState<any>(10000);
  const [userSearch, setUserSearch] = useState<string>("");
  const myVacations: VacationModel[] = useSelector(
    (state: any) => state.vacations.vacations
  );

  useEffect(() => {
    setPrice(10000);
  }, [category]);

  const sortVacations = async (
    newS = sortBy,
    newO = order,
    _vacations = myVacations
  ) => {
    dispatch(vacationActions.setSort(newS));
    if (!_vacations.length) {
      dispatch(vacationActions.setVacations([]));
      return;
    }
    Object.keys(_vacations[0]).forEach((key: any) => {
      if (key === newS) {
        const vacations = [..._vacations].sort((a: any, b: any) => {
          if (newO === "ASC")
            return a[key] > b[key] ? 1 : b[key] > a[key] ? -1 : 0;
          else return a[key] < b[key] ? 1 : b[key] < a[key] ? -1 : 0;
        });
        dispatch(vacationActions.setVacations({ vacations, category }));
      }
    });
  };

  const changeOrder = async () => {
    const newOrder = order === "ASC" ? "DESC" : "ASC";
    sortVacations(sortBy, newOrder);
    dispatch(vacationActions.setOrder(newOrder));
  };

  const mouseUp = async () => {
    const result = await service.getMaxPrice(user.id, userPrice, sortBy, order);
    let vacations: VacationModel[] = result.data;
    if (category === categories.FOLLOWED) {
      vacations = vacations.filter((v: VacationModel) => v.follower_id);
    }
    sortVacations(sortBy, order, vacations);
  };

  const submitSearch = async (e: any) => {
    e.preventDefault();
    const userInput = upperCaseVacation(userSearch);
    const vacations = await service.getVacationByName(userInput);
    dispatch(
      vacationActions.setVacations({ vacations, category: categories.SEARCHED })
    );
    setUserSearch("");
  };

  const upperCaseVacation = (v: string) => {
    const newV = v.split(" ").map((u) => u[0].toUpperCase() + u.slice(1));
    return newV.join(" ");
  };

  return (
    <div className="HeaderFilters">
      <div className="filter-search-container">
        <Paper
          component="form"
          className="filters-search"
          onSubmit={submitSearch}
        >
          <InputBase
            inputProps={{ maxLength: "20" }}
            onChange={(e) =>
              setUserSearch((e.target as HTMLInputElement).value)
            }
            value={userSearch}
            className="filters-search-input"
            placeholder="find your vacation..."
          />
          <IconButton
            sx={{ height: "2rem", width: "2rem" }}
            onClick={submitSearch}
          >
            <SearchIcon />
          </IconButton>
        </Paper>
      </div>
      <div className="SortMenu">
        <div className="slider-container">
          <span>0$</span>
          <Slider
            style={{ margin: "0 0.6rem 0 0.3rem" }}
            value={userPrice}
            min={0}
            max={10000}
            valueLabelDisplay="auto"
            onChange={async (e: Event, val: number | number[]) => setPrice(val)}
            onMouseUp={mouseUp}
          />
          <span>10k$</span>
        </div>
        <div className="sort-items-container">
          <select
            className="sort-items-select"
            onChange={(e) => sortVacations(e.target.value)}
          >
            {Object.values(sorts).map((s) => (
              <SortItem key={s} sortBy={s} />
            ))}
          </select>
          <img
            src={require(`../../../../../images/${order}.png`)}
            alt=""
            title={order === "ASC" ? "sort down" : "sort up"}
            onClick={changeOrder}
          />
        </div>
      </div>
    </div>
  );
}

export default HeaderFilters;
