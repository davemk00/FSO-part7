import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const UsersPage = () => {
  const users = useSelector((state) => state.users)

  return (
    <div>
      <h2>Users:</h2>
      <table>
        <thead>
          <tr>
            <th>Usernames</th>
            <th>Blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) =>
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`}>
                  {user.username}
                </Link>
              </td>
              <td>{user.blogs.length}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default UsersPage