const bcrypt = require("bcrypt");
const User = require("../models/userModel");

const userLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Email and Password are required");
  }

  try {
    const foundData=await User.findOne({email});

    if(!foundData){
        return res.status(404).json({
            msg: "Account Not found",
        });
        
    }
    if(foundData){
        // console.log(foundData);
        const isCorrectPassword=await bcrypt.compare(password,foundData.password);
        if(!isCorrectPassword){
            return res.status(401).json({
                msg:"Incorrect Password",
            });
            // return ;
        }
        console.log(foundData);
        const dataWithToken=foundData.toUserResponse();
        // flag=true;
        res.status(201).json(dataWithToken);
    }
  } catch (err) {
    res.status(500).json({msg:"Error logging in"});
  }
};
const userRegister = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    loginId,
    password,
    confirmPassword,
    contactNumber,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !confirmPassword ||
    !contactNumber ||
    !loginId
  ) {
    return res.status(400).send("All fields are required");
  }

  if (password !== confirmPassword) {
    return res.status(400).send("Password and Confirm Password must match");
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("Email already exists");
    }
    // console.log("Check point 1");
    const hashedPassword=await bcrypt.hash(password,10); // Placeholder for password hashing
    // console.log("Check point 1.5");
    const newUser = new User({
      firstName,
      lastName,
      email,
      loginId,
      password: hashedPassword,
      contactNumber,
    });
    // console.log("Check point 2");
    await newUser.save();
    // console.log("Check point 3");
    const dataWithToken =await newUser.toUserResponse(); // Placeholder for generating token
    // console.log("Check point 4");
    res.status(201).json(dataWithToken);
  } catch (err) {
    res.status(500).send("Error registering user");
  }
};
// const getCurrentUser = async (req, res) => {
//   const email = req.email;
//   const user = await Users.findOne({ email });
//   if (!user) {
//     return res.status(404).json({ message: "User Not Found" });
//   }
//   res.status(200).json(user.toUserResponse());
// };

// const updateUserData = async (req, res) => {
//   const data = req.body;
//   console.log(data);
//   const { email, name, oldPassword, newPassword } = data;
//   const foundData = await Users.findOne({ email });
//   // console.log(foundData);
//   const isCorrectPassword = await bcrypt.compare(
//     oldPassword,
//     foundData.password
//   );
//   if (!isCorrectPassword) {
//     res.status(401).json({
//       errors: {
//         body: "Incorrect Password",
//       },
//     });
//     return;
//   }
//   const hashedPassword = await bcrypt.hash(newPassword, 10);
//   const updatedData = await Users.findOneAndUpdate(
//     { email },
//     { name: name, password: hashedPassword },
//     {
//       new: true,
//     }
//   );
//   console.log(updatedData);
//   res.status(200).json({ data: updatedData });
// };
module.exports = {
  userLogin,
  userRegister,
//   getCurrentUser,
//   updateUserData,
};
