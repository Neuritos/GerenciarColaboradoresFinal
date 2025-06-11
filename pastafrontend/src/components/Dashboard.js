import React, { useEffect, useState } from 'react';
import api from '../services/api';
import ColaboradorForm from './ColaboradorForm';
import './Dashboard.css';

const Dashboard = () => {
  const [colaboradores, setColaboradores] = useState([]);
  const [editando, setEditando] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [colaboradorInfo, setColaboradorInfo] = useState(null);

  useEffect(() => {
    buscarColaboradores();
  }, []);

  const buscarColaboradores = async () => {
    const res = await api.get('/colaboradores');
    setColaboradores(res.data);
  };

  const salvarColaborador = async (dados) => {
    if (editando) {
      await api.put(`/colaboradores/${editando.id}`, dados);
    } else {
      await api.post('/colaboradores', dados);
    }
    buscarColaboradores();
    setEditando(null);
  };

  const excluirColaborador = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este colaborador?')) {
      await api.delete(`/colaboradores/${id}`);
      buscarColaboradores();
    }
  };

  const colaboradoresFiltrados = colaboradores
    .filter(c => {
      const termo = filtro.toLowerCase();
      return c.nome.toLowerCase().includes(termo) || c.cpf.includes(termo);
    })
    .sort((a, b) => a.nome.localeCompare(b.nome));

  return (
    <div className="dashboard">
        
      <ColaboradorForm
        onSave={salvarColaborador}
        colaboradorEditando={editando}
        limparEdicao={() => setEditando(null)}
      />
    <h2>Lista de Colaboradores</h2>
      <input
        type="text"
        placeholder="Buscar por nome ou CPF"
        value={filtro}
        onChange={e => setFiltro(e.target.value)}
        className="input-busca"
      />

      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>CPF</th>
            <th>Cargo</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {colaboradoresFiltrados.map(c => (
            <tr key={c.id}className={c.status === 'desligado' ? 'linha-desligado' : 'linha-atuando'}>
              <td id='info-td'>{c.nome}</td>
              <td id='info-td'>{c.cpf}</td>
              <td id='info-td'>{c.cargo}</td>
              <td id='info-td'>{c.status}</td>
              <td className='area-btn'>
                <button className="btn-info" onClick={() => setColaboradorInfo(c)}>Info</button>{' '}
                <button className="btn-editar" onClick={() => setEditando(c)}>Editar</button>{' '}
                <button className="btn-excluir" onClick={() => excluirColaborador(c.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {colaboradorInfo && (
  <div className="modal">
    <div className="modal-conteudo">
      <h3>Informações do Colaborador</h3>
      <ul>
        {Object.entries(colaboradorInfo).map(([chave, valor]) => {
          const formatarData = (data) => {
            if (!data) return '—';
            const d = new Date(data);
            const dia = String(d.getDate()).padStart(2, '0');
            const mes = String(d.getMonth() + 1).padStart(2, '0');
            const ano = d.getFullYear();
            return `${dia}/${mes}/${ano}`;
          };

          const camposDeData = ['data_nascimento', 'data_contratacao', 'data_demissao'];
          const valorFormatado = camposDeData.includes(chave)
            ? formatarData(valor)
            : valor || '—';

          return (
            <li key={chave}>
              <strong>{chave.replace(/_/g, ' ').toUpperCase()}:</strong> {valorFormatado}
            </li>
          );
        })}
      </ul>
      <button onClick={() => setColaboradorInfo(null)}>Fechar</button>
    </div>
  </div>
)}
    </div>
  );
};

export default Dashboard;
