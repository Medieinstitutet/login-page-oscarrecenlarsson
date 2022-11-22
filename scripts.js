headerDiv = document.getElementById("headerDiv");
contentDiv = document.getElementById("contentDiv");

let currentUser = "";
let state = "";

if (!localStorage.getItem("state")) {
  let state = "unknown";
  localStorage.setItem("state", state);
} else {
  state = localStorage.getItem("state");
}

if (!localStorage.getItem("users")) {
  let users = [];
  users = [{ username: "janne", password: "test" }];
  localStorage.setItem("users", JSON.stringify(users));
}

const checkPassword = (password) => {

  let specialCharsCount = 0;
  const specialChars = [
    "@", "$", "%", "*", "^", "<", ">", "?", "!", "(", ")", "[", "]", "{", "}", "'"
  ];

  specialChars.forEach((value, index) => {
    const specialChar = specialChars[index];
    if (password.includes(specialChar)) {
      specialCharsCount++;
    }
  });
  if (password.length >= 6 && specialCharsCount >= 2 ||
    password.length >= 8 && specialCharsCount >= 1 ||
    password.length >= 12 && password.includes("-") ||
    password.length >= 16) {
    errorBoxNewPassword.innerHTML = "";
    return true;
  }
  else {
    const ErrorMessagePassword = "Password not strong enough, try again! <br> Password needs to be at least 6 characters long and include at least 2 <br> unique special characters from the following list: @ $ % * ^ < > ? ! ( ) [ ] { } '"
    errorBoxNewPassword.innerHTML = ErrorMessagePassword;
    return false;
  }
};

function newUserNameLengthCheck(newUserName, minlength, maxlength) {
  let mnlen = minlength;
  let mxlen = maxlength;

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
  if (users.find(user => user.username === newUserName)) {
    errorBoxUserExists.innerHTML = "Username already exists, try another one!";
    return false;
  } else {
    errorBoxUserExists.innerHTML = "";
    return true;
  }
};

function printPage(state) {
  switch (state) {
    default:
      contentDiv.innerHTML = `
      <h2>You need to log in to see the page. </h2>
      <p>Use the form in the upper right hand corner of the screen to log in.<br>
        If you don't already have an account you can create one here.
      </p>
      <br>
      <button id="iWantToCreateAnAccountBtn">I want to create an account</button>
      `;
      iWantToCreateAnAccountBtn = document.getElementById("iWantToCreateAnAccountBtn")
      iWantToCreateAnAccountBtn.addEventListener("click", () => {
        state = "createNewUser"
        localStorage.setItem("state", state);
        printPage(state);
        printHeader(state);
      });
      break;

    case "logInSuccess":

      contentDiv.innerHTML = `
      <h2>Welcome to the page ${currentUser}!</h2>
      <p>You have successfully logged in and are now able to enjoy this custom quote.</p>
      <q>Wake up, ${currentUser}... <br> The Matrix has you... <br> Follow the white rabbit. 
      <br><br><br>
      Knock, knock, ${currentUser}.
      `
      break;

    case "failedLogInAttempt":
      contentDiv.innerHTML = `
      <div id="errorMessage">
      <h2>Wrong Credentials</h2>
      <p>Invalid username or password. <br>
        Try again or create a new account.
      </p>
      <button id="iGiveUpGiveMeANewAccount">I give up, give me a new account</button>
      </div>
      `;
      iGiveUpGiveMeANewAccount.addEventListener("click", () => {
        state = "createNewUser"
        localStorage.setItem("state", state);
        printPage(state);
        printHeader(state);
      });
      break;

    case "createNewUser":
      contentDiv.innerHTML = `
      <h2>Create Account</h2>
      <br><br>
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
      createNewAccountBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (checkIfUsersExists(newUserName.value) && newUserNameLengthCheck(newUserName, 4, 10) && checkPassword(newUserPassword.value)) {
          //Push new user to LocalStorage
          let newUser = {
            username: newUserName.value,
            password: newUserPassword.value
          }
          let users = [];
          users = JSON.parse(localStorage.getItem("users"));
          users.push(newUser);

          //Change state
          localStorage.setItem("users", JSON.stringify(users));
          state = "unknown";
          localStorage.setItem("state", state);
          printPage(state);
          printHeader(state);

        } else {
          // createNewUserForm.reset();
          newUserNameLengthCheck(newUserName, 4, 10);
          checkPassword(newUserPassword.value);
          checkIfUsersExists(newUserName.value);
        }
      });
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
    logInBtn.addEventListener("click", (e) => {
      e.preventDefault();
      let users = [];
      users = JSON.parse(localStorage.getItem("users"));
      let logInResultSuccess = users.find(user => user.username === userName.value && user.password === userPassword.value);

      if (logInResultSuccess) {
        state = "logInSuccess"
        localStorage.setItem("state", state);
        currentUser = userName.value;
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
    headerDiv.innerHTML = `
      <p>You are logged in as: ${currentUser}</p>
      <button id="logOutBtn">Log Out</button>
      `
    logOutBtn.addEventListener("click", () => {

      state = "unknown"
      localStorage.setItem("state", state);
      printPage(state);
      printHeader(state);

    });
  };
};

printPage(state);
printHeader(state);
