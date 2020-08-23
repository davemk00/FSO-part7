import blogService from '../services/blogs'

const initialState = []

const blogReducer = (state = initialState, action) => {
  // console.log('state now: ', state)
  // console.log('action: ', action)

  switch (action.type) {
    case 'INIT_BLOGS':
      return action.data
    case 'NEW_BLOG': {
      return [...state, action.data]
    }
    case 'DELETE_BLOG': {
      const { id } = action.data
      return state.filter((blog) => blog.id !== id)
    }
    case 'LIKE_BLOG': {
      const { blog } = action.data
      const id = blog.id
      const updatedBlog = {
        ...blog,
        likes: blog.likes + 1,
      }
      return state.map((blog) => (blog.id !== id ? blog : updatedBlog))
    }
    default:
      return state
  }
}

export const setBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch({
      type: 'INIT_BLOGS',
      data: blogs,
    })
  }
}

export const createBlog = (data, user) => {
  return async (dispatch) => {
    let newBlog = await blogService.create( data )
    newBlog = { ...newBlog, user: { name: user.name }}
    dispatch({
      type: 'NEW_BLOG',
      data: newBlog,
    })
  }
}

export const deleteBlog = ( id ) => {
  return async (dispatch) => {
    await blogService.remove(id)
    dispatch({
      type: 'DELETE_BLOG',
      data: { id },
    })
  }
}

export const likeBlog = (blog) => {
  const id = blog.id
  return async (dispatch) => {
    await blogService.update(id, blog)
    dispatch({
      type: 'LIKE_BLOG',
      data: { blog },
    })
  }
}


export default blogReducer
