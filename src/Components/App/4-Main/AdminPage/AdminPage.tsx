import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Role } from "../../../../models/user-model";
import service from "../../../../services/vacation-service";
import Button from "../../../UI/Button/Button";
import Spinner from "../../../UI/Spinner/Spinner";
import VacationForm from "../VacationForm/VacationForm";
import "./AdminPage.css";

function Profile(): JSX.Element {
  const user = useSelector((state: any) => state.user.user);
  const [data, setData] = useState<{}[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user.id && user.role !== Role.Admin) {
      navigate("/homepage");
      return;
    }
    service
      .getFollowedVacations()
      .then((res) => {
        if (res.status === 200) {
          const newData = res.data.map((d: any) => {
            return {
              name: d.destination,
              pv: d.followers,
              price: d.price,
              dest: d.destination,
            };
          });
          setData(newData);
        }
      })
      .then((res) => setIsLoading(false));
  }, [navigate, user.id, user.role]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label-dest">{`${payload[0].payload.dest}`}</p>
          <p>{`${payload[0].value} followers`}</p>
          <p>{`price : ${payload[0].payload.price}$`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="AdminPage">
      <h1>Admin Reports</h1>
      {isLoading && <Spinner />}
      {!isLoading &&
        (data.length ? (
          <div className="bar-chart-background">
            <span>Followed vacations</span>
            <ResponsiveContainer height={300} className="bar-chart-container">
              <BarChart data={data}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  content={CustomTooltip}
                  wrapperStyle={{
                    fontSize: "0.8rem",
                    padding: "0.2rem",
                    outlineColor: "black",
                    backgroundColor: "rgb(173, 216, 230, 0.7)",
                    borderRadius: "10px",
                  }}
                />
                <Bar
                  dataKey="pv"
                  stackId="a"
                  fill="rgb(47, 47, 154)"
                  barSize={120 / data.length}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div>No vacations to show</div>
        ))}
      {isVisible ? (
        <div>
          <VacationForm />
        </div>
      ) : (
        <Button value="add vacation" onClick={() => setIsVisible(true)} />
      )}
    </div>
  );
}

export default Profile;
