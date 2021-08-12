const express = require("express");
const _ = require("lodash");
const { Path } = require("path-parser");
const { URL } = require("url");
const router = express.Router();
const requireCredits = require("../middlewares/requireCredits");
const requireLogin = require("../middlewares/requireLogin");
const Mailer = require("../services/Mailer");
const surveyTemplate = require("../services/emailTemplates/surveyTemplate");
const Survey = require("../models/survey");

router.get("/", async (req, res) => {
  const surveys = await Survey.find({ surveyOwner: req.user.id }).select({
    recipients: false,
  });
  res.send(surveys);
});

router.get("/:survey/:choice", (req, res) => {
  res.send("Thanks for Voting");
});

router.post("/webhooks", (req, res) => {
  const p = new Path("/api/surveys/:surveyId/:choice");

  _.chain(req.body)
    .map((event) => {
      const match = p.test(new URL(event.url).pathname);
      if (match) {
        return { ...match, email: event.email };
      }
    })
    .compact()
    .uniqBy("email", "surveyId")
    .each(({ surveyId, email, choice }) => {
      Survey.updateOne(
        {
          _id: surveyId,
          recipients: {
            $elemMatch: { email: email, responded: false },
          },
        },
        {
          $inc: { [choice]: 1 },
          $set: { "recipients.$.responded": true },
          lastResponded: new Date(),
        }
      ).exec();
    })
    .value();

  res.send({});
});

router.post("/", requireLogin, requireCredits, async (req, res) => {
  const { title, subject, body, recipients } = req.body;

  const survey = new Survey({
    title,
    subject,
    body,
    recipients: recipients.split(",").map((email) => ({ email: email })),
    surveyOwner: req.user.id,
    datesent: Date.now(),
  });

  try {
    await Mailer(survey, surveyTemplate(survey));
    await survey.save();
    req.user.credits -= 1;
    const user = await req.user.save();
    res.send(user);
  } catch (e) {
    res.status(422).send(e);
  }
});

module.exports = router;
