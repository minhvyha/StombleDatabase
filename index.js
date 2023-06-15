const express = require('express');

const app = express()
app.use(express.json());


app.get('/', (req, res) =>{
  res.json("running")
})

app.listen(11050, () => console.log('API running on port 11050'))