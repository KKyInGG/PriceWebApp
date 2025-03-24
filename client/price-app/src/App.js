import React, { useState, useContext, useEffect } from "react";
import SearchBar from "./components/searchBar.js";
import StockChart from "./components/stockChart.js";
import ParamsEditor from "./components/paramsEditor.js";
import { WebSocketContext } from "./WebSocketProvider.js";
import loadingIcon from "./resources/loading-icon.gif"; 
import "./App.css";

const App = () => {
    const [selectedStock, setSelectedStock] = useState(null);
    const { latestStockData } = useContext(WebSocketContext); 
    const updatedStock = latestStockData ? latestStockData : selectedStock;
    const [isLoading, setIsLoading] = useState(false);

    // in case need to add loading
    // useEffect(() => {
    //     if (selectedStock) {
    //         setIsLoading(true);
    //         setTimeout(() => {
    //             setIsLoading(false);
    //         }, 400);
    //     }
    // }, [selectedStock]); 

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <div id="headerContainer">
                <h1 id="title">{"Search Your Stock"}</h1>
                <SearchBar onStockSelect={setSelectedStock} />
            </div>
            {isLoading ? (
                <img id="loading-icon" src={loadingIcon} alt="Loading..." />
            ) : (
                updatedStock && (
                    <>
                        <ParamsEditor stock={updatedStock} />
                        <StockChart stock={updatedStock} />
                    </>
                )
            )}
        </div>
    );
};

export default App;
