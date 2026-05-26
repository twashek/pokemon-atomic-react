import {
  AtomicBreadbox,
  AtomicDidYouMean,
  AtomicFacet,
  AtomicFacetManager,
  AtomicLayoutSection,
  AtomicLoadMoreResults,
  AtomicNoResults,
  AtomicQueryError,
  AtomicQuerySummary,
  AtomicRefineToggle,
  AtomicResultImage,
  AtomicResultLink,
  AtomicResultRating,
  AtomicResultSectionTitle,
  AtomicResultSectionTitleMetadata,
  AtomicResultSectionVisual,
  AtomicSearchBox,
  AtomicSearchBoxInstantResults,
  AtomicSearchBoxQuerySuggestions,
  AtomicSearchBoxRecentQueries,
  AtomicSearchInterface,
  AtomicSearchLayout,
  AtomicSortDropdown,
  AtomicSortExpression,
  type Bindings,
} from '@coveo/atomic-react';
import {
  buildSearchEngine,
  getSampleSearchEngineConfiguration,
  loadAdvancedSearchQueryActions,
  type Result,
  type SearchEngineConfiguration,
} from '@coveo/headless';
import type React from 'react';
import {type FunctionComponent, useMemo} from 'react';

type Sample = 'service' | 'electronics';

type Options = {
  instantResults?: boolean;
  recentQueries?: boolean;
  advancedQuery?: string;
};

type Props = {
  sample: Sample;
  options?: Options;
  children: React.ReactNode;
};

function getElectronicsConfiguration(): SearchEngineConfiguration {
  const accessToken = 'xx141be452-d8ad-4e51-8098-9cf85feab66c';
  const organizationId = 'psjlzopg4zxkq4jxmyvglhacadq';
  const pipeline = 'default';
  const searchHub = 'default';
  return {
    accessToken,
    organizationId,
    search: {pipeline, searchHub},
  };
}

function getConfigurationForSample(sample: Sample) {
  switch (sample) {
    case 'service':
      return getSampleSearchEngineConfiguration();
    case 'electronics':
      return getElectronicsConfiguration();
  }
}

export const AtomicPageWrapper: FunctionComponent<Props> = ({
  sample,
  options = {},
  children,
}) => {
  const engine = useMemo(
    () =>
      buildSearchEngine({
        configuration: {
          ...getConfigurationForSample(sample),
          analytics: {
            trackingId: 'pokemon-atomic-react',
          },
        },
      }),
    [sample]
  );

  if (options.advancedQuery) {
    const action = loadAdvancedSearchQueryActions(
      engine
    ).updateAdvancedSearchQueries({
      aq: options.advancedQuery,
    });
    engine.dispatch(action);
  }

  return (
    <AtomicSearchInterface
      engine={engine}
      fieldsToInclude={[
        'pokemon_image',
        'pokemon_name',
        'pokemon_desc',
        'pokemon_generation',
        'pokemon_species',
        'pokemon_types',
        'pokemon_height',
        'pokemon_weight',
        'pokemon_national_num',
      ]}
      localization={(i18n) => {
        i18n.addResourceBundle('en', 'translation', {
          'no-ratings-available': 'No ratings available',
        });
      }}
    >
      <AtomicSearchLayout>
        <AtomicLayoutSection section="search">
          <AtomicSearchBox>
            <AtomicSearchBoxQuerySuggestions />
            {options.recentQueries && <AtomicSearchBoxRecentQueries />}
            {options.instantResults && (
              <AtomicSearchBoxInstantResults
                template={InstantResultsTemplate}
                imageSize="small"
                ariaLabelGenerator={InstantResultsAriaLabelTemplate}
              />
            )}
            <div style={{display: 'flex', justifyContent: 'flex-start'}}>
              <AtomicDidYouMean automaticallyCorrectQuery />
            </div>
          </AtomicSearchBox>
        </AtomicLayoutSection>

        <AtomicLayoutSection section="facets">
          <AtomicFacetManager>
            <AtomicFacet field="source" label="Source" />
            <AtomicFacet field="pokemon_types" label="Pokemon Type" number-of-values="5"/>
            <AtomicFacet field="pokemon_species" label="Pokemon Species" number-of-values="5"/>
            <AtomicFacet field="pokemon_generation" label="Pokemon Generation" number-of-values="5"/>
          </AtomicFacetManager>
        </AtomicLayoutSection>

        <AtomicLayoutSection section="main">
          <AtomicLayoutSection section="status">
            <AtomicBreadbox />
            <AtomicQuerySummary />
            <AtomicRefineToggle />
            <AtomicSortDropdown>
              <AtomicSortExpression label="Relevance" expression="relevancy" />
              <AtomicSortExpression
                label="National Number (Low to High)"
                expression="pokemon_national_num ascending"
              />
              <AtomicSortExpression
                label="National Number (High to Low)"
                expression="pokemon_national_num descending"
              />
            </AtomicSortDropdown>
          </AtomicLayoutSection>

          <AtomicLayoutSection section="results">
            {children}
            <AtomicQueryError />
            <AtomicNoResults />
            <AtomicLoadMoreResults />
          </AtomicLayoutSection>
        </AtomicLayoutSection>
      </AtomicSearchLayout>
    </AtomicSearchInterface>
  );
};

function InstantResultsAriaLabelTemplate({}: Bindings, result: Result) {
  return result.title;
}

function InstantResultsTemplate() {
  return (
    <>
      <style>{'.result-root{padding: 14px;}'}</style>
      <AtomicResultSectionVisual>
        <AtomicResultImage field="pokemon_image" />
      </AtomicResultSectionVisual>
      <AtomicResultSectionTitle>
        <AtomicResultLink />
      </AtomicResultSectionTitle>
    </>
  );
}
