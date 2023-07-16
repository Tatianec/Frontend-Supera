import React from 'react';
import TransferenciaList from './components/transferencia/TransferenciaList';
import './App.css'; 

const App = () => {
  return (
    <div>
      <h1 className='App'>Lista de Transferências</h1>
      <TransferenciaList />
    </div>
  );
};

export default App;
