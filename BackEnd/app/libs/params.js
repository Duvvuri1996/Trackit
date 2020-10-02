let emailValidation = (email)=>{
    let emailMatch = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    if(email.match(emailMatch)) {
        return email 
    } else {
        return false
    }
}

let passwordValidation = (password) => {
    let passwordMatch = /^[A-Za-z0-9]\w{7,}$/
    if(password.match(passwordMatch)) {
        return password
    } else {
        return false
    }
}

module.exports = {
    Email : emailValidation,
    password : passwordValidation
}