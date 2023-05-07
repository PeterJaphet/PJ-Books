const url = "http://localhost:3000";

const latestBooks = document.querySelector(".latest .books.grid.grid-5");
const trendingBooks = document.querySelector(".trending .books.grid.grid-5");
const recommendedBooks = document.querySelector(
  ".recommended .books.grid.grid-5"
);
const likeBtn = document.querySelector(".like span");
const dropContainer = document.querySelector(".drop-down");
let user = JSON.parse(localStorage.getItem("user"));
const types = ["Author", "Reader"];

let faStatus;
const userId = user.id;

const renderUser = () => {
  let template = `
              <div class="drop-user-info">
                <h3>${user.firstName + " " + user.lastName}</h3>
                <span>${types[user.type - 1]}</span>
              </div>

              <a href="user.html" class="drop-down-link"><i class="fa-regular fa-user icon"></i><p>Profile</p><i class="fa-solid fa-angle-right"></i></a>
              <a href="login.html" class="drop-down-link"><i class="fa-regular fa-arrow-right-from-bracket icon"></i><p>Logout</p><i class="fa-solid fa-angle-right"></i></a>
              `;

  dropContainer.innerHTML = template;
};

// code block to add like
const addLike = async (bookId) => {
  let updateLikes;

  const uri = `${url}/books/${bookId}`;

  const res = await fetch(uri);
  let book = await res.json();

  if (checkLike(book.likes)) {
    const index = book.likes.indexOf(userId);
    if (index > -1) {
      book.likes.splice(index, 1);
      updateLikes = [...book.likes];
    }
  } else {
    let likes = book.likes;
    updateLikes = [...likes, userId];
  }

  await fetch(uri, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      likes: [...updateLikes],
    }),
  });

  renderBooks(); // re-render the books after the update
};

const checkLike = (likes) => {
  if (likes.includes(userId)) {
    return true;
  } else {
    return false;
  }
};

// code block to add save

const addSave = async (bookId) => {
  let updateSaves;

  const uri = `${url}/books/${bookId}`;

  const res = await fetch(uri);
  let book = await res.json();

  if (checkSave(book.saves)) {
    const index = book.saves.indexOf(userId);
    if (index > -1) {
      book.saves.splice(index, 1);
      updateSaves = [...book.saves];
    }
  } else {
    let saves = book.saves;
    updateSaves = [...saves, userId];
  }

  await fetch(uri, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      saves: [...updateSaves],
    }),
  });
  renderBooks();
};

const checkSave = (saves) => {
  if (saves.includes(userId)) {
    return true;
  } else {
    return false;
  }
};

const renderLatest = async () => {
  const uri = `${url}/books?_sort=createdAt&_order=desc`;

  const res = await fetch(uri);
  let books = await res.json();
  books = books.splice(0, 10);
  let template = "";

  books.forEach((book) => {
    console.log(book.likes, userId);
    template += `
    <div class="book-item shadow">
    <a href="/bookDetails.html?id=${book.id}"> <img src="${book.uploadUrl}" alt="" /></a>
        <div class="book-item__text text-center">
          <h3>${book.title}</h3>
          <p>${book.author}</p>
          <div class="activity flex">
            <div class="like">
              <span onclick="addLike(${book.id})">${
      book.likes.includes(userId)
        ? "<i class='fa-solid fa-heart'></i>"
        : "<i class='fa-regular fa-heart'></i>"
    }</span>
              <p>${book.likes.length}</p>
            </div>
            <span onclick="addSave(${book.id})">${
      book.saves.includes(userId)
        ? "<i class='fa-solid fa-bookmark'></i></span>"
        : "<i class='fa-regular fa-bookmark'></i>"
    }</span>
          </div>  
          </div>
          </div>
          `;
  });

  latestBooks.innerHTML = template;
};

const renderTrending = async () => {
  const uri = `${url}/books?_sort=saves.length&_order=desc`;

  const res = await fetch(uri);
  let books = await res.json();
  books = books.splice(0, 10);
  let template = "";

  books.forEach((book) => {
    console.log(book.likes, userId);
    template += `
        <div class="book-item shadow">
        <a href="/bookDetails.html?id=${book.id}"> <img src="${book.uploadUrl}" alt="" /></a>
        <div class="book-item__text text-center">
          <h3>${book.title}</h3>
          <p>${book.author}</p>
          <div class="activity flex">
            <div class="like">
              <span onclick="addLike(${book.id})">${
      book.likes.includes(userId)
        ? "<i class='fa-solid fa-heart'></i>"
        : "<i class='fa-regular fa-heart'></i>"
    }</span>
              <p>${book.likes.length}</p>
            </div>
            <span onclick="addSave(${book.id})">${
      book.saves.includes(userId)
        ? "<i class='fa-solid fa-bookmark'></i></span>"
        : "<i class='fa-regular fa-bookmark'></i>"
    }</span>
          </div>  
          </div>
          </div>
          `;
  });

  trendingBooks.innerHTML = template;
};

const renderRecommended = async () => {
  const uri = `${url}/books?_sort=likes.length&_order=desc`;

  const res = await fetch(uri);
  let books = await res.json();
  books = books.splice(0, 10);
  let template = "";

  books.forEach((book) => {
    template += `
        <div class="book-item shadow">
        <a href="/bookDetails.html?id=${book.id}">
        <img src="${book.uploadUrl}" alt="" /></a>
        <div class="book-item__text text-center">
          <h3>${book.title}</h3>
          <p>${book.author}</p>
          <div class="activity flex">
            <div class="like">
              <span onclick="addLike(${book.id})">${
      book.likes.includes(userId)
        ? "<i class='fa-solid fa-heart'></i>"
        : "<i class='fa-regular fa-heart'></i>"
    }</span>
              <p>${book.likes.length}</p>
            </div>
            <span onclick="addSave(${book.id})">${
      book.saves.includes(userId)
        ? "<i class='fa-solid fa-bookmark'></i></span>"
        : "<i class='fa-regular fa-bookmark'></i>"
    }</span>
          </div>  
          </div>
          </div>
          `;
  });

  recommendedBooks.innerHTML = template;
};

const renderBooks = async () => {
  renderUser();
  renderLatest();
  renderTrending();
  renderRecommended();
};

window.addEventListener("DOMContentLoaded", () => renderBooks());
