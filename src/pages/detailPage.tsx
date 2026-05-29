import {useLocation, Link} from 'react-router-dom';

export const DetailPage = () => {
  const location = useLocation();
  // Retrieve the Coveo result passed from the search page
  const result = location.state?.result;

  if (!result) {
    return (
      <div style={{padding: '2rem'}}>
        No Pokemon data found. <Link to="/">Go back to search</Link>
      </div>
    );
  }

  // 1. Format Name once for all URL options
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

  // Helper function to handle the array-to-string logic for table cells
  const renderFieldValue = (value: any) => {
    return Array.isArray(value) ? value.join(', ') : value || 'N/A';
  };

  // Logic to determine the description: 
  // Priority: pokemon_desc (Array) > pokemon_desc (String) > excerpt > fallback text
  const rawDesc = result.raw.pokemon_desc;
  const descriptionContent = (Array.isArray(rawDesc) ? rawDesc[0] : rawDesc) 
   // || result.excerpt 
    || 'No description available.';

  return (
    <div
      style={{
        padding: '2rem',
        maxWidth: '1000px',
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <Link
        to="/"
        style={{textDecoration: 'none', color: '#0056b3', fontWeight: 'bold'}}
      >
        ← Back to Pokedex
      </Link>

      <h1
        style={{
          fontSize: '3.5rem',
          textTransform: 'capitalize',
          marginBottom: '1rem',
        }}
      >
        {result.raw.pokemon_name || result.title}
      </h1>

      <div style={{display: 'flex', gap: '3rem', alignItems: 'flex-start'}}>
        <img
          src={imageUrls.avif}
          alt={result.title}
          title={result.title}
          onError={handleImageError}
          style={{
            width: 'auto',
            maxHeight: '400px',
            background: '#f5f5f5',
            borderRadius: '15px',
            padding: '20px',
          }}
        />

        <div style={{flex: 1}}>
          <h3 style={{borderBottom: '2px solid #eee', paddingBottom: '0.5rem'}}>
            Description
          </h3>
          <div
            style={{lineHeight: '1.6', color: '#333', fontSize: '1.1rem'}}
            dangerouslySetInnerHTML={{
              __html: descriptionContent.toString().replace(/;/g, ' ')
            }}
          />

          {/* ATTRIBUTES TABLE 1 */}
          <table
            style={{
              width: '100%',
              marginTop: '2rem',
              borderCollapse: 'collapse',
              textAlign: 'left',
            }}
          >
            <thead>
              <tr style={{borderBottom: '2px solid #333'}}>
                <th style={{padding: '12px 8px'}}>Types</th>
                <th style={{padding: '12px 8px'}}>Species</th>
                <th style={{padding: '12px 8px'}}>Generation</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{borderBottom: '1px solid #eee'}}>
                <td
                  style={{
                    padding: '12px 8px',
                    fontWeight: 'bold',
                    color: '#0056b3',
                  }}
                >
                  {renderFieldValue(result.raw.pokemon_types)}
                </td>
                <td style={{padding: '12px 8px'}}>
                  {renderFieldValue(result.raw.pokemon_species)}
                </td>
                <td style={{padding: '12px 8px'}}>
                  {renderFieldValue(result.raw.pokemon_generation)}
                </td>
              </tr>
            </tbody>
          </table>

          {/* ATTRIBUTES TABLE 2 */}
          <table
            style={{
              width: '100%',
              marginTop: '2rem',
              borderCollapse: 'collapse',
              textAlign: 'left',
            }}
          >
            <thead>
              <tr style={{borderBottom: '2px solid #333'}}>
                <th style={{padding: '12px 8px'}}>Height</th>
                <th style={{padding: '12px 8px'}}>Weight</th>
                <th style={{padding: '12px 8px'}}></th>
              </tr>
            </thead>
            <tbody>
              <tr style={{borderBottom: '1px solid #eee'}}>
                <td
                  style={{
                    padding: '12px 8px',
                    fontWeight: 'bold',
                    color: '#0056b3',
                  }}
                >
                  {renderFieldValue(result.raw.pokemon_height)}
                </td>
                <td style={{padding: '12px 8px'}}>
                  {renderFieldValue(result.raw.pokemon_weight)}
                </td>
                <td style={{padding: '12px 8px'}}></td>
              </tr>
            </tbody>
          </table>

          {/* Raw Data Debugger */}
          <details style={{marginTop: '3rem', width: '100%'}}>
            <summary style={{cursor: 'pointer', color: '#888'}}>
              View Raw Data
            </summary>
            <pre
              style={{
                background: '#f4f4f4',
                padding: '1rem',
                borderRadius: '5px',
                fontSize: '0.8rem',
                marginTop: '0.5rem',
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
                overflowX: 'hidden',
                border: '1px solid #ddd',
              }}
            >
              {JSON.stringify(result, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    </div>
  );
};
