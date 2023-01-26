const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mysql = require('mysql2');

// Create a connection to the MySQL database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'quizgrad'
});


const schema = buildSchema(`
  type Query {
    users: [User]
  
    
  }
  type User {
    id: Int
    email:String
    password:String
  }
  type Mutation {
    addUser(email: String!, password: String!): User
    updateUser(id: ID!, email: String, password: String): User
    delete(id: Int!): Boolean
  }
`);

// Define the root value for the API
const rootValue = {
  users: () => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM signup', (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },
  addUser: ({ email, password }) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO signup (email, password) VALUES (?, ?)',
        [email, password],
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve({ id: results.insertId, email, password });
          }
        }
      );
    });
  },
  updateUser:({id,email,password})=>{
    return new Promise ((resolve,reject)=>{
      connection.query('UPDATE signup SET email = ?, password = ? WHERE id = ?',
      [email, password, id],
      (error,results)=>{
        if(error){
          reject(error);
        }
        else{
          resolve({id:results.insertId,email,password});
        }
      })
    })
  },


  delete:({id})=>{
    return new Promise ((resolve,reject)=>{
      connection.query('DELETE FROM signup WHERE id=?',
      [id],
      (error,results)=>{
        if(error){
          console.log(error,"==================");
          reject(error);
        }else{
          if(results.affectedRows){
            resolve(true);
          }else{
            reject("user not found")
          }
        }
      })
    })
  }

};

const app = express();
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue,
  graphiql: true
}));

app.listen(4000, () => console.log('Server running on port 4000'));




// to run this code 
// # mutation{
//   #  addUser(email:"tushar.paradva@gmail.com",password:"tushartrrrrr"){
//   #   email
//   # }
//   # } 
  
//   # mutation{
//   # 	delete(id:7)
//   # }
  
//   # mutation{
//   #   updateUser(id:7,email:"shivu@gmail.com",password:"shivang"){
//   #     email
//   #   }
//   # }
  
//   # {
//   #   users{
//   #     email
//   #     id
//   #     password
//   #   }
//   # }