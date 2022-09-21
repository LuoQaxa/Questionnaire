// 学习轮
import React, { useState } from "react";
import "./styles.css";

interface LearnProps {
  onLearnFinish: (step?: number) => void;
}
const group = [0, 6];
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
            {[...new Array(13).keys()].map((item) => (
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
              left: (520 / 12) * group[0],
              right: (520 / 12) * (12 - group[1]),
            }}
          ></div>
        </div>
      </div>
    );
  };
  const OptionItem = (key: number, options = { optOne: 35, optTwo: 550 }) => {
    const month = group[key];
    const { optOne, optTwo } = options;
    const monthWith = 43;
    const text = month ? `after ${month} months obtain ` : `now obtain `;
    return (
      <div
        style={{ left: monthWith * month }}
        className="option"
        onClick={() => onSelect()}
      >
        <span>{month}</span>
        <span>{`${text}`}</span>
        <span className="money">${key === 0 ? optOne : optTwo}</span>
      </div>
    );
  };
  return (
    <div>
      <div>
        Before the experiment starts, please complete the following training
        test. From today to next year, the intervals 0-12 below represent the 12
        months, each cell representing one month, and you will have to choose
        the lottery ticket corresponding to each delay. For example, the choice
        below is between getting $35 immediately and getting $550 in 6 weeks.
        You can click on the option.
      </div>
      {renderQuestion()}
      {selectNum >= 1 && (
        <>
          <div>
            After making the first choice, you will then make a second choice.
            The time interval does not change, but the amount of the lottery
            ticket changes. And you will need to make multiple choices in each
            round until the calculation stops (which won't take long). There are
            three rounds in the experiment.
          </div>
          {renderQuestion({ optOne: 35, optTwo: 450 })}
          <div>
            Click continue if you understand what you are about to do. Click
            exit if you are confused or don't want to proceed.
            <button
              onClick={() => {
                onLearnFinish(2);
              }}
              style={{ marginRight: 10 }}
            >
              Exit{" "}
            </button>
            <button
              onClick={() => {
                onLearnFinish();
              }}
            >
              Continue{" "}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Learn;
