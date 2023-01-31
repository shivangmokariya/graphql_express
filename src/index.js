const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const schema=require('./schema/schema')
const connection=require('./DB/conn')



const createTable = `CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL
)`;

connection.query(createTable, function (err, result) {
  if (err){
    console.log("Table already created.");
  }else{
  console.log("Table created");
  };
});

// Define the root value for the API

const rootValue = {
  users: () => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM users', (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },
  addUser: ({ email, name }) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO users (email, name) VALUES (?, ?)',
        [email, name],
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve({ id: results.insertId, email, name });
          }
        }
      );
    });
  },
  updateUser:({id,email,name})=>{
    return new Promise ((resolve,reject)=>{
      connection.query('UPDATE users SET email = ?, name = ? WHERE id = ?',
      [email, name, id],
      (error,results)=>{
        if(error){
          reject(error);
        }
        else{
          resolve({id:results.insertId,email,name});
        }
      })
    })
  },


  delete:({id})=>{
    return new Promise ((resolve,reject)=>{
      connection.query('DELETE FROM users WHERE id=?',
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
