import React, { useState, useContext, useRef} from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./searchBar.css"
import searchIcon from "../resources/search-icon.png"; 
import { WebSocketContext } from "../WebSocketProvider.js"; 


const SearchBar = ({onStockSelect}) => {
    const [query, setQuery] = useState("");
    const currentQuery = useRef("");
    const {setSelectedStock} = useContext(WebSocketContext); 
    

    const handleSearch = async () => {
        if (!query.trim()){
            toast.error("Please enter search text!")
            return
        } 
        try {
            const response = await axios.get(`http://localhost:5001/api/search?query=${query}`);
            // update data
            if (onStockSelect) onStockSelect(response.data);
            // let socket to subscribe ticker
            setSelectedStock(response.data.ticker)
            currentQuery.current = query
        } catch (error) {
            console.log(error)
            toast.error(error.response? error.response.data.error : error.message, { position: "top-right", autoClose: 1000 });

        }
    };
    const handleKeyPress = (event) => {
      if(event.key === "Enter"){
        handleSearch();
      }
    };

    return (
        <div id="search-container">
            <input
                id="search-input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter stock ticker"
                onKeyDown={handleKeyPress}
            />
             <img 
                src={searchIcon}
                alt="Search"
                id="search-icon"
                onClick={handleSearch}
            />
            <ToastContainer />
        </div>
    );
};

export default SearchBar;
