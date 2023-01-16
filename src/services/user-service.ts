import axios from "axios";
import UserModel from "../models/user-model";
import config from "../utils/config";

class Service {
  public getAllUsers = async (): Promise<UserModel[]> => {
    try {
      const response = await axios.get(`${config.userAPI}/all`);
      return response.data;
    } catch (err: any) {
      return err.response.data.msg;
    }
  };

  public getAllUsernames = async (): Promise<any> => {
    try {
      const response = await axios.get(`${config.userAPI}/all/usernames`);
      return response;
    } catch (err: any) {
      return err.response;
    }
  };

  public getUser = async (id: number): Promise<UserModel> => {
    try {
      const response = await axios.get(`${config.userAPI}/${id}`);
      return response.data;
    } catch (err: any) {
      return err.response.data.msg;
    }
  };

  public login = async (userCred: UserModel): Promise<any> => {
    try {
      const response = await axios.post(`${config.authAPI}/login`, userCred);
      return response;
    } catch (err: any) {
      return err.response.data;
    }
  };

  public register = async (user: UserModel): Promise<any> => {
    try {
      const response = await axios.post(`${config.authAPI}/register`, user, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.headers.authorization;
    } catch (err: any) {
      return err.response.data;
    }
  };

  public deleteUser = async (details: UserModel, token: string) => {
    try {
      await axios.post(`${config.authAPI}/delete`, details, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
    } catch (err: any) {
      return err.response.data;
    }
  };

  public updateUser = async (user: UserModel) => {
    try {
      const response = await axios.put(
        `${config.authAPI}/update/${user.id}`,
        user,
        {
          headers: {
            authorization: `Bearer ${user.token}`,
          },
        }
      );
      return response;
    } catch (err: any) {
      return err.response.data;
    }
  };

  public updateUserProfile = async (user: any) => {
    try {
      const response = await axios.put(
        `${config.authAPI}/changeprofile/${user.id}`,
        user,
        {
          headers: {
            authorization: `Bearer ${user.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response;
    } catch (err: any) {
      return err.response;
    }
  };
}

const service = new Service();
export default service;
