import express from 'express'

const PORT = parseInt(process.env.PORT) || 8080;
const app = express()

app.get('/', (req, res) => {
    res.send(["Hello", "World!"]);
});

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
});
