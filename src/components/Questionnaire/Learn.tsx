// 学习轮
import React, { useState } from "react";
import { Button } from "antd";
import "./styles.css";
import { gridWidth } from './index'

interface LearnProps {
  onLearnFinish: (step?: number) => void;
}
const group = [1, 10];
const Learn: React.FC<LearnProps> = (props) => {
  const { onLearnFinish } = props;
  const [selectNum, setSelectNum] = useState(0);
  const onSelect = () => {
    setSelectNum(selectNum + 1);
  };
  const renderQuestion = (options?: any) => {
    return (
      <div className="option_container">
        <div className="axle">
          <div className="axle_seps">
            {[...new Array(29).keys()].map((item) => (
              <div
                style={{
                  height: group.includes(item) ? "40px" : "20px",
                  top: group.includes(item) ? "-40px" : "-20px",
                }}
                key={`${item}_separator`}
                className="separator"
              ></div>
            ))}
          </div>
          {OptionItem(0, options)}
          {OptionItem(1, options)}
          <div
            className="top_line"
            style={{
              left: gridWidth * group[0],
              right: gridWidth * (28 - group[1]),
            }}
          ></div>
        </div>
      </div>
    );
  };
  const OptionItem = (key: number, options = { optOne: 35, optTwo: 550 }) => {
    const month = group[key];
    const { optOne, optTwo } = options;
    const monthWith = gridWidth;
    const text = month ? `第 ${month} 天获得 ` : `立即获得 `;
    return (
      <div
        style={{ left: monthWith * month }}
        className="option"
        onClick={() => onSelect()}
      >
        <span className="triangle"></span>
        <span>{`${text}`}</span>
        <span className="money">{key === 0 ? optOne : optTwo}</span>
      </div>
    );
  };
  return (
    <div>
      <div>
        实验开始前，请完成以下训练测试。从今天到明年，
        <span>下面的区间0-28代表28天，每个小格代表一个天</span>，
        你需要选择每一个延迟对应的兑换金额。例如，下面的选择是1天后得到35元和10天后得到550元。您现在需要单击您的选择
      </div>
      {renderQuestion()}
      {selectNum >= 1 && (
        <>
          <div style={{ marginTop: 130 }}>
            在做出第一个选择之后，你会做出下一个选择。
            <span>每轮时间间隔没有改变，但是奖金的金额改变了</span>。
            你需要在下一轮中做出多个选择，直到计算停止(不会花很长时间)。这个实验有6轮。
          </div>
          {renderQuestion({ optOne: 35, optTwo: 450 })}
          <div style={{ marginTop: 130 }}>
            如果您明白了您要做的选择，请单击继续。如果您感到困惑或不想继续进行，请单击退出。
            <Button
              onClick={() => {
                onLearnFinish(2);
              }}
              style={{ marginRight: 10 }}
            >
              退出
            </Button>
            <Button
              type="primary"
              onClick={() => {
                onLearnFinish();
              }}
            >
              继续
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Learn;
