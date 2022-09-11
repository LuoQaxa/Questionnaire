import React, { useEffect, useRef, useState } from "react";
import "./styles.css";
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

  const [loading, setLoading] = useState(false);
  const [lock, setLock] = useState(false);

  /** 随机设置分组 */
  useEffect(() => {
    const group = Math.random() > 0.5 ? groupA : groupB;
    setGroup(group);
  }, []);
  const getFloorInt = (num: number) => Math.floor(num / 10) * 10;

  const handleOver = () => {
    let result = Math.abs(LD - HU) <= 10;
    console.log(
      "handleOver",
      `Math.abs(${LD} - ${HU}) <= 10`,
      Math.abs(LD - HU),
      result
    );
    if (result) {
      const nextRound = group[round + 1];
      if (nextRound) {
        setLoading(true);
        setTimeout(() => {
          setRound(round + 1);
          setOptOne(defaultSS);
          setOptTwo(defaultLL);
          // init LD and HU
          setHU(500);
          setLD(0);
          firstCountRef.current = false;
          setLoading(false);
        }, 1000);
        result = false;
      } else {
        setOver(true);
      }
    }
    return result;
  };

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }

    const m = Math.abs((LD - HU) / 2);
    let nextOptTwo = 0;
    if (HU !== prevHU && lock) {
      console.log("hu changed");
      if (!firstCountRef.current) {
        firstCountRef.current = true;
        const m = Math.abs((LD - prevHU!) / 2);
        nextOptTwo = getFloorInt(optTwo + m);
      } else {
        console.log(`本次计算为${optTwo} + (${LD} - ${HU}) / 2`);
        nextOptTwo = getFloorInt(optTwo + m);
      }
      setOptTwo(nextOptTwo);
    }

    if (LD !== prevLD && lock) {
      firstCountRef.current = true;
      console.log("ld changed");
      console.log(`本次计算为${optTwo} - (${LD} - ${HU}) / 2`);
      nextOptTwo = getFloorInt(optTwo - m);
      setOptTwo(nextOptTwo);
    }
    handleOver();
    setLock(false);
  }, [HU, LD]);

  const onSelect = (option: number) => {
    if (lock || isOver) return;
    setLock(true);
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
      <div className="content">
        你通过银行的抽奖活动，获得了一次兑换现金奖励的机会。但是这需要你在两种类别的奖项里进行选择，两个奖项会在
        <span>不同的时间兑现，金额也并不相同</span>
        。所以请您在后续的选择中，做出你心中<span>理想的选择</span>
        。谢谢您的合作，我们将<span>不会获取您的个人信息</span>
        ，完成选择后的数据我们也将仅用于科学研究。感谢您的配合。
      </div>
      <div className="title">
        本次测试有{group.length}轮，当前为第{round + 1}轮
      </div>
      <p className="question">
        假设你购买了一个奖券并中奖，你可以在两种奖励当中选择一种：
      </p>
      {loading ? (
        <div>正在加载下一轮。。。</div>
      ) : (
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
      )}

      {isOver && <div className="over_content">恭喜你，完成问卷!</div>}
    </div>
  );
}
