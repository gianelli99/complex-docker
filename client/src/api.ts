import axios from "axios";

export const fetchValues = () => {
  return axios.get("/api/values/current");
};

export const fetchIndexes = () => {
  return axios.get<Array<{ number: string }>>("/api/values/all");
};

export const sendIndex = (index: string) => {
  return axios.post("/api/values", {
    value: index,
  });
};
