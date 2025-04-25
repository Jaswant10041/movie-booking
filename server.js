const express=require('express');
const DbConnect = require("./config/dbConnect");
const corsOptions = require('./models/corsOptions');
const app=express();
require("dotenv").config();
const cors=require('cors');
app.use(express.json());
app.use(cors(corsOptions))
const mongoose=require('mongoose');
const PORT=process.env.PORT || 5000;
DbConnect();

app.use('/api/v1/moviebooking/movies',require('./routes/movieRouter'));
app.use('/api/v1/moviebooking',require('./routes/userRouter'));

mongoose.connection.once("open", async () => {
    
    app.listen(PORT, () => {
      console.log(`app is listening on ${PORT}`);
    });
});
mongoose.connection.on("error", (err) => {
   console.log("Error while connecting to MongoDB: ", err);
});
  