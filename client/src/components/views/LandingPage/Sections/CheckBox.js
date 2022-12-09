import React, { Fragment, useState } from "react";
import { Checkbox, Collapse } from "antd";

const { Panel } = Collapse;

// https://ant.design/components/collapse/#header
// https://ant.design/components/checkbox/#header
function CheckBox({ list, handleFilters }) {
    //Check 박스에서 선택한 아이디들이 들어올 배열을 useState를 이용.
    const [Checked, setChecked] = useState([]);

    const handleToggle = (id) => {
        //누른 것의 index를 구하고 전체 checked 된 state에서
        //현재 누른 checkbox가 이미 있다면 빼주고 state를 넣어준다.
        const currentIndex = Checked.indexOf(id);
        const newChecked = [...Checked];

        if (currentIndex === -1) {
            newChecked.push(id);
        } else {
            newChecked.splice(currentIndex, 1);
        }
        setChecked(newChecked);
        //부모 컴포너트인 LandingPage에 알려주자.
        handleFilters(newChecked);
    };

    const renderCheckBoxLists = () =>
        list &&
        list.map((continent) => (
            <Fragment key={continent.id}>
                <Checkbox
                    onChange={() => handleToggle(continent.id)}
                    checked={Checked.indexOf(continent.id) === -1 ? false : true}
                />
                <span style={{ marginRight: "15px" }}>{continent.name}</span>
            </Fragment>
        ));

    return (
        <div>
            <Collapse defaultActiveKey={0}>
                <Panel header="Continents">{renderCheckBoxLists()}</Panel>
            </Collapse>
        </div>
    );
}

export default CheckBox;
