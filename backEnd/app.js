import express from "express";
import bodyParser from 'body-parser'
// Import routes
import indexRoutes from "./routes/index.routes.js";
import faker from "faker";
import db from "./db.js";

const app = express();
const port = 3333;
const jsonParser = bodyParser.json();
// routes

app.get('/',(req,res,next) => {
  res.send('Hello world!')
})

app.get("/fake-data", jsonParser, async (req, res, next) => {
  console.log('start generating data')
  for (let i = 0; i < 100; i++) {
    let staffs = [];
    for (let j = 0; j < faker.datatype.number({ min: 5, max: 20 }); j++) {
      const staff = {
        name: faker.name.findName(),
        gender: faker.name.gender(),
        age: faker.datatype.number({ min: 15, max: 40 }),
        jobTitle: faker.name.jobTitle(),
      };
      staffs.push(staff);
    }
    const restaurant = {
      id: faker.datatype.uuid(),
      address: {
        streetAddress: faker.address.streetAddress(),
        cityName: faker.address.cityName(),
      },
      email: faker.internet.email(),
      phoneNumber: faker.phone.phoneNumber(),
      staffs,
      description: faker.commerce.productDescription(),
    };
    console.log(restaurant);
    db.data.restaurants.push(restaurant);
  }
  await db.write();
  res.send("Finish fake data");
});

app.use('/restaurants',indexRoutes);

app.listen(port, function () {
  console.log(`Server listening ${port}`);
});
