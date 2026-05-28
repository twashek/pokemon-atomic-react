import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AtomicPageWrapper } from '../components/AtomicPageWrapper';

export const GroupedResultsListPage: React.FC = () => {
    const navigate = useNavigate();
    const [results, setResults] = useState<any[]>([]);
    const [query, setQuery] = useState("bird");
    const [groupBy, setGroupBy] = useState("pokemon_generation");
    const [loading, setLoading] = useState(false);

    // --- Image Normalization & Fallbacks ---
    const getSlug = (n: string) => (n || '').toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const getImgUrls = (raw: any) => {
        const slug = getSlug(raw.pokemon_name);
        return {
            avif: `https://img.pokemondb.net/artwork/avif/${slug}.avif`,
            large: `https://img.pokemondb.net/artwork/large/${slug}.jpg`,
            sprite: `https://img.pokemondb.net/sprites/scarlet-violet/normal/${slug}.png`,
            placeholder: `https://picsum.photos/seed/${slug}/200`
        };
    };

    const handleImgErr = (e: React.SyntheticEvent<HTMLImageElement, Event>, urls: any) => {
        const img = e.currentTarget;
        if (img.src === urls.avif) img.src = urls.large;
        else if (img.src === urls.large) img.src = urls.sprite;
        else if (img.src === urls.sprite) img.src = urls.placeholder;
    };

    const fetchGrouped = async () => {
        setLoading(true);
        const resp = await fetch(`https://platform.cloud.coveo.com/rest/search/v2?organizationId=psjlzopg4zxkq4jxmyvglhacadq`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer xx141be452-d8ad-4e51-8098-9cf85feab66c`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                q: query, filterField: `@${groupBy}`, parentField: `@${groupBy}`, childField: `@${groupBy}`,
                filterFieldRange: 8, numberOfResults: 10, enableDuplicateFiltering: false,
                fieldsToInclude: ["pokemon_name", "pokemon_generation", "pokemon_species", "pokemon_types", "pokemon_national_num"]
            })
        });
        const data = await resp.json();
        setResults(data.results || []);
        setLoading(false);
    };

    useEffect(() => { fetchGrouped(); }, [groupBy]);

    return (
        <AtomicPageWrapper isCustomPage={true}>
            {/* Custom Dark Header styling restored */}
            <div style={{ background: '#2c3e50', color: '#fff', padding: '30px', borderRadius: '15px', marginBottom: '30px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                <h2 style={{ margin: '0 0 20px 0', fontSize: '2rem' }}>Pokédex Group Explorer</h2>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <input value={query} onChange={(e) => setQuery(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && fetchGrouped()}
                        style={{ padding: '15px', flex: 1, borderRadius: '8px', border: 'none', fontSize: '1rem' }} placeholder="Search within groups..." />
                    <button onClick={fetchGrouped} style={{ padding: '15px 30px', background: '#ef5350', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>SEARCH</button>
                </div>
                <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <label style={{ fontSize: '0.9rem', opacity: 0.8 }}>GROUP BY:</label>
                    <select value={groupBy} onChange={(e) => setGroupBy(e.target.value)} style={{ padding: '10px', borderRadius: '8px', background: '#34495e', color: 'white', border: '1px solid #555' }}>
                        <option value="pokemon_generation">Generation</option>
                        <option value="pokemon_types">Type</option>
                        <option value="pokemon_species">Species</option>
                    </select>
                </div>
            </div>

            {loading ? <p>Loading Groups...</p> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                    {results.map((parent) => {
                        const urls = getImgUrls(parent.raw);
                        const id = parent.raw.pokemon_national_num ? (parent.raw.pokemon_national_num as string).split(';')[0] : null;
                        return (
                            <div key={parent.uniqueId} style={{ background: '#fff', border: '1px solid #edf2f7', borderRadius: '20px', padding: '30px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                                <div style={{ display: 'flex', gap: '40px', alignItems: 'start' }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ background: '#ef5350', color: '#fff', fontSize: '0.7rem', padding: '3px 10px', borderRadius: '10px', fontWeight: 'bold', marginBottom: '10px' }}>GROUP LEADER</div>
                                        <img src={urls.avif} style={{ width: '180px', height: '180px', objectFit: 'contain', cursor: 'pointer' }} 
                                             onClick={() => navigate(`/pokemon/${getSlug(parent.raw.pokemon_name)}`, { state: { result: parent } })}
                                             onError={(e) => handleImgErr(e, urls)} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        {id && <div style={{ fontFamily: 'monospace', color: '#a0aec0', fontWeight: 'bold' }}>#{id}</div>}
                                        <h2 style={{ margin: '5px 0', color: '#2d3748', fontSize: '2.2rem', fontWeight: '800' }}>{parent.raw.pokemon_name}</h2>
                                        <p style={{ margin: '15px 0', color: '#4a5568', lineHeight: '1.6' }}>{parent.excerpt}</p>
                                        <div style={{ display: 'flex', gap: '15px' }}>
                                            <div style={{ background: '#f7fafc', padding: '10px 15px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                                <span style={{ fontSize: '0.7rem', color: '#718096', display: 'block' }}>GENERATION</span>
                                                <strong>{parent.raw.pokemon_generation}</strong>
                                            </div>
                                            <div style={{ background: '#f7fafc', padding: '10px 15px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                                <span style={{ fontSize: '0.7rem', color: '#718096', display: 'block' }}>SPECIES</span>
                                                <strong>{parent.raw.pokemon_species}</strong>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {parent.childResults?.length > 0 && (
                                    <div style={{ marginTop: '30px', paddingTop: '30px', borderTop: '1px dashed #e2e8f0' }}>
                                        <h4 style={{ color: '#718096', fontSize: '0.8rem', letterSpacing: '2px', marginBottom: '15px' }}>RELATED MEMBERS ({parent.childResults.length})</h4>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '20px' }}>
                                            {parent.childResults.map((child: any) => {
                                                const cUrls = getImgUrls(child.raw);
                                                return (
                                                    <div key={child.uniqueId} onClick={() => navigate(`/pokemon/${getSlug(child.raw.pokemon_name)}`, { state: { result: child } })}
                                                         style={{ textAlign: 'center', cursor: 'pointer', padding: '20px', borderRadius: '15px', background: '#f8fafc' }}>
                                                        <img src={cUrls.avif} style={{ width: '80px', height: '80px', objectFit: 'contain' }} onError={(e) => handleImgErr(e, cUrls)} />
                                                        <div style={{ fontSize: '0.9rem', fontWeight: 'bold', marginTop: '10px' }}>{child.raw.pokemon_name}</div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </AtomicPageWrapper>
    );
};
