# Price App Project
# Description

This web application provides real-time price updates for three specific stocks: AAPL US, GOOGL US, and MSFT US. Other stock symbols are not searchable. 
The real-time price updates are available for 24 hours after the market opens and will reset at the start of the next trading day. 
Additionally, an edit button allows users to adjust volatility and drift parameters to determine the stock's next price using the GBM formula.

## Installation & SetUp

Ensure the following installed:
1. Node.js
2. npm
3. nodemon

Clone the repository to your local destination using
### `git clone https://github.com/your-username/your-repo.git`
### `cd PriceWebApp`

In the project server folder , you can run
### `cd server`
### `npx nodemon server.js`

to intialize your backend

In the project client/price-app folder , you can run
### `cd ../client/price-app`
### `npm start`

to intialize your frontend

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

