import React from "react";
import copy from "copy-to-clipboard";
import { Button, message, Space } from "antd";
type Props = {
  text: string;
  code: string;
};

const Result = (props: Props) => {
  const onCopy = () => {
    const result = copy(code);
    if (result) {
      message.success("复制成功");
    }
  };
  const { text, code } = props;
  return (
    <div>
      <p>{text}</p>
      <Space>
        <span>{code}</span>
        <Button type="primary" onClick={onCopy}>
          复制
        </Button>
      </Space>
    </div>
  );
};
export default Result;
