import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getCartItems } from "../../../_actions/user_actions";
function CartPage({ user }) {
    const dispatch = useDispatch();
    let cartItems = [];

    useEffect(() => {
        //리덕스 User state안에 cart 안에 상품이 들어있는지 확인
        if (user.userData && user.userData.cart) {
            if (user.userData.cart.length > 0) {
                user.userData.cart.forEach((item) => {
                    cartItems.push(item.id);
                });
                //원래는 axios를 사용했겠지만, 지금은 redux
                dispatch(getCartItems(cartItems, user.userData.cart));
            }
        }
    });

    return <div>CartPage</div>;
}

export default CartPage;
