"use strict"

import checkPassword from "./modules/checkPassword.mjs";

const headerDiv = document.getElementById("headerDiv");
const contentDiv = document.getElementById("contentDiv");
const logoDiv = document.getElementById("logoDiv");

let currentUser = "";
let state = "unknown";
let users = [];

// Check if a state i saved if local storage, 
// if not, save default state to local storage and print the page based on the default state.
// If a state is already in local storage print the page based on that state.
if (!localStorage.getItem("state")) {
  localStorage.setItem("state", state);
  printPage(state);
  printHeader(state);
} else {
  state = localStorage.getItem("state");
  printPage(state);
  printHeader(state);
};

// Check if any users are stored in local storage, if not, set up a set of default users and store them in local storage.
if (!localStorage.getItem("users")) {
  users = [{ username: "janne", password: "test" }, { username: "oscar", password: "1234" }, { username: "kalle", password: "asdf" }];
  localStorage.setItem("users", JSON.stringify(users));
};

function newUserNameLengthCheck(newUserName, minlength, maxlength) {
  let mnlen = minlength;
  let mxlen = maxlength;
  let errorBoxNewUserName = document.getElementById("errorBoxNewUserName");
  if (newUserName.value.length < mnlen || newUserName.value.length > mxlen) {
    errorBoxNewUserName.innerHTML = ("Username needs to be " + mnlen + " to " + mxlen + " characters.");
    return false;
  }
  else {
    errorBoxNewUserName.innerHTML = "";
    return true;
  }
}

function checkIfUsersExists(newUserName) {
  let users = JSON.parse(localStorage.getItem("users"));
  let errorBoxUserExists = document.getElementById("errorBoxUserExists");
  if (users.find(user => user.username === newUserName)) {
    errorBoxUserExists.innerHTML = "Username already exists, try another one!";
    return false;
  } else {
    errorBoxUserExists.innerHTML = "";
    return true;
  }
};

// Main function to display content in the "contentDiv" based on what state the page is in
function printPage(state) {
  switch (state) {
    case "unknown": {
      // console.log("hi from unkown");
      contentDiv.innerHTML = `
      <h2>You need to log in to see the page. </h2>
      <p>Use the form in the upper right hand corner of the screen to log in.<br>
        If you don't already have an account you can create one here.
      </p>
      <br>
      <button id="iWantToCreateAnAccountBtn">I want to create an account</button>
      `;
      let iWantToCreateAnAccountBtn = document.getElementById("iWantToCreateAnAccountBtn");
      iWantToCreateAnAccountBtn.addEventListener("click", () => {
        state = "createNewUser";
        localStorage.setItem("state", state);
        printPage(state);
        printHeader(state);
      });
      break;
    }
    case "logInSuccess": {
      // console.log("Hi from logInSuccess");
      currentUser = localStorage.getItem("currentUser");
      contentDiv.innerHTML = `
      <h2>Welcome to the page ${currentUser}!</h2>
      <p>You have successfully logged in and are now able to enjoy this custom quote.</p>
      <q>Wake up, ${currentUser}... <br> The Matrix has you... <br> Follow the white rabbit. 
      <br><br><br>
      Knock, knock, ${currentUser}.
      `;
      break;
    }
    case "failedLogInAttempt": {
      // console.log("Hi from failedLogInAttempt");
      contentDiv.innerHTML = `
      <div id="errorMessage">
      <h2>Wrong Credentials</h2>
      <p>Invalid username or password. <br>
        Try again or create a new account.
      </p>
      <button id="iGiveUpGiveMeANewAccount">I give up, give me a new account</button>
      </div>
      `;
      let iGiveUpGiveMeANewAccount = document.getElementById("iGiveUpGiveMeANewAccount");
      iGiveUpGiveMeANewAccount.addEventListener("click", () => {
        state = "createNewUser";
        localStorage.setItem("state", state);
        printPage(state);
        printHeader(state);
      });
      break;
    }
    case "createNewUser": {
      // console.log("Hi from CreateNewUser");
      contentDiv.innerHTML = `
      <h2>Create Account</h2>
     
      <form id="createNewUserForm">
          <div class="inputField">
              <label for="newUserName">Username:</label><br>
              <input type="text" name="newUserName" id="newUserName" required/>
          </div>
          <br>
          <div class="inputField">
              <label for="newUserPassword">Password:</label><br>
              <input type="password" name="newUserPassword" id="newUserPassword" required/>
          </div>
          <br>
          <button type="submit" id="createNewAccountBtn">Create New Account</button>
      </form>
      <div id="errorBox">
      <div id="errorBoxUserExists"></div>
      <div id="errorBoxNewUserName"></div> 
      <div id="errorBoxNewPassword"></div> 
      </div>
            `;
      let createNewAccountBtn = document.getElementById("createNewAccountBtn");
      let newUserName = document.getElementById("newUserName");
      let newUserPassword = document.getElementById("newUserPassword");

      createNewAccountBtn.addEventListener("click", (e) => {
        e.preventDefault();
        //If username and password input match conditions to create new user, push new user to LocalStorage
        if (checkIfUsersExists(newUserName.value) && newUserNameLengthCheck(newUserName, 4, 10) && checkPassword(newUserPassword.value)) {
          let newUser = {
            username: newUserName.value,
            password: newUserPassword.value
          }
          users = JSON.parse(localStorage.getItem("users"));
          users.push(newUser);
          localStorage.setItem("users", JSON.stringify(users));

          // Go back to "start page"
          state = "unknown";
          localStorage.setItem("state", state);
          printPage(state);
          printHeader(state);

        } else {
          // Run conditions to display the errors that caused the if statement to fail
          // createNewUserForm.reset();
          newUserNameLengthCheck(newUserName, 4, 10);
          checkPassword(newUserPassword.value);
          checkIfUsersExists(newUserName.value);
        };
      });
      break;
    }
    default: {
      console.log("Something is wrong with the state/switch");
    }
  };
};

