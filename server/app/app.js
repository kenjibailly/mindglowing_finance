const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.static('public'));
app.use(express.json());


app.listen(4242, () => console.log('Running on port 4242'));