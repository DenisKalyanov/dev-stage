const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const authMiddleware = require("../../middleware/auth");
const Post = require("../../models/Post");
const User = require("../../models/User");

// @route POST api/posts
// @desc Create a post
// access Private

router.post("/", [authMiddleware, check("text", "Text is required").not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      // первым делом найдём user и с помощью комманды select исключим из выборки пароль
      const user = await User.findById(req.user.id).select("-password");
      console.log(user);
      const newPost = new Post({
        text: req.body.text, // сохраняем текст который считали
        name: user.name, // имя пользователя чтобы потом на имя найти польз.
        avatar: user.avatar, // сохраняем аватар
        user: req.user.id,
      });

      // /далее мы это сохраним и отправим
      await newPost.save();
      res.status(201).json(newPost);

    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }

  });

// @route GET api/posts
// @desc Get all posts
// access Private

router.get("/", authMiddleware, async (req, res) => {
  try {
    //находим все посты find - находит все посты и отсортируем по date: -1 (значит самые свежие посты)
    // Так как мы ищем все посты то в find() ничего не указываем
    const posts = await Post.find().sort({ date: -1 });

    res.json(posts)

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;  
