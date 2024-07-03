const express = require('express');  // Import the express module
const app = express();  // Create an instance of an Express app

// Middleware for handling JSON
app.use(express.json());

// Initialize an empty array to store items
let items = [];
let currentId = 1;

// Root route
app.get('/', (req, res) => {
    res.send('Welcome User!');
});

// Create Operation: POST route to add a new item
app.post('/api/items', (req, res) => {
    const newItem = {
        id: currentId++,
        ...req.body
    };
    items.push(newItem);
    res.status(201).json(newItem);
});

// Read Operation: GET route to list all items
app.get('/api/items', (req, res) => {
    res.json(items);
});

// Read Operation: GET route to retrieve a single item by its identifier
app.get('/api/items/:id', (req, res) => {
    const itemId = parseInt(req.params.id, 10);
    const item = items.find(i => i.id === itemId);
    if (!item) {
        return res.status(404).send('Item not found');
    }
    res.json(item);
});

// Update Operation: PUT route to modify an existing item based on its identifier
app.put('/api/items/:id', (req, res) => {
    const itemId = parseInt(req.params.id, 10);
    const itemIndex = items.findIndex(i => i.id === itemId);
    if (itemIndex === -1) {
        return res.status(404).send('Item not found');
    }

    // Update the item
    items[itemIndex] = {
        ...items[itemIndex],
        ...req.body
    };
    res.json(items[itemIndex]);
});

// Delete Operation: DELETE route that removes an item based on its identifier
app.delete('/api/items/:id', (req, res) => {
    const itemId = parseInt(req.params.id, 10);
    const itemIndex = items.findIndex(i => i.id === itemId);
    if (itemIndex === -1) {
        return res.status(404).send('Item not found');
    }

    // Remove the item from the array
    const deletedItem = items.splice(itemIndex, 1);
    res.json(deletedItem[0]);
});

// Error handling for invalid JSON
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).send({ error: 'Invalid JSON' });
    }
    next();
});

// Configure the server to listen on port 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});
