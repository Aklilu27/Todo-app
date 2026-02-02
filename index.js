const express = require('express');

const PORT=8000;

// Create an instance of an Express application
const app = express();

//view engine 
app.set('view engine', 'ejs');


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});