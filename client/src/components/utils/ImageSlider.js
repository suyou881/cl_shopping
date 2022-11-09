import React from "react";
import { Carousel } from "antd";

function ImageSlider({ images }) {
    return (
        <div>
            <Carousel autoplay>
                {images.map((image, index) => (
                    <div key={index}>
                        <img
                            style={{ width: "100%", maxHeight: "150px" }}
                            src={`http://localhost:5000/${image}`}
                        />
                    </div>
                ))}
                {/* <div>
                    <img
                        style={{ width: "100%", maxHeight: "150px" }}
                        src={`http://localhost:5000/${images[0]}`}></img>
                </div>
                <div>
                    <img
                        style={{ width: "100%", maxHeight: "150px" }}
                        src={`http://localhost:5000/${images[1]}`}></img>
                </div> */}
            </Carousel>
        </div>
    );
}

export default ImageSlider;
