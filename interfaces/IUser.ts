interface IUser {
  name: {
    type: string;
  };
  hashedPassword: {
    type: string;
  };
  role: {
    type: string;
    enum: ["user", "admin"];
  };
}
export default IUser;
