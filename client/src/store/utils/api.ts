import { Answers } from "../../types";
import { store } from "../index";

export const API_URL =
  "https://eekguocox7.execute-api.us-east-1.amazonaws.com/dev";

const ANSWERS_API = `${API_URL}/answers`;

const getHeaders = () => {
  const token = store.getState().user.token;

  const headers = new Headers({
    Authorization: `Bearer ${token}`,
  });

  return headers;
};

export const getAnswers = async (questionId: string): Promise<Answers> => {
  const response = await fetch(`${ANSWERS_API}/${questionId}`, {
    headers: getHeaders(),
  });

  const answers: Answers = await response.json();

  return answers;
};