function printHeader(state) {
  if (state !== "logInSuccess") {
    headerDiv.innerHTML = `
    <form id="logInForm">
      <div class="inputField">
        <label for="userName">Username:</label><br>
        <input type="text" name="userName" id="userName" />
      </div>
      <div class="inputField">
        <label for="userPassword">Password:</label><br>
        <input type="password" name="userPassword" id="userPassword" />
      </div>
      <br>
      <button type="submit" id="logInBtn">Log In</button>
    </form>
    `
    let logInBtn = document.getElementById("logInBtn");
    let userName = document.getElementById("userName");
    let userPassword = document.getElementById("userPassword");

    logInBtn.addEventListener("click", (e) => {
      e.preventDefault();
      users = JSON.parse(localStorage.getItem("users"));
      let logInResultSuccess = users.find(user => user.username === userName.value && user.password === userPassword.value);

      if (logInResultSuccess) {
        state = "logInSuccess";
        localStorage.setItem("state", state);
        currentUser = userName.value;
        localStorage.setItem("currentUser", currentUser);
        printPage(state);
        printHeader(state);
      } else {
        state = "failedLogInAttempt";
        localStorage.setItem("state", state);
        printPage(state);
        printHeader(state);
      }
    });

  } else {
    currentUser = localStorage.getItem("currentUser");
    headerDiv.innerHTML = `
      <p>You are logged in as: ${currentUser}</p>
      <button id="logOutBtn">Log Out</button>
      `
    let logOutBtn = document.getElementById("logOutBtn");
    logOutBtn.addEventListener("click", () => {

      state = "unknown"
      localStorage.setItem("state", state);
      printPage(state);
      printHeader(state);
    });
  };
};

// Navigate to start page by clicking on "Enter the Matrix"
logoDiv.addEventListener("click", () => {

  if (localStorage.getItem("state") !== "logInSuccess") {
    state = "unknown";
    localStorage.setItem("state", state);
    printPage(state);
  }
});