import React, { useEffect, useRef, useState } from "react";
import "./index.scss";
import usePrevious from "./hooks/usePrevious";

type Props = {};

const groupA = [
  [8, 16],
  [16, 24],
  [24, 32],
  [8, 32],
];

const groupB = [
  [1, 6],
  [6, 14],
  [14, 25],
  [1, 25],
];

const defaultSS = 500;
const defaultLL = 1000;

export default function Questionnaire({}: Props) {
  const [optOne, setOptOne] = useState(defaultSS);
  const [optTwo, setOptTwo] = useState(defaultLL);

  const [group, setGroup] = useState(groupA);
  const [round, setRound] = useState(0);

  const [HU, setHU] = useState(500);
  const prevHU = usePrevious(HU);
  const [LD, setLD] = useState(0);
  const prevLD = usePrevious(LD);

  const mountedRef = useRef(false);
  const firstCountRef = useRef(false);

  const [isOver, setOver] = useState(false);

  /** 随机设置分组 */
  useEffect(() => {
    const group = Math.random() > 0.5 ? groupA : groupB;
    setGroup(group);
  }, []);
  const getFloorInt = (num: number) => Math.floor(num / 10) * 10;

  const handleOver = () => {
    let result = Math.abs(LD - HU) <= 10;
    if (result) {
      const nextRound = group[round + 1];
      if (nextRound) {
        setRound(round + 1);
        setOptOne(defaultSS);
        setOptTwo(defaultLL);
        result = false;
      } else {
        setOver(true);
      }
    }
    return result;
  };

  useEffect(() => {
    console.log(mountedRef.current);
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    console.log("useEffect");

    const m = Math.abs((LD - HU) / 2);
    let nextOptTwo = 0;
    if (HU !== prevHU) {
      //
      if (!firstCountRef.current) {
        firstCountRef.current = true;
        const m = Math.abs((LD - prevHU!) / 2);
        nextOptTwo = getFloorInt(optTwo + m);
      } else {
        console.log(`本次计算为${optTwo} + (${LD} - ${HU}) / 2`);
        nextOptTwo = getFloorInt(optTwo + m);
      }
    }
    if (LD !== prevLD) {
      console.log(`本次计算为${optTwo} - (${LD} - ${HU}) / 2`);
      nextOptTwo = getFloorInt(optTwo - m);
    }
    setOptTwo(nextOptTwo);
  }, [HU, LD]);

  const onSelect = (option: number) => {
    if (handleOver()) return;
    if (option === 0) {
      setHU(optTwo);
    }
    if (option === 1) {
      setLD(optTwo);
    }
  };
  const OptionItem = (key: number) => {
    return (
      <div className="option" onClick={() => onSelect(key)}>
        <span>{`${group[round][key]}个月后获得`}</span>
        <div className="option_box">{key === 0 ? optOne : optTwo}</div>
      </div>
    );
  };
  return (
    <div>
      <div>
        本次测试有{group.length}轮，当前为第{round + 1}轮
      </div>
      <p>假设你购买了一个奖券并中奖，你可以在两种奖励当中选择一种：</p>
      <div className="option_container">
        {Math.random() > 0.5 ? (
          <>
            {OptionItem(0)}
            {OptionItem(1)}
          </>
        ) : (
          <>
            {OptionItem(1)}
            {OptionItem(0)}
          </>
        )}
      </div>
      {isOver && <div>完成问卷</div>}
    </div>
  );
}
