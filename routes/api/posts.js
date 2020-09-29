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


// @route GET api/posts/:id
// @desc Get post by id
// access Private

router.get("/:id", authMiddleware, async (req, res) => {

  try {
    // находим пост со всеми его данными и ложим в post
    const post = await Post.findById(req.params.id);
    console.log(req);
    //если поста не будет найдено нужно обработать
    if (!post) {
      return res.status(404).json({ msg: "Post not found error 1" });
    }

    res.json(post)

  } catch (err) {
    //если будет такая ошибка, типо тип её ОбэжектИд, то выдай такой текст.
    if (err.kind = "ObjectId") {
      return res.status(404).json({ msg: 'Post not found error 2' })
    }
    //если тип ошибки другой, то вот:
    res.status(500).send("Server error");
  }
});

// @route DELETE api/posts/:id
// @desc DELETE post by id
// access Private

router.delete("/:id", authMiddleware, async (req, res) => {
  // роут похож на предыдущий, но нужно полностью поменять логику.
  // Тут в :id будет лежать тот ObjectId поста который мы хотим удалить
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found error 1" });
    }

    //добавляем ещё одну проверку, чтобы пост мог удалить только его создатель
    // так как юзер это объект, то приводим его к строке

    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    // с помощью remove удалим пост
    await post.remove();

    res.json({ msg: "Post removed" });
  } catch (err) {
    if (err.kind = "ObjectId") {
      return res.status(404).json({ msg: 'Post not found error 2' })
    }
    res.status(500).send("Server error");
  }
});

// Добавим пользователю возможность лайкать посты
// (patch - частично изменим пост, будем менять массив лайков)
// @route PATCH api/posts/like/:id
// @desc PATCH post by id
// access Private

router.patch("/like/:id", authMiddleware, async (req, res) => {
  // роут похож на предыдущий, но нужно полностью поменять логику.
  // Тут в :id будет лежать тот ObjectId поста который мы хотим удалить
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    // убедимся в том, что пользователь ставит лайк, где он ещё не лайкал
    // смотрим на массивы лайков у поста, фильтруем все лайки и каждый лайк
    // сравниваем есть ли у него в свойстве юзер уже такой id
    // filter вернёт нам массив с совпадениями и мы посчитаем их длину, если она больше нуля то...

    if (post.likes.filter((like) => like.user.toString() === req.user.id).length > 0) {
      return res.status(400).json({ msg: "Post already was liked" });
    }

    post.likes.push({ user: req.user.id });

    await post.save();
    res.json(post.likes);

  } catch (err) {
    if (err.kind = "ObjectId") {
      return res.status(404).json({ msg: 'Post not found error 2' })
    }
    res.status(500).send("Server error");
  }
});

//далее делаем пост по анлайку
// (patch - частично изменим пост, будем менять массив лайков)
// @route PATCH api/posts/like/:id
// @desc UNLIKE post by id
// access Private

router.patch("/unlike/:id", authMiddleware, async (req, res) => {
  // роут похож на предыдущий, но нужно полностью поменять логику.
  // Тут в :id будет лежать тот ObjectId поста который мы хотим удалить
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    // убедимся в том, что пользователь ставит лайк, где он ещё не лайкал
    // смотрим на массивы лайков у поста, фильтруем все лайки и каждый лайк
    // сравниваем есть ли у него в свойстве юзер уже такой id
    // filter вернёт нам массив с совпадениями и мы посчитаем их длину, если она больше нуля то...

    // делаем === 0, проверяем, если он ещё не лайкнул пост то не судьба его отлайкать
    if (post.likes.filter((like) => like.user.toString() === req.user.id)
      .length === 0) {
      return res
        .status(400)
        .json({ msg: "Post has not yet been already liked" });
    }

    // будем находить лайк который хотим убрать (индекс этого лайка)
    // у поста есть массив likes в котором хранится user c ID
    // мы преебриаем все лайки и если есть лайк с таким id, значит он был поставлен
    const removeIndex = post.likes.findIndex(
      (like) => like.user.toString() === req.user.id
    );

    // далее с помощью метода splice будем удалять лайк с позиции removeIndex
    post.likes.splice(removeIndex, 1);

    await post.save();
    res.json(post.likes);

  } catch (err) {
    if (err.kind = "ObjectId") {
      return res.status(404).json({ msg: 'Post not found error 2' })
    }
    res.status(500).send("Server error");
  }
});

// будем делать далее пост который будет добавлять коммент и удалять коммент по ID
// @route PATCH api/posts/comment/:id
// @desc Comment for a post
// access Private

router.patch("/comment/:id", [authMiddleware, check("text", "Text is required").not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);


    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // первым делом найдём user и с помощью комманды select исключим из выборки пароль
      const user = await User.findById(req.user.id).select("-password");
      const post = await Post.findById(req.params.id);


      if (!post) {
        return res.status(404).json({ msg: "Post not found" });
      }

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      }

      post.comments.unshift(newComment);

      await post.save();
      res.json(post.comments);

    } catch (err) {
      if (err.kind = "ObjectId") {
        return res.status(404).json({ msg: 'Post not found error 2' })
      }
      res.status(500).send("Server error");
    }
  });


// @route DELETE api/posts/comment/:id/:comment_id
// @desc DELETE Comment by id
// access Private

router.patch("/comment/:id/:comment_id", authMiddleware, async (req, res) => {

  try {
    // первым делом найдём user и с помощью комманды select исключим из выборки пароль
    const post = await Post.findById(req.params.id);


    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    // находим коммент который хотим удалить
    const comment = post.comments.find((comment) => {
      return comment.id === req.params.comment_id
    });
    console.log(comment);

    //если комментария нет
    if (!comment) {
      return res.status(404).json({ msg: "Comment doesn't exist " })
    }

    // не даём удалить коммент который является не его
    // у комментария есть свойство юзер, и если его id не совпадает с тем кто вошёл в систему, то юзер не юзер
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" })
    }

    // находим индекс по которому хотим удалить
    const removeIndex = post.comments.findIndex(
      (comment) => comment.id === req.params.comment_id
    );

    post.comments.splice(removeIndex, 1);

    await post.save();
    res.json(post.comments);

  } catch (err) {
    if (err.kind = "ObjectId") {
      return res.status(404).json({ msg: 'Post not found error 2' })
    }
    res.status(500).send("Server error");
  }
});

module.exports = router;  