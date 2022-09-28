const cloud = require("@cloudbase/node-sdk");

exports.main = async (event, context) => {
  const app = cloud.init({
    env: cloud.SYMBOL_CURRENT_ENV,
  });

  const db = app.database()
  const questionCollection = db.collection('question')  

  // todo
  // your code here
  questionCollection.add({
    data: {
      name: 'luoqian'
    }
  })
  return {
    event,
    message: 'hello world'
  };
};
