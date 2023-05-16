const url = "http://localhost:3000";

const addBtn = document.querySelector(".form-active");
const requestBtn = document.querySelector("#request");
const form = document.querySelector("#add-book");
const title = document.querySelector(".title");
const author = document.querySelector(".author-name");
const bookCover = document.querySelector(".image-cover");
const bookFile = document.querySelector(".book-file");
const description = document.querySelector(".desc");
const type = document.querySelector(".type");
const userInfoContainer = document.querySelector(".user-info");
const userBooksContainer = document.querySelector(
  ".user-books .books-container"
);
const bookRequestContainer = document.querySelector(".books.books-request");
const emptyContainer = document.querySelector(".books.empty-container");
const clearText = document.querySelectorAll("#add-book input[type=text]");
const clearFile = document.querySelectorAll("#add-book input[type=file]");
const cat = document.querySelectorAll(".user-books span");
const settings = document.querySelector("setting");
let user = JSON.parse(localStorage.getItem("user"));
const likes = [];
const saves = [];



const types = ["Author", "Reader"];
let BookDetails = {};


if(!user){
  window.location.href = "login.html";
}

const userId = user.id;

// for switching betwwen categories of books
cat.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector("span.active").classList.remove("active");
    btn.classList.add("active");
    renderUserBooks(btn.id);
  });
});

// andle settings
const handleSettings = () => {
  let dropDown = document.querySelector(".user-profile .setting_dropdown");
  dropDown.classList.toggle("open");
};

//Render User info
const renderUserInfo = async () => {
  uri = `http://localhost:3000/books?userId=${userId}`;
  const res = await fetch(uri);
  const books = await res.json();
  let saves = 0;

  books.forEach((book) => {
    saves += book.saves.length;
  });

  let template = `
    <div class="user-profile b flex shadow">
            <img src="./images/p.jpg" alt="" class="shadow" />
            <div>
              <h3 class="user-name">${user.firstName + " " + user.lastName}</h3>
              <p>${types[user.type - 1]}</p>
            </div>
            <span class="setting" onclick="handleSettings()"><i class="fa-solid fa-gear"></i></span>
            <div class="setting_dropdown shadow">
            <div>
              <a href="index.html" class="btn-link"><i class="fa-solid fa-house"></i><p>Home</p><i class="fa-solid fa-angle-right"></i></a>
              <span class="btn-link"><i class="fa-solid fa-xmark"></i><p>Logout</p><i class="fa-solid fa-angle-right"></i></span>
              </div>
            </div>
          </div>
          <div class="user-stats my-2 card b flex">
            <div class="text-center">
              <p>${books ? books.length : 0}</p>
              <h3>Books</h3>
            </div>
            <div class="text-center">
              <p>${books ? saves : 0}</p>
              <h3>Saves</h3>
            </div>
          </div>

          <div class="user-desc my-2 card">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nihil iure
            illo libero mollitia tenetur atque quos consectetur delectus
            aliquam, obcaecati vero saepe inventore voluptatem. Ab deserunt modi
            quia, veritatis aperiam eum aliquam?
          </div>
    
    `;

  userInfoContainer.innerHTML = template;
};

//render Filter options

const renderFilter = () => {
  if (user.type !== 1) {
    addBtn.style.display = "none";
    requestBtn.style.display = "none";
  }
};

