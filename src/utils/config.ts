class Config {
  // public address = "https://infinite-thicket-00448.herokuapp.com";
  public address = "https://nodejs-first-deploy.onrender.com";
  // public address = "http://localhost:4500";
  public vacationsAPI = `${this.address}/api/vacation`;
  public userAPI = `${this.address}/api/user`;
  public authAPI = `${this.address}/api/auth`;
  public followAPI = `${this.address}/api/follow`;
}

const config = new Config();
export default config;
