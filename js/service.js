const userBtn = document.querySelector(".home .user");
// const dropContainer= document.querySelector(".drop-down")
// let user = JSON.parse(localStorage.getItem("user"));
// const userId = user.id;





// const renderUser =()=>{
//   let template = `
//               <div class="drop-user-info">
//                 <h3>${user.firstName+" "+user.lastName}</h3>
//                 <span>${types[user.type-1]}</span>
//               </div>

//               <a href="user.html" class="drop-down-link"><i class="fa-regular fa-user icon"></i><p>Profile</p><i class="fa-solid fa-angle-right"></i></a>
//               <a href="login.html" class="drop-down-link"><i class="fa-regular fa-arrow-right-from-bracket icon"></i><p>Logout</p><i class="fa-solid fa-angle-right"></i></a>
//   `

//   dropContainer.innerHTML= template;

// }

userBtn.addEventListener("click", ()=>{
    let dropDown = document.querySelector(".drop-down-wrap");
    dropDown.classList.toggle("open");
  })

