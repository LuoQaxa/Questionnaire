import React, { useState } from "react";
import Transition from "../index";
type Props = {};

const Tdemo = (props: Props) => {
  const [visible, setVisible] = useState(true);
  return (
    <>
      <Transition visible={visible}>Tdemo</Transition>
      <button onClick={() => setVisible(!visible)}>
        {visible ? "隐藏" : "显示"}
      </button>
    </>
  );
};
export default Tdemo;
