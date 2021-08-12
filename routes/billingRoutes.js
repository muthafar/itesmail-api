const express = require("express");
const requireLogin = require("../middlewares/requireLogin");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.post("/api/stripe", requireLogin, async (req, res) => {
  const { id } = req.body;

  const charge = await stripe.charges.create({
    amount: 500,
    currency: "usd",
    description: "$5 for 5 credits",
    source: id,
  });

  req.user.credits += 5;
  const user = await req.user.save();
  res.json(user);
});

module.exports = router;
