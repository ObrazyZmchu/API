var express = require('express');
var router = express.Router();
var fs = require("fs");
const categories = require("../../../util/json/categories.json");

router.get('', (req, res, next) => {
    res.status(200).json(categories)
})

router.post('/add', (req, res, next) => {

    if(!(req.body.secret === process.env.PASSWORD)) {
        res.status(401).json({"result": "podaj dobry secret"})
        return next()
    }

    cat = categories
    cat.categories.push(req.body.category)
    console.log(cat)
    fs.writeFile('./util/json/categories.json', JSON.stringify(cat), function(err) {
            if (err) throw err;
        }
    );
    res.status(200).json({"result": "dodano kategorie"});
})

router.delete('/remove', (req, res, next) => {

    if(!(req.body.secret === process.env.PASSWORD)) {
        res.status(401).json({"result": "podaj dobry secret"})
        return next()
    }

    cat = categories
    cat.categories.forEach((val, index) => {
        if (val === req.body.category) {
            cat.categories.splice(index, 1)
        }
    })
    fs.writeFile('./util/json/categories.json', JSON.stringify(cat), function(err) {
            if (err) throw err;
        }
    );
    res.status(200).json({"result": "usunieto kategorie"});
})


module.exports = router;