// render books
const renderUserBooks = async (id,load) => {

  //userBooksContainer.innerHTML = "";
  emptyContainer.innerHTML = "";
  bookRequestContainer.innerHTML = "";
  if (id == "books") {
    if(load===true){
    for (let i = 0; i < 4; i++) {
      userBooksContainer.innerHTML += `
      <div class="book-item shadow ">
      
      <div class="skeleton skeleton-image"></div>
      <div class="book-item__text text-center">
        <h3 class="skeleton skeleton-text"></h3>
        <p class="skeleton skeleton-text"></p>
        <div class="activity flex skeleton">
          <div class="like skeleton">
            <span class="skeleton"><i class='fa-regular fa-heart'></i></span>
            <p></p>
          </div>
          <span class="skeleton"><i class='fa-regular fa-bookmark'></i></span>
        </div>  
        </div>
        </div>
        `;
    }}
    uri = `http://localhost:3000/books?userId=${userId}`;

    const res = await fetch(uri);
    const books = await res.json();

    let template = "";

    if (books.length !== 0) {
      books.forEach((book) => {
        template += `
      <div class="book-item shadow">
      <a href="/bookDetails.html?id=${book.id}"><img src="${book.uploadUrl}" alt="" /></a>
      <div class="book-item__text text-center">
        <h3>${book.title}</h3>
        <p>${book.author}</p>
        <div class="activity flex">
          <div class="like">
            <span onclick="addLike(${book.id},'books')">${
          book.likes.includes(userId)
            ? "<i class='fa-solid fa-heart'></i>"
            : "<i class='fa-regular fa-heart'></i>"
        }</span>
            <p>${book.likes.length}</p>
          </div>
          <span onclick="addSave(${book.id},'books')">${
          book.saves.includes(userId)
            ? "<i class='fa-solid fa-bookmark'></i></span>"
            : "<i class='fa-regular fa-bookmark'></i>"
        }</span>
        </div>  
        </div>
        </div>
            `;
      });

      userBooksContainer.innerHTML = template;
      emptyContainer.innerHTML = "";
    } else {
      userBooksContainer.innerHTML = "";
      bookRequestContainer.innerHTML = "";
      emptyContainer.classList.add("active");
      emptyContainer.innerHTML = `<div class="empty md">No Books 😢</div>`;
      emptyContainer.style.marginTop = "-3rem";
    }
  }

  if (id == "saved") {

    renderUserSavedBooks(load);
  }

  if (id == "borrow") {
   // userBooksContainer.innerHTML = "";
    if(load===true){
    for (let i = 0; i < 4; i++) {
      userBooksContainer.innerHTML += `
      <div class="book-item shadow ">
      
      <div class="skeleton skeleton-image"></div>
      <div class="book-item__text text-center">
        <h3 class="skeleton skeleton-text"></h3>
        <p class="skeleton skeleton-text"></p>
        <div class="activity flex skeleton">
          <div class="like skeleton">
            <span class="skeleton"><i class='fa-regular fa-heart'></i></span>
            <p></p>
          </div>
          <span class="skeleton"><i class='fa-regular fa-bookmark'></i></span>
        </div>  
        </div>
        </div>
        `;
    }}
    renderBorrowedBooks(load);
  }

  if (id == "request") {
    renderRequests();
  }
};

const renderRequests = async () => {
  userBooksContainer.innerHTML = "";
  emptyContainer.innerHTML = "";
  uri = `http://localhost:3000/borrow?authorId=${userId}`;
  const res = await fetch(uri);
  const borrowUsers = await res.json();

  uriUsers = `http://localhost:3000/users`;
  const res2 = await fetch(uriUsers);
  const users = await res2.json();

  // const filteredUsers = borrowUsers.filter(user=> user.borrow.some(borrow=> borrow.authorId===userId && borrow.status==="pending")).flat();

  let template = "";
  let count = 0;

  borrowUsers.forEach((item) => {
    if (item.status === "pending") {
      count++;
      const user = users.find((user) => item.userId === user.id);
      template += `
    <div class="card">
    <span>${user.firstName}  ${user.lastName} wants to borrow !</span>
    <span class="span-link" onclick="viewRequest(${item.id});">View request</span>
  </div>
    
    `;
    }
  });

  if (count !== 0) {
    bookRequestContainer.innerHTML = template;
    bookRequestContainer.style.marginTop = "-2rem";
  } else {
    bookRequestContainer.innerHTML = "";
    emptyContainer.classList.add("active");
    emptyContainer.innerHTML = `<div class=" md">No Book Requests 😢</div>`;
    emptyContainer.style.marginTop = "-3rem";
  }
};

