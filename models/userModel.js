const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const schema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  loginId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  contactNumber: { type: String, required: true },
});
schema.methods.generateAccessToken = function () {
  const accessToken = jwt.sign(
    {
      user: {
        name: this.firstName || "",
        email: this.email,
        password: this.password,
      },
    },
    process.env.ACCESS_TOKEN,
    { expiresIn: "1d" }
  );
  return accessToken;
};
schema.methods.toUserResponse = function () {
  return {
    user: {
      name: this.firstName,
      email: this.email,
      accessToken: this.generateAccessToken(),
    },
  };
};
// schema.methods.toProfileJSON = function () {
//   return {
//     username: this.name,
//     bio: this.bio,
//     image: this.image,
//     following: 10,
//   };
// };
const model = mongoose.model("users", schema);

module.exports = model;
