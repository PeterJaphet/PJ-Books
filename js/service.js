const userBtn = document.querySelector(".home .user");
//let user = JSON.parse(localStorage.getItem("user"));

userBtn.addEventListener("click", ()=>{
  if(user){
    let dropDown = document.querySelector(".drop-down-wrap");
    dropDown.classList.toggle("open");
  }
  else{
    window.location.replace('/login.html')
  }
  })

  const toggleMenu =()=>{
    const hamburger = document.querySelector(".burger");
    hamburger.classList.toggle("active");

    document.body.classList.toggle("open");
  }

