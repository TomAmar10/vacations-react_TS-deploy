export enum Role {
  Admin = 1,
  User = 2,
  Guest = 3,
}

class UserModel {
  public id: number = 0;
  public first_name: string = "";
  public last_name: string = "";
  public user_name: string = "";
  public password: string = "";
  public image: any = "";
  public role: number = Role.Guest;
  public token: string = "";
}

export default UserModel;
