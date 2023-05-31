const form = document.querySelector("#register-form");
const firstName = document.querySelector(".firstname");
const lastName = document.querySelector(".lastname");
const email = document.querySelector(".email");
const Status = document.querySelector(".status");
const dob = document.querySelector(".dob");
const password = document.querySelector(".password");
const rePassword = document.querySelector(".re-password");
let userDetails = {};

//Handle Form

form.addEventListener("submit", (e) => {
  e.preventDefault();

  console.log(userDetails);
  if (handleValidation()) {
    checkUserExists(userDetails).then((exist) => {
      if (!exist) {
        setSuccess(email, "Email");
        registerUser(userDetails);
        window.location.replace("/login.html");
      } else {
        setError(email, "Email already Exist!");
      }
    });
  }
});

//Set Errors
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

//check validEmail
const isValidEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

//Encrypt Passwords

function encryptPassword(password) {
  const sha256 = new jsSHA("SHA-256", "TEXT");
  sha256.update(password);
  const hash = sha256.getHash("HEX");
  return hash;
}

//Handle Validation
const handleValidation = () => {
  const type = parseInt(Status.value.trim());

  let createdAt = new Date();

  if (firstName.value.trim() === "") {
    setError(firstName, "First Name is required!");
    return false;
  } else {
    setSuccess(firstName, "First Name");
    userDetails = { ...userDetails, firstName: firstName.value.trim() };
  }

  if (lastName.value.trim() === "") {
    setError(lastName, "Last Name is required!");
    return false;
  } else {
    setSuccess(lastName, "Last Name");
    userDetails = { ...userDetails, lastName: lastName.value.trim() };
  }

  if (email.value.trim() === "") {
    setError(email, "Email is required!");
    return false;
  } else if (!isValidEmail(email.value.trim())) {
    setError(email, "Provide a valid email address");
    return false;
  } else {
    setSuccess(email, "Email");
    userDetails = { ...userDetails, email: email.value.trim() };
  }

  if (dob.value.trim() === "") {
    setError(dob, "Date of Birth is required!");
    return false;
  } else {
    setSuccess(dob, "Date of Birth");
  }

  userDetails = { ...userDetails, dob: dob.value.trim() };

  if (password.value.trim() === "") {
    setError(password, "Password is required!");
    return false;
  } else if (password.value.trim().length < 8) {
    setError(password, "Password must be at least 8 characters.");
    return false;
  } else {
    setSuccess(password, "Password");
  }

  if (rePassword.value.trim() === "") {
    setError(rePassword, "Password is required!");
    return false;
  } else if (rePassword.value.trim() !== password.value.trim()) {
    setError(rePassword, "Passwords don't match!");
    return false;
  } else {
    setSuccess(rePassword, "Re-Enter Password");
    userDetails = {
      ...userDetails,
      password: encryptPassword(rePassword.value.trim()),
    };
  }

  userDetails = { ...userDetails, type: type };
  userDetails = { ...userDetails, createdAt };
  return true;
};

//Register Users
const registerUser = async (userData) => {
  fetch("http://localhost:3000/users", {
    method: "POST",
    body: JSON.stringify(userData),
    headers: { "Content-Type": "application/json" },
  });
};

const checkUserExists = async (newUser) => {
  const response = await fetch("http://localhost:3000/users");
  const users = await response.json();
  const userExists = users.some((user) => user.email === newUser.email);
  console.log(newUser.email, userExists);
  if (userExists) {
    return Promise.resolve(true);
  } else {
    return Promise.resolve(false);
  }
};

// const handleValidation = () => {
//     const type = parseInt(Status.value.trim());
//     const fields = [
//       { name: "First Name", input: firstName },
//       { name: "Last Name", input: lastName },
//       { name: "Email", input: email, validator: isValidEmail },
//       { name: "Date of Birth", input: dob },
//       { name: "Password", input: password, validator: (value) => value.trim().length >= 8 },
//       { name: "Re-Enter Password", input: rePassword, validator: (value) => value.trim() === password.value.trim() },
//     ];

//     let valid = true;
//     let userDetailsCopy = { ...userDetails };

//     fields.forEach((field) => {
//       const { name, input, validator } = field;
//       const value = input.value.trim();

//       if (value === "") {
//         setError(input, `${name} is required!`);
//         valid = false;
//       } else if (validator && !validator(value)) {
//         setError(input, `Provide a valid ${name.toLowerCase()}.`);
//         valid = false;
//       } else {
//         setSuccess(input, name);
//         userDetailsCopy = { ...userDetailsCopy, [input.name]: input.value.trim() };
//       }
//     });

//     if (valid) {
//       userDetailsCopy = { ...userDetailsCopy, type };
//       userDetailsCopy = { ...userDetailsCopy, password: encryptPassword(rePassword.value.trim()) };
//       userDetails = userDetailsCopy;
//     }

//     return valid;
//   };





