import axios from "axios";
import FollowModel from "../models/follow-model";
import UserModel from "../models/user-model";
import config from "../utils/config";

class Service {
  public getAllFollows = async (): Promise<FollowModel[]> => {
    const response = await axios.get(`${config.followAPI}/all`);
    return response.data;
  };

  public addFollow = async (follow: {}, token: string): Promise<any> => {
    try {
      await axios.post(`${config.followAPI}/all`, follow, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
    } catch (err: any) {
      return err.response.data.msg;
    }
  };

  public deleteFollow = async (vacationId: number, user: UserModel) => {
    try {
      await axios.delete(`${config.followAPI}/id/${vacationId}/${user.id}`, {
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      });
    } catch (err: any) {
      return err.response.data.msg;
    }
  };
}

const service = new Service();
export default service;
