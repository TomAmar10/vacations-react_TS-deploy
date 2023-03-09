import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import VacationModel from "../../../../models/vacation-model";
import Button from "../../../UI/Button/Button";
import VacationBox from "./VacationBox/VacationBox";
import UserModel, { Role } from "../../../../models/user-model";
import VacService from "../../../../services/vacation-service";
import { Pagination, Stack } from "@mui/material";
import HeaderFilters from "./HeaderFilters/HeaderFilters";
import HomeNavigator from "./HomeNavigator/HomeNavigator";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../../UI/Spinner/Spinner";
import { vacationActions } from "../../../../store/vacation-state";
import { categories } from "../../../../store/vacation-state";
import { userActions } from "../../../../store/user-state";
import Modal from "./Modal/Modal";
import "./HomePage.css";

function HomePage(): JSX.Element {
  const dispatch = useDispatch();
  const isModalVisible = useSelector((state: any) => state.modal.isVisible);
  const category = useSelector((state: any) => state.vacations.category);
  const vacations: VacationModel[] = useSelector(
    (state: any) => state.vacations.vacations
  );
  const user: UserModel = useSelector((state: any) => state.user.user);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const sortBy = useSelector((state: any) => state.vacations.sortBy);
  const order = useSelector((state: any) => state.vacations.order);
  const [error, setError] = useState<string>();
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    setError(undefined);
    showAll();
    if (user.id < 1) {
      const userToken = localStorage.getItem("userToken");
      if (userToken) dispatch(userActions.login(userToken));
    }
  }, [dispatch, user]);

  const showAll = async () => {
    const result = await VacService.getSorted(user.id, "start", "ASC");
    if (!result) {
      setError("something went wrong, please try again later");
      setIsLoading(false);
      return;
    }
    switch (result.status) {
      case 204:
        setError("No vacations to show");
        dispatch(
          vacationActions.setVacations({
            vacations: [],
            category: categories.ALL,
          })
        );
        break;
      case 200:
        dispatch(
          vacationActions.setVacations({
            vacations: result.data,
            category: categories.ALL,
          })
        );
        break;
      default:
        user.role === Role.Admin
          ? setError(result.data.msg)
          : setError("something went wrong, please try again later");
    }
    setIsLoading(false);
  };

  const toggle = async (category: string) => {
    setPage(1);
    let sorted = await VacService.getSorted(user.id, sortBy, order);
    if (category === categories.FOLLOWED) {
      sorted = sorted.data.filter((v: VacationModel) => v.follower_id);
    } else sorted = sorted.data;
    dispatch(
      vacationActions.setVacations({
        vacations: sorted,
        category: category,
      })
    );
  };


  return (
    <div className="HomePage">
      <HeaderFilters />
      <HomeNavigator />
      <div className="pagination-area">
        <div>
          {category === categories.ALL ? (
            user.role === Role.User && (
              <Button
                value="my vacations"
                onClick={() => toggle(categories.FOLLOWED)}
              />
            )
          ) : (
            <Button value="Home" onClick={() => toggle(categories.ALL)} />
          )}
        </div>
        {vacations && Math.ceil(vacations.length / 10) > 1 && (
          <Stack spacing={2}>
            <Pagination
              size="small"
              sx={{ marginTop: "0.5rem" }}
              count={Math.ceil(vacations.length / 10)}
              page={page}
              onChange={(event: any, value: number) => setPage(value)}
            />
          </Stack>
        )}
      </div>
      <div className="homepage-main-area flow">
        <div className="vacations-container">
          {isLoading && <Spinner />}
          {!isLoading && vacations && vacations.length > 0 ? (
            vacations
              ?.slice((page - 1) * 10, page * 10)
              ?.map((vacation) => (
                <VacationBox vacation={vacation} key={vacation.id} />
              ))
          ) : (
            <div>{error && error}</div>
          )}
        </div>
      </div>
      {user.role === Role.Admin && (
        <NavLink to={"/vacation/add"}>
          <Button value="add vacation" />
        </NavLink>
      )}
      {isModalVisible && <Modal onDelete={showAll} />}
    </div>
  );
}

export default HomePage;
