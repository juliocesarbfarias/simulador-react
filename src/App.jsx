import React from 'react';
import { Outlet } from 'react-router-dom'; // Importe o Outlet
import Header from './components/Header';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />

      <main>
        {/*render */}
        <Outlet />
      </main>
    </div>
  );
}

export default App;