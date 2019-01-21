const addDivTag = content =>
  `<div id="commentBox" class="table">${content}</div>`;

const addStrongTag = content => `<strong> ${content} </strong>`;

const createCommentHTML = function(comments) {
  let data = [];
  comments.map(comment =>
    data.push(`<p> ${comment.time} : ${addStrongTag(comment.name)} : ${comment.comment} </p>`));
  return addDivTag(data.join(""));
};

const parseArgs = function(postData) {
  const commentObject = new Object();
  const [, author, , commentText] = postData.split(/=|&/);
  commentObject.name = unescape(author).replace(/\+/g, " ");
  commentObject.comment = unescape(commentText).replace(/\+/g, " ");
  commentObject.time = new Date().toLocaleString();
  return commentObject;
};

module.exports = { createCommentHTML, parseArgs };
