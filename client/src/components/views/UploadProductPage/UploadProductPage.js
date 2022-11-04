import React, { useState } from "react";
import { Button, Form, Input } from "antd";
import FileUpLoad from "../../utils/FileUpload";
import Axios from "axios";
const { TextArea } = Input;

const Continents = [
    { key: 1, value: "Africa" },
    { key: 2, value: "Europe" },
    { key: 3, value: "Asia" },
    { key: 4, value: "North America" },
    { key: 5, value: "South America" },
    { key: 6, value: "Australia" },
    { key: 7, value: "Antarctica" },
];

function UploadProductPage(props) {
    const [Title, setTitle] = useState("");
    const [Description, setDescription] = useState("");
    const [Price, setPrice] = useState(0);
    const [Continent, setContinent] = useState(1);
    const [Images, setImages] = useState([]);

    const titleChangeHandler = (e) => {
        setTitle(e.currentTarget.value);
    };

    const discriptionChangeHandler = (e) => {
        setDescription(e.currentTarget.value);
    };

    const priceChangeHandler = (e) => {
        setPrice(e.currentTarget.value);
    };

    const continentChangeHandler = (e) => {
        setContinent(e.currentTarget.value);
    };

    //UploadProductPage 안에 FileUpload 컴포넌트가 있다.
    //파일을 드랍존에서 선택하고 지울 때 FileUpload 컴포넌트만 파일의 변경을 알 수 있고
    //부모인 UploadProductPage는 알 수 없다.
    //그런데 form 으로 데이터를 날릴 때, 부모컴포넌트가 알아야 한다.
    //그래서 props로 refreshFunction을 주고 FileUpload 에서 변화가 있을때 마다
    //부모 컴포넌트인 UploadProductPage 또한 알 수 있게 해준다.
    const updateImages = (newImages) => {
        setImages(newImages);
    };

    const submitHandler = (e) => {
        console.log("In submitHandler");
        // e.preventDefault();

        //모든 칸이 채워지지 않으면 submit 안되게
        if (!Title || !Description || !Price || !Continent || !Images) {
            return alert("모든 값을 넣어주셔야 합니다.");
        }

        //서버에 채운 값들을 request로 보낸다.
        const body = {
            //로그인 된 사람의 ID를 가져와야 한다.
            //hoc폴더 안에 auth.js 의 user를 가져오자.
            //위에 인자로 props를 넣어주자.
            writer: props.user.userData._id,
            title: Title,
            description: Description,
            price: Price,
            images: Images,
            contients: Continent,
        };

        Axios.post("/api/products", body).then((response) => {
            if (response.data.success) {
                alert("상품 업로드에 성공 했습니다");
                //상품 업로드가 성공이 되면 push(~~) 주소로 이동.
                props.history.push("/");
            } else {
                alert("상품 업로드에 실패 했습니다.");
            }
        });
    };

    return (
        <div style={{ maxWidth: "700px", margin: "2rem auto" }}>
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                <h2> 여행 상품 업로드</h2>
            </div>
            <Form onSubmit={submitHandler}>
                {/* DropZone */}
                <FileUpLoad refreshFunction={updateImages} />
                <br />
                <br />
                <label>이름</label>
                <Input onChange={titleChangeHandler} value={Title} />
                <br />
                <br />
                <label>설명</label>
                <TextArea onChange={discriptionChangeHandler} value={Description} />
                <br />
                <br />
                <label>가격 ($)</label>
                <Input type="number" onChange={priceChangeHandler} value={Price} />
                <br />
                <br />
                <select onChange={continentChangeHandler} value={Continent}>
                    {Continents.map((item) => (
                        <option key={item.key} value={item.key}>
                            {item.value}
                        </option>
                    ))}
                </select>
                <br />
                <br />
                <Button onClick={submitHandler}>확인</Button>
            </Form>
        </div>
    );
}

export default UploadProductPage;
