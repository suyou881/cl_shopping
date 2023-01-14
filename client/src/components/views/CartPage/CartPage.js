import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getCartItems } from "../../../_actions/user_actions";
import UserCardBlock from "./Sections/UserCardBlock";
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
    }, [user.userData]);

    return (
        <div style={{ width: "85%", margin: "3rem auto" }}>
            {/* user.cartDetail &&  이 코드를 추가해 주지 않으면 product가 없다고 에러가 난다.
            너무 빠르게 정보를 가지고 오려하다보니 에러가 생긴것.
            그래서 user.cartDetail 이 있다면? 가져오게끔 코드를 바꿔주면 에러를 해결할 수 있다. */}
            <UserCardBlock products={user.cartDetail && user.cartDetail.product} />
        </div>
    );
}

export default CartPage;
