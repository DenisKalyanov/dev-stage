const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const Profile = require("../../models/Profile");
const User = require("../../models/User");
const authMiddleware = require("../../middleware/auth");

// @route GET api/profile
// @desc Get all profiles
// access Public

router.get("/", async (req, res) => {
  try {
    const profile = await Profile.find().populate("user", ["name", "avatar"]);
    //нашли пользователя и возвращаем его
    res.json(profile);
  } catch (err) {
    // выводим ошибку и отправляем человеку ошибку. ВАЛИДИРУЕМ
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route GET api/profile/user/:user_id
// @desc Get profile by user id
// access Public

router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      // у req есть свойство params, в котором он будет считывать это динамическое свойство
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);

    //Далее мы хотим проверить вдруг профайла нет.
    if (!profile) {
      return res.status(404).json({ msg: "There is no profile for this user" });
    }
    // так как это последняя опперация в цепочке, то  return писать не нужно
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    console.error(err.kind); // выводим тут объект ошибки (если ввели неадекватный идентефикатор)
    // у ошибки err есть свойство kind, и если его значение ObjectID, то напишем ему об этом
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "There is no profile for this user" });
    }
    res.status(500).send("Server error");
  }
});

// @route POST api/profile
// @desc Create our update profile
// access Private

router.post(
  "/",
  [
    authMiddleware,
    [
      check("status", "Status is required").not().isEmpty(),
      check("skills", "Skills are required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // деструктуризируем данные которые к нам прийдут от пользователя:

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      linkedin,
      instagram,
    } = req.body;

    const profileFields = {};
    profileFields.user = req.user.id;

    // добавляем дестр. поля. (если поля будут присутствовать, до мы добавим их в профайл
    //и засетим в базу данных) На случай если пользователь захочет что-то не указыват
    if (company) profileFields.company = company.trim();
    if (website) profileFields.website = website.trim();
    if (location) profileFields.location = location.trim();
    if (bio) profileFields.bio = bio.trim();
    if (status) profileFields.status = status.trim();
    if (githubusername) profileFields.githubusername = githubusername.trim();
    if (skills) {
      profileFields.skills = skills.split(", ").map((skill) => skill.trim());
    }
    //добавим
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube.trim();
    if (facebook) profileFields.social.facebook = facebook.trim();
    if (twitter) profileFields.social.twitter = twitter.trim();
    if (linkedin) profileFields.social.linkedin = linkedin.trim();
    if (instagram) profileFields.social.instagram = instagram.trim();

    try {
      // пытаемся найти профайл. Ищем его в user в его свойстве user.id
      // Если профайл есть то мы обновляем, если нету то создаём.
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id }, // ищем профайл
          { $set: profileFields }, // если есть существующие поля то обнови это
          { new: true } // работает с верхним
        );

        return res.json(profile);
      }
      //если профайла не существует, то создадим новый
      profile = new Profile(profileFields);
      //сохраним его
      await profile.save();
      // отправим как результат работы
      res.json(profile);
    } catch (err) {
      // выводим ошибку и отправляем человеку ошибку.
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

//добавим роут который будет позволять получать этот профайл!

// @route GET api/profile/me
// @desc Get user profile
// access Private

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      // найдём пользователя (получим профайл)
      user: req.user.id,
      //метод populate позволяет нам получить данные из разных источников (таблиц)
      //  указываем в этом методе таблицы (user - таблица, [name, avatar] -указываем данные которые берём)
    }).populate("user", ["name", "avatar"]);

    if (!profile) {
      return res.status(404).json({ msg: "There is no profile for this user" });
    }
    res.json(profile);
  } catch (err) {
    // выводим ошибку и отправляем человеку ошибку. ВАЛИДИРУЕМ
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route DELETE api/profile
// @desc DELETE profile & user
// access Private
router.delete("/", authMiddleware, async (req, res) => {
  try {
    //Удаляем профиль
    await Profile.findOneAndDelete({ user: req.user.id });
    //Удаляем пользователя
    await User.findOneAndDelete({ _id: req.user.id });

    res.json({ msg: "User has been successfully deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route PATCH api/profile/experience
// @desc Add profile experience
// access Private
router.patch(
  "/experience",
  [
    authMiddleware,
    check("title", "Title is required").not().isEmpty(),
    check("company", "Company is required").not().isEmpty(),
    check("from", "From date is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // если всё норм, ошибок нет, то нам нужно задеструкторизировать наш req.body
    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    } = req.body;
    // на строке выше, мы получили перемеенные, для того чтобы в будущем могли их как-то обработать.
    //И внизу используем
    const newExp = { title, company, location, from, to, current, description };

    try {
      //находим профиль по id который нам нужен
      const profile = await Profile.findOne({ user: req.user.id });
      // обращаемся к объекту который мы нашли и к его свойству experience
      profile.experience.unshift(newExp);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route DELETE api/profile/experience/:exp_id
// @desc DELETE experience from profile
// access Private
router.delete("/experience/:exp_id", authMiddleware, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    // теперь нам нужно найти тот experience который нужно удалить
    // И в нём будем перебирать массив experienc, состоящий из объектов.
    // Их назовём exp и будем его сравнивать с тем, что мы передаём в параметрах запроса
    // в адресной строке.

    const removeIndex = profile.experience.findIndex(
      (exp) => exp._id.toString() === req.params.exp_id
    );

    if (removeIndex === -1) {
      return res.status(404).json({ msg: "Experiance not found" });
    }
    // далее вызываем метот splice, Где указываем с какой позиции и сколько элементов удалить
    profile.experience.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route PATCH api/profile/education
// @desc Add profile education
// access Private
router.patch(
  "/education",
  [
    authMiddleware,
    check("school", "School is required").not().isEmpty(),
    check("degree", "Degree is required").not().isEmpty(),
    check("fieldofstudy", "Field of stady is require").not().isEmpty(),
    check("from", "From date is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // если всё норм, ошибок нет, то нам нужно задеструкторизировать наш req.body
    const newEdu = ({
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    } = req.body);

    try {
      //находим профиль по id который нам нужен
      const profile = await Profile.findOne({ user: req.user.id });
      // обращаемся к объекту который мы нашли и к его свойству experience
      profile.education.unshift(newEdu);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route DELETE api/profile/education/:exp_id
// @desc DELETE education from profile
// access Private
router.delete("/education/:edu_id", authMiddleware, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    // теперь нам нужно найти тот education который нужно удалить
    // И в нём будем перебирать массив experienc, состоящий из объектов.
    // Их назовём exp и будем его сравнивать с тем, что мы передаём в параметрах запроса
    // в адресной строке.

    const removeIndex = profile.education.findIndex(
      (edu) => edu._id.toString() === req.params.edu_id
    );

    if (removeIndex === -1) {
      return res.status(404).json({ msg: "Education not found" });
    }
    // далее вызываем метот splice, Где указываем с какой позиции и сколько элементов удалить
    profile.education.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
