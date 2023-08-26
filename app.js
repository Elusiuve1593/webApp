const express = require("express")
const fs = require("fs")

const app = express()
const jsonParser = express.json()

app.use(express.static(__dirname + "/public"))

const filePath = "users.json"

app.get("/api/users", (__, res) => {
    const content = fs.readFileSync(filePath, "utf8")
    const users = JSON.parse(content)
    res.send(users)
})

app.get("/api/users/:id", (req, res) => {
    const id = req.params.id
    const content = fs.readFileSync(filePath, "utf8")
    const users = JSON.parse(content)

    let user = users.find(el => el.id.toString() === id) || null

    if (user) {
        res.send(user)
    }

    res.status(404).send()
}
)

app.post("/api/users", jsonParser, (req, res) => {
    if (!req.body) return res.sendStatus(400)

    const userName = req.body.name
    const userAge = req.body.age

    const user = { name: userName, age: userAge }

    let data = fs.readFileSync(filePath, "utf8")
    const users = JSON.parse(data)

    const id = Math.max.apply(Math, users.map((el) => el.id))
    user.id = id + 1

    users.push(user)
    data = JSON.stringify(users)

    fs.writeFileSync("users.json", data)
    res.send(user)
})

app.delete("/api/users/:id", (req, res) => {
    const id = req.params.id
    let data = fs.readFileSync(filePath, "utf8")
    const users = JSON.parse(data)

    const index = users.findIndex(user => user.id.toString() === id);

    if (index > -1) {
        const user = users.splice(index, 1)[0]
        data = JSON.stringify(users)
        fs.writeFileSync("users.json", data)
        res.send(user)
    }

    res.status(404).send()
})

app.put("/api/users", jsonParser, (req, res) => {
    if (!req.body) return res.sendStatus(400)

    const userId = req.body.id
    const userName = req.body.name
    const userAge = req.body.age

    let data = fs.readFileSync(filePath, "utf8")
    const users = JSON.parse(data)

    let user = users.find(el => el.id.toString() === userId)

    if (user) {
        user.age = userAge
        user.name = userName
        data = JSON.stringify(users)
        fs.writeFileSync("users.json", data)
        res.send(user)
    }

    res.status(404).send(user)
})

app.listen(3000, () => console.log("Server is ready to connection..."))