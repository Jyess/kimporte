const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

//redirige les chemins /api/utilisateurs vers le fichier utilisateurs.js (il s'en occupe)
const utilisateurs = require("./routes/api/utilisateurs");
app.use("/api/utilisateurs", utilisateurs);

//redirige les chemins /api/articles vers le fichier articles.js (il s'en occupe)
const articles = require("./routes/api/articles");
app.use("/api/articles", articles);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server running (port ${port})`);
});