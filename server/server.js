const express = require('express')
const http = require('http')
const cors = require('cors');

const app = express()
const PORT = process.env.PORT || 5001;
const SOCKETPORT = 8080;

const {Server} = require('socket.io')
const stockManager = require('./StockManager');
const httpServer = http.createServer(app)
const socketServer = new Server( httpServer, {
    cors:{
        origin: "*"
    }
})

app.use(cors());
app.use(express.json());

app.get("/api/search", (req, res) => {
    const name = req.query.query?.toUpperCase();
    const stock = stockManager.updateStockPrice(name);
    if(!stock){
        return res.status(404).json({error: "Stock not found!"})
    }
    return res.status(200).json(stock);
})

function updateStock(socket, subscriptions){
    console.log("Emit " + socket.id + " " + subscriptions[socket.id] + " at " + new Date());
    const updatedStock = stockManager.updateStockPrice(subscriptions[socket.id]);
    socket.emit("stockUpdate", updatedStock);
}

app.post("/api/update",(req, res) => {
    const updatedStock = stockManager.setStockParams(req.body);
    if(!updatedStock){
        return res.status(404).json({error: "Stock not found!"})
    }
    if(updatedStock.error){
        return res.status(400).json({error: updatedStock.error})
    }
    return res.status(201).json({
        ticker: updatedStock.ticker,
        drift: updatedStock.drift,
        volatility: updatedStock.volatility});
})

let subscriptions = new Map();
socketServer.on("connection", (socket) => {

    console.log("Socket Server Connect Intitialize...")   

    const getMsUntilNextMinute = () => {
        const now = new Date();
        const nextMinute = new Date(now);
        nextMinute.setSeconds(0, 0); 
        nextMinute.setMinutes(now.getMinutes() + 1);
        return nextMinute - now; 
    };

    let millionSeconds = 0;
 

    socket.on("subscribe", (stock) => {
        console.log(`Client ${socket.id} subscribed to : ${stock}`);
        subscriptions[socket.id] = stock;
        updateStock(socket, subscriptions);
        millionSeconds = getMsUntilNextMinute();
        global.setTimeout(() => {
                updateStock(socket, subscriptions);
            setInterval(() => {
                updateStock(socket, subscriptions);
            }, 60000)}, 
        millionSeconds)
    });

    socket.on("unsubscribe", () => {
        if (subscriptions.has(socket.id)) {
            console.log(`Client ${socket.id} unsubscribed from ${subscriptions.get(socket.id)}`);
            subscriptions.delete(socket.id);
        }
    });
    
    socket.on("disconnect", () => {
        console.log(`Client Disconnected: ${socket.id}`);
        subscriptions = new Map();
    });

})

app.listen(PORT, () => {
    console.log(`Server running on http://127.0.0.1:${PORT}`);
});
httpServer.listen(SOCKETPORT, () => {
    console.log(`Socket Server running on http://127.0.0.1:${SOCKETPORT}`);
})