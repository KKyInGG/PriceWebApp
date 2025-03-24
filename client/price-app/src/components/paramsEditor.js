import React, { useState, useEffect } from "react";
import axios from "axios";
import "./paramsEditor.css"; 
import cancelIcon from "../resources/cancel-icon.png"; 
import confirmIcon from "../resources/confirm-icon.png"; 
import editIcon from "../resources/edit-icon.png"; 
import { ToastContainer, toast } from "react-toastify";

const ParamsEditor = ({ stock }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [drift, setDrift] = useState(stock.drift);
    const [volatility, setVolatility] = useState(stock.volatility);
    const [tempDrift, setTempDrift] = useState(stock.drift);
    const [tempVolatility, setTempVolatility] = useState(stock.volatility);
    const [date, setDate] = useState("");

    useEffect(() => {
        setIsEditing(false)
        setDrift(stock.drift)
        setVolatility(stock.volatility)
        setDate(stock.date)
    }, [stock])

    const handleEditClick = () => {
        setTempDrift(drift);
        setTempVolatility(volatility);
        setIsEditing(true);
    };

    const handleCancelClick = () => {
        setIsEditing(false);
    };
    const isFloat = (str) => {
        return !isNaN(str) && parseFloat(str).toString() === str.toString();
    };

    const handleConfirmClick = async () => {
        try {
            if(!isFloat(tempDrift)){
                toast.error("Drift should be a valid number!", { position: "top-right", autoClose: 1000 });
                return
            }
            if(!isFloat(tempVolatility)){
                toast.error("Volatility should be a valid number!", { position: "top-right", autoClose: 1000 });
                return
            }
            await axios.post(`http://localhost:5001/api/update`, {
                ticker: stock.ticker,
                drift: tempDrift,
                volatility: tempVolatility,
            });
            setDrift(tempDrift);
            setVolatility(tempVolatility);
            setIsEditing(false);
        } catch (error) {
            toast.error(error.response? error.response.data.error : error.message, { position: "top-right", autoClose: 1000 });
        }
    };

    return (
        <div className="edit-stock-container">
            <div className="params">
                <label>Date:</label>
                <span>{date}</span>
            </div>
            <div className="params">
                <label>Drift:</label>
                {isEditing ? (
                    
                    <input type="number" value={tempDrift} onChange={(e) => setTempDrift(e.target.value)} />
                ) : (
                    <span>{drift}</span>
                )}
            </div>
            <div className="params">
                <label>Volatility:</label>
                {isEditing ? (
                    <input type="number" value={tempVolatility} onChange={(e) => setTempVolatility(e.target.value)} />
                ) : (
                    <span>{volatility}</span>
                )}
            </div>
            <div className="buttons">
                {isEditing ? (
                    <>
                    <img 
                    src={confirmIcon}
                    alt="Confirm"
                    id="confirm-icon"
                    onClick={handleConfirmClick}
                />
                <img 
                    src={cancelIcon}
                    alt="Cancel"
                    id="cancel-icon"
                    onClick={handleCancelClick}
                />
                    </>
                ) : (
                    <img 
                    src={editIcon}
                    alt="Edit"
                    id="edit-icon"
                    onClick={handleEditClick}
                />
                )}
            </div>
            <ToastContainer />
        </div>
    );
};

export default ParamsEditor;
