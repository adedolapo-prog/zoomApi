let request = require("request")
const config = require("./config")
const jwt = require("jsonwebtoken")
const express = require("express")
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
var email, userid, resp
const port = 3000

//Use the ApiKey and APISecret from config.js
const payload = {
  iss: config.APIKey,
  exp: new Date().getTime() + 5000,
}
const token = jwt.sign(payload, config.APISecret)

const getUser = callback => {
  let options = {
    method: "GET",
    // A non-existing sample userId is used in the example below.
    url: "https://api.zoom.us/v2/users/me",
    headers: {
      authorization: `Bearer ${token}`, // Do not publish or share your token publicly.
    },
  }

  request(options, function (error, response, body) {
    if (error) throw new Error(error)

    // console.log(response)
    return callback(body)
  })
}

app.get("/home", async (req, res) => {
  getUser(response => {
    res.json({ tokenJwt: response })
  })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
