import { ChangeEvent, FC, useEffect, useState } from "react";
import { IArgs, getCurrencies } from "../../api/getCurrencies";
import Chart from "./Chart";
import "./Charts.css";

export type currenciesType = "eur" | "usd" | "cny";

interface IMapValue {
  rub?: number;
}

interface ICurrenciesValue {
  isChecked: boolean;
}

export interface ICurrencies {
  eur: ICurrenciesValue;
  usd: ICurrenciesValue;
  cny: ICurrenciesValue;
}

type mapType = Map<string, IMapValue>;

export interface IData {
  eur: mapType;
  usd: mapType;
  cny: mapType;
}

const Charts: FC = () => {
  const [count, setCount] = useState(0);
  const [startDate, setStartDate] = useState<string>(
    new Date(new Date().setDate(new Date().getDate() - 6))
      .toISOString()
      .split("T")[0]
  );
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [currencies, setCurrencies] = useState<ICurrencies>({
    eur: {
      isChecked: false,
    },
    usd: {
      isChecked: false,
    },
    cny: {
      isChecked: false,
    },
  });

  const [data, setData] = useState<IData>({
    eur: new Map(),
    usd: new Map(),
    cny: new Map(),
  });

  useEffect(() => {
    Object.entries(currencies).forEach(([key, value]) => {
      const { isChecked } = value as ICurrenciesValue;
      const type = key as currenciesType;
      if (isChecked) {
        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();
        const arrForGetCurrencies: IArgs[] = [];
        for (let date = start; date <= end; date += 86400000) {
          const convertDate = new Date(date).toISOString().split("T")[0];
          if (data[type].has(convertDate)) continue;
          arrForGetCurrencies.push({
            type,
            date: convertDate,
          });
        }
        Promise.allSettled(
          arrForGetCurrencies.map((value) => getCurrencies(value))
        )
          .then((res) =>
            res.forEach((item, i) => {
              setData({
                ...data,
                [type]: data[type].set(arrForGetCurrencies[i].date, {
                  rub: item.status === "fulfilled" ? item.value.rub : undefined,
                }),
              });
            })
          )
          .finally(() => setCount((prev) => prev + arrForGetCurrencies.length));
      }
    });
  }, [currencies, startDate, endDate]);

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value as currenciesType;
    setCurrencies({
      ...currencies,
      [value]: {
        ...currencies[value],
        isChecked: !currencies[value].isChecked,
      },
    });
  };

  const handleStartDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedStartDate = event.target.value;
    const start = Math.min(
      new Date(selectedStartDate).getTime(),
      new Date(endDate).getTime()
    );
    setStartDate(new Date(start).toISOString().split("T")[0]);
  };

  const handleEndDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedEndDate = event.target.value;
    const end = Math.max(
      Math.min(new Date(selectedEndDate).getTime(), new Date().getTime()),
      new Date(startDate).getTime()
    );
    setEndDate(new Date(end).toISOString().split("T")[0]);
  };

  return (
    <div className="wrapper">
      <div className="left">
        <div className="checkbox">
          <label>
            <input
              type="checkbox"
              value="eur"
              checked={currencies.eur.isChecked}
              onChange={handleCheckboxChange}
            />
            Евро
          </label>
          <label>
            <input
              type="checkbox"
              value="usd"
              checked={currencies.usd.isChecked}
              onChange={handleCheckboxChange}
            />
            Доллар
          </label>
          <label>
            <input
              type="checkbox"
              value="cny"
              checked={currencies.cny.isChecked}
              onChange={handleCheckboxChange}
            />
            Юань
          </label>
        </div>
        <div className="date-picker">
          <label>
            Start Date:
            <input
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
            />
          </label>

          <label>
            End Date:
            <input type="date" value={endDate} onChange={handleEndDateChange} />
          </label>
        </div>
        <div>число запросов API: {count}</div>
      </div>
      <Chart
        currencies={data}
        startDate={startDate}
        endDate={endDate}
        checkbox={currencies}
      />
    </div>
  );
};

export default Charts;
