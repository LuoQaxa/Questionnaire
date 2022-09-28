import React from "react";
import copy from "copy-to-clipboard";
import { Button, Space } from "antd";
type Props = {
  text: string;
  code: string;
};

const Result = (props: Props) => {
  const onCopy = () => {
    const result = copy(code);
    if (result) {
      window.alert("copy success");
    }
  };
  const { text, code } = props;
  return (
    <div>
      <p>{text}</p>
      <Space>
        <span>{code}</span>
        <Button type="primary" onClick={onCopy}>
          copy
        </Button>
      </Space>
    </div>
  );
};
export default Result;
