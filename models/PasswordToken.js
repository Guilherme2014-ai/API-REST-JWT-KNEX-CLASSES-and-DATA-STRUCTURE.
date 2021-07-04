const knex = require('../database/connection');
const User = require('./User');

class PasswordToken {

    
    async create(email){
        try{

            const user = await User.findByEmail(email);

            if(user == undefined || user.length == 0){
                return 404
            }

            const token = Date.now();
            const data = { user_id: user["id"], token, used: 0 };

            await knex.insert(data).table("passwordtoken");

            return token;
        
        } catch(err){ console.error(err) }
    };
    async valid(token){
        try{

            const searchToken = await knex.select('*').where('token',token).table("passwordtoken");

            if(searchToken == undefined || searchToken.length == 0){ return 404 };
            if(searchToken[0]["used"] == 0){  return {
                status: true,
                user_id: searchToken[0]["user_id"]
            } }else{ return false };

        } catch(err){ console.error(err) }
    };
    async inative(token){
        try{

            await knex.update({ used: 1 }).where('token',token).table("passwordtoken");

        } catch(err){
            console.error(err);
            return false;
        };
    };

};

module.exports = new PasswordToken();