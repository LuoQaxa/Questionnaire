import React, { useEffect, useRef, useState } from "react";

interface indexProps {
  value?: string;
  onChange?: (value: string) => void;
}

const Input: React.FC<indexProps> = (props) => {
  const { value, onChange } = props;
  const [innerValue, setValue] = useState(value);

  const isControl = props.value !== undefined;

  //父组件的value发生变化后，子组件会执行一次useEffect. 在函数内部同步父组件的值到子组件

  useEffect(() => {
    console.log("Input useEffect");
    if (isControl) {
      setValue(props.value);
    }
  });

  const hanldeChange = (e: any) => {
    if (!isControl) {
      setValue(e.target.value);
    }
    onChange?.(e.target.value);
  };
  const getValue = () => {
    console.log(inputRef.current.value);
  };
  const inputRef = useRef<any>();

  const finalValue = isControl ? props.value : value;
  // 指定默认的值后，就交出控制权给组件内部，这种应用场景为非受控
  return (
    <div>
      <input
        ref={inputRef}
        value={finalValue}
        onChange={hanldeChange}
        type="text"
      />
      <button onClick={getValue}>获取值</button>
    </div>
  );
};

// 在HTML的表单元素中，它们通常自己维护一套state，并随着用户的输入自己进行UI上的更新，
// 这种行为是不被我们程序所管控的。而如果将React里的state属性和表单元素的值建立依赖关系，
// 再通过onChange事件与setState()结合更新state属性，就能达到控制用户输入过程中表单发生的操作。
// 被React以这种方式控制取值的表单输入元素就叫做受控组件。

export default Input;
