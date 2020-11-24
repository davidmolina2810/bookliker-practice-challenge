const BASE_URL = 'http://localhost:3000'
const BOOKS_URL = `${BASE_URL}/books`
const USERS_URL = `${BASE_URL}/users`

document.addEventListener("DOMContentLoaded", function() {
  fetch(BOOKS_URL).then(
    res => res.json()
  ).then(
    booksData => {
      renderBooks(booksData)
      handleBookClick(booksData)
    }
  )
});


function renderBooks(books) {
  const booksContainer = document.querySelector('#list')
  books.forEach(book => {
    const bookLi = document.createElement('li')
    bookLi.innerText = book.title
    booksContainer.appendChild(bookLi)
  })
  return booksContainer
}

function handleBookClick(books) {
  const booksContainer = document.querySelector("#list")
  booksContainer.addEventListener('click', (e) => {
    const book = books.find(book => book.title === e.target.innerText)
    renderBookData(book)
    handleLikes(book)
  })
}

function renderBookData(book) {
  const bookParent = document.querySelector("#show-panel")
  bookParent.innerHTML = ""

  const bookTitleH1 = document.createElement('h1')
  bookTitleH1.innerText = book.title

  const bookImg = document.createElement('img')
  bookImg.src = book.img_url

  const bookSubtitleH2 = document.createElement('h2')
  bookSubtitleH2.innerText = book.subtitle

  const bookAuthorH3 = document.createElement('h3')
  bookAuthorH3.innerText = book.author

  const bookDescP = document.createElement('p')
  bookDescP.innerText = book.description

  const usersContainer = document.createElement('ul')
  usersContainer.id = "users-container"
  book.users.forEach(user => {
    const userLi = document.createElement("li")
    userLi.innerText = user.username  
    usersContainer.appendChild(userLi)
  })

  const likeBtn = document.createElement('button')
  if (!book.users.some(user => user.username === "pouros")) {
    likeBtn.innerText = "Like"
  } else {
    likeBtn.innerText = "Unlike"
  }

  bookParent.appendChild(bookTitleH1)
  bookParent.appendChild(bookImg)
  if (book.subtitle) {
    bookParent.appendChild(bookSubtitleH2)
  }
  bookParent.appendChild(bookAuthorH3)
  bookParent.appendChild(bookDescP)
  bookParent.appendChild(usersContainer)
  bookParent.appendChild(likeBtn)
}

function handleLikes(book) {
  const showBookContainer = document.querySelector("#show-panel")
  const likeBtn = showBookContainer.querySelector("button")
  likeBtn.addEventListener("click", () => {
    fetch(`${BOOKS_URL}/${book.id}`, {
      method: "PATCH",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        "users": currentLikedByUser(book)
      })
    }).then(
      res => res.json()
    ).then(
      book => renderNewLikedUserToDom(book)
    )
  })
  
}

function currentLikedByUser(book) {
  const current = book.users
  if (!book.users.some(user => user.username === "pouros")) {
    current.push({"id": 1, "username":"pouros"})
  } else {
    current.pop()
  }
  return current
}

function renderNewLikedUserToDom(book) {
  const usersContainer = document.querySelector("#users-container")
  const likeBtn = document.querySelector("#show-panel").querySelector("button")
  if (book.users.some(user => user.username === "pouros")) {
    const newUserLi = document.createElement("li")
    newUserLi.innerText = book.users[book.users.length - 1].username
    usersContainer.appendChild(newUserLi)
    likeBtn.innerText = "Unlike"
  } else {
    usersContainer.removeChild(usersContainer.lastChild)
    likeBtn.innerText = "Like"
  }

}

