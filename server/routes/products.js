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
    console.log("in products.js from FileUpload");
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
    console.log(" In server, router post");
    //받아온 정보들을 DB에 넣어준다.
    const product = new Product(req.body);
    console.log(product);
    product.save((err) => {
        if (err) return res.status(400).json({ success: false, err });
        return res.status(200).json({ success: true });
    });
});

module.exports = router;