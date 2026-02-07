import React from 'react';
import ReactDOM from 'react-dom';
//import {createServer, Model, Server} from 'miragejs';
import {App} from './App';

// createServer({
  
//   models: {
//     transaction: Model,
//     user: Model
//   },

//   seeds(server) {
//     server.db.loadData({
//       transactions: [
//         {
//           id: 1,
//           title: 'Website development',
//           type: 'deposit',
//           category: 'Job',
//           ammount: 1500,
//           createdAt: new Date('2021-11-09 09:00:00')
//         },
//         {
//           id: 2,
//           title: 'Appartment Rent',
//           type: 'withdraw',
//           category: 'Home',
//           ammount: 600,
//           createdAt: new Date('2021-11-18 09:00:00')
//         }
//       ],

//       users: [
//         {
//           id_user: 1,
//           name: 'Pedro',
//           email: 'pedro@email.com',
//           telephone: '(51) 92133-1293',
//           birth_date: new Date('2000-11-09'),
//           birth_city: 'Porto Alegre',
//           companies: 'Empresa1, Empresa2, Empresa3'
//         },

//         {
//           id_user: 2,
//           name: 'Josh',
//           email: 'josh@email.com',
//           telephone: '(11) 8364-2341',
//           birth_date: new Date('2002-03-07'),
//           birth_city: 'São Paulo',
//           companies: 'Empresa1'
//         }
//       ]
//     })
//   },

//   routes(){
//     this.namespace = 'api'

    
//     this.get('/users', () => {
//       return this.schema.all('user')
//     })
    
//     this.post('/users', (schema, request) => {
//       const data = JSON.parse(request.requestBody)
      
//       return schema.create('user', data)
//     })
    
//     this.get('/transactions', () => {
//       return this.schema.all('transaction')
//     })

//     this.post('/transactions', (schema, request) => {
//       const data = JSON.parse(request.requestBody)

//       return schema.create('transaction', data)
//     })
//   }
// })

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
