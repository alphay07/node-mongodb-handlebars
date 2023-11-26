const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';

function findAll() {
  return MongoClient.connect(url, { useNewUrlParser: true })
    .then(client => {
      console.log('1');
      const db = client.db("mydb");
      console.log('2');
      const collection = db.collection('customers');
      console.log('3');
      const cursor = collection.find({}).limit(10);
      console.log('4');
      return new Promise((resolve, reject) => {
        cursor.forEach(doc => console.log(doc), () => {
          client.close();
          resolve();
        });
      });
    })
    .catch(err => {
      console.log(err);
    });
}

setTimeout(() => {
  findAll()
    .then(() => console.log('iter'))
    .catch(err => console.error(err));
}, 5000);
