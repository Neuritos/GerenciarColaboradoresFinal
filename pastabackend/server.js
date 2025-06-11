const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const colaboradorRoutes = require('./routes/colaboradores');
app.use('/api/colaboradores', colaboradorRoutes);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
