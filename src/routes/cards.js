const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

router.get('/add', (req, res) => {
    res.render('cards/add');
});

router.post('/add', isLoggedIn, async(req, res) => {
    var { name, img_url, description, app_url_download } = req.body;
    if (img_url == '') { img_url = 'https://img.icons8.com/officel/100/000000/no-image.png'; }
    if (description == '') { description = 'no description'; }

    const newCard = {
        name,
        img_url,
        description,
        app_url_download,
        app_url_copy: 'http://localhost:4000/cards/',
    };

    await pool.query('INSERT INTO note set ?', [newCard]);
    req.flash('success', 'Card Saved Successfully');
    res.redirect('/cards');
});

router.get('/', isLoggedIn, async(req, res) => {
    const cards = await pool.query('SELECT * FROM note WHERE status = ?', ['HA']);
    res.render('cards/list', { cards });
});

router.get('/delete/:id', async(req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM note  WHERE ID = ?', [id]);
    req.flash('success', 'Card Removed Successfully');
    res.redirect('/cards');
});


router.get('/edit/:id', async(req, res) => {
    const { id } = req.params;
    const cards = await pool.query('SELECT * FROM note WHERE id = ?', [id]);
    res.render('cards/edit', { card: cards[0] });
});

router.post('/edit/:id', async(req, res) => {
    const { id } = req.params;
    const { name, description, img_url, app_url_download } = req.body;
    const newCard = {
        name,
        img_url,
        description,
        app_url_download,
    };
    await pool.query('UPDATE note set ? WHERE id = ?', [newCard, id]);
    req.flash('success', 'Card Update Successfully');
    res.redirect('/cards');
});



module.exports = router;