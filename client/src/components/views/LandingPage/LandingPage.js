import React, { useEffect, useState } from "react";
import { FaCode } from "react-icons/fa";
import axios from "axios";
import { Icon, Col, Card, Row } from "antd";
import Meta from "antd/lib/card/Meta";
function LandingPage() {
    const [Products, setProducts] = useState([]);

    useEffect(() => {
        //비동기로 axios 이용해서 데이터 받아와서 products 스테이트에 넣어준다.
        //end-point 는 /api/products/products
        axios.post("/api/products/products").then((res) => {
            if (res.data.success) {
                // console.log(res.data);
                setProducts(res.data.productInfo);
            } else {
                alert("failed to import goods");
            }
        });
    }, []);

    const renderCards = Products.map((product, index) => {
        //console.log(product);
        return (
            //브라우저 크기에 따라 한 줄에 몇개의 상품을 나열할지
            // lg, md, xs... etc 이런것들은 사이즈가 얼마만해졌는지에 따라서
            // 하나의 col 이 가지는 면적을 나타낸다.
            <Col lg={6} md={8} xs={24} key={index}>
                <Card cover={<img src={`http://localhost:5000/${product.images[0]}`} />}>
                    <Meta title={product.title} description={`$${product.price}`} />
                </Card>
            </Col>
        );
    });

    return (
        <div style={{ width: "75%", margin: "3rem auto" }}>
            <div style={{ textAlign: "center" }}>
                <h2>
                    Let's Travel Anywhere <Icon type="rocket" />
                </h2>
            </div>
            {/* Filter */}

            {/* Search */}

            {/* Cards */}
            {/* https://ant.design/components/grid/ */}
            <Row gutter={[16, 16]}>{renderCards}</Row>
        </div>
    );
}

export default LandingPage;
