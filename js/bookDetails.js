const id = new URLSearchParams(window.location.search).get("id");
const bookDetailContainer = document.querySelector(".book-details");
const form = document.querySelector("#book-request");
const requestReason = document.querySelector(".reason");
const returnDate = document.querySelector(".return-date");
const types = ["Public", "Private"];
let user = JSON.parse(localStorage.getItem("user"));
const userId = user.id;
const url = "http://localhost:3000";
let requestDetails = {};

//render Book Details
const renderBookDetails = async () => {
  uri = `http://localhost:3000/books/${id}`;

  const res = await fetch(uri);
  const book = await res.json();
  const uploadDate = book.createdAt.split("T");
  requestDetails = { ...requestDetails, userId: userId, bookId: book.id,authorId:book.userId };

  template = `
    <div class="container flex">
    <div class="book-image">
      <img src="${book.uploadUrl}" alt="" class="book-img"/>
    </div>
    <div class="book-detail">
    <div class="book-info">
        <h1 class="book-title">${book.title}</h1>
        <p>By <span class="book-author">${book.author}</span></p>
        <p class="py-1">${book.description}</p>
      </div>
      <div class="book-stats py-1">
        <h4>Category: <span class="stat">${types[book.type - 1]}</span></h4>
        <h4>Likes: <span class="stat">${book.likes.length}</span></h4>
        <h4>Saves: <span class="stat">${book.saves.length}</span></h4>
        <h4>Date Uploaded: <span class="stat">${uploadDate[0]}</span></h4>
      </div>
      <div class="book-btn py-1">
      

      ${
        book.type - 1 === 0
          ? '<span class="open btn btn-primary">Open</span>'
          : "<span></span>"
      }

        <span class="like btn ${
          book.likes.includes(userId) ? "btn-primary" : "btn-outline"
        }" onclick="addLike(${book.id})">${
    book.likes.includes(userId)
      ? "Liked <i class='fa-solid fa-heart'></i>"
      : "Like <i class='fa-regular fa-heart'></i>"
  }</span>
        <span class="save btn ${
          book.saves.includes(userId) ? "btn-primary" : "btn-outline"
        }" onclick="addSave(${book.id})">${
    book.saves.includes(userId)
      ? "Saved <i class='fa-solid fa-bookmark'></i></span>"
      : "Save <i class='fa-regular fa-bookmark'></i>"
  }</span>
          ${
            book.type - 1 === 1
              ? '<span class="borrow btn btn-outline" onclick="borrowBtn()">Borrow <i class="fa-solid fa-flag-swallowtail"></i></span>'
              : "<span></span>"
          }
        
      </div>
      </div>
      </div>`;
  bookDetailContainer.innerHTML = template;
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

  renderBookDetails();
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
  renderBookDetails();
};

const checkSave = (saves) => {
  if (saves.includes(userId)) {
    return true;
  } else {
    return false;
  }
};

const borrowBtn = () => {
  const modal = document.querySelector(".modal");
  const overlay = document.querySelector("#overlay");

  modal.classList.add("active");
  overlay.classList.add("active");
  // Form Validation
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (handleValidation()) {
      requestDetails = {
        ...requestDetails,
        status: "pending",
        borrowDate: new Date(),
      };
      addBorrow(requestDetails)
        .then((valid) => {
          if (valid) {
            alert("Request Sent!");
            requestReason.value = "";
            returnDate.value = "";
          }
          modal.classList.remove("active");
          overlay.classList.remove("active");
        })
        .catch((error) => {
          console.error(error);
        });
    }
});
  overlay.addEventListener("click", () => {
    modal.classList.remove("active");
    overlay.classList.remove("active");
  });
};

//Add to Borrow

const addBorrow = async (borrowData) => {
  fetch("http://localhost:3000/borrow", {
    method: "POST",
    body: JSON.stringify(borrowData),
    headers: { "Content-Type": "application/json" },
  });

  return true;
};
const setError = (element, msg) => {
  const errorControl = element.parentElement;
  const errorMsg = errorControl.querySelector(".error-msg");
  errorMsg.textContent = msg;
  element.classList.add("error");
  errorMsg.classList.add("error");
};

//Set Success
const setSuccess = (element, msg) => {
  const errorControl = element.parentElement;
  const errorMsg = errorControl.querySelector(".error-msg");
  errorMsg.textContent = msg;
  element.classList.remove("error");
  errorMsg.classList.remove("error");
};

const handleValidation = () => {
  const reason = requestReason.value.trim();
  const rDate = returnDate.value.trim();

  console.log(reason, rDate);

  if (reason === "") {
    setError(requestReason, "Reason cannot be empty");
    return false;
  } else {
    setSuccess(requestReason, "Reason");
    requestDetails = { ...requestDetails, reason: reason };
  }

  if (rDate === "") {
    setError(returnDate, "Set Return Date");
    return false;
  } else {
    setSuccess(returnDate, "Return Date");
    requestDetails = { ...requestDetails, returnDate: rDate };
  }

  return true;
};

window.addEventListener("DOMContentLoaded", () => renderBookDetails());
