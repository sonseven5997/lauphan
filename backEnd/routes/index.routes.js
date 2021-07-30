import express from "express";
import db from "../db.js";
import bodyParser from "body-parser";
import faker from "faker";
import validate from "../validate.js";

const router = express.Router();
// create application/json parser
const jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: true })

router.get("/", async (req, res, next) => {
  await db.read();
  res.send(db.data);
});

router.post("/", jsonParser, async (req, res, next) => {
  if (validate(req.body)) {
    db.data.restaurants.push({ ...req.body, id: faker.datatype.uuid() });
    await db.write();
    res.statusCode = 201;
    res.send(db.data);
  } else {
    res.statusCode = 400;
    res.send("Syntax error");
  }
});
router.get("/max-page", async (req,res,next) => {
  await db.read()
  let perPage = 5
  let maxPage = Math.ceil(db.data.restaurants.length / perPage);
  res.send(maxPage.toString())
})

router.get("/page/:page", async (req, res, next) => {
  console.log(req.params.page);
  await db.read();
  let perPage = 5;
  let page = req.params.page || 1;
  let maxPage = Math.ceil(db.data.restaurants.length / perPage);
  if (req.params.page >= 1 && req.params.page <= maxPage) {
    res.send(db.data.restaurants.slice((page - 1) * 5, (page - 1) * 5 + 5));
  } else {
    res.statusCode = 400;
    res.send("Invalid page");
  }
});

router.get("/id/:id", async (req, res, next) => {
  await db.read();
  if (db.data.restaurants.find((e) => e.id === req.params.id) !== undefined) {
    res.send(db.data.restaurants.find((e) => e.id === req.params.id));
  } else {
    res.statusCode = 400;
    res.send("Restaurant not found!");
  }
});

router.put("/id/:id",jsonParser ,async (req, res, next) => {
  await db.read();
  let tempData
  if (!validate(req.body)) {
    res.statusCode = 400;
    res.send("Syntax error");
  } else {
    db.data.restaurants.forEach((element, index) => {
      if (element.id === req.params.id) {
        db.data.restaurants[index] = {...req.body, id:req.params.id};
        tempData = db.data.restaurants[index]
      }
    });
    await db.write();
    res.send(tempData);
  }
});

router.delete('/id/:id', async (req,res,next) => {
  await db.read()
  if (db.data.restaurants.find((e) => e.id === req.params.id) !== undefined) {
    let data = db.data.restaurants.find((e) => e.id === req.params.id)
    db.data.restaurants.splice(db.data.restaurants.indexOf(data),1)
    await db.write()
    res.send('Delete success')
  } else{
    res.send('Syntax error')
  }
})

export default router;
