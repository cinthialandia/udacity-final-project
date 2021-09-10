export const getQuestionId = (date: Date) => {
  const dateMonth = date.getMonth() + 1;
  const dateDay = date.getDate();
  const questionId = `d${dateDay}-m${dateMonth}`;

  return questionId;
};
