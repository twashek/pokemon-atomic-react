import {
  AtomicBreadbox,
  AtomicFacet,
  AtomicFacetManager,
  AtomicLayoutSection,
  AtomicLoadMoreResults,
  AtomicNoResults,
  AtomicQueryError,
  AtomicQuerySummary,
  AtomicRefineToggle,
  AtomicSearchBox,
  AtomicSearchBoxQuerySuggestions,
  AtomicSearchInterface,
  AtomicSearchLayout,
  AtomicSortDropdown,
  AtomicSortExpression,
} from '@coveo/atomic-react';
import { buildSearchEngine, type SearchEngine } from '@coveo/headless';
import React, { type FunctionComponent, useMemo, useEffect, useRef } from 'react';

let sharedEngine: SearchEngine | null = null;

interface Props {
  children: React.ReactNode;
  isCustomPage?: boolean; 
}

export const AtomicPageWrapper: FunctionComponent<Props> = ({ children, isCustomPage }) => {
  const engine = useMemo(() => {
    if (!sharedEngine) {
      sharedEngine = buildSearchEngine({
        configuration: {
          accessToken: 'xx141be452-d8ad-4e51-8098-9cf85feab66c',
          organizationId: 'psjlzopg4zxkq4jxmyvglhacadq',
          analytics: { enabled: true, trackingId: 'pokemon-atomic-react' },
          search: { filterDuplicates: false } 
        }
      });
    }
    return sharedEngine;
  }, []);

  const hasFired = useRef(false);
  useEffect(() => {
    if (engine && !isCustomPage && !hasFired.current) {
      engine.executeFirstSearch();
      hasFired.current = true;
    }
  }, [engine, isCustomPage]);

  return (
    <AtomicSearchInterface
      engine={engine}
      
      fieldsToInclude={[
        'pokemon_name',
        'pokemon_desc', 
        'pokemon_generation', 
        'pokemon_species', 
        'pokemon_types', 
        'pokemon_national_num',
        'pokemon_image',
        'pokemon_height',
        'pokemon_weight'
      ]}
    >
      <AtomicSearchLayout>
        <AtomicLayoutSection section="search">
          <AtomicSearchBox redirection-url='http://localhost:4173/search/'>
            <AtomicSearchBoxQuerySuggestions />
          </AtomicSearchBox>
        </AtomicLayoutSection>

        <AtomicLayoutSection section="facets">
          <AtomicFacetManager>
            <AtomicFacet field="pokemon_types" label="Pokemon Type" />
            <AtomicFacet field="pokemon_generation" label="Generation" />
            <AtomicFacet field="pokemon_species" label="Pokemon Species" />
          </AtomicFacetManager>
        </AtomicLayoutSection>

        <AtomicLayoutSection section="main">
          {!isCustomPage && (
            <AtomicLayoutSection section="status">
              <AtomicBreadbox />
              <AtomicQuerySummary />
              <AtomicRefineToggle />
              <AtomicSortDropdown>
                <AtomicSortExpression label="Relevance" expression="relevancy" />
                <AtomicSortExpression label="National Number (Low to High)" expression="pokemon_national_num ascending" />
                <AtomicSortExpression label="National Number (High to Low)" expression="pokemon_national_num descending" />
                <AtomicSortExpression label="Generation (Low to High)" expression="pokemon_generation ascending" />
                <AtomicSortExpression label="Generation (High to Low)" expression="pokemon_generation descending" />
              </AtomicSortDropdown>
            </AtomicLayoutSection>
          )}

          <AtomicLayoutSection section="results">
            {children}
            {!isCustomPage && (
              <>
                <AtomicQueryError />
                <AtomicNoResults />
                <AtomicLoadMoreResults />
              </>
            )}
          </AtomicLayoutSection>
        </AtomicLayoutSection>
      </AtomicSearchLayout>
    </AtomicSearchInterface>
  );
};
