import React, { useState } from "react";
import Dropzone from "react-dropzone";
import { Icon } from "antd";
import axios from "axios";

export default function FileUpload() {
    //사진이 여러개 들어올 수 있기 때문에 배열로 초기화
    const [Images, setImages] = useState([]);

    const dropHandler = (files) => {
        //파일을 전해줄 때 헤더에 컨텐트 타입에 대한 정보를 입력해서 같이 보내줘야 한다.
        //또한 formData 안에 파일정보를 넣어서 보내준다.
        let formData = new FormData();
        const config = {
            header: { "content-type": "multipart/form-data" },
        };
        formData.append("file", files[0]);

        //server 에 index쪽으로 들아가서 end point를 찾아간다.
        axios
            .post("/api/products/image", formData, config)
            //response 안에 정보가 들어있다.
            .then((response) => {
                if (response.data.success) {
                    setImages([...Images, response.data.filePath]);
                } else {
                    alert("파일을 저장하는데 실패했습니다.");
                }
            });
    };

    return (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Dropzone onDrop={dropHandler}>
                {({ getRootProps, getInputProps }) => (
                    <section>
                        <div
                            style={{
                                width: 300,
                                height: 240,
                                border: "1px solid lightgray",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            {...getRootProps()}>
                            <input {...getInputProps()} />
                            <Icon type="plus" style={{ fontSize: "3rem" }}></Icon>
                        </div>
                    </section>
                )}
            </Dropzone>

            {/* 아래 ui가 없으면 파일을 받아서 아무것도 표시가 안된다. */}
            <div
                style={{
                    display: "flex",
                    width: "350px",
                    height: "240px",
                    overflowX: "scroll",
                    overflowY: "hidden",
                }}>
                {Images.map((image, index) => (
                    <div>
                        <img
                            style={{ minWidth: "300px", width: "300px", height: "240px" }}
                            src={`http://localhost:5000/${image}`}></img>
                    </div>
                ))}
            </div>
        </div>
    );
}
