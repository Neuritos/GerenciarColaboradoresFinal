const db = require('../db');

// Função auxiliar para validação de campos
const camposObrigatorios = [
  'nome', 'email', 'telefone', 'cpf', 'rg', 'data_nascimento', 'genero',
  'estado_civil', 'nacionalidade', 'endereco', 'numero_endereco', 'bairro',
  'estado', 'cidade', 'cep', 'cargo', 'salario', 'data_contratacao', 'status',
  'pis', 'carteira_trabalho'
];

function validarCampos(req) {
  return camposObrigatorios.every(campo => req.body[campo] !== undefined && req.body[campo] !== '');
}

exports.getColaboradores = (req, res) => {
  const sql = 'SELECT * FROM colaboradores ORDER BY nome';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.createColaborador = (req, res) => {
  if (!validarCampos(req)) return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });

  const sqlVerificaCPF = 'SELECT * FROM colaboradores WHERE cpf = ?';
  db.query(sqlVerificaCPF, [req.body.cpf], (err, results) => {
    if (results.length > 0) return res.status(400).json({ error: 'CPF já cadastrado.' });

    const sql = 'INSERT INTO colaboradores SET ?';
    db.query(sql, req.body, (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ id: result.insertId, ...req.body });
    });
  });
};

exports.updateColaborador = (req, res) => {
  const id = req.params.id;
  if (!validarCampos(req)) return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });

  const sql = 'UPDATE colaboradores SET ? WHERE id = ?';
  db.query(sql, [req.body, id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ id, ...req.body });
  });
};

exports.deleteColaborador = (req, res) => {
  const sql = 'DELETE FROM colaboradores WHERE id = ?';
  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ success: true });
  });
};
