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
const clearText = document.querySelectorAll("#add-book input[type=text]");
const clearFile = document.querySelectorAll("#add-book input[type=file]");
const cat = document.querySelectorAll(".user-books span");
const settings = document.querySelector("setting");
let user = JSON.parse(localStorage.getItem("user"));
const likes = [];
const saves = [];
const userId = user.id;
const types = ["Author", "Reader"];

console.log(clearText, clearFile);
let BookDetails = {};

// for switching betwwen categories of books
cat.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector("span.active").classList.remove("active");
    btn.classList.add("active");
    renderUserBooks(btn.id);
  });
});

//
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

const renderFilter = () =>{
 if(user.type!==1){
 addBtn.style.display = "none";
 requestBtn.style.display="none";
 }

}

// render books
const renderUserBooks = async (id) => {
  if (id == "books") {
    uri = `http://localhost:3000/books?userId=${userId}`;

    const res = await fetch(uri);
    const books = await res.json();

    let template = "";

    books.forEach((book) => {
      template += `
      <div class="book-item shadow">
      <img src="${book.uploadUrl}" alt="" />
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
  } 
  
  if (id == "saved") {
    renderUserSavedBooks();
  }

  if(id == "request"){
    renderRequests();
  }
  
};


const renderRequests = async ()=>{
  uri = `http://localhost:3000/borrow?authorId=${userId}`;
  
  const res = await fetch(uri);
  const users = await res.json();

  const filteredUsers = users.filter(user=> user.borrow.some(borrow=> borrow.authorId===userId && borrow.status==="pending")).flat();

  let template = "";
  console.log(filteredUsers)

  filteredUsers.forEach(user=>{
    console.log(user.borrow.map((id)=>console.log(id)));
    template += `
    <div class="card">
    <span>${user.firstName}  ${user.lastName} wants to borrow !</span>
    <span class="span-link" onclick="viewRequest(${user.borrow.id});">View request</span>
  </div>
    
    `})

    userBooksContainer.innerHTML ="";

    bookRequestContainer.innerHTML = template;
    bookRequestContainer.style.marginTop = "-2rem";

}

const viewRequest = async(id)=>{
  uri = `http://localhost:3000/users?_embed=borrow`;
  const res = await fetch(uri);
  const users = await res.json();
  const filteredUser = users.filter(user=> user.borrow.some(borrow=> borrow.id===3)).flat();

  console.log(id,filteredUser);

}

const renderUserSavedBooks = async () => {
  uri = `http://localhost:3000/books`;
  const res = await fetch(uri);
  const books = await res.json();

  let template = "";

  books.forEach((book) => {
    console.log(book.saves.includes(userId));
    if (book.saves.includes(userId)) {
      console.log(book.saves.includes(userId));
      template += `
    <div class="book-item shadow">
    <img src="${book.uploadUrl}" alt="" />
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

  userBooksContainer.innerHTML = template;
};

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

  renderUserBooks(id); // re-render the books after the update
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
  renderUserBooks(id);
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
  const modal = document.querySelector(".modal");
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

const renderUserComponents = () => {

  renderUserInfo();
  renderFilter();
  renderUserBooks("books");
};

window.addEventListener("DOMContentLoaded", () => renderUserComponents());
