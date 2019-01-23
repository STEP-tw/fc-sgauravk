const loginLogout = {
  afterLogin:
    `<h1>Leave a comment</h1>
    <form method="POST" action='/logout'>
      <p> Name: ##USER## <input type="submit" value="Logout" /> </p>
      </form>
      <form action="submitComment" method="POST">
      <p>
        <label>Comment:</label>
        <textarea name="comment" cols="30" rows="6" required></textarea>
      </p>
      <input type="submit" value="Submit" class="button" />
    </form>`,
  beforeLogin: `<h1>Login to comment</h1>
    <form method="POST" action='/login'>
        Name<input type="text" name="name" required />
      <input type="submit" value="Login" />
    </form>`
};

module.exports = loginLogout;