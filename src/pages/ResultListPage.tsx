// ResultListPage.tsx
import {
  AtomicResultList,
  AtomicResultSectionVisual,
  AtomicResultSectionTitle,
  AtomicResultSectionExcerpt,
  AtomicResultText,
  AtomicResultMultiValueText,
} from '@coveo/atomic-react';
import {type FunctionComponent} from 'react';
import {AtomicPageWrapper} from '../components/AtomicPageWrapper';
import {type Result} from '@coveo/headless';
import {useNavigate, type NavigateFunction} from 'react-router-dom';

// --- Pokemon Card Component ---
interface PokemonResultCardProps {
  result: Result;
  externalNavigate: NavigateFunction;
}

const PokemonResultCard: FunctionComponent<PokemonResultCardProps> = ({
  result,
  externalNavigate,
}) => {
  const rawName = (result.raw.pokemon_name as string) || '';
  const name = rawName
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Strips accents like é -> e
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

  const imageUrls = {
    avif: `https://img.pokemondb.net/artwork/avif/${name}.avif`,
    large: `https://img.pokemondb.net/artwork/large/${name}.jpg`,
    sprite: `https://img.pokemondb.net/sprites/scarlet-violet/normal/${name}.png`,
    placeholder: `https://picsum.photos/seed/${name}/200`,
  };

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const img = e.currentTarget;
    if (img.src === imageUrls.avif) {
      img.src = imageUrls.large;
    } else if (img.src === imageUrls.large) {
      img.src = imageUrls.sprite;
    } else if (img.src === imageUrls.sprite) {
      img.src = imageUrls.placeholder;
    }
  };

  const handleTitleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (result.logClick) {
      result.logClick();
      console.log('Analytics: Click logged for', result.title);
    }

    const pokemonNameParam =
      result.raw.pokemon_name?.toString().toLowerCase().replace(/\s+/g, '-') ||
      result.uniqueId;
    externalNavigate(`/pokemon/${pokemonNameParam}`, {state: {result}});
  };

  const pokemonDisplayName =
    (result.raw.pokemon_name as string) || result.title;

  return (
    <div style={{padding: '15px'}}>
      <style>{`
        .field {display: inline-block; align-items: center; margin-right: 10px;}
        .field-label {font-weight: bold; margin-right: 0.25rem;}
        .result-card-image {width: 100%; max-height: 200px; object-fit: contain; display: block; margin-bottom: 10px;}
        .excerpt-truncate {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;  
            overflow: hidden;
            font-size: 0.9rem;
            color: #444;
            margin-top: 0.5rem;
          }
       `}</style>

      <AtomicResultSectionVisual>
        <img
          src={imageUrls.avif}
          alt={result.title}
          className="result-card-image"
          style={{cursor: 'pointer'}}
          onClick={handleTitleClick}
          onError={handleImageError}
        />
      </AtomicResultSectionVisual>

      <AtomicResultSectionTitle>
        <a
          href="#"
          onClick={handleTitleClick}
          style={{
            fontSize: '1.3rem',
            fontWeight: 'bold',
            color: '#0056b3',
            cursor: 'pointer',
            textDecoration: 'none',
          }}
        >
          {pokemonDisplayName}
        </a>
      </AtomicResultSectionTitle>

      <AtomicResultSectionExcerpt>
        <AtomicResultText field="excerpt" className="excerpt-truncate" />
      </AtomicResultSectionExcerpt>

      <div style={{marginTop: '1rem', display: 'flex', gap: '5px'}}>
        <p style={{fontWeight: 'bold'}}>Type:</p>
        <AtomicResultMultiValueText field="pokemon_types" />
      </div>

      {result.raw.pokemon_weight && (
        <div className="field">
          <span className="field-label">Weight:</span>
          <AtomicResultText field="pokemon_weight" />
        </div>
      )}
    </div>
  );
};

// --- Main Result List Page ---
export const ResultListPage: FunctionComponent = () => {
  const navigate = useNavigate();

  return (
    <AtomicPageWrapper sample="electronics">
      <AtomicResultList
        display="grid"
        imageSize="small"
        template={(result) => (
          <PokemonResultCard result={result} externalNavigate={navigate} />
        )}
      />
    </AtomicPageWrapper>
  );
};
