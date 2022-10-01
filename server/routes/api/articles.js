const axios = require("axios");

const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const urlEncodedParser = bodyParser.urlencoded({
  extended: true
});

const passport = require("passport");

async function getUsername(id) {
  return axios({
    method: "GET",
    url: "https://blogg-8a72.restdb.io/rest/articles/" + id,
    headers: {
      "cache-control": "no-cache",
      "x-apikey": ""
    }
  }).then(response => response.data.username);
}

//affiche tous les articles
router.get("/", function(req, res) {
  axios({
    method: "GET",
    url: "https://blogg-8a72.restdb.io/rest/articles",
    headers: {
      "cache-control": "no-cache",
      "x-apikey": ""
    }
  })
    .then(response => {
      res.json(response.data);
    })
    .catch(error => {
      res.status(error.response.status).json({
        error: `${error}`
      });
    });
});

// affiche un article
router.get("/find/:id", function(req, res) {
  axios({
    method: "GET",
    url: "https://blogg-8a72.restdb.io/rest/articles/" + req.params.id,
    headers: {
      "cache-control": "no-cache",
      "x-apikey": ""
    }
  })
    .then(response => {
      res.json(response.data);
    })
    .catch(error => {
      res.status(error.response.status).json({
        error: `${error}`
      });
    });
});

//ajoute un article
router.post(
  "/add",
  urlEncodedParser,
  passport.authenticate("jwt", {
    session: false
  }),
  function(req, res) {
    axios({
      method: "POST",
      url: "https://blogg-8a72.restdb.io/rest/articles",
      headers: {
        "cache-control": "no-cache",
        "x-apikey": "",
        "content-type": "application/json"
      },
      data: {
        title: req.body.title,
        content: req.body.content,
        username: req.user.username
      },
      responseType: "json"
    })
      .then(response => {
        res.json({
          response: "Votre article a bien été ajouté."
        });
      })
      .catch(error => {
        res.status(error.response.status).json({
          error: `${error}`
        });
      });
  }
);

//update article
router.post(
  "/update",
  urlEncodedParser,
  passport.authenticate("jwt", {
    session: false
  }),
  async function(req, res) {
    let username = await getUsername(req.body.id);

    if (username == req.user.username) {
      axios({
        method: "PUT",
        url: "https://blogg-8a72.restdb.io/rest/articles/" + req.body.id,
        headers: {
          "cache-control": "no-cache",
          "x-apikey": "",
          "content-type": "application/json"
        },
        data: {
          title: req.body.title,
          content: req.body.content,
          username: username
        },
        responseType: "json"
      })
        .then(response => {
          res.json({
            response: "Votre article a bien été modifié."
          });
        })
        .catch(error => {
          res.status(error.response.status).json({
            error: `${error}`
          });
        });
    } else {
      res.status(401).json({
        error: `Seul l'utilisateur ayant créé l'article peut le modifier.`
      });
    }
  }
);

//delete article
router.get(
  "/delete/:id",
  passport.authenticate("jwt", {
    session: false
  }),
  async function(req, res) {
    let username = await getUsername(req.params.id);

    if (username == req.user.username) {
      axios({
        method: "DELETE",
        url: "https://blogg-8a72.restdb.io/rest/articles/" + req.params.id,
        headers: {
          "cache-control": "no-cache",
          "x-apikey": "",
          "content-type": "application/json"
        }
      })
        .then(response => {
          res.json({
            response: "Votre article a bien été supprimé."
          });
        })
        .catch(error => {
          res.status(error.response.status).json({
            error: `${error}`
          });
        });
    } else {
      res.status(401).json({
        error: `Seul l'utilisateur ayant créé l'article peut le supprimer.`
      });
    }
  }
);

module.exports = router;
