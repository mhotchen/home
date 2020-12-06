let express = require('express')
let app = express()
app.use(express.static('public'))
app.listen(3000, () => {
    console.log("App listening on port 3000")
})
app.get('*', (req, res) => {
    res.sendFile(__dirname + "/public/index.html")
})