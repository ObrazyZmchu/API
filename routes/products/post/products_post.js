var express = require('express');
var router = express.Router();
const productModel = require("../../../models/product");
const categories = require("../../../util/json/categories.json");
const productPicModel = require("../../../models/productpic");
const mongoose = require("mongoose");

function upload(file, product, order, id) {
  file.mv('./static/files/' + id + ".png", function(err) {
    const pic = new productPicModel({
      "_id": id,
      "path": "/files/" + id + ".png",
      "productID": product.id,
      "order": order
    });
    pic.save().then().catch(err => {
      return res.status(500).send(err);
    })
  });
}

router.post('', (req, res, next) => {
  if(!(req.body.secret === process.env.PASSWORD)) {
    res.status(401).json({"result": "unauthorized"});
    return next()
  }

  if(!categories.categories.includes(req.body.category)) {
    res.status(400).json({"result": "nie ma takiej kategorii" + "(dostepne: " + categories.categories + ")"})
    return next()
  }

  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400).json({"result": "brak pliku"});
    return next()
  }

  var product;

  if(req.files.file.length === undefined) {
    var id = mongoose.Types.ObjectId();
    file = req.files.file
    product = new productModel({
        title: req.body.title,
        desc: req.body.desc,
        category: req.body.category,
        price: req.body.price,
        time: req.body.time,
        pics: "/files/" + id + ".png"
    });
    upload(file, product, 0, id)

  }else {
    var filelist = [];
    var objectIds = [];

    req.files.file.forEach((file, index) => {
      objectIds.push(mongoose.Types.ObjectId());
    })


    req.files.file.forEach((file, index) => {
      filelist.push("/files/" + objectIds[index] + ".png")
    })

    product = new productModel({
      title: req.body.title,
      desc: req.body.desc,
      category: req.body.category,
      price: req.body.price,
      time: req.body.time,
      pics: filelist
    });

    req.files.file.forEach((file, index) => {
      upload(file, product, index, objectIds[index])
    })
  }


  product.save().then(result => {
    return res.status(200).json({
      "result": "Dodano produkt.",
      "product_id": product.id,
      "pic_id": id || objectIds
    });
  }).catch(err => {
    //res.status(500).send(err);
  })
});



module.exports = router;
