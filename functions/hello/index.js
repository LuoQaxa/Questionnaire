const cloud = require("@cloudbase/node-sdk");

exports.main = async (event, context) => {
  const app = cloud.init({
    env: cloud.SYMBOL_CURRENT_ENV,
  });

  const db = app.database()
  const questionCollection = db.collection('question')  

  questionCollection.add({
    data: event
  })
  return {
    message: 'success'
  };
};
