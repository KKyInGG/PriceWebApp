import React, { useEffect, useState, useMemo} from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const StockChart = ({stock}) => {
    const [priceData, setPriceData] = useState(new Array(1440).fill(null));

    useEffect(() => {
        if (!stock || !stock.prices) return;
        setPriceData(stock.prices);
    }, [stock]);

    const labels = useMemo(() => {
        const startTime = new Date();
        startTime.setHours(9, 30, 0, 0);
    
        return Array.from({ length: 1440 }, (_, i) => {
            const time = new Date(startTime);
            time.setMinutes(startTime.getMinutes() + i); 
            return time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
        });
    }, []);
    

    const data = useMemo(() => ({
        labels,
        datasets: [
            {
                label: stock?.ticker || "Stock",
                data: priceData,
                borderColor: "blue",
                backgroundColor: "rgba(0, 0, 255, 0.2)",
                borderWidth: 1.5,
                pointRadius: 2.5, 
                pointHoverRadius: 5, 
                pointBorderWidth: 1,
                pointBackgroundColor: "blue",
                tension: 0.2, 
                spanGaps: true,
            },
        ],
    }), [priceData, stock]);

    const options = useMemo(() => ({
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                enabled: true,
                mode: "index",
                intersect: false,
            },
        },
        scales: {
            x: {
                title: { display: true, text: "Time" },
                ticks: {
                    maxTicksLimit: 8,
                },
            },
            y: {
                title: { display: true, text: "Price" },
                ticks: {
                    maxTicksLimit: 6,
                },
            },
        },
        animation: {
            duration: 0
        },
    }), []);

    return (<Line data={data} options={options} />);
};

export default StockChart;
