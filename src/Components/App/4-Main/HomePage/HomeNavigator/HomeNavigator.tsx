import { useSelector } from "react-redux";
import VacationModel from "../../../../../models/vacation-model";
import { categories } from "../../../../../store/vacation-state";
import "./HomeNavigator.css";


function HomeNavigator(): JSX.Element {
  const category = useSelector((state: any) => state.vacations.category);
  const vacations: VacationModel[] = useSelector(
    (state: any) => state.vacations.vacations
  );

  return (
    <div className="HomeNavigator">
      <h2>
        {category === categories.ALL && "All Vacations"}
        {category === categories.FOLLOWED && "My vacations"}
        {category === categories.SEARCHED &&
          `Vacations at ${vacations[0].destination}`}
      </h2>
    </div>
  );
}

export default HomeNavigator;
