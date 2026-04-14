import express from "express";
const router = express.Router();
import Upcoming from "../models/UpSchema.js";

// GET all
router.get('/', async (req, res) => {
  try {
    const upcomings = await Upcoming.find().sort({ createdAt: -1 });
    res.json(upcomings);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET one by id
router.get('/:id', async (req, res) => {
  try {
    const upcoming = await Upcoming.findById(req.params.id);
    if (!upcoming) return res.status(404).json({ error: 'Not found' });
    res.json(upcoming);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


export default router;