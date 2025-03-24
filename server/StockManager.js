const fs = require('fs');
const path = require('path');
const Stock = require('./models/Stock');
const DATA_FOLDER = path.join(__dirname, 'data');

class StockManager {
    
    constructor(){
        if (!StockManager.instance) {
            this.stocks = {};
            this.loadAllStocks();
        }
        return StockManager.instance;
    }

    loadAllStocks(){
        if (fs.existsSync(DATA_FOLDER)) {
            const files = fs.readdirSync(DATA_FOLDER);
            files.forEach(file => {
                if (file.endsWith('.json')) {
                    const ticker = file.replace('.json', '');
                    this.stocks[ticker] = this.loadStock(ticker);
                }
            });
    
        }
    }

    checkStockExist(ticker){
        return ticker in this.stocks;
    }

    getStockInfo(ticker){
        if(!this.checkStockExist(ticker)){
            return None;
        }
        return this.stocks[ticker]
    }

    updateStockPrice(ticker){
        if(!this.checkStockExist(ticker)){
            return null;
        }
        let stock = this.stocks[ticker];
        stock.addPrice();
        return stock.toJSON();
    }

    setStockParams(reqBody){
        let ticker = reqBody.ticker;

        if(!this.checkStockExist(ticker)){
            return None
        }

        const isFloat = (str) => {
            return !isNaN(str) && parseFloat(str).toString() === str.toString();
        };

        let currentStock = this.stocks[ticker]
        if("drift" in reqBody){
            if(isFloat(reqBody.drift)){
                currentStock.setDrift(parseFloat(reqBody.drift))
            }
            else{
                return {error: "Drift should be a valid number!"}
            }
        }
        if ("volatility" in reqBody){
            if(isFloat(reqBody.volatility)){
                currentStock.setVolatility(parseFloat(reqBody.volatility))
            }
            else{
                return {error: "Volatility should be a valid number!"}
            }
        }
        console.log("After update " + currentStock.ticker + " D: " + currentStock.drift + 
        " V: " + currentStock.volatility)
        return currentStock;
    }

    loadStock(ticker) {
        const filePath = path.join(DATA_FOLDER, `${ticker}.json`);
        if (fs.existsSync(filePath)) {
            const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            return Stock.fromJSON(ticker, jsonData);
        }
        return None;
    }

}
const stockManagerInstance = new StockManager();
Object.freeze(stockManagerInstance); 
module.exports = stockManagerInstance;