import React, { useEffect, useRef, useState } from "react";
import "./styles.css";
import usePrevious from "./hooks/usePrevious";
import { Input, Button, Space, Modal } from "antd";
import Result from "./Result";
import Learn from "./Learn";
import { getApp } from "../../tcb";
import { createCode } from "./createCode";

type Props = {};

const groupA = [
  [7, 14, 1000],
  [14, 21, 1000],
  [21, 28, 1000],
  [7, 21, 1500],
  [14, 28, 1500],
  [7, 28, 2000],
];

const groupB = [
  [7, 10, 720],
  [10, 16, 930],
  [16, 28, 1360],
  [7, 16, 1080],
  [10, 28, 1790],
  [7, 28, 2000],
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
  const [llDisabled, setLlDisabed] = useState(false);
  const [isSubmiting, setIsSubmit] = useState(false);
  const [resultCode, setCode] = useState("");
  const resultRef = useRef({});

  const app = getApp();
  const addData = async (data: any) => {
    console.log("result", data);
    const res = await app.callFunction({
      name: "hello",
      data,
    });
  };

  /** 随机设置分组 */
  useEffect(() => {
    const group = Math.random() > 0.5 ? groupA : groupB;
    setGroup(group);
    setOptTwo(group[round][2]);
  }, []);
  const getFloorInt = (num: number) => Math.floor(num / 10) * 10;

  const maxLimitWarn = () => {
    Modal.warn({
      content: "你选择的数量不能超过$3000",
    });
  };
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
      setLlDisabed(false);
      // 大于indiff提示，并且禁选LL
      if (indifference > 2945) {
        setLlDisabed(true);
        maxLimitWarn();
        return;
      }
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
    if (key === 1 && llDisabled) {
      maxLimitWarn();
    }
    const month = group[round][key];
    const monthWith = 18.5;
    const text = month ? `第 ${month} 天 获得 ` : `立即获得 `;
    return (
      <div
        style={{ left: monthWith * month }}
        className="option"
        onClick={() => onSelect(key)}
      >
        <span>{month}</span>
        <span>{`${text}`}</span>
        <span className="money">{key === 0 ? optOne : optTwo}</span>
      </div>
    );
  };
  const onLearnFinish = (step = 1) => {
    if (!profileId && step === 1) {
      Modal.warning({
        title: "警告",
        content: "请输入你刚才复制的值",
      });
      return;
    }
    setStep(step);
  };
  const initRound = () => {
    setOptOne(defaultSS);
    // 初始化每一轮的LL
    setOptTwo(group[round][2]);
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
      if (isSubmiting) return;
      setIsSubmit(true);
      const code = createCode();
      setCode(code);
      await addData({
        code,
        ...resultRef.current,
      });
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
    return (
      <div>
        {`根据你的选择，${one}天后得到500元和 ${two}天后得到${indifference}元对你来说是几乎一样的。你同意这种说法吗?如果您同意，则单击同意，如果不同意，则单击不同意并再次进行选择。`}
        <Space>
          <Button onClick={restartCurRound}>不同意</Button>
          <Button type="primary" onClick={onNextRound}>
            同意
          </Button>
        </Space>
      </div>
    );
  };
  return (
    <div>
      <div className="content">
        您通过银行的抽奖活动获得了兑换现金的权益，但这需要您在两类奖券中进行选择，
        每一类奖券在<span>不同的时间可兑换不同的金额</span>，因此请选择
        <span>最适合</span>您的奖券类别。 所有的结果都一定会在
        <span>指定的时间</span>发生。
        <span>非常感谢您的合作，我们不会获取您的个人信息</span>
        ，只会在完成筛选过程后用于科学研究。
      </div>
      <div className="profile">
        请输入您刚才复制的数值：
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
            现在是6轮决策中的（({round + 1}/{group.length}) 轮
          </div>
          <p className="question">请在一下两种奖励中进行选择：</p>
          {loading ? (
            <div>{renderRoundConfirm()}</div>
          ) : (
            <div className="option_container">
              <div className="axle">
                <div className="axle_seps">
                  {[...new Array(29).keys()].map((item) => (
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
                    left: (520 / 28) * group[round][0],
                    right: (520 / 28) * (28 - group[round][1]),
                  }}
                ></div>
              </div>
            </div>
          )}

          {isOver && (
            <Result
              text="测试已经结束，请将以下代码粘贴到原始测试中"
              code={resultCode}
            />
          )}
        </>
      )}
      {step === 2 && (
        <Result
          text="测试已经结束，请将以下代码粘贴到原始测试中"
          code={"C2T39WDM"}
        ></Result>
      )}
    </div>
  );
}
