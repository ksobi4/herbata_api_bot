var bodyParser = require('body-parser')
require('dotenv').config()
const express = require('express')

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: true }))

const TOKEN = process.env.TOKEN1

app.get('/', (req, res) => {
  res.send('Hello World!')
})

var isCorrect = false;
var correct_ans = "";
var badAns = []
var usedMachines = []


app.post('/do_things', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*")
    let jsonRaw = jsonConventer(req.body)
    let json = {
      token: jsonRaw["token"],
      id: jsonRaw["id"]
    }
    if(json.token != TOKEN) {
      res.sendStatus(401)
      return
    }
    console.log('/do_things ' + JSON.stringify(json))
    //---------------------
    var machineId = json.id

    if(usedMachines.includes(machineId)) {
      res.json({"answer":"false", "do": "wait"})
      return
    }

    if(isCorrect) {
      res.json({"answer": "true", "correct": correct_ans});
      return
    }

    if(machineId > 3) {
      res.json({"answer":"false", "do": "wait"})
    } else {
      res.json({"answer":"false", "do": "try", "try_target": machineId.toString()})
    }

})

app.post('/set_correct', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*")
    let jsonRaw = jsonConventer(req.body)
    let json = {
      token: jsonRaw["token"],
      id: jsonRaw["id"],
      correct: jsonRaw["correct"]
    }
    if(json.token != TOKEN) {
      res.sendStatus(401)
      return
    }
    console.log('/set_correct ' + JSON.stringify(json))
    //---------------------
    isCorrect = true;
    correct_ans = json.correct

    usedMachines.push(json.id)
    res.json({"status":"OK"})
    print1()
})

app.post('/set_bad', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*")
    let jsonRaw = jsonConventer(req.body)
    let json = {
      token: jsonRaw["token"],
      id: jsonRaw["id"],
      bad: jsonRaw["bad"]
    }

    if(json.token != TOKEN) {
      res.sendStatus(401)
      return
    }
    console.log('/set_bad ' + JSON.stringify(json))
    //---------------------
    
    usedMachines.push(json.id)
    badAns.push(json.bad)
    res.json({"status":"OK"})
    print1()
})


function print1() {
  console.log("---------")
  console.log("bad [" + badAns+ "]")
  console.log("---------")
}

function jsonConventer(raw) {
    if(Object.keys(raw)[0] == "token") {
      return raw
    } else {
      return JSON.parse(Object.keys(raw)[0])
    }
}


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})