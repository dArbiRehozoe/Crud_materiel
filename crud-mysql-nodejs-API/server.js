const express = require('express');
const mysql = require('mysql');
var cors = require('cors');



const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
});

connection.connect((err) => {
  if (err) {
    console.error('Erreur de connexion :', err.stack);
    return;
  }

  connection.query('CREATE DATABASE IF NOT EXISTS projetnode', (err, results) => {
    if (err) {
      console.error('Erreur lors de la création de la base de données :', err.stack);
      connection.end(); // Ferme la connexion en cas d'erreur
      return;
    }

    console.log('Base de données projetnode créée ou déjà existante.');

    // Connecte-toi à la base de données projetnode
    connection.changeUser({ database: 'projetnode' }, (err) => {
      if (err) {
        console.error('Erreur lors de la connexion à la base de données :', err.stack);
        connection.end(); // Ferme la connexion en cas d'erreur
        return;
      }
      console.log('Connecté à la base de données projetnode.');
      
      // Continue avec d'autres opérations sur la base de données si nécessaire
    });
  });
});


const app = express();
app.use(express.json());
app.use(cors());

// Create a book
app.post('/materiel', (req, res) => {
  const {  design, etat,quantite } = req.body;
  const sql = 'INSERT INTO materiel ( design, etat,quantite ) VALUES ( ?, ?, ?)';
  connection.query(sql, [  design, etat,quantite ], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Failed to create book' });
    } else {
      res.status(201).json({ message: 'Book created successfully' });
    }
  });
});

// Get all books
app.get('/materiel', (req, res) => {
  const sql = 'SELECT * FROM materiel';
  connection.query(sql, (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Failed to retrieve books' });
    } else {
      res.status(200).json(results);
    }
  });
});

// FROM materiel
//     SELECT COUNT(*) AS nombre_total ,
//     SUM(CASE WHEN etat='Bon' THEN 1 ELSE 0 END) AS somme_bon,
//     SUM(CASE WHEN etat='Mauvais' THEN 1 ELSE 0 END) AS somme_Mauvais,
//     SUM(CASE WHEN etat='Abimé' THEN 1 ELSE 0 END) AS somme_Abimé 
//   FROM materiel
// Get all books
app.get('/materieletat', (req, res) => {
  const sql = `
  SELECT
  SUM(quantite) AS nombre_total,
  SUM(CASE WHEN etat = 'Mauvais' THEN quantite ELSE 0 END) AS somme_Mauvais,
  SUM(CASE WHEN etat = 'Bon' THEN quantite ELSE 0 END) AS somme_bon,
  SUM(CASE WHEN etat = 'Abimé' THEN quantite ELSE 0 END) AS somme_Abimé
FROM materiel
  `
  connection.query(sql, (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Failed to retrieve books' });
    } else {
      res.status(200).json(results);
    }
  });
});



// Update a book by ID
app.put('/materiel/:id', (req, res) => {
  const matId = req.params.id;
  const { design, etat,quantite } = req.body;
  const sql = 'UPDATE materiel SET  design = ?, etat = ?, quantite = ? WHERE num_materiel = ?';
  connection.query(sql, [ design, etat,quantite, matId], (error, results) => {
    if (error) {
      console.log(error)
      res.status(500).json({ error: 'Failed to update book' });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Book not found' });
    } else {
      res.status(200).json({ message: 'Book updated successfully' });
    }
  });
});

// Delete a book by ID
app.delete('/materiel/:id', (req, res) => {
  const matId = req.params.id;
  const sql = 'DELETE FROM materiel WHERE num_materiel = ?';
  connection.query(sql, [matId], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Failed to delete book' });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Book not found' });
    } else     {
      res.status(200).json({ message: 'Book deleted successfully' });
    }
  });
});

// Start the server
app.listen(2000, () => {
  console.log('Server started on port 2000');
});

