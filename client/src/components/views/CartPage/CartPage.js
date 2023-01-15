import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getCartItems, removeCartItem } from "../../../_actions/user_actions";
import UserCardBlock from "./Sections/UserCardBlock";
function CartPage({ user }) {
    const dispatch = useDispatch();

    const [ToTal, setToTal] = useState(0);

    useEffect(() => {
        let cartItems = [];

        //리덕스 User state안에 cart 안에 상품이 들어있는지 확인
        if (user.userData && user.userData.cart) {
            if (user.userData.cart.length > 0) {
                user.userData.cart.forEach((item) => {
                    cartItems.push(item.id);
                });
                //원래는 axios를 사용했겠지만, 지금은 redux
                dispatch(getCartItems(cartItems, user.userData.cart)).then((response) => {
                    calculateTotal(response.payload);
                });
            }
        }
    }, [user.userData]);

    let calculateTotal = (cartDetail) => {
        let total = 0;

        cartDetail.map((item) => {
            total += parseInt(item.price, 10) * item.quantity;
        });

        setToTal(total);
    };

    let removeFromCart = (productId) => {
        dispatch(removeCartItem(productId)).then((reponse) => {});
    };

    return (
        <div style={{ width: "85%", margin: "3rem auto" }}>
            <h1>My Cart</h1>
            <div>
                {/* user.cartDetail &&  이 코드를 추가해 주지 않으면 product가 없다고 에러가 난다.
            너무 빠르게 정보를 가지고 오려하다보니 에러가 생긴것.
            그래서 user.cartDetail 이 있다면? 가져오게끔 코드를 바꿔주면 에러를 해결할 수 있다. */}
                <UserCardBlock products={user.cartDetail} removeItem={removeFromCart} />
            </div>

            <div style={{ marginTop: "3rem" }}>
                <h2>Total Amount: ${ToTal}</h2>
            </div>
        </div>
    );
}

export default CartPage;
