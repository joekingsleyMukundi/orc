const bcrypt = require('bcrypt');
class Password{
    static toHash (password){
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);
        return hashedPassword
    }
    static compare( storedPassword, suppliedPassword){
        return bcrypt.compareSync(suppliedPassword, storedPassword);
    }
}

module.exports = Password;