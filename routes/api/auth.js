const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");

// Импортируем пользователя чтобы его искать в базе данных
const User = require("../../models/User");
const authMiddleware = require("../../middleware/auth");

// @route GET api/auth
// @desc Get a user
// access Private
router.get("/", authMiddleware, async (req, res) => {
  try {
    // сохраним пользователя в объекте юзер, обратимся к схеме и его статическому методу поиска по ИД
    // а метод .select("поле которое исключим")
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    //пишем логирование ошибки
    console.error(err.message);
    // и отправим статус 500 и сообщение
    // не пишем return потому что мы отправили ошибку и больше ничего не будет происходить,
    // полностью выйдем из опперации.
    res.status(500).send("Server error");
  }
});

// @route POST api/auth
// @desc Authenticate user & get token
// access Public
router.post(
  "/",
  [
    check("email", "Include a valid email").isEmail(),
    // exists - значит тоже самое что и .not().isEmpty()
    check("password", "Password is require").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      //Туу немного другая логика, чем та что была скопирована из users,
      //если пользователя нет, то нужно оповетстить, поэтому ставим (!user);
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid credentials" }] }); // Неверные учетные данные
      }

      // Далее в переменной сравним, совпадает ли пароль который к нам пришел с паролем который у нас есть
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid credentials" }] }); // Неверные учетные данные
      }

      //Сформирует пэйлод который вставим в токен при авторизации
      const payload = {
        user: {
          id: user.id,
        },
      };

      // создаём токен, такой же как и был.
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
