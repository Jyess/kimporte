const axios = require("axios");

const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const urlEncodedParser = bodyParser.urlencoded({
  extended: true
});

const jwt = require("jsonwebtoken");
const passport = require("passport");
const passportJWT = require("passport-jwt");

// const bcrypt = require("bcrypt"); //pour encrypter passwords
const bcrypt = require("bcryptjs"); //pour windows !!!
const salt = bcrypt.genSaltSync(10);

//affiche un utilisateur
router.get("/find/:id", function(req, res) {
  axios({
    method: "GET",
    url: "https://blogg-8a72.restdb.io/rest/utilisateurs/" + req.params.id,
    headers: {
      "cache-control": "no-cache",
      "x-apikey": ""
    }
  })
    .then(response => {
      res.send(response.data);
    })
    .catch(error => {
      res.status(error.response.status).json({
        error: `${error}`
      });
    });
});

function hashPassword(plainPassword) {
  return bcrypt.hashSync(plainPassword, salt);
}

function isValidPassord(plainPassword, hashPassword) {
  return bcrypt.compareSync(plainPassword, hashPassword);
}

//ajoute un utilisateur
router.post("/add", urlEncodedParser, function(req, res) {
  axios({
    method: "POST",
    url: "https://blogg-8a72.restdb.io/rest/utilisateurs",
    headers: {
      "cache-control": "no-cache",
      "x-apikey": ""
    },
    data: {
      username: req.body.username,
      password: hashPassword(req.body.password)
    },
    responseType: "json"
  })
    .then(response => {
      res.json({
        response: "Votre compte a bien été créé."
      });
    })
    .catch(error => {
      res.status(error.response.status).json({
        error: `${error}`
      });
    });
});

const secret = "";
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

// Options pour la stratégie d'authentification JWT
const jwtOptions = {
  // fromAuthHeaderAsBearerToken() est l'extracteur
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secret
};

// Stratégie d'authentification JWT
const jwtStrategy = new JwtStrategy(jwtOptions, function(payload, next) {
  axios({
    method: "GET",
    url: "https://blogg-8a72.restdb.io/rest/utilisateurs",
    headers: {
      "cache-control": "no-cache",
      "x-apikey": ""
    }
  })
    .then(resultat => {
      const users = resultat.data;

      // La payload correspond à ce qui est extrait du JWT
      const user = users.find(user => user.username === payload.user);

      if (user) {
        next(null, user);
      } else {
        next(null, false);
      }
    })
    .catch(error => {
      console.error(error);
    });
});

// On utilise la stratégie d'authentification JWT
passport.use(jwtStrategy);

router.get("/public", (req, res) => {
  res.send("Public");
});

/* Pour se connecter sur cette page, il faut utiliser "Authorization" dans les Headers avec comme valeur "Bearer JSONWebToken"
Dès que l'on va sur /private, on utilise la stratégie d'authentification JWT */
router.get(
  "/private",
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    res.send("Hello " + req.user.username);
  }
);

// Création du JSONWebToken si le login et mdp sont bon
router.post("/login", urlEncodedParser, (req, res) => {
  // On récupère le username et le mdp des paramètres
  const username = req.body.username;
  const password = req.body.password;

  // Si le username ou le mot de passe sont vides, on affiche une erreur en JSON
  if (!username || !password) {
    res.status(401).json({
      error: "Le nom d'utilisateur ou le mot de passe est manquant."
    });
    return;
  }

  axios({
    method: "GET",
    url: "https://blogg-8a72.restdb.io/rest/utilisateurs",
    headers: {
      "cache-control": "no-cache",
      "x-apikey": ""
    }
  })
    .then(resultat => {
      const users = resultat.data;

      // On cherche si le username récupéré correspond à un username dans le tableau
      const user = users.find(user => user.username === username);

      /* Si la variable user n'existe pas ou que le mot de passe en paramètre 
           ne correspond pas au mot de passe dans le tableau, on affiche une erreur en JSON */
      if (!user || !isValidPassord(password, user.password)) {
        res.status(401).json({
          error: "Le nom d'utilisateur et le mot de passe ne correspondent pas."
        });
        return;
      }

      // On créer un JSONWebToken en y mettant le username de l'utilisateur
      const userJwt = jwt.sign(
        {
          user: user.username
        },
        secret
      );

      // On affiche le JSONWebToken au format JSON
      res.json({
        jwt: userJwt
        // response: "Vous êtes bien connecté. Bonjour " + user.username + " !"
      });
    })
    .catch(error => {
      res.status(error.response.status).json({
        error: `${error}`
      });
    });
});

module.exports = router;
