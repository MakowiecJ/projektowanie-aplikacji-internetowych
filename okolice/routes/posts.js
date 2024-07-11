const express = require('express');
const Post = require('../models/Post');
const { authenticateToken } = require('../middleware/auth');
const multer = require('multer');
const upload = multer({dest: 'uploads/'})

// Konfiguracja multer
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     cb(null, `${Date.now()}_${file.originalname}`);
//   }
// });
// const upload = multer({ storage });

const router = express.Router();


// Dodanie ogłoszenia
router.post('/', authenticateToken, upload.array('images', 10), async (req, res) => {
  const images = req.files.map(file => file.path);
  const post = new Post({
    // author: req.user.userId,
    author: '66902d1c503ac32debd5d369',
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    images: images
  })

  try {
    const newPost = await post.save();
    // res.redirect(`/posts/${newPost.id}`);
    res.redirect('/posts');
  } catch (error){
    console.log(error);
    res.render('posts/new', { post: post, errorMessage: 'Error creating post' });
  }
});

// Pobranie wszystkich ogłoszeń
router.get('/', async (req, res) => {

  const category = req.query.category;
  const search = req.query.search;
  let searchOptions = {}
  if (category != null && category !== '') {
    searchOptions.category = category
  }
  if (search != null && search !== '') {
    searchOptions.title = new RegExp(search, 'i')
  }

  try {
    const posts = await Post.find(searchOptions).populate('author', 'username');
    res.render('posts/index', { posts, search, category});
  } catch (error) {
    res.redirect('/');
  }
});

router.get('/new', (req, res) => {
  res.render('posts/new', { post: new Post() })
})

// Pobranie konkretnego ogłoszenia
router.get('/:id', async (req, res) => {
  const post = await Post.findById(req.params.id).populate('author', 'username');
  res.json(post);
});

// Aktualizacja ogłoszenia
router.put('/:id', authenticateToken, async (req, res) => {
  const { title, description } = req.body;
  const post = await Post.findByIdAndUpdate(req.params.id, { title, description }, { new: true });
  res.json(post);
});

// Usunięcie ogłoszenia
router.delete('/:id', authenticateToken, async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

module.exports = router;
