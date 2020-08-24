import React from 'react'
import { useSelector } from 'react-redux'

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
              <td>{user.username}</td>
              <td>{user.blogs.length}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default UsersPage