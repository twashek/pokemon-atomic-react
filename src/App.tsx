import { useState } from 'react';
import './App.css';
import { ResultListPage } from './pages/ResultListPage';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'; // 2. Import Link
import { DetailPage } from './pages/detailPage';
import {GroupedResultsListPage} from './pages/GroupedResultsListPage';

function MainAppContent() {
  return (
    <>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', borderBottom: '1px solid #eee' }}>
        <span className="pageTitle"><h2>Pokemon Pokedex</h2></span>
      </header>
      
      <main>
        {/* This main catch-all now renders the standard list by default */}
        <ResultListPage />
      </main>
    </>
  );
}

const navLinkStyle = {
  marginLeft: '15px',
  textDecoration: 'none',
  color: '#ef5350',
  fontWeight: 'bold',
  fontSize: '0.9rem'
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/pokemon/:pokemonName" element={<DetailPage />} />
        
        {/* 4. Define the explicit route for the grouped page */}
        <Route path="/grouped" element={
           <>
             <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', borderBottom: '1px solid #eee' }}>
               <span className="pageTitle">Pokemon Pokedex (Grouped)</span>
         
             </header>
             <GroupedResultsListPage />
           </>
        } />

        <Route path="*" element={<MainAppContent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
