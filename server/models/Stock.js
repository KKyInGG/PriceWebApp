const fs = require('fs');
const path = require('path');

class Stock{
    constructor(ticker, open, drift, volatility, prices, lastEndIndex, date){
        this.ticker = ticker
        this.open = parseFloat(open)
        this.drift = parseFloat(drift)
        this.volatility = parseFloat(volatility)
        this.prices = prices.length == 0 ?  new Array(1440).fill(null) : prices
        this.prices[0] = this.open
        this.date = date
        this.lastEndIndex = lastEndIndex || 0
        this.addPrice()
    }

    setDrift(drift){
        this.drift = drift
        this.saveToJSON()
    }

    setVolatility(volatility){
        this.volatility = volatility
        this.saveToJSON()
    }


    getTodayDate(marketOpen){
        return marketOpen.toISOString().split('T')[0];
    }

    addPrice(){
        let now = new Date(); 
        let marketOpen = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 30, 0, 0);
        if(now < marketOpen){
            const yesterday = new Date(now);
            yesterday.setDate(now.getDate() - 1);
            marketOpen = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 9, 30, 0, 0);
        }


        let point = Math.floor((now - marketOpen) / 60000);
        const marketOpenDate = this.getTodayDate(marketOpen)
        if(this.date !== marketOpenDate){
            console.log("Reseting backend data...");
            this.resetData(marketOpenDate)
        }

        if(point <= 1439 && point >= 0 && this.prices[point] === null){
            console.log("Add price " + this.ticker + " D: " + this.drift + " V: " + this.volatility)
            for(let i = this.lastEndIndex + 1; i <= point; i++){
                let prevPrice = parseFloat(this.prices[i - 1])
                let nextPrice = parseFloat(this.getNextPrice(prevPrice).toFixed(2))
                this.prices[i] = nextPrice
            }
            this.lastStartIndex = this.lastEndIndex + 1
            this.lastEndIndex = point
            this.saveToJSON();
        }
    }

    getNextPrice(currentPrice){
        const Z = Math.random() * 2 - 1; 
        const dt = 1 / 390;
        const exponent = (this.drift - 0.5 * this.volatility ** 2) * dt + this.volatility * Math.sqrt(dt) * Z;
        return currentPrice * Math.exp(exponent)
    }

    resetData(date){
        console.log("reset data")
        this.date = date
        this.prices = new Array(1440).fill(null)
        this.prices[0] = this.open
        this.lastEndIndex = 0
        this.saveToJSON();
    }

    toJSON() {
        return {
            ticker: this.ticker,
            open: this.open,
            drift: this.drift,
            volatility: this.volatility,
            prices: this.prices,
            date: this.date,
            lastEndIndex: this.lastEndIndex
        };
    }

    saveToJSON() {
        const filePath = path.join(path.dirname(__dirname), 'data', `${this.ticker}.json`);
        fs.writeFileSync(filePath, JSON.stringify(this.toJSON(), null, 2), 'utf8');
    }

    static fromJSON(ticker, jsonData) {
        const stock = new Stock(
            ticker, 
            jsonData.open, 
            jsonData.drift, 
            jsonData.volatility,
            jsonData.prices,
            jsonData.lastEndIndex,
            jsonData.date
        );
        return stock;
    }

}

module.exports = Stock;