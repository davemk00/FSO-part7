import React from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const UserPage = () => {
  const users = useSelector((state) => state.users)
  const id = useParams().id
  const user = users.find(n => n.id === id)
  if (!user) {    return null  }
  const userBlogs = user.blogs

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>Added Blogs:</h3>
      <ul>
        {userBlogs.map((blog) =>
          <li key={blog.id}>
            <Link to={`/blog/${blog.id}`}>
              {blog.title}
            </Link>
          </li>
        )}
      </ul>
    </div>
  )
}

export default UserPage