const express = require("express");
const passport = require("passport");
const router = express.Router();

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google"),
  (req, res) => {
    res.redirect(`${process.env.CLIENT_URL}/surveys`);
  }
);

router.get("/api/logout", (req, res) => {
  req.logout();

  res.redirect(`${process.env.CLIENT_URL}`);
});
router.get("/api/current_user", (req, res) => {
  res.json(req.user);
});

module.exports = router;
