const form = document.querySelector("#login-form");
const email = document.querySelector(".email");
const password = document.querySelector(".password");
const btn = form.querySelector(".btn");
let userDetails = {};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (handleValidation()) {
    fetchData().then((valid) => {
      console.log(valid);

      if (!valid) {
        alert("Wrong Email or Password, Please enter correct details !");
      } else {
        window.location.replace("/index.html");
      }
    });
  }
});

const setError = (element, msg) => {
  const errorControl = element.parentElement;
  const errorMsg = errorControl.querySelector(".error-msg");
  errorMsg.textContent = msg;
  element.classList.add("error");
  errorMsg.classList.add("error");
};

const setSuccess = (element, msg) => {
  const errorControl = element.parentElement;
  const errorMsg = errorControl.querySelector(".error-msg");
  errorMsg.textContent = msg;
  element.classList.remove("error");
  errorMsg.classList.remove("error");
};

const handleValidation = () => {
  const userEmail = email.value.trim();
  const pass = password.value.trim();

  if (userEmail === "") {
    setError(email, "Email is required!");
    return false;
  } else {
    setSuccess(email, "Email");
    userDetails = { email: email.value.trim() };
  }
  if (pass === "") {
    setError(password, "Password is required!");
    return false;
  } else {
    setSuccess(password, "Password");
    userDetails = { ...userDetails, password: password.value.trim() };
  }

  return true;
};

function compareHashes(userPassword, storedHashedPassword) {
  const sha256 = new jsSHA("SHA-256", "TEXT");
  sha256.update(userPassword);
  const userHash = sha256.getHash("HEX");
  if (userHash === storedHashedPassword) {
    // The passwords match
    return true;
  } else {
    // The passwords do not match
    return false;
  }
}

const fetchData = async () => {
  let valid = false;

  const response = await fetch("http://localhost:3000/users");
  const users = await response.json();

  users.forEach((user) => {
    if (
      user.email === userDetails.email &&
      compareHashes(userDetails.password, user.password)
    ) {
        valid = true;
        let userInfo =user;
        localStorage.setItem("user", JSON.stringify(userInfo));
      
    } else if (!valid) {
        valid = false;
      }
    });

  if (valid) {
    return Promise.resolve(true);
  } else {
    return Promise.resolve(false);
  }
};
