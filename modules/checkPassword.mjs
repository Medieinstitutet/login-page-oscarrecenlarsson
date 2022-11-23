export default function checkPassword(password) {

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
    if ((password.length >= 6 && specialCharsCount >= 2) ||
        (password.length >= 8 && specialCharsCount >= 1) ||
        (password.length >= 12 && password.includes("-")) ||
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