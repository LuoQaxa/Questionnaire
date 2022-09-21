import React from "react";
import copy from "copy-to-clipboard";
type Props = {
  text: string;
  code: string;
};

const Result = (props: Props) => {
  const onCopy = () => {
    const result = copy(code);
    if (result) {
      window.alert("复制成功");
    }
  };
  const { text, code } = props;
  return (
    <div>
      <p>{text}</p>
      <span>{code}</span> <button onClick={onCopy}>复制</button>
    </div>
  );
};
export default Result;
