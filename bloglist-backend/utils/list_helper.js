// Load the core build.
var _ = require('lodash');

const dummy = (blogs) => {
  return 1
}


const maxLikes = (blogs) => {
  return blogs.reduce((maxLikes, blog) => blog.likes > maxLikes ? blog.likes : maxLikes, 0)
}

const minLikes = (blogs) => {
  return blogs.reduce((minLikes, blog) => blog.likes < minLikes ? blog.likes : minLikes, 0)
}

const totalLikes = (blogs) => {
  return blogs.reduce((totalLikes, blog) => totalLikes + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((favoriteBlog, blog) => favoriteBlog.likes > blog.likes ? favoriteBlog : blog, 0)
}

const favoriteBlogger = (blogs) => {
  var favoriteAuthor = _.maxBy(blogs, 'author').author
  var authorArray = _.map(blogs, 'author')
  const count = (str, ch) => _.countBy(str)[ch] || 0
  const numBlogs = count(authorArray, favoriteAuthor)
  const ans = {author: favoriteAuthor, blogs: numBlogs}

  return ans
}


const mostLikedBlogger = (blogs) => {
  authList = _.sortedUniq(_.map(blogs, 'author'))

  var mostLikes = 0

  authList.forEach(author => {
    tmpLikes = 0
    blogs.forEach(blog => {
      if (blog.author === author) {tmpLikes = tmpLikes + blog.likes}
    })
    if (tmpLikes > mostLikes) {
      mostLikes = tmpLikes
      mostLiked = author
    }
  })

  return {author: mostLiked, likes: mostLikes}
}


module.exports = {
  dummy, 
  totalLikes,
  maxLikes,
  minLikes,
  favoriteBlog,
  favoriteBlogger,
  mostLikedBlogger
}  