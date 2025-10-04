const express = require('express');
const app = express();

app.use(express.json());

const tasksRoutes = require('./routes/tasks');
app.use('/tasks', tasksRoutes);

app.listen(3001, () => console.log('Backend escuchando en puerto 3001'));