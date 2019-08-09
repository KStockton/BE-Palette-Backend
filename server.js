
const app = require('./app');
const PORT = process.env.PORT || 3001;

app.listen(PORT);
console.log(`App is 🏃‍💨 running on PORT ` + PORT);

module.exports = app;