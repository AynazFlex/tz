import { FC } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { ICurrencies, IData, currenciesType } from "./Charts";
import "./Charts.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom" as const,
    },
    title: {
      display: true,
      text: "График валют",
    },
  },
};

interface IProps {
  currencies: IData;
  startDate: string;
  endDate: string;
  checkbox: ICurrencies;
}

const Chart: FC<IProps> = ({ currencies, startDate, endDate, checkbox }) => {
  const labels: string[] = [];

  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  for (let date = start; date <= end; date += 86400000) {
    const convertDate = new Date(date).toISOString().split("T")[0];
    labels.push(convertDate);
  }

  const setData = (type: currenciesType) => {
    if (!checkbox[type].isChecked) return [];
    return labels.map((label) => currencies[type].get(label)?.rub);
  };

  const data = {
    labels,
    datasets: [
      {
        label: "eur",
        data: setData("eur"),
        borderColor: "red",
        backgroundColor: "red",
      },
      {
        label: "usd",
        data: setData("usd"),
        borderColor: "green",
        backgroundColor: "green",
      },
      {
        label: "cny",
        data: setData("cny"),
        borderColor: "blue",
        backgroundColor: "blue",
      },
    ],
  };

  return (
    <div className="line">
      <Line options={options} data={data} />
    </div>
  );
};

export default Chart;
