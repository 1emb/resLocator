const pg = require("pg");
const express = require("express");
const app = express();

const port = 3000;
const hostname = "localhost";

const env = require("../env.json");
const Pool = pg.Pool;
const pool = new Pool(env);
pool.connect().then(function () {
    console.log(`Connected to database ${env.database}`);
});


app.use(express.static("templates"));
app.use(express.json());

app.post("/add", function(req,res){
  let body = req.body;
  console.log(body);
  let name = body.name;
  let address = body.address;
  let style = body.style;
  let website = body.website;

  name = name.trim();
  address = address.trim();
  if(website === "" || website === 'undefined'){
    website = "Website not available";
  }
  website = website.trim();

  pool.query( //Code borrowed from in-class exercise
      `INSERT INTO restaurant(name, address, website, style)
      VALUES($1, $2, $3, $4)
      RETURNING *`,
      [`${name}`, `${address}`, `${website}`, `${style}`]
  ).then(function (response) {
      console.log("Inserted:");
      console.log(response.rows);
      return res.status(200).send();
  })
  .catch(function (error) {
      console.log(error);
  });
});

//GET request to /search

app.get("/search", function(req,res){

  let style = req.query.style;
  console.log(style);
  if(style === ""){
    pool.query(`SELECT * FROM restaurant`)
    .then(function(response){
      res.json(response.rows);
    })
    .catch(function (error) {
        console.log(error);
    });
  }
  else{
    pool.query(`SELECT * FROM restaurant WHERE style = '${style}'`)
    .then(function(response){
      res.json(response.rows);
    })
    .catch(function (error) {
        console.log(error);
    });
  }
});

app.listen(port, hostname, () => {
    console.log(`Listening at: http://${hostname}:${port}`);
});
