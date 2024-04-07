import axios from "axios";

type currenciesType = "eur" | "usd" | "cny";

export interface IArgs {
  type: currenciesType;
  date: string;
}

interface IRub {
  rub: number;
}

interface IData {
  date: string;
  eur?: IRub;
  usd?: IRub;
  cny?: IRub;
}

export const getCurrencies = async ({ type, date }: IArgs) => {
  const { data } = await axios.get<IData>(
    `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${date}/v1/currencies/${type}.json`
  );
  return {
    date: data.date,
    rub: data[type]?.rub,
  };
};
