import React, { createContext, useRef, useEffect, useState } from "react";
import socketIOClient from "socket.io-client";

export const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
    const [selectedStock, setSelectedStockState] = useState(null);  
    const [latestStockData, setLatestStockData] = useState(null);
    
    const socketRef = useRef(null);
    const selectedStockRef = useRef(null);

    useEffect(() => {
        if (!socketRef.current) {
            socketRef.current = socketIOClient("http://127.0.0.1:8080/");
            console.log("Client WebSocket initialized...");
            socketRef.current.on("stockUpdate", (data) => {
                setLatestStockData(data);
            });
            socketRef.current.on("disconnect", () => {
                console.log("Socket disconnected");
            });
        }

        const handleBeforeUnload = () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                console.log("Socket.IO disconnected on page refresh");
            }
        };

        // disconnect socketio when refresh page
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            handleBeforeUnload();
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);

    useEffect(() => {
        if (!selectedStock || !socketRef.current) return;
        socketRef.current.emit("subscribe", selectedStock);
    }, [selectedStock]);

    const setSelectedStock = (stock) => {
        setSelectedStockState(stock);
    };

    return (
        <WebSocketContext.Provider value={{ 
            latestStockData, 
            selectedStock: selectedStockRef.current, 
            setSelectedStock
        }}>
            {children}
        </WebSocketContext.Provider>
    );
};
