const express = require("express");
const router = express.Router();

// Импортируем пользователя чтобы его искать в базе данных
const User = require("../../models/User")
// @route GET api/auth
// @desc Get a user
// access Private

router.get("/", (req, res) => {
  try {
    // сохраним пользователя в объекте юзер, обратимся к схеме и его статическому методу поиска по ИД
    // а метод .select("поле которое исключим")
    const user = await User.findById(req.user.id).select("-password");

  } catch (err) {
    //пишем логирование ошибки
    console.error(err.message);
    // и отправим статус 500 и сообщение
    // не пишем return потому что мы отправили ошибку и больше ничего не будет происходить,
    // полностью выйдем из опперации.
    res.status(500).send("Server error")
  }
});

module.exports = router;
