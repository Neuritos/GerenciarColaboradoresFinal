import React, { useState, useEffect } from 'react';
import './ColaboradorForm.css';

const estadosBrasil = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

const opcoesGenero = ["Masculino", "Feminino"];
const opcoesEstadoCivil = ["Solteiro", "Casado", "Viúvo", "Separado", "Divorciado"];
const opcoesCargo = [
  "Presidente", "Vice-presidente", "Diretor Executivo", "Coordenador Administrativo",
  "Secretário(a)", "Tesoureiro(a)", "Assistente Social", "Psicólogo(a)",
  "Instrutor(a) de Orientação e Mobilidade", "Instrutor(a) de Braille",
  "Instrutor(a) de Tecnologia Assistiva", "Reabilitador(a) Visual",
  "Fonoaudiólogo(a)", "Pedagogo(a)", "Terapeuta Ocupacional", "Educador(a) Físico(a)",
  "Advogado(a)", "Recepcionista", "Auxiliar Administrativo", "Técnico(a) em Informática",
  "Comunicador(a) Social", "Intérprete de Libras", "Voluntário(a)"
];

const ColaboradorForm = ({ onSave, colaboradorEditando, limparEdicao }) => {
  const [dados, setDados] = useState({
    nome: '', email: '', telefone: '', cpf: '', rg: '', data_nascimento: '',
    genero: '', estado_civil: '', nacionalidade: '', endereco: '', numero: '',
    bairro: '', estado: '', cidade: '', cep: '', cargo: '', pis: '',
    carteira_trabalho: '', status: 'atuando', data_contratacao: '', data_demissao: ''
  });

  useEffect(() => {
    if (colaboradorEditando) {
      const formatarData = (data) => {
        if (!data) return '';
        if (data.includes('/')) {
          const [dia, mes, ano] = data.split('/');
          return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
        } else if (data.includes('-')) {
          return data.split('T')[0];
        }
        return '';
      };

      setDados({
        ...colaboradorEditando,
        data_nascimento: formatarData(colaboradorEditando.data_nascimento),
        data_contratacao: formatarData(colaboradorEditando.data_contratacao),
        data_demissao: formatarData(colaboradorEditando.data_demissao)
      });
    }
  }, [colaboradorEditando]);

  const aplicarMascara = (nome, valor) => {
    let v = valor.replace(/\D/g, '');
    switch (nome) {
      case 'cpf':
        v = v.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        break;
      case 'telefone':
        v = v.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2');
        break;
      case 'cep':
        v = v.replace(/(\d{5})(\d)/, '$1-$2');
        break;
      case 'pis':
        v = v.replace(/(\d{3})(\d{5})(\d{2})(\d)/, '$1.$2.$3-$4');
        break;
      case 'carteira_trabalho':
        v = v.replace(/(\d{7})(\d{2})(\d)/, '$1/$2-$3');
        break;
      default:
        break;
    }
    return v;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    const valor = ['cpf', 'telefone', 'cep', 'pis', 'carteira_trabalho'].includes(name)
      ? aplicarMascara(name, value)
      : value;

    setDados(prev => ({ ...prev, [name]: valor }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (dados.status === 'desligado' && !dados.data_demissao) {
      alert('Informe a data de demissão para colaboradores desligados.');
      return;
    }

    try {
      await onSave(dados);
      setDados({
        nome: '', email: '', telefone: '', cpf: '', rg: '', data_nascimento: '',
        genero: '', estado_civil: '', nacionalidade: '', endereco: '', numero: '',
        bairro: '', estado: '', cidade: '', cep: '', cargo: '', pis: '',
        carteira_trabalho: '', status: 'atuando', data_contratacao: '', data_demissao: ''
      });
      limparEdicao();
    } catch (err) {
      alert('Erro: algum dado já está cadastrado. Verifique CPF, PIS ou carteira de trabalho.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="formulario">
      <h2>{colaboradorEditando ? 'Editar Colaborador' : 'Cadastrar Colaborador'}</h2>
      <div className="campos">
        {Object.entries(dados).map(([key, val]) => {
          if (key === 'id') return null;
          if (key === 'data_demissao' && dados.status === 'atuando') return null;

          if (key === 'status') {
            return (
              <div key={key} className="campo">
                <label>Status</label>
                <select name={key} value={val} onChange={handleChange} required>
                  <option value="atuando">Atuando</option>
                  <option value="desligado">Desligado</option>
                </select>
              </div>
            );
          }

          if (key === 'estado') {
            return (
              <div key={key} className="campo">
                <label>Estado</label>
                <select name={key} value={val} onChange={handleChange} required>
                  <option value="">Selecione</option>
                  {estadosBrasil.map(uf => (
                    <option key={uf} value={uf}>{uf}</option>
                  ))}
                </select>
              </div>
            );
          }

          if (key === 'genero') {
            return (
              <div key={key} className="campo">
                <label>Gênero</label>
                <select name={key} value={val} onChange={handleChange} required>
                  <option value="">Selecione</option>
                  {opcoesGenero.map(op => (
                    <option key={op} value={op}>{op}</option>
                  ))}
                </select>
              </div>
            );
          }

          if (key === 'estado_civil') {
            return (
              <div key={key} className="campo">
                <label>Estado Civil</label>
                <select name={key} value={val} onChange={handleChange} required>
                  <option value="">Selecione</option>
                  {opcoesEstadoCivil.map(op => (
                    <option key={op} value={op}>{op}</option>
                  ))}
                </select>
              </div>
            );
          }

          if (key === 'cargo') {
            return (
              <div key={key} className="campo">
                <label>Cargo</label>
                <select name={key} value={val} onChange={handleChange} required>
                  <option value="">Selecione</option>
                  {opcoesCargo.map(op => (
                    <option key={op} value={op}>{op}</option>
                  ))}
                </select>
              </div>
            );
          }

          return (
            <div key={key} className="campo">
              <label>{key.replace('_', ' ').toUpperCase()}</label>
              <input
                type={key.includes('data') ? 'date' : 'text'}
                name={key}
                value={val}
                onChange={handleChange}
                required={key !== 'data_demissao'}
              />
            </div>
          );
        })}
      </div>
      <div className="btns-baixo">
        <button className="btn-salvar" type="submit">Salvar</button>
        <button
          className="btn-limpar"
          type="button"
          style={{ backgroundColor: '#e53935', color: 'white' }}
          onClick={() => {
            setDados({
              nome: '', email: '', telefone: '', cpf: '', rg: '', data_nascimento: '',
              genero: '', estado_civil: '', nacionalidade: '', endereco: '', numero: '',
              bairro: '', estado: '', cidade: '', cep: '', cargo: '', pis: '',
              carteira_trabalho: '', status: 'atuando', data_contratacao: '', data_demissao: ''
            });
            limparEdicao();
          }}
        >
          Limpar
        </button>
      </div>
    </form>
  );
};

export default ColaboradorForm;
