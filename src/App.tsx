import './App.css';
import {ResultListPage} from './pages/ResultListPage';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {DetailPage} from './pages/detailPage';

/**
 * MainAppContent now serves as the primary layout for the search interface.
 * The complex navigation and conditional page rendering have been removed
 * to focus on the Pokemon Result List.
 */
function MainAppContent() {
  return (
    <>
      <header style={{ padding: '10px 20px', borderBottom: '1px solid #eee' }}>
        <span className="pageTitle" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          Pokemon Pokedex
        </span>
      </header>

      <main>
        <ResultListPage />
      </main>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route for Pokemon Detail Page */}
        <Route path="/pokemon/:pokemonName" element={<DetailPage />} />

        {/* 
          Catch-all route: 
          If the URL doesn't match a specific pokemon, show the main search list.
        */}
        <Route path="*" element={<MainAppContent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
