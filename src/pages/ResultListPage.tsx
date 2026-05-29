import { AtomicResultList, AtomicResultText, AtomicResultMultiValueText } from '@coveo/atomic-react';
import { type FunctionComponent } from 'react';
import { AtomicPageWrapper } from '../components/AtomicPageWrapper';
import { type Result } from '@coveo/headless';
import { useNavigate, type NavigateFunction } from 'react-router-dom';

interface PokemonResultCardProps {
  result: Result;
  navigate: NavigateFunction;
}

const PokemonResultCard: FunctionComponent<PokemonResultCardProps> = ({ result, navigate }) => {
  const rawName = (result.raw.pokemon_name as string || '').toLowerCase().trim();
  const slug = rawName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  
  const imageUrls = {
    avif: `https://img.pokemondb.net/artwork/avif/${slug}.avif`,
    large: `https://img.pokemondb.net/artwork/large/${slug}.jpg`,
    sprite: `https://img.pokemondb.net/sprites/scarlet-violet/normal/${slug}.png`,
    placeholder: `https://picsum.photos/seed/${slug}/200`
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget;
    if (img.src === imageUrls.avif) img.src = imageUrls.large;
    else if (img.src === imageUrls.large) img.src = imageUrls.sprite;
    else if (img.src === imageUrls.sprite) img.src = imageUrls.placeholder;
  };

  const handleNavigation = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); 
    e.nativeEvent.stopImmediatePropagation();
    navigate(`/pokemon/${slug}`, { state: { result } });
  };

  const id = result.raw.pokemon_national_num ? (result.raw.pokemon_national_num as string).split(';')[0] : null;

  return (
    <div style={{ 
      background: '#fff', 
      border: '1px solid #edf2f7', 
      borderRadius: '20px', 
      padding: '20px', 
      boxShadow: '0 4px 6px rgba(0,0,0,0.02)', 
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <style>{`
        .grid-metadata-chip { background: #f7fafc; padding: 6px 10px; border-radius: 6px; border: 1px solid #e2e8f0; flex: 1; text-align: center; }
        .grid-metadata-label { font-size: 0.6rem; color: #718096; display: block; text-transform: uppercase; font-weight: bold; margin-bottom: 2px; }
        .grid-metadata-value { font-size: 0.8rem; color: #2d3748; font-weight: bold; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .grid-pokedex-title { margin: 10px 0; color: #ef5350; cursor: pointer; font-size: 1.5rem; font-weight: 800; text-decoration: none; border: none; background: none; padding: 0; text-align: center; width: 100%; }
        .grid-pokedex-title:hover { text-decoration: underline; }
      `}</style>

      {/* Hidden to check if field is loaded */}
      <div style={{display: 'none'}}><AtomicResultText field="pokemon_desc" /></div>

      {id && <div style={{ fontFamily: 'monospace', color: '#a0aec0', fontSize: '0.9rem', fontWeight: 'bold', textAlign: 'center' }}>#{id}</div>}

      <div style={{ display: 'flex', justifyContent: 'center', padding: '15px 0' }}>
        <img 
          src={imageUrls.avif} 
          style={{ width: '150px', height: '150px', objectFit: 'contain', cursor: 'pointer' }} 
          onClick={handleNavigation} 
          onError={handleImageError} 
        />
      </div>

      <button className="grid-pokedex-title" onClick={handleNavigation}>
        {result.raw.pokemon_name as string || result.title}
      </button>

      <p style={{ 
        color: '#4a5568', 
        fontSize: '0.9rem', 
        lineHeight: '1.4', 
        margin: '0 0 15px 0', 
        textAlign: 'center',
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        minHeight: '4.2em'
      }}>
        {result.excerpt}
      </p>

      <div style={{ marginTop: 'auto', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <div className="grid-metadata-chip">
            <span className="grid-metadata-label">Gen</span>
            <div className="grid-metadata-value"><AtomicResultText field="pokemon_generation" /></div>
        </div>
        <div className="grid-metadata-chip">
            <span className="grid-metadata-label">Type</span>
            <div className="grid-metadata-value"><AtomicResultMultiValueText field="pokemon_types" /></div>
        </div>
      </div>
    </div>
  );
};

export const ResultListPage: FunctionComponent = () => {
  const navigate = useNavigate();

  return (
    <AtomicPageWrapper>
      <div style={{ padding: '20px 0' }}>
        <AtomicResultList 
          display="grid" 
          imageSize="none" 
          template={(res) => <PokemonResultCard result={res} navigate={navigate} />} 
        />
      </div>
    </AtomicPageWrapper>
  );
};
