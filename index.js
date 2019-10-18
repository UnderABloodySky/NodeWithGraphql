const express = require('express');
const express_graphql = require('express-graphql');
const {buildSchema} = require('graphql');  
let users = [{id:0, name: "Pepe", email:"asd@gmail.com"}, {id:1, name: "Juan", email:"asd@gmail.com"}, {id:2, name: "Pepe", email:"asd@gmail.com"}];
let myId = 3;
const app = express();

const schema = buildSchema(`
    type Query{
        hola:String,
        users:[User],
        user(id:Int):User
    },

    type Mutation{
        createUser(name: String, email: String):User,
        updateUser(id:ID!, name: String, email: String):User,
        deleteUser(id: ID!):User,
    },

    type User{
        id:ID!,
        name:String!,
        email:String!
    },

    type UserInput{
        name: String!,
        email: String!
    }
    `);

const resolver = {
    hola: ()=>'Hola',
    users: ()=> users,
    user(id){
        return users.find(user => user.id == id.id);  
    },
    createUser(input){
            const newUser = {
                id:myId, 
                name:input.name, 
                email:input.email
            };    
            users.push(newUser);
            myId += 1;    
            return newUser;    
    },
    deleteUser(input){
        users.filter(user => user.id == input.id);
        return 'So bye bye, miss American Pie'
    },
    updateUser(input){
        const lastUser = this.user({id:input.id});
        const newOldUser = {
            id:lastUser.id, 
            name:input.name, 
            email:input.email
        };
        users.filter(user => user.id == lastUser.id);
        users.push(newOldUser);
        return newOldUser;
    }
};

app.use('/graphql', express_graphql({
    schema: schema, 
    rootValue: resolver,
    graphiql: true
}));

app.listen(4000,()=> console.log('asd'));
