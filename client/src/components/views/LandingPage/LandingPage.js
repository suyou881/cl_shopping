import React, { useEffect, useState } from "react";
import { FaCode } from "react-icons/fa";
import axios from "axios";
import { Icon, Col, Card, Row, Carousel, Checkbox } from "antd";
import Meta from "antd/lib/card/Meta";
import ImageSlider from "../../utils/ImageSlider";
import CheckBox from "./Sections/CheckBox";
import { continents, price } from "./Sections/Datas";
import RadioBox from "./Sections/RadioBox";
import SearchFeature from "./Sections/SearchFeature";

function LandingPage() {
    const [Products, setProducts] = useState([]);
    //mongoDB에서 처음에 몇개를 보여줄지를 skip과 limit을 통해서 보여주려고 usestate 사용.
    const [Skip, setSkip] = useState(0);
    const [Limit, setLimit] = useState(8);
    const [PostSize, setPostSize] = useState(0);
    const [Filters, setFilters] = useState({
        continents: [],
        price: [],
    });

    const [SearchTerm, setSearchTerm] = useState("");

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
                <Card
                    cover={
                        <a href={`/product/${product._id}`}>
                            <ImageSlider images={product.images} />
                        </a>
                    }>
                    <Meta title={product.title} description={`$${product.price}`} />
                </Card>
            </Col>
        );
    });

    const showFilterdResult = (newFilters) => {
        let body = {
            skip: 0,
            limit: Limit,
            loadMore: false,
            filters: newFilters,
            searchTerm: SearchTerm,
        };
        getProducts(body);
        setSkip(0);
    };

    const handlePrice = (value) => {
        const data = price;
        let arr = [];
        for (let key in data) {
            if (data[key].id === parseInt(value, 10)) {
                arr = data[key].array;
            }
        }
        return arr;
    };

    //filter는 체크된 것들의 id를 담은 array
    //category는 checkbox인지 radiobox인지를 알려주는
    const handleFilters = (filters, category) => {
        const newFilters = { ...Filters };
        //categoryd에는 continent와 price가 있다.
        //newFilters[category] --> newFilters[continent] or newFilters[price]가 되고
        //filter로 넘어온 id값들을 해당 카테고리에 맞게 넣는 작업.
        newFilters[category] = filters;

        //category가 price일 때는 추가 작업을 해줘야 한다.
        //console.log(category);
        //console.log(filters);
        // console.log(newFilters);
        if (category === "price") {
            let papriceValues = handlePrice(filters);

            newFilters[category] = papriceValues;
        }
        // console.log(newFilters["price"]);
        const existSearchTerm = SearchTerm;
        showFilterdResult(newFilters);
        setFilters(newFilters);
        setSearchTerm(existSearchTerm);
    };

    const updateSearchTerm = (newSearchTerm) => {
        let body = {
            skip: 0,
            limit: Limit,
            filters: Filters,
            searchTerm: newSearchTerm,
        };

        setSkip(0);
        getProducts(body);
        setSearchTerm(newSearchTerm);
    };

    return (
        <div style={{ width: "75%", margin: "3rem auto" }}>
            <div style={{ textAlign: "center" }}>
                <h2>
                    Let's Travel Anywhere <Icon type="rocket" />
                </h2>
            </div>
            {/*------------------- Filter -------------------*/}
            <Row gutter={[16, 16]}>
                <Col lg={12} xs={24}>
                    {/* CheckBox */}
                    <CheckBox
                        list={continents}
                        handleFilters={(filters) => {
                            handleFilters(filters, "continents");
                        }}
                    />
                </Col>
                <Col lg={12} xs={24}>
                    {/* RadioBox */}
                    <RadioBox
                        list={price}
                        handleFilters={(filters) => {
                            handleFilters(filters, "price");
                        }}></RadioBox>
                </Col>
            </Row>

            {/* Search */}
            <div style={{ display: "flex", justifyContent: "flex-end", margin: "1rem auto" }}>
                <SearchFeature refreshFunction={updateSearchTerm} />
            </div>
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
