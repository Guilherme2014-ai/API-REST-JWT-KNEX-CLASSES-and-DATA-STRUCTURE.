const User = require("../models/User.js");
const PasswordToken = require('../models/PasswordToken')

class HomeController{

    async index(req, res){
        try{

            const users = await User.findAll();
            res.json( users );

        } catch(err){
            res.send( err );
            console.error(err);
        }
    };
    async create(req, res){
        try{
            

            const { name,email,password } = req.body;

            if(name == undefined || name == "" || name.length == 0 || name == " " || name == undefined  || name == null){
                res.status(400)
                res.json({ Error : "Name is Null or Undefined" })
                return
            }
            if(email == undefined || email == "" || email.length == 0 || email == " " || email == undefined  || email == null){
                res.status(400)
                res.json({ Error : "Email is Null or Undefined" })
                return
            }
            if(password == undefined || password == "" || password.length == 0 || password == " " || password == undefined  || password == null){
                res.status(400)
                res.json({ Error : "Password is Null or Undefined" })
                return
            }

            const isDuplicated = await User.duplicated(email)

            if(isDuplicated == true){
                res.status(406)
                res.json({ msg: "This email already exists !" })
                return
            }

            const user = { name,email,password }

            await User.new(user)
            res.json({ user: { name,email } })
            

        } catch(err){ console.error(err) }
    };
    async searchByid(req, res){
        try{

            const { id } = req.params

            if(isNaN(id)){
                res.status(400)
                res.send("Id isn't a Number !")
                return
            }

            const user = await User.findById(id)

            if(user.length == 0){
                res.status(404)
                res.send("This User doesnt exists !")
                return
            }

            res.json( user )

        } catch(err){
            res.send(err)
            console.error(err)
        }
    };
    async searchByemail(req, res){
        try{

            const { email } = req.params;

            if(email == undefined || email.length == 0 || email == " "){
                res.status(400)
                res.sendStatus(400)
                return
            }

            const emailSearch = await User.findByEmail(email)

            if(emailSearch.length == 0 || emailSearch == undefined){
                res.status(404)
                res.sendStatus(404)
                return
            }

            res.json( emailSearch )

        } catch(err){ console.error(err) }
    };
    async editUser(req, res){
        try{

            const { id } = req.params;
            const { name,email,role } = req.body;

            let userUpdated = await User.findById(id)

            if(userUpdated == undefined || userUpdated.length == 0){
                res.status(404);
                res.sendStatus(404);
                return;
            }

            await User.editUser(id,name,email,role)
            userUpdated = await User.findById(id)
            res.json( userUpdated )

        } catch(err){ 
            res.send(err)
            console.error(err)
        }
    };
    async deleteUser(req,res){
        try{

            const { id } = req.params;

            if(isNaN(id) || id == undefined || id == ""){
                res.status(400);
                res.sendStatus(400);
                return;
            };

            const search = await User.findById(id)

            if(search == undefined || search.length == 0){
                res.status(404)
                res.sendStatus(404)
                return
            }

            await User.delete(id);

            const allUsersAtualized = await User.findAll();

            res.json(allUsersAtualized);

        } catch(err){
            console.error(err);
            res.send(err);
        }
    };
    async recoverPassword(req, res){
        try{

            const { email } = req.params;

            if(email == undefined || email.length == 0 || email == " "){
                res.status(400);
                res.sendStatus(400);
                return;
            };

            const token = await PasswordToken.create(email);

            if(token == 404){
                res.status(404);
                res.sendStatus(404);
                return;
            };

            res.send( `${token}` );

        } catch(err){
            console.error(err);
            res.send(err);
        };
    };
    async changePassword(req, res){
        try{

            const { token,password } = req.body;

            if(token == undefined || token.length == 0){
                res.status(400)
                res.sendStatus(400)
                return
            }
            if(password == undefined || password.length == 0){
                res.status(400)
                res.sendStatus(400)
                return
            }

            const isTokenValid = await PasswordToken.valid(token);

            if(isTokenValid == 404){
                res.status(404)
                res.sendStatus(404)
                return
            }

            if(!isTokenValid){
                res.status(406)
                res.send('The Token Isnt Valid !')
                return
            }

            const changer = User.changePassword(password,isTokenValid["user_id"])

            if(changer != false){
                const inativer = await PasswordToken.inative(token)
                if(inativer == false){
                    res.status(501)
                    res.sendStatus(501)
                    return
                }
                res.send("Password Changed !")
            }else{
                res.status(501)
                res.sendStatus(501)
            }

        } catch(err){ console.error(err) }
    };
    async login(req, res){
        try{

            const { email,password } = req.body;

            const result = await User.login(email,password)

            switch (result) {
                case false:
                    res.status(501)
                    res.sendStatus(501)
                break;

                case 404:
                    res.status(404)
                    res.sendStatus(404)                   
                break;

                case 401:
                    res.status(401)
                    res.sendStatus(401)
                break

                default:
                    res.json({ token: result })
                break;
            }

        } catch(err){console.error(err)}
    };
    // Ja esta retornando o token
    // o payload de um token seria como os dados de uma session.

};

module.exports = new HomeController();