const viewRequest = async (id) => {
  console.log(id);
  uri = `http://localhost:3000/users?_embed=borrow`;
  const res = await fetch(uri);
  const users = await res.json();

  uriBooks = `http://localhost:3000/books`;
  const res2 = await fetch(uriBooks);
  const books = await res2.json();

  const filteredUser = users
    .filter((user) => user.borrow.some((borrow) => borrow.id === id))
    .flat();

  const filteredBorrow = users
    .map((user) => user.borrow.filter((borrow) => borrow.id === id))
    .flat();
  const modal = document.querySelector(".modal.card.request");
  const overlay = document.querySelector("#overlay");

  modal.classList.add("active");
  overlay.classList.add("active");
  console.log(modal, filteredUser, filteredBorrow);

  let template = ``;

  filteredUser.forEach((user) => {
    const book = books.find((item) => filteredBorrow[0].bookId === item.id);
    console.log(book);

    template = `

    <form id="pending-request">
    <h1 class="my-2 md">Pending request</h1>

    <div class="form-control">
      <p class="error-msg">Name</p>
      <input
        type="text"
        name="title"
        class="input-control name"
        placeholder=""
        value="${user.firstName} ${user.lastName}"
        disabled
      />
    </div>

    <div class="form-control">
      <p class="error-msg">Book's Name</p>
      <input
        type="text"
        name="author-name"
        class="input-control book-name"
        placeholder=""
        value="${book.title}"
        disabled
      />
    </div>
    <div class="form-control-2">
      <div class="form-control">
        <p class="error-msg">Request Date</p>
        <input
          type="text"
          class="input-control request-date"
          value=${filteredBorrow[0].borrowDate.split("T")[0]}
          disabled
        />
      </div>

      <div class="form-control">
        <p class="error-msg">Return Date</p>
        <input
          type="text"
          class="input-control return-date"
          value=${filteredBorrow[0].returnDate}
          disabled
        />
      </div>
    </div>
    <div class="form-control">
      <p class="error-msg">Reason</p>
      <textarea
        name="textarea"
        class="input-control desc"
        rows="5"
        cols="30"
        disabled
        value=""
      >${filteredBorrow[0].reason}</textarea>
    </div>
    <div class="text-center">
    <span class="btn btn-outline my-1" onclick="approveRequest(${
      filteredBorrow[0].id
    })">
      Approve <i class="fa-solid fa-check"></i>
    </span>
    <span class="btn my-1" onclick="rejectRequest(${filteredBorrow[0].id}) ">
      Reject <i class="fa-solid fa-times"></i>
    </span>
    </div>
  </form>
    
    `;
  });

  modal.innerHTML = template;

  overlay.addEventListener("click", () => {
    modal.classList.remove("active");
    overlay.classList.remove("active");
  });
};

const approveRequest = async (id) => {
  console.log("hello", id);

  uri = `http://localhost:3000/borrow/${id}`;

  await fetch(uri, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status: "approved",
    }),
  });
  alert("Approved!!!");

  const modal = document.querySelector(".modal.card.request");
  const overlay = document.querySelector("#overlay");
  modal.classList.remove("active");
  overlay.classList.remove("active");
  renderRequests();
};

const rejectRequest = async (id) => {
  uri = `http://localhost:3000/borrow/${id}`;

  await fetch(uri, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status: "rejected",
    }),
  });

  alert("Rejected!!!");
  const modal = document.querySelector(".modal.card.request");
  const overlay = document.querySelector("#overlay");
  modal.classList.remove("active");
  overlay.classList.remove("active");

  renderRequests();
};

//render saved Books
const renderUserSavedBooks = async (load) => {
  emptyContainer.innerHTML = "";

  if(load===true){
  bookRequestContainer.innerHTML = "";

  for (let i = 0; i < 4; i++) {
    userBooksContainer.innerHTML += `
    <div class="book-item shadow ">
    
    <div class="skeleton skeleton-image"></div>
    <div class="book-item__text text-center">
      <h3 class="skeleton skeleton-text"></h3>
      <p class="skeleton skeleton-text"></p>
      <div class="activity flex skeleton">
        <div class="like skeleton">
          <span class="skeleton"><i class='fa-regular fa-heart'></i></span>
          <p></p>
        </div>
        <span class="skeleton"><i class='fa-regular fa-bookmark'></i></span>
      </div>  
      </div>
      </div>
      `;
  }}
  uri = `http://localhost:3000/books`;
  const res = await fetch(uri);
  const books = await res.json();

  let template = "";
  let count = 0;

  books.forEach((book) => {
    if (book.saves.includes(userId)) {
      count++;
      template += `
    <div class="book-item shadow">
    <a href="/bookDetails.html?id=${book.id}"><img src="${book.uploadUrl}" alt="" /></a>
    <div class="book-item__text text-center">
      <h3>${book.title}</h3>
      <p>${book.author}</p>
      <div class="activity flex">
        <div class="like">
          <span onclick="addLike(${book.id},'saved')">${
        book.likes.includes(userId)
          ? "<i class='fa-solid fa-heart'></i>"
          : "<i class='fa-regular fa-heart'></i>"
      }</span>
          <p>${book.likes.length}</p>
        </div>
        <span onclick="addSave(${book.id},'saved')">${
        book.saves.includes(userId)
          ? "<i class='fa-solid fa-bookmark'></i></span>"
          : "<i class='fa-regular fa-bookmark'></i>"
      }</span>
        </div>  
        </div>
    </div>
          `;
    }
  });


  if (count !== 0) {
    userBooksContainer.innerHTML = template;
  } 
  if(count===0) {
    userBooksContainer.innerHTML = "";
    emptyContainer.classList.add("active");
    emptyContainer.innerHTML = `<div class="md">No Saved Book(s) 😢</div>`;
    emptyContainer.style.marginTop = "-3rem";
  }
};

