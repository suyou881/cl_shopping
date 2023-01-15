import React from "react";
import "./UserCardBlock.css";

function UserCardBlock({ products, removeItem }) {
    return (
        <div>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Product Image</th>
                            <th>Product Quantity</th>
                            <th>Product Price</th>
                            <th>Remove from Cart</th>
                        </tr>
                    </thead>
                    <tbody>{renderItems(products, removeItem)}</tbody>
                </table>
            </div>
        </div>
    );
}

const renderItems = (products, removeItem) =>
    // console.log(products);
    products &&
    products.map((product, index) => (
        <tr key={index}>
            <td>
                <img
                    style={{ width: "70px" }}
                    alt="product"
                    src={renderCartImage(product.images)}
                />
            </td>
            <td>{product.quantity} EA</td>
            <td>$ {product.price}</td>
            <td>
                <button onClick={() => removeItem(product._id)}>Remov e</button>
            </td>
        </tr>
    ));

const renderCartImage = (images) => {
    if (images.length > 0) {
        let image = images[0];
        return `http://localhost:5000/${image}`;
    }
};

export default UserCardBlock;
