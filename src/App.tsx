import {useState} from 'react';
import './App.css';
import {HeaderLink} from './components/HeaderLink';
import {CommerceRecommendationPage} from './pages/CommerceRecommendationPage';
import {CommerceSearchPage} from './pages/CommerceSearchPage';
import {CommerceTableProductListPage} from './pages/CommerceTableProductListPage';
import {FoldedResultListPage} from './pages/FoldedResultListPage';
import {InstantResultsPage} from './pages/InstantResultsPage';
import {RecsPage} from './pages/RecsPage';
import {ResultListPage} from './pages/ResultListPage';
import {TableResultListPage} from './pages/TableResultListPage';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {DetailPage} from './pages/detailPage';

// --- Constants for your existing pages ---
const LIST_PAGE = 'Result list';
const FOLDED_LIST_PAGE = 'Folded result list';
const INSTANT_RESULTS_PAGE = 'Instant results';
const TABLE_RESULT_LIST_PAGE = 'Table result list';
const RECS_PAGE = 'Recs Interface';
const COMMERCE_SEARCH_PAGE = 'Commerce Search Page';
const COMMERCE_RECOMMENDATIONS_PAGE = 'Commerce Recommendations Page';
const COMMERCE_TABLE_PRODUCT_LIST_PAGE = 'Commerce Table Product List Page';

const pages = [
  LIST_PAGE,
  FOLDED_LIST_PAGE,
  INSTANT_RESULTS_PAGE,
  TABLE_RESULT_LIST_PAGE,
  RECS_PAGE,
  COMMERCE_SEARCH_PAGE,
  COMMERCE_TABLE_PRODUCT_LIST_PAGE,
  COMMERCE_RECOMMENDATIONS_PAGE,
];

// --- Component to render the common header and your existing page logic ---
function MainAppContent() {
  const initialPage = pages.find((page) =>
    decodeURIComponent(window.location.search).includes(`page=${page}`)
  );
  const [page, setPage] = useState(initialPage || LIST_PAGE); // Default to LIST_PAGE if no param

  return (
    <>
      <header>
        <span className="pageTitle">{page} example</span>
        <ul>
          {/* Your existing HeaderLinks */}
          <HeaderLink page={LIST_PAGE} currentPage={page} setPage={setPage} />
          <HeaderLink
            page={FOLDED_LIST_PAGE}
            currentPage={page}
            setPage={setPage}
          />
          <HeaderLink
            page={INSTANT_RESULTS_PAGE}
            currentPage={page}
            setPage={setPage}
          />
          <HeaderLink
            page={TABLE_RESULT_LIST_PAGE}
            currentPage={page}
            setPage={setPage}
          />
          <HeaderLink page={RECS_PAGE} currentPage={page} setPage={setPage} />
          <HeaderLink
            page={COMMERCE_SEARCH_PAGE}
            currentPage={page}
            setPage={setPage}
          />
          <HeaderLink
            page={COMMERCE_TABLE_PRODUCT_LIST_PAGE}
            currentPage={page}
            setPage={setPage}
          />
          <HeaderLink
            page={COMMERCE_RECOMMENDATIONS_PAGE}
            currentPage={page}
            setPage={setPage}
          />
        </ul>
      </header>

      {/* Your existing conditional rendering logic for pages */}
      {page === LIST_PAGE && <ResultListPage />}
      {page === FOLDED_LIST_PAGE && <FoldedResultListPage />}
      {page === INSTANT_RESULTS_PAGE && <InstantResultsPage />}
      {page === TABLE_RESULT_LIST_PAGE && <TableResultListPage />}
      {page === COMMERCE_TABLE_PRODUCT_LIST_PAGE && (
        <CommerceTableProductListPage />
      )}
      {page === RECS_PAGE && <RecsPage />}
      {page === COMMERCE_SEARCH_PAGE && <CommerceSearchPage />}
      {page === COMMERCE_RECOMMENDATIONS_PAGE && <CommerceRecommendationPage />}
    </>
  );
}

// --- Main App Component with BrowserRouter ---
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route for your Product Detail Page - now using DetailPage */}
        <Route path="/pokemon/:pokemonName" element={<DetailPage />} />

        {/* Catch-all route for all other paths, rendering your existing app content */}
        {/* The path="*" means "match any path not matched by previous routes" */}
        <Route path="*" element={<MainAppContent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
