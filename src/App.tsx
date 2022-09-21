import React, { cloneElement, useLayoutEffect, useRef, useState } from "react";
import "./App.css";
import { Button } from "antd";
import Space from "./components/Space/index";
import Transition from "./components/Transition/demo";
import classNames from "classnames";
import ToggleList from "./components/ToggleList";
import Questionnaire from "./components/Questionnaire";

function App() {
  // const [list, setList] = useState([1, 2]);
  // const [fold, setFold] = useState(true);
  // const ulRef = useRef<HTMLUListElement>(null);
  // const ulCopyRef = useRef<HTMLUListElement>(null);
  // const [height, setHeight] = useState("40px");

  // // 1. 获取当前的ul DOM的高度x
  // useLayoutEffect(() => {
  //   console.log("ulRef", ulRef.current);
  //   const ulHeight = getComputedStyle(ulCopyRef.current!).height;
  //   setHeight(ulHeight);
  //   console.log("ulHeight", ulHeight);
  // }, [list]);
  // const getRealHeight = () => {};

  return (
    <div className="App">
      {/* <Space>
        <Button>1</Button>
        <Button>2</Button>
      </Space>
      <Transition></Transition>
      <ToggleList
        defaultFold={true}
        initNum={1}
        list={[1, 2, 3, 4]}
        listItemRender={(item) => <div>{item}</div>}
      ></ToggleList> */}
      <Questionnaire></Questionnaire>
      {/* <div className="list_container">
        <ul
          ref={ulRef}
          style={{ height: height }}
          className={classNames("list", {
            list_expand: list.length === 4,
          })}
        >
          {[1, 2, 3, 4].map((item) => (
            <li className="item">{item}</li>
          ))}
        </ul>
      </div>
      <ul
        ref={ulCopyRef}
        className={classNames("list_copy", {
          list_expand: list.length === 4,
        })}
      >
        {list.map((item) => (
          <li className="item">{item}</li>
        ))}
      </ul>
      <button
        onClick={() => {
          getRealHeight();
          const newList = fold ? [...list, 3, 4] : list.slice(0, 2);
          setList(newList);
          setFold(!fold);
        }}
      >
        {fold ? "展开" : "收起"}
      </button> */}
    </div>
  );
}

export default App;
