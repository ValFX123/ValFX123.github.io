require('dotenv').config();

const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);

// Add at the top
const { MongoClient } = require('mongodb');

// MongoDB connection string
const mongoUri = "mongodb+srv://damskobot:8AmTQYAk3UrqChhm@damskobot.27lzu.mongodb.net/?retryWrites=true&w=majority&appName=damskobot";

// Update the payment processing endpoint
app.post('/process-payment', async (req, res) => {
    try {
        // ... existing PayPal code ...
        
        if (response.result.status === 'COMPLETED') {
            const transactionId = response.result.id;
            const amount = response.result.purchase_units[0].amount.value;
            const currency = response.result.purchase_units[0].amount.currency_code;
            const service = req.body.serviceName;
            
            // Save to MongoDB
            const client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
            
            try {
                await client.connect();
                const database = client.db("valfx");
                const orders = database.collection("orders");
                
                const orderDoc = {
                    transactionId: transactionId,
                    service: service,
                    amount: parseFloat(amount),
                    currency: currency,
                    status: "completed",
                    date: new Date()
                };
                
                const result = await orders.insertOne(orderDoc);
                console.log(`Order saved with ID: ${result.insertedId}`);
            } finally {
                await client.close();
            }
            
            res.status(200).json({ 
                success: true,
                transactionId: transactionId
            });
        }
        // ... rest of code ...
    } catch (error) {
        // ... error handling ...
    }
});

const express = require('express');
const paypal = require('@paypal/checkout-server-sdk');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// PayPal configuration
const clientId = 'AT0hiVJ7UQB6Uo5oSy1OfeOI-qbQapVYJP-clLzvxYsu3Fp0VjuDmK1-HeNlTdZwoe2LU98i1PFejPJk';
const clientSecret = 'EHt9MGA6DoaB6OcaXSZ9Cc1oaBgDhh1hz_plYAfgeWXfvOohbT8OkmXD6wOx9z1vlDp3L7wX14b8VnyD';

// Use Sandbox for testing, switch to LiveEnvironment for production
const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
const client = new paypal.core.PayPalHttpClient(environment);

// Payment processing endpoint
app.post('/process-payment', async (req, res) => {
    try {
        const { orderID } = req.body;
        
        if (!orderID) {
            return res.status(400).json({ error: 'Order ID is required' });
        }
        
        // Capture the order
        const request = new paypal.orders.OrdersCaptureRequest(orderID);
        request.requestBody({});
        
        const response = await client.execute(request);
        
        if (response.result.status === 'COMPLETED') {
            // Payment successful - save to database
            const transactionId = response.result.id;
            const amount = response.result.purchase_units[0].amount.value;
            const currency = response.result.purchase_units[0].amount.currency_code;
            const service = req.body.serviceName; // Added service name
            
            console.log(`Payment completed: ${transactionId}, Amount: ${amount} ${currency}`);
            
            // Here you would save to your databasecd
            // saveToDatabase(transactionId, amount, currency, service);
            
            res.status(200).json({ 
                success: true,
                transactionId: transactionId,
                amount: amount,
                currency: currency
            });
        } else {
            res.status(400).json({ error: 'Payment not completed' });
        }
    } catch (error) {
        console.error('Payment processing error:', error);
        res.status(500).json({ error: 'Server error processing payment' });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});