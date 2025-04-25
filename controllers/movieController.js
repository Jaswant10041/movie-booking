const Movie = require("../models/movieModel");
const User = require("../models/userModel");
const Ticket = require("../models/ticketModel");
const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find({});
    res.status(200).json(movies);
  } catch (err) {
    res.status(500).send("Error fetching movies");
  }
};
const findMovieByName = async (req, res) => {
  const { moviename } = req.params;
  try {
    const movies = await Movie.find({
      movieName: { $regex: moviename, $options: "i" },
    });
    if (movies.length === 0) {
      return res.status(404).json({ msg: "No movies found" });
    }
    res.status(200).json(movies);
  } catch (err) {
    res.status(500).send("Error fetching movies");
  }
};
const bookMovie = async (req, res) => {
  const { moviename } = req.params;
  const movieName=moviename;
  const { email, theatreName, numberOfTickets, seatNumbers } = req.body;

  try {
    const user = await User.find({ email });

    if (!user) return res.status(404).send("User not found");
    const userId = user[0]._id; // Assuming email is unique and returns one user
    if (!userId) return res.status(404).send("User not found");
    console.log(movieName);
    console.log(theatreName);
    if (seatNumbers.length !== numberOfTickets)
      return res
        .status(400)
        .send("Number of tickets and seat numbers do not match");
    const movie = await Movie.findOne({ movieName, theatreName });
    if (!movie) return res.status(404).send("Movie or theatre not found");
    if (movie.availableTickets < numberOfTickets)
      return res.status(400).send("Not enough tickets available");

    const ticket = new Ticket({
      userId,
      movieName,
      theatreName,
      numberOfTickets,
      seatNumbers,
    });
    await ticket.save();

    movie.availableTickets -= numberOfTickets;
    movie.status = movie.availableTickets === 0 ? "SOLD OUT" : "BOOK ASAP";
    await movie.save();

    res.status(201).json({ message: "Tickets booked successfully", ticket });
  } catch (err) {
    res.status(500).send("Error booking tickets");
  }
};
module.exports = {
  getMovies,
  findMovieByName,
  bookMovie,
};
