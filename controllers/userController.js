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
const updatePassword = async (req, res) => {
  const { email, newPassword,confirmPassword } = req.body;

  if (!email || !newPassword || !confirmPassword) {
    return res.status(400).send("All fields are required");
  }
  if(newPassword!==confirmPassword){
    return res.status(400).send("Password and Confirm Password must match");
  }
  try {
    const foundData=await User.findOne({email});
    if(!foundData){
        return res.status(404).json({
            msg: "Account Not found",
        });   
    }
    console.log(foundData);
    const hashedPassword=await bcrypt.hash(newPassword,10);
    foundData.password=hashedPassword;
    await foundData.save();
    res.status(200).json({msg:"Password Updated Successfully"});
  } catch (err) {
    res.status(500).json({msg:"Error in updating password"});
  }
};
const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
      return res.status(400).send('Email and Password are required');
  }

  try {
      const admin = await User.findOne({ email: 'admin@example.com' }); // Assuming admin email is fixed
      if (!admin) {
          return res.status(404).send('Admin not found');
      }

      const isPasswordValid = admin.password === `hashed_${password}`; // Placeholder for password comparison
      if (!isPasswordValid) {
          return res.status(401).send('Invalid credentials');
      }

      const token = `token_for_admin_${admin._id}`; // Placeholder for token generation
      res.status(200).json({ message: 'Admin login successful', token });
  } catch (err) {
      res.status(500).send('Error logging in as admin');
  }
}
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

module.exports = {
  userLogin,
  adminLogin,
  updatePassword,
  userRegister,
};
