const userBtn = document.querySelector(".home .user");
const searchInput = document.querySelector("#search");
const searchForm = document.querySelector("#form-search");
const search = document.querySelector(".search-display");
let dropDown = document.querySelector(".drop-down-wrap");

userBtn.addEventListener("click", ()=>{
  if(user){
    
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

  const handleSearch = async (searchValue) => {
    console.log(searchValue);
    let uri = `http://localhost:3000/books?q=${searchValue}`;
  
    const res = await fetch(uri);
    const books = await res.json();
  
    if (searchValue !== "" && books.length !== 0) {
      search.style.display = "block";
  
      let template = "";
      books.forEach((book) => {
        template += `
      <a href="bookDetails.html?id=${book.id}">
                <div class="search-item">
                  <div class="search-details">
                    <img src="${book.uploadUrl}" alt="" class="search-img">
                    <div class="book-info">
                      <h3>${book.title}</h3>
                      <p>${book.author}</p>
                    </div>
                  </div>
                  </div>
                  </a>
          
          `;
      });
      search.innerHTML = template;
    } else {
      search.style.display = "none";
    }
  };
  
  searchInput.addEventListener("keyup", (e) => {
    e.preventDefault();
  
    handleSearch(searchInput.value.trim());
  });
  
  searchInput.addEventListener("change", (e) => {
    e.preventDefault();
  
    handleSearch(searchInput.value.trim());
  });
  
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
  
    handleSearch(searchInput.value.trim());
  });

  document.addEventListener('click', (e) => {
    let clickInside = search.contains(e.target);
  
    if (!clickInside) {
       search.style.display = "none"
       searchInput.value="";       
    }
  })

