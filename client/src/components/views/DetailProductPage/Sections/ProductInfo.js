import React from "react";
import { Descriptions, Button } from "antd";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../../_actions/user_actions";

function ProductInfo({ detail }) {
    const dispatch = useDispatch();

    const clickHandler = () => {
        //필요한 정보를 넣어준다.
        //상품에 대한 아이디, 개수, 언제 넣었는지

        dispatch(addToCart(detail._id));
    };

    return (
        <div>
            <Descriptions title="Product Info" bordered>
                <Descriptions.Item label="Price">{detail.price}</Descriptions.Item>
                <Descriptions.Item label="Billing Mode">{detail.sold}</Descriptions.Item>
                <Descriptions.Item label="View">{detail.views}</Descriptions.Item>
                <Descriptions.Item label="Description">{detail.description}</Descriptions.Item>
            </Descriptions>

            <br />
            <br />
            <br />
            <div style={{ display: "flex", justifyContent: "center" }}>
                <Button size="large" shape="round" type="danger" onClick={clickHandler}>
                    Add to Cart
                </Button>
            </div>
        </div>
    );
}

export default ProductInfo;