// Render Borrowed Books

const renderBorrowedBooks = async (load) => {
 
  emptyContainer.innerHTML = "";
  bookRequestContainer.innerHTML = "";

  
  if(load===true){
    bookRequestContainer.innerHTML = "";
  
    for (let i = 0; i < 4; i++) {
      userBooksContainer.innerHTML += `
      <div class="book-item shadow ">
      
      <div class="skeleton skeleton-image"></div>
      <div class="book-item__text text-center">
        <h3 class="skeleton skeleton-text"></h3>
        <p class="skeleton skeleton-text"></p>
        <div class="activity flex skeleton">
          <div class="like skeleton">
            <span class="skeleton"><i class='fa-regular fa-heart'></i></span>
            <p></p>
          </div>
          <span class="skeleton"><i class='fa-regular fa-bookmark'></i></span>
        </div>  
        </div>
        </div>
        `;
    }}
  const uri = `http://localhost:3000/books?_embed=borrow`;
  const res = await fetch(uri);
  const books = await res.json();

  const filteredBooks = books
    .filter((book) => book.borrow.some((borrow) => borrow.userId === userId))
    .flat();

  const filteredBorrow = books
    .map((book) => book.borrow.filter((borrow) => borrow.userId === userId))
    .flat();

  console.log(filteredBorrow);

  let template = "";
  let count = 0;

  if (filteredBorrow.length!== 0) {
  filteredBorrow.forEach((book) => {
    const bookItem = filteredBooks.filter((item) => item.id === book.bookId);
    console.log(bookItem)
    const now = new Date().getTime();
    const rDate = new Date(book.returnDate).getTime();

    count++;
    template += `
    <div class="book-item shadow">

    ${ now < rDate && book.status==="approved" ? `<span onclick="openPdf('${
      bookItem[0].uploadFile.split(",")[1]
    }');"><img src="${bookItem[0].uploadUrl}" alt="" /></span>`:`<span onclick="handleStatus('${book.status}')"><img src="${bookItem[0].uploadUrl}" alt="" /></span>`}
    
    <div class="book-item__text text-center">
      <h3>${bookItem[0].title}</h3>
      <p>${bookItem[0].author}</p>
      <div class="activity text-center flex">
      <p class="${book.status}">${book.status}!</p>
       </div>
        </div>
    </div>
          `;
  });

    userBooksContainer.innerHTML = template;
    
  } else {
    userBooksContainer.innerHTML = "";
    emptyContainer.classList.add("active");
    emptyContainer.innerHTML = `<div class="md">No Borrowed Book(s) 😢</div>`;
    emptyContainer.style.marginTop = "-3rem";
  }
};

const openPdf = (link) => {
  let pdfWindow = window.open("");
  pdfWindow.document.write(
    "<iframe style='border:none;' width='100%' height='100%' frameBorder='' src='data:application/pdf;base64, " +
      encodeURI(link) +
      "'></iframe>"
  );
};

const handleStatus = (status) =>{
  if (status==="pending")
  alert("Borrow request is Pending")
  if (status==="rejected")
  alert("Borrow request Has been Rejected")
  if (status==="approved")
  alert("Book Has been Returned")
}

const addLike = async (bookId, id) => {
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

  renderUserBooks(id,false); // re-render the books after the update
};

const checkLike = (likes) => {
  if (likes.includes(userId)) {
    return true;
  } else {
    return false;
  }
};

// code block to add save

const addSave = async (bookId, id) => {
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
  renderUserBooks(id,false);
  renderUserInfo();
};

const checkSave = (saves) => {
  if (saves.includes(userId)) {
    return true;
  } else {
    return false;
  }
};

// handle add books
addBtn.addEventListener("click", () => {
  const modal = document.querySelectorAll(".modal")[1];
  const overlay = document.querySelector("#overlay");

  modal.classList.add("active");
  overlay.classList.add("active");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (handleValidation()) {
      BookDetails = {
        ...BookDetails,
        likes,
        saves,
        userId,
        createdAt: new Date(),
      };
      addBook(BookDetails)
        .then((valid) => {
          if (valid) {
            alert("Book Added!");
            clearText.forEach((text) => {
              text.value = "";
            });
            clearFile.forEach((input) => {
              input.value = "";
            });
            description.value = "";
            renderUserComponents();
          }
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
});

//Convert to base64
async function imageToBase64(inputFileElement) {
  const file = inputFileElement.files[0];
  if (!file) {
    throw new Error("No file selected.");
  }
  const blob = await new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => resolve(reader.result);
  });
  return blob;
}

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
  const Title = title.value.trim();
  const Author = author.value.trim();
  const Description = description.value.trim();
  const Type = type.value.trim();

  console.log(Description);
  console.log(bookCover.files[0]);

  if (Title === "") {
    setError(title, "Title is required!");
    return false;
  } else {
    setSuccess(title, "Title");
    BookDetails = { ...BookDetails, title: title.value.trim() };
  }
  if (Author === "") {
    setError(author, "Author is required!");
    return false;
  } else {
    setSuccess(author, "Author's Name");
    BookDetails = { ...BookDetails, author: author.value.trim() };
  }
  if (Description === "") {
    setError(description, "Description is required!");
    return false;
  } else {
    setSuccess(description, "Description");
    BookDetails = { ...BookDetails, description: description.value.trim() };
  }
  if (Type === "") {
    setError(type, "Type is required!");
    return false;
  } else {
    setSuccess(type, "Type");
    BookDetails = { ...BookDetails, type: parseInt(type.value.trim()) };
  }

  if (bookCover.files[0] === undefined) {
    setError(bookCover, "Book Cover is required!");
    return false;
  } else {
    setSuccess(bookCover, "Book Cover");
  }

  if (bookFile.files[0] === undefined) {
    setError(bookFile, "Book File is required!");
    return false;
  } else {
    setSuccess(bookFile, "Book File");
  }

  return true;
};

//upload Book COver
bookCover.addEventListener("change", async () => {
  try {
    const base64 = await imageToBase64(bookCover);
    BookDetails = { ...BookDetails, uploadUrl: base64 };
    console.log(BookDetails);
  } catch (error) {
    console.error(error);
  }
});

//upload Book File
bookFile.addEventListener("change", async () => {
  try {
    const reader = new FileReader();
    reader.readAsDataURL(bookFile.files[0]);
    const pdfData = await new Promise((resolve) => {
      reader.onload = (event) => {
        resolve(event.target.result);
      };
    });
    BookDetails = { ...BookDetails, uploadFile: pdfData };
  } catch (error) {
    console.error(error);
  }
});

const addBook = async (bookData) => {
  fetch("http://localhost:3000/books", {
    method: "POST",
    body: JSON.stringify(bookData),
    headers: { "Content-Type": "application/json" },
  });

  return true;
};

//Skeleton Loader

const renderSkeletonLoader = (container) => {
  container = "";
  for (let i = 0; i < 4; i++) {
    container.innerHTML += `
    <div class="book-item shadow ">
    
    <div class="skeleton skeleton-image"></div>
    <div class="book-item__text text-center">
      <h3 class="skeleton skeleton-text"></h3>
      <p class="skeleton skeleton-text"></p>
      <div class="activity flex skeleton">
        <div class="like skeleton">
          <span class="skeleton"><i class='fa-regular fa-heart'></i></span>
          <p></p>
        </div>
        <span class="skeleton"><i class='fa-regular fa-bookmark'></i></span>
      </div>  
      </div>
      </div>
      `;
  }
};
const renderUserComponents = (load) => {
  renderUserInfo();
  renderFilter();
  renderUserBooks("books", load);
};

window.addEventListener("DOMContentLoaded", () => renderUserComponents(true));
