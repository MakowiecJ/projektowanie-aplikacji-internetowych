const express = require('express');
const Post = require('../models/Post');
const { authenticateToken } = require('../middleware/auth');
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif'];

const router = express.Router();

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

router.get('/:id/edit', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    res.render('posts/edit', { post: post })
  } catch {
    res.redirect('/posts')
  }
})

// Pobranie konkretnego ogłoszenia
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'username');
    res.render('posts/post', { post});
  } catch (error) {
    res.redirect('/');
  }
});

// Dodanie ogłoszenia
router.post('/', authenticateToken, async (req, res) => {
  const post = new Post({
    // author: req.user.userId,
    author: '66902d1c503ac32debd5d369',
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
  })

  savePostImages(post, req.body.images);

  try {
    const newPost = await post.save();
    // res.redirect(`/posts/${newPost.id}`);
    res.redirect(`/posts/${newPost.id}`);
  } catch (error){
    console.log(error);
    res.render('posts/new', { post: post, errorMessage: 'Error creating post' });
  }
});


// Aktualizacja ogłoszenia
router.put('/:id/edit', authenticateToken, async (req, res) => {
  let post;
  try {
		post = await Post.findById(req.params.id);
		post.title = req.body.title;
		post.description = req.body.description;
		post.category = req.body.category;
		post.updatedAt = Date.now();
		savePostImages(post, req.body.images);
		await post.save();
		res.redirect(`/posts/${post.id}`);
	} catch {
		if (post == null) {
			res.redirect('/');
		} else {
			res.render(`posts/:${req.params.id}/edit`, { post: post, errorMessage: 'Error editing post' });
		}
	}
});

// Usunięcie ogłoszenia
router.delete('/:id/delete', authenticateToken, async (req, res) => {
	let post;
	try {
		 post = await Post.findByIdAndDelete(req.params.id);
		 res.redirect(`/`);
	 } catch {
		 if (post == null) {
			 res.redirect('/');
		 } else {
			 res.render(`posts`, { errorMessage: 'Could not delete post' });
		 }
	 }
});


function savePostImages(post, images) {
	if (images == null || images == '') return;
	
	post.images = [];

	if (!Array.isArray(images)) {
		images = [images];
	}

	if (images.length > 0) {
		images.forEach(image => {
		const img = JSON.parse(image);
		if (img != null && imageMimeTypes.includes(img.type)) {
			post.images.push({
				data: new Buffer.from(img.data, 'base64'),
				extension: img.type
			});
		}
		});
	}
}

module.exports = router;
