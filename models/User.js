const jwt = require('jsonwebtoken');
const knex = require("../database/connection");
const bcrypt = require('bcrypt');
const secret = require('../secret.json');


class User {

    async duplicated(email){
        try{

            const duplicate = await knex.select("*").table("users").where('email', email);
            if(duplicate.length > 0){ return true };
            return false;

        } catch(err){ console.error(err) }
    };
    async new(user){

        try{

            const hash = await bcrypt.hash(user["password"],secret.saltBcrypt);

            user["role"] = 0;
            user["password"] = hash;
            await knex.insert(user).table("users");

        } catch(err){ console.error(err) }

    };
    async findAll(){
        try{

            return await knex.select([ 'name','email' ]).table("users")

        } catch(err){ console.error(err) }
    };
    async findById(id){
        try{

            return await knex.select([ 'name','email' ]).where('id',id).table('users')

        } catch(err){
            res.send(err)
            console.error(err)
        }
    };
    async findByEmail(email){
        try{

            const search = await knex.select([ 'name','email','id','password' ]).where('email',email).table("users");

            return search[0]

        } catch(err){ console.error(err) }
    };
    async editUser(id,name,email,role){
        try{

            const dataToSave = {};

            if(name != undefined && name.length > 0){
                dataToSave["name"] = name;
            };
            if(email != undefined && email.length > 0){
                dataToSave["email"] = email;
            };
            if(role != undefined && role.length > 0){
                dataToSave["role"] = role;
            };

            await knex.update(dataToSave).where('id',id).table("users")

        } catch(err){
            res.send(err)
            console.error(err)
        }
    };
    async delete(id){
        try{

            await knex
            .delete()
            .where({ id })
            .table("users");

        } catch(err){console.error(err)};
    };
    async changePassword(newPass,id){
        try{

            const hash = await bcrypt.hash(newPass,secret.saltBcrypt);
            await knex.update({ password:hash }).where('id',id).table("users")

        } catch(err){
            console.error(err)
            return false
        }
    };
    async login(email,password){
        try{

            const searchEmail = await knex.select("*").where('email',email).table("users")

            if(searchEmail.length == 0){ return 404 }

            const compare = await bcrypt.compare(password,searchEmail[0]["password"])

            if(compare == false){ return 401 }

            return await jwt.sign({ email,role: searchEmail[0]["role"] }, secret.jwtPass)

        } catch(err){
            console.error(err)
            return false
        }
    };

};

module.exports = new User();
