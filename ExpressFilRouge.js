const connection = require('./conf');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000; 

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// Ensemble des données //
app.get('/superdev/all', (req, res) => {
    connection.query('SELECT * FROM SuperDev', (err, result) => {
        if (err) {
            res.status(500).send('Internal server error')
            console.log(err)
        } else {
            res.status(200).send(result)
        }
    })
})

// Quelques champs spécifiques  //
app.get('/names-and-birthday', (req, res) => {
    connection.query('SELECT name, birthday FROM SuperDev', (err, result) => {
    if (err) {
        res.status(500).send('Internal server error')
    } else {
        res.status(200).send(result)
      }
    })
})

// Trois Filtres //
app.get('/superdev/:name', (req, res) => {
    connection.query('SELECT * FROM SuperDev WHERE name = ? ', req.params.name, (err, result) => {
    if (err) {
        res.status(500).send('Internal server error')
    } else {
        res.status(200).send(result)
      }
    })
})

app.get('/insolentscale/:insolentScale', (req, res) => {
    connection.query('SELECT * FROM SuperDev WHERE insolenceScale > ? ' , req.params.insolentScale, (err, result) => {
    if (err) {
        res.status(500).send('Internal server error')
    } else {
        res.status(200).send(result)
      }
    })
})

app.get('/superyoungdev', (req, res) => {
    connection.query('SELECT * FROM SuperDev WHERE birthday > "1980-01-01"', (err, result) => {
    console.log(result)
    if (err) {
        res.status(500).send('Internal server error')
        console.log(err)
    } else {
        res.status(200).send(result)
      }
    })
})

// Récupération de données ordonnées (croissant, date de naissance la plus petite) // 

app.get('/superyoungdev/:order', (req, res) => {
    const order = req.params.order;
    if (order === 'asc') {
        connection.query('SELECT * FROM SuperDev WHERE birthday > "1980-01-01" ORDER BY birthday', (err, result) => {
        console.log(result)
        if (err) {
            res.status(500).send('Internal server error')
        console.log(err)
        } else {
            res.status(200).send(result)
        }
        })
    }
})


//Sauvegarde d'une nouvelle entité //
app.post('/superdev/newdev', (req, res) => {
    const newDev = {
        name: req.body.name,
        birthday: req.body.birthday,
        isAGreatDev: req.body.good,
        insolenceScale : req.body.insolence
    }

    const sqlRequest = 'INSERT INTO SuperDev SET ?'
    console.log(newDev)
    connection.query(sqlRequest, newDev, (err, results) => {
        if (err) {
            res.status(500).send(`Erreur lors de l'ajout du super Dev`)
        } else {
            res.sendStatus(200)
        }
    })
})

//Modification d'une nouvelle entité //
  app.put('/superdev/:id', (req, res) => {

    const idDev = req.params.id;
    const formData = req.body;
  
    connection.query('UPDATE SuperDev SET ? WHERE id = ?', [formData, idDev], err => {
  
      if (err) {
        console.log(err);
        res.status(500).send("Erreur lors de la modification d'un superDev");
      } else {
        res.sendStatus(200);
      }
    });
  });

  // Toggle du Boolean //
  app.put('/superdev/insolence/:id', (req, res) => {
    const idDev = req.params.id;  
    connection.query('UPDATE SuperDev SET isAGreatDev = NOT isAGreatDev WHERE id = ?', idDev, err => {
  
      if (err) {
        console.log(err);
        res.status(500).send("Erreur lors de la modification d'un superDev");
      } else {
        res.sendStatus(200);
      }
    });
  });

  //Suppression d'une nouvelle entité //
  app.delete('/superdev/delete/:id', (req, res) => {

    const idDev = req.params.id;
    connection.query('DELETE FROM SuperDev WHERE id = ?', idDev, err => {
      if (err) {
        res.status(500).send("Error deleting a dev");
      } else {
        res.sendStatus(200);
      }
    });
  });


    //Suppression de toutes les entités dont le boolean est faux //
  app.delete('/fakedev', (req, res) => {
    connection.query('DELETE FROM SuperDev WHERE isAGreatDev = 0', err => {
      if (err) {
        res.status(500).send("Error deleting a dev");
      } else {
        res.sendStatus(200);
      }
    });
  });




app.listen(port, (err => {
    if (err) {
        throw new Error ('Something bad happened...')
    }
} ))