const express = require("express");
const router = express.Router();
const { User } = require("../models/User");
const { Product } = require("../models/Product");
const { auth } = require("../middleware/auth");

//=================================
//             User
//=================================

router.get("/auth", auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image,
        cart: req.user.cart,
        history: req.user.history,
    });
});

router.post("/register", (req, res) => {
    const user = new User(req.body);

    user.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true,
        });
    });
});

router.post("/login", (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user)
            return res.json({
                loginSuccess: false,
                message: "Auth failed, email not found",
            });

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch) return res.json({ loginSuccess: false, message: "Wrong password" });

            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                res.cookie("w_authExp", user.tokenExp);
                res.cookie("w_auth", user.token).status(200).json({
                    loginSuccess: true,
                    userId: user._id,
                });
            });
        });
    });
});

router.post("/addToCart", auth, (req, res) => {
    //해당 유저의 정보를 가져오기.
    //req.user._id를 할 수 있는 이유는 auth 미들웨어 때문이다.
    //쿠키에 담겨있는 user 정보를 req.user에 담아주기 때문이다.
    User.findOne({ _id: req.user._id }, (err, userInfo) => {
        //그 다음 가져온 정보에서 카트에 넣으려하는 상품이 들어있는지 확인
        let duplicate = false;
        userInfo.cart.forEach((item) => {
            if (item.id === req.body.productId) {
                duplicate = true;
            }
        });

        //상품이 이미 있을 때

        if (duplicate) {
            User.findOneAndUpdate(
                { _id: req.user._id, "cart.id": req.body.productId },
                { $inc: { "cart.$.quantity": 1 } },
                { new: true },
                //update된 정보의 결과값을 받으려면 new: true 옵션이 필요하다.
                (err, userInfo) => {
                    if (err) return res.status(400).json({ success: false, err });
                    res.status(200).send(userInfo.cart);
                }
            );
            //상품이 이미 있지 않을 때
        } else {
            User.findOneAndUpdate(
                { _id: req.user._id },
                {
                    $push: {
                        cart: {
                            id: req.body.productId,
                            quantity: 1,
                            date: Date.now(),
                        },
                    },
                },
                { new: true },
                (err, userInfo) => {
                    if (err) return res.status(400).json({ success: false, err });
                    res.status(200).send(userInfo.cart);
                }
            );
        }
    });
});

router.get("/removeFromCart", auth, (req, res) => {
    //먼저 cart 안에 내가 지우려고 한 상품을 지워주기
    User.findOneAndUpdate(
        { _id: req.user._id },
        {
            $pull: { cart: { id: req.query.id } },
        },
        //update 된 새로운 값을 가져온다.
        { new: true },
        (err, userInfo) => {
            let cart = userInfo.cart;
            let array = cart.map((item) => {
                return item.id;
            });

            //product collection에서 현재 남아있는 상품들의 정보를 가져오기
            Product.find({ _id: { $in: array } })
                .populate("writer")
                .exec((err, productInfo) => {
                    return res.status(200).json({
                        //왜 cart 까지 넘기느냐?
                        //cartDetail을 만들 때 두 정보 모두 필요하다.
                        productInfo,
                        cart,
                    });
                });
        }
    );
});

module.exports = router;
