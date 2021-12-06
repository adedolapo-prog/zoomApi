const config = require("./config")
const jwt = require("jsonwebtoken")
const express = require("express")
const axios = require("axios").default
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))

const port = 3000

//Use the ApiKey and APISecret from config.js
const payload = {
  iss: config.APIKey,
  exp: new Date().getTime() + 5000,
}
const token = jwt.sign(payload, config.APISecret)

const createUser = () => {
  const options = {
    method: "POST",
    url: "https://api.zoom.us/v2/users",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
    },
    data: {
      action: "custCreate",
      user_info: {
        email: "zealightlabs@gmail.com",
        type: 1,
        first_name: "Adetoye",
        last_name: "Bamise",
      },
    },
    json: true,
  }
  axios(options)
    .then(function (response) {
      console.log("body", response)
      return response
    })
    .catch(function (response) {
      //handle error
      console.log(response)
    })
}

const getUser = () => {
  return new Promise((resolve, reject) => {
    let options = {
      method: "GET",
      // A non-existing sample userId is used in the example below.
      url: "https://api.zoom.us/v2/users/zealightlabs@gmail.com",
      headers: {
        "User-Agent": "Zoom-api-Jwt-Request",
        "content-type": "application/json",
        authorization: `Bearer ${token}`, // Do not publish or share your token publicly.
      },
    }
  
    axios(options)
      .then(function (response) {
        // console.log("body", response)
        return resolve(response)
      })
      .catch(function (response) {
        //handle error
        // console.log(response)
        return reject(response)
      })
  })
}

app.post("/home", async (req, res) => {
  createUser()
})

app.get("/home", async (req, res) => {
  // getUser(response => {
  //   res.json({ tokenJwt: response })
  // })
  let rezzz = await getUser()
  console.log('res', rezzz.data)
})

const newMeeting = async () => {
  const options = {
    method: "POST",
    url: "https://api.zoom.us/v2/users/34Vgv2oLSO6BEsfkzkUx2w/meetings",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: {
      topic: "Demo Meeting 1",
      type: 2,
      start_time: "2021-11-20 12:00:00",
      password: "Hey123",
      agenda: "This is the meeting description",
      settings: {
        host_video: false,
        participant_video: false,
        join_before_host: false,
        mute_upon_entry: true,
        use_pmi: false,
        approval_type: 0,
      },
    },
    json: true,
  }
  axios(options, function (error, response, body) {
    if (error) throw new Error(error)
    console.log(body)
  })
}

app.post("/meeting", async (req, res) => {
  newMeeting()
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
