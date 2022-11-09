import React from "react";
import { Carousel } from "antd";

function ImageSlider(props) {
    //console.log(images);
    return (
        <div>
            <Carousel autoplay>
                {props.images.map((image, index) => (
                    <div>
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
