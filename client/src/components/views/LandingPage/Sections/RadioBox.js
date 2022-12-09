import React, { useState } from "react";
import { Collapse, Radio } from "antd";

const { Panel } = Collapse;

function RadioBox({ list, handleFilters }) {
    const [Checked, setChecked] = useState(0);

    const renderRadioBox = () =>
        list &&
        list.map((price, index) => (
            <Radio key={index} value={price.id}>
                {price.name}
            </Radio>
        ));

    const handleChange = (event) => {
        setChecked(event.target.value);
        //console.log(Checked);
        handleFilters(event.target.value);
    };

    return (
        <div>
            <Collapse defaultActiveKey={0}>
                <Panel header="Price">
                    <Radio.Group onChange={handleChange} value={Checked}>
                        {renderRadioBox()}
                    </Radio.Group>
                </Panel>
            </Collapse>
        </div>
    );
}

export default RadioBox;
