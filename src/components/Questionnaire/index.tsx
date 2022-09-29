import React, { useEffect, useRef, useState } from "react";
import "./styles.css";
import usePrevious from "./hooks/usePrevious";
import { Input, Button, Space, Modal } from "antd";
import Result from "./Result";
import Learn from "./Learn";
import { getApp } from "../../tcb";

type Props = {};

const groupA = [
  [0, 6],
  [6, 12],
  [0, 12],
];

const groupB = [
  [0, 4],
  [4, 12],
  [0, 12],
];

const defaultSS = 500;
const defaultLL = 1000;
let indifference = 0;
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
  const [profileId, setProfileId] = useState("");

  const [step, setStep] = useState(0);
  const resultRef = useRef({});

  const app = getApp();
  const addData = async (data: any) => {
    console.log("result", data);
    const res = await app.callFunction({
      name: "hello",
      data,
    });
  };
  // callFunction()

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
      indifference = Math.abs((LD + HU) / 2);
      setLoading(true);
    }
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
    const month = group[round][key];
    const monthWith = 43;
    const text = month ? `after ${month} months obtain ` : `now obtain `;
    return (
      <div
        style={{ left: monthWith * month }}
        className="option"
        onClick={() => onSelect(key)}
      >
        <span>{month}</span>
        <span>{`${text}`}</span>
        <span className="money">${key === 0 ? optOne : optTwo}</span>
      </div>
    );
  };
  const onLearnFinish = (step = 1) => {
    if (!profileId) {
      Modal.warning({
        title: "warning",
        content: "Please input your profileId",
      });
      return;
    }
    setStep(step);
  };
  const initRound = () => {
    setOptOne(defaultSS);
    setOptTwo(defaultLL);
    // init LD and HU
    setHU(500);
    setLD(0);
    firstCountRef.current = false;
  };
  /**
   * 下一轮
   */
  const onNextRound = async () => {
    const nextRound = group[round + 1];
    resultRef.current = {
      profileId,
      group: group[0][1] === 6 ? "A" : "B",
      ...resultRef.current,
      [`round${round}`]: indifference,
    };
    if (!nextRound) {
      await addData(resultRef.current);
      setOver(true);
      return;
    }
    setRound(round + 1);
    initRound();
    setLoading(false);
  };
  /**
   * 重新当前轮
   */
  const restartCurRound = () => {
    setRound(round);
    initRound();
    setLoading(false);
  };
  // 加两个按钮
  /**
   * 每轮结束后渲染对应的提示
   */
  const renderRoundConfirm = () => {
    const [one, two] = group[round];
    const oneTime = one === 0 ? "now" : `in ${one} months`;
    return (
      <div>
        {`Depending on your choice, getting $500 ${oneTime} and getting $${indifference} in ${two} months is indifferent for you. Do you agree with this statement? If you agree, click Agree, if not, then click Disagree and make your selection again. `}
        <Space>
          <Button onClick={restartCurRound}>Disagree</Button>
          <Button type="primary" onClick={onNextRound}>
            Continue
          </Button>
        </Space>
      </div>
    );
  };
  return (
    <div>
      <div className="content">
        You have been offered a chance to redeem a cash prize through the bank's
        sweepstakes, but this requires you to choose between two categories of
        prizes, each of which will be redeemable for{" "}
        <span>different amounts at different times</span>, so please choose the
        prize category that<span> best suits</span> you. All outcomes were
        <span> certain to occur</span> at the designated time. Your cooperation
        is greatly appreciated,
        <span> as we will not obtain your personal information </span> and only
        use it for scientific research after completing the selection process.
      </div>
      <div className="profile">
        please input your profile Id：
        <Input
          value={profileId}
          style={{ width: 300 }}
          onChange={(e) => setProfileId(e.target.value)}
        />
      </div>
      {step === 0 && <Learn onLearnFinish={onLearnFinish} />}
      {step === 1 && (
        <>
          <div className="title">
            The current round is the ({round + 1}/{group.length}) of three
            rounds in this test
          </div>
          <p className="question">
            Choosing between two rewards is up to you：
          </p>
          {loading ? (
            <div>{renderRoundConfirm()}</div>
          ) : (
            <div className="option_container">
              <div className="axle">
                <div className="axle_seps">
                  {[...new Array(13).keys()].map((item) => (
                    <div
                      style={{
                        height: group[round].includes(item) ? "40px" : "20px",
                        top: group[round].includes(item) ? "-40px" : "-20px",
                      }}
                      key={`${item}_separator`}
                      className="separator"
                    ></div>
                  ))}
                </div>
                {OptionItem(0)}
                {OptionItem(1)}
                <div
                  className="top_line"
                  style={{
                    left: (520 / 12) * group[round][0],
                    right: (520 / 12) * (12 - group[round][1]),
                  }}
                ></div>
              </div>
            </div>
          )}

          {isOver && (
            <Result
              text="The test has been completed, paste the following code into the original test"
              code="C7O3FZDA"
            />
          )}
        </>
      )}
      {step === 2 && (
        <Result
          text="The test has been completed, paste the following code into the
        original test"
          code="C2T39WDM"
        ></Result>
      )}
    </div>
  );
}
