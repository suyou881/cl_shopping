import React, { useEffect, useState } from "react";
import { FaCode } from "react-icons/fa";
import axios from "axios";
import { Icon, Col, Card, Row, Carousel } from "antd";
import Meta from "antd/lib/card/Meta";
import ImageSlider from "../../utils/ImageSlider";

function LandingPage() {
    const [Products, setProducts] = useState([]);
    //mongoDB에서 처음에 몇개를 보여줄지를 skip과 limit을 통해서 보여주려고 usestate 사용.
    const [Skip, setSkip] = useState(0);
    const [Limit, setLimit] = useState(8);
    const [PostSize, setPostSize] = useState(0);

    useEffect(() => {
        //limit과 skip을 이용해서 처음 LandingPage에 들어왔을 때,
        //8개의 상품만 보여줄 수 있도록
        //body를 만들고 axios에 end-point 옆에 같이 실어보내자.
        let body = {
            skip: Skip,
            limit: Limit,
            //더보기 버튼을 누른건지 아닌지
            loadMore: true,
        };
        getProducts(body);
        //비동기로 axios 이용해서 데이터 받아와서 products 스테이트에 넣어준다.
        //end-point 는 /api/products/products
        //아래 loadMoreHandler에도 같은 코드가 들어가야 한다. 중복을 피하기 위해서
        //getProducts 로 따로 빼자.
        // axios.post("/api/products/products", body).then((res) => {
        //     if (res.data.success) {
        //         // console.log(res.data);
        //         setProducts(res.data.productInfo);
        //     } else {
        //         alert("failed to import goods");
        //     }
        // });
    }, []);

    const getProducts = (body) => {
        axios.post("/api/products/products", body).then((res) => {
            if (res.data.success) {
                if (body.loadMore) {
                    setProducts([...Products, ...res.data.productInfo]);
                } else {
                    setProducts(res.data.productInfo);
                }
                setPostSize(res.data.PostSize);
                //console.log(PostSize, "    ", Limit);
                //setProducts(res.data.productInfo);
            } else {
                alert("failed to import goods");
            }
        });
    };

    const loadMoreHandler = () => {
        //더보기를 누르면?
        //skip은 변하지만 limit은 변하지 않는다.
        //skip만 변하게 설정.
        let skip = Skip + Limit;
        let body = {
            skip: skip,
            limit: Limit,
            loadMore: true,
        };
        getProducts(body);

        //skip 스테이트 업데이트
        setSkip(skip);
    };

    const renderCards = Products.map((product, index) => {
        //console.log(product);
        return (
            //브라우저 크기에 따라 한 줄에 몇개의 상품을 나열할지
            // lg, md, xs... etc 이런것들은 사이즈가 얼마만해졌는지에 따라서
            // 하나의 col 이 가지는 면적을 나타낸다.
            <Col lg={6} md={8} xs={24} key={index}>
                {/* <Card cover={<img src={`http://localhost:5000/${product.images[0]}`} />}> */}
                {/* https://ant.design/components/carousel 이용해서 슬라이드 만들기 */}
                <Card cover={<ImageSlider images={product.images} />}>
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

            <br />

            {/* 더 볼 수 있는 상품이 있을때만 더보기 버튼이 나오도록 
            PostSize를 usestate로 세팅해주고
            products router안에 Product.find()로 상품을 찾을 때 PostSize를 찾을 수 있다.*/}
            {PostSize >= Limit && (
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <button onClick={loadMoreHandler}>view more</button>
                </div>
            )}
        </div>
    );
}

export default LandingPage;
