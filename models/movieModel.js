const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    movieName: { type: String, required: true },
    theatreName: { type: String, required: true },
    totalTickets: { type: Number, required: true },
    availableTickets: { type: Number, required: true },
    status: { type: String, default: 'BOOK ASAP' }
}, { timestamps: true });

movieSchema.index({ movieName: 1, theatreName: 1 }, { unique: true });

module.exports = mongoose.model('Movie', movieSchema);
