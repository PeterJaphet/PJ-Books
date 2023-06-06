const id = new URLSearchParams(window.location.search).get("id");
const bookDetailContainer = document.querySelector(".book-details");
const form = document.querySelector("#book-request");
const formReport = document.querySelector("#report-book");
const requestReason = document.querySelector(".reason");
const reportReason = document.querySelector(".report-reason");
const returnDate = document.querySelector(".return-date");
const types = ["Public", "Private"];
const dropContainer = document.querySelector(".drop-down");
let user = JSON.parse(localStorage.getItem("user"));

const url = "http://localhost:3000";
let requestDetails = {};
let reportDetails = {};

if (!user) {
  window.location.href = "login.html";
}

if (user && !id) {
  window.location.href = "index.html";
}

const userId = user.id;

const renderUser = () => {
  if (user) {
    let template = `
                  <div class="drop-user-info">
                    <h3>${user.firstName + " " + user.lastName}</h3>
                    <span>${types[user.type - 1]}</span>
                  </div>
    
                  <a href="user.html" class="drop-down-link"><i class="fa-regular fa-user icon"></i><p>Profile</p><i class="fa-solid fa-angle-right"></i></a>
                  <a href="login.html" class="drop-down-link"><i class="fa-regular fa-arrow-right-from-bracket icon"></i><p>Logout</p><i class="fa-solid fa-angle-right"></i></a>
                  `;

    dropContainer.innerHTML = template;
  }
};

//render Book Details
const renderBookDetails = async () => {
  const uri = `http://localhost:3000/books/${id}`;
  const res = await fetch(uri);
  const book = await res.json();

  const uriBorrow = `http://localhost:3000/books/${id}?_embed=borrow`;
  const res2 = await fetch(uriBorrow);
  const borrow = await res2.json();

  const filteredBorrow = borrow.borrow
    .filter((borrow) => borrow.userId === userId)
    .flat();

  console.log(book.userId, user.id);
  const latestBorrow = filteredBorrow.splice(-1);
  console.log(latestBorrow.length);
  if (latestBorrow.length !== 0) {
    const now = new Date().getTime();
    const rDate = new Date(latestBorrow[0].returnDate).getTime();
  }

  const uploadDate = book.createdAt.split("T");
  let template = "";

  requestDetails = {
    ...requestDetails,
    userId: userId,
    bookId: book.id,
    authorId: book.userId,
  };

  reportDetails = {
    ...reportDetails,
    userId: userId,
    bookId: book.id,
    authorId: book.userId,
  };

  template = `
    <div class="container grid">
    <div class="book-image">
    <img src="${book.uploadUrl}" alt="" class="book-img"/>
    ${
      book.userId !== user.id
        ? "<span class='report-btn' onclick='handleReport()'><p>Report</p><i class='fa-solid fa-times'></i></span>"
        : "<span></span> "
    }
    
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
        book.type - 1 === 0 || book.userId === userId
          ? `<span class="open btn btn-primary" onclick="openPdf('${
              book.uploadFile.split(",")[1]
            }');">Open</span>`
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
  }</span>`;

  if (latestBorrow.length === 0) {
    template += `${
      book.type - 1 === 1 && book.userId !== userId
        ? ` <span class="borrow btn btn-outline" onclick="borrowBtn()">Borrow <i class="fa-solid fa-flag-swallowtail"></i></span>`
        : "<span></span>"
    }
      
      
       
        
      </div>
      </div>
      </div>`;
  }

  if (latestBorrow.length === 1) {
    const now = new Date().getTime();
    const rDate = new Date(latestBorrow[0].returnDate).getTime();

    if (latestBorrow[0].status === "rejected" || now > rDate) {
      template += `

    ${
      book.type - 1 === 1 && book.userId !== userId
        ? ` <span class="borrow btn btn-outline" onclick="borrowBtn()">Borrow <i class="fa-solid fa-flag-swallowtail"></i></span>`
        : "<span></span>"
    }
      </div>
      </div>
      </div>`;
    } else if (latestBorrow[0].status === "pending") {
      template += `

    ${
      book.type - 1 === 1 && book.userId !== userId
        ? `<span class="borrow btn btn-outline" onclick="statusBtn('${latestBorrow[0].status}')">Borrow <i class="fa-solid fa-flag-swallowtail"></i></span>`
        : "<span></span>"
    }
      </div>
      </div>
      </div>`;
    }
  }

  bookDetailContainer.innerHTML = template;
};

const statusBtn = (status) => {
  if (status === "pending") alert("Borrow request is Pending!");
  if (status === "rejected") alert("Borrow request Has been Rejected");
  if (status === "approved") alert("Book Has been Approved!");
};

const openPdf = (link) => {
  let pdfWindow = window.open("");
  pdfWindow.document.write(
    "<iframe style='border:none;' width='100%' height='100%' frameBorder='' src='data:application/pdf;base64, " +
      encodeURI(link) +
      "'></iframe>"
  );
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

//Borrow
const borrowBtn = () => {
  const modal = document.querySelector(".modal.card.borrow");
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

//Add report
const handleReportValidation = () => {
  const report = reportReason.value.trim();
  console.log(report);

  if (report === "") {
    setError(reportReason, "Complaint cannot be empty");
    return false;
  } else {
    setSuccess(reportReason, "Complaint");
    reportDetails = { ...reportDetails, reason: report };
  }

  return true;
};

const handleReport = () => {
  const modal = document.querySelector(".modal.card.report");
  const overlay = document.querySelector("#overlay");

  modal.classList.add("active");
  overlay.classList.add("active");
  // Form Validation
  formReport.addEventListener("submit", (e) => {
    e.preventDefault();

    if (handleReportValidation()) {
      reportDetails = {
        ...reportDetails,
        date: new Date(),
      };
      console.log(reportDetails);
      addReport(reportDetails)
        .then((valid) => {
          if (valid) {
            alert("Book Reported!");
            reportReason.value = "";
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

const addReport = async (reportData) => {
  fetch("http://localhost:3000/reports", {
    method: "POST",
    body: JSON.stringify(reportData),
    headers: { "Content-Type": "application/json" },
  });

  return true;
};

const renderDetails = () => {
  renderUser();
  renderBookDetails();
};

window.addEventListener("DOMContentLoaded", () => renderDetails());
