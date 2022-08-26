import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./index.scss";

type Props = {
  list: any[];
  /** 是否收起 */
  defaultFold: boolean;
  /* 初始化显示的数量 */
  initNum: number;
  listItemRender: (item: any) => React.ReactNode;
};

const ToggleList: React.FC<Props> = (props) => {
  const { list, listItemRender, initNum, defaultFold } = props;
  const [height, setHeight] = useState("");
  const [fold, setFold] = useState(defaultFold);

  const [copyList, setCopyList] = useState<any>([]);
  useEffect(() => {
    const newList = initNum ? list.slice(0, initNum) : list;
    setCopyList(newList);
  }, [initNum, list]);

  const copyListRef = useRef(null);
  useLayoutEffect(() => {
    const realHeight = getComputedStyle(copyListRef.current!).height;
    setHeight(realHeight);
  }, [copyList]);

  /**
   * toggle展开收起
   */
  const onToggle = () => {
    setCopyList(fold ? list : list.slice(0, initNum));
    setFold(!fold);
  };
  return (
    <div>
      {/* 全部渲染的组件 */}
      <div className="list_container" style={{ height: height }}>
        {list.map((item) => listItemRender(item))}
      </div>
      <button onClick={onToggle}>{fold ? "展开" : "收起"}</button>
      {/* 渲染实际的组件 */}
      <div className="list_copy_container" ref={copyListRef}>
        {copyList.map((item: any) => listItemRender(item))}
      </div>
    </div>
  );
};
export default ToggleList;
