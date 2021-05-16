//Bring in express
const express = require("express")

// Create an instance of express and define a port
const app = express();
const PORT = process.env.PORT || 3000;

//allows us to read json from a post
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
// request for static files. look in public folder. Public folder becomes root for all static requests.
app.use(express.static('public'));

require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);


app.listen(PORT, () => console.log(`Listening on PORT: http://localhost:${PORT}`));
