import tcb from "@cloudbase/js-sdk";

export const getApp = () => {
  const app = tcb.init({
    env: 'hello-cloudbase-0g4f2zq6cc46138b',
    region: "ap-shanghai",
  });

  return app;
};
