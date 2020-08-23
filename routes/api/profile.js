const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const Profile = require("../../models/Profile");
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

module.exports = router;
