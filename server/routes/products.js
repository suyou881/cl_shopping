const express = require("express");
const multer = require("multer");
const router = express.Router();
const { Product } = require("../models/Product");

const { auth } = require("../middleware/auth");

//=================================
//             Product
//=================================

const storage = multer.diskStorage({
    //목적지 설정
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    //파일 이름을 어떻게 설정할 지
    filename: function (req, file, cb) {
        const uniqueFile = `${Date.now()}_${file.originalname}}`;
        cb(null, uniqueFile);
    },
});

const upload = multer({ storage: storage }).single("file");

router.post("/image", (req, res) => {
    //가져온 이미지를 저장해주면 된다.
    //multer를 사용한다.
    upload(req, res, (err) => {
        if (err) {
            return req.json({ success: false, err });
        }
        //여기서 성공하면 다시 front-end로
        //FileUpload.js
        return res.json({
            success: true,
            filePath: res.req.file.path,
            fileName: res.req.file.filename,
        });
    });
});

router.post("/", (req, res) => {
    //받아온 정보들을 DB에 넣어준다.
    const product = new Product(req.body);
    console.log(product);
    product.save((err) => {
        if (err) return res.status(400).json({ success: false, err });
        return res.status(200).json({ success: true });
    });
});

//import all goods from product collection
router.post("/products", (req, res) => {
    let limit = req.body.limit ? parseInt(req.body.limit) : 20;
    let skip = req.body.skip ? parseInt(req.body.skip) : 0;
    let term = req.body.searchTerm;

    let findArgs = {};
    //여기서 key는 continent or price가 된다.
    for (let key in req.body.filters) {
        //console.log("key", key);
        if (req.body.filters[key].length > 0) {
            // console.log("key", key);

            if (key === "price") {
                findArgs[key] = {
                    //greater than equal
                    $gte: req.body.filters[key][0],
                    //less than equal
                    $lte: req.body.filters[key][1],
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }

    // console.log("findArgs", findArgs);
    // if (term) console.log("term", term);
    //term = term + "*";

    if (term) {
        //몽고디비 Product 컬렉션에 있는 모든 item들을 가져온다.
        Product.find(findArgs)
            .find({ $text: { $search: term } })
            //populate을 쓰면 wirter에 대한 정보도 같이 끌어온다.
            .populate("writer")
            .skip(skip)
            .limit(limit)
            .exec((err, productInfo) => {
                if (err) return res.status(400).json({ success: false, err });
                return res
                    .status(200)
                    .json({ success: true, productInfo, PostSize: productInfo.length });
            });
    } else {
        //몽고디비 Product 컬렉션에 있는 모든 item들을 가져온다.
        Product.find(findArgs)
            //populate을 쓰면 wirter에 대한 정보도 같이 끌어온다.
            .populate("writer")
            .skip(skip)
            .limit(limit)
            .exec((err, productInfo) => {
                if (err) return res.status(400).json({ success: false, err });
                return res
                    .status(200)
                    .json({ success: true, productInfo, PostSize: productInfo.length });
            });
    }
});

router.get("/products_by_id", (req, res) => {
    //prodcutId를 이용해서 DB에서 productId와 같은 상품의 정보를 가져온다.
    let type = req.query.type;
    let productId = req.query.id;
    Product.find({ _id: productId })
        .populate("writer")
        .exec((err, product) => {
            if (err) return res.status(400).send(err);
            return res.status(200).send({ success: true, product });
        });
});
// axios.get(`api/products/products_by_id?id=${productId}&type=single`)
module.exports = router;
