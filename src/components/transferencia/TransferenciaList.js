import React, { useState, useEffect } from 'react';
import TransferService from '../../service/TransferService';
import './TransferenciaList.css';

const TransferenciaList = () => {
  const [transferencias, setTransferencias] = useState([]);
  const [error, setError] = useState('');
  const [saldoTotal, setSaldoTotal] = useState(0);
  const [saldoPeriodo, setSaldoPeriodo] = useState(0);

  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [nomeOperador, setNomeOperador] = useState('');

  const buscarTransferencias = async () => {
    try {
      const params = {};

      if (dataInicio && dataFim) {
        const formattedDataInicio = dataInicio + 'T00:00:00';
        const formattedDataFim = dataFim + 'T23:59:59';

        params.dataInicio = formattedDataInicio;
        params.dataFim = formattedDataFim;
      }

      if (nomeOperador) {
        params.nomeOperadorTransacao = nomeOperador;
      }

      if (dataInicio && dataFim && nomeOperador) {
        params.todosValoresPreenchidos = true;
      }

      const response = await TransferService.getTransferList(params);
      const { transferencias, saldoTotal } = response.data;
      setTransferencias(transferencias);
      setSaldoTotal(saldoTotal);
      setError('');
    } catch (error) {
      console.error(error.response);
      setError('Erro ao buscar transferências. Verifique o console para mais detalhes.');
    }
  };

  useEffect(() => {
    const calcularSaldoPeriodo = () => {
      const saldoPeriodoCalculado = transferencias.reduce((total, transferencia) => {
        return total + transferencia.valor;
      }, 0);
      setSaldoPeriodo(saldoPeriodoCalculado);
    };

    calcularSaldoPeriodo();
  }, [transferencias]);

  return (
    <div className="transferencia-list">
      <div className='dataInicio'>
        <label>Data Início:</label>
        <input type="date" value={dataInicio} onChange={e => setDataInicio(e.target.value)} />
      </div>
      <div className='dataFim'>
        <label>Data Fim:</label>
        <input type="date" value={dataFim} onChange={e => setDataFim(e.target.value)} />
      </div>
      <div className='nomeOperador'>
        <label>Nome do Operador:</label>
        <input type="text" value={nomeOperador} onChange={e => setNomeOperador(e.target.value)} />
      </div>
      <button onClick={buscarTransferencias} className='buscar'>Pesquisar</button>
      {error && <p>{error}</p>}
      <table>
        <thead>
          <tr>
            <th colSpan={2}>Saldo Total: R$ {saldoTotal.toFixed(2)}</th>
            <th colSpan={2}>Saldo no Período: R$ {saldoPeriodo.toFixed(2)}</th>
          </tr>
          <tr>
            <th>Data Transferência</th>
            <th>Valor</th>
            <th>Tipo</th>
            <th>Nome do Operador</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(transferencias) && transferencias.map((transferencia) => (
            <tr key={transferencia.id}>
              <td>{new Date(transferencia.dataTransferencia).toLocaleDateString()}</td>
              <td> R$ {transferencia.valor.toFixed(2)}</td>
              <td>{transferencia.tipo}</td>
              <td>{transferencia.nomeOperadorTransacao}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransferenciaList;
