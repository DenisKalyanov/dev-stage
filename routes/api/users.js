const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");

const User = require("../../models/User");

// @route POST api/users
// @desc Register user
// access Public

router.post(
  "/",
  [
    check("name", "Name is reuired").not().isEmpty(),
    check("email", "Include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password witch 6 or nore symbols"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    try {
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });

      user = new User({
        name,
        email,
        avatar,
        password,
      });
      const salt = await bcryptjs.genSalt(10);
      // зашифруем наш обычный пароль "password", с помощью salt
      user.password = await bcryptjs.hash(password, salt);

      //Сохраним пользователя в базу данных с помощью метода save из mongoose
      await user.save();

      //Выполним проверке, отправим запрос в формате json
      // res.status(201).json({ msg: "All good" });

      //Сформирует пэйлод который вставим в токен
      const payload = {
        user: {
          id: user.id,
        },
      };
      console.log(req.body);
      // создаём токен:
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 36000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );

    } catch (err) {
      console.log(err.message);

      res.status(500).send("Send error");
    }
  }
);

module.exports = router;
