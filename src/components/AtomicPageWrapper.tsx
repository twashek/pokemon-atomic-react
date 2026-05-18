import {
  AtomicBreadbox,
  AtomicColorFacet,
  AtomicDidYouMean,
  AtomicFacet,
  AtomicFacetManager,
  AtomicFormatCurrency,
  AtomicLayoutSection,
  AtomicLoadMoreResults,
  AtomicNoResults,
  AtomicNumericFacet,
  AtomicNumericRange,
  AtomicQueryError,
  AtomicQuerySummary,
  AtomicRatingFacet,
  AtomicRatingRangeFacet,
  AtomicRefineToggle,
  AtomicResultImage,
  AtomicResultLink,
  AtomicResultNumber,
  AtomicResultRating,
  AtomicResultSectionTitle,
  AtomicResultSectionTitleMetadata,
  AtomicResultSectionVisual,
  AtomicSearchBox,
  AtomicSearchBoxInstantResults,
  AtomicSearchBoxQuerySuggestions,
  AtomicSearchBoxRecentQueries,
  AtomicSearchInterface,
  AtomicResultsPerPage,
  AtomicSearchLayout,
  AtomicSortDropdown,
  AtomicSortExpression,
  AtomicTimeframe,
  AtomicTimeframeFacet,
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
  //const accessToken = 'xxc23ce82a-3733-496e-b37e-9736168c4fd9';
  const accessToken = 'xx141be452-d8ad-4e51-8098-9cf85feab66c'; //'xx2c7248f0-2b95-4caf-b69e-7540b3bdfc22'; //first org
  const organizationId = 'psjlzopg4zxkq4jxmyvglhacadq'; //'psjyvooq42sokr7izw4wie4cehi'; //'electronicscoveodemocomo0n2fu8v';
  const pipeline = 'default';
  const searchHub = 'default'; //'UI_KIT_E2E';
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
            enabled: true,
            analyticsMode: 'legacy',
            originLevel2: 'MainPokedex',
          },
        },
        initialState: {
          pagination: { pageSize: 12 },
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
        'ec_price',
        'ec_rating',
        'ec_images',
        'ec_brand',
        'cat_platform',
        'cat_condition',
        'cat_categories',
        'cat_review_count',
        'cat_color',
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
            <AtomicSearchBoxRecentQueries />
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
              <AtomicSortExpression label="relevance" expression="relevancy" />
              <AtomicSortExpression
                label="Price (low to high)"
                expression="ec_price ascending"
              />
              <AtomicSortExpression
                label="Price (high to low)"
                expression="ec_price descending"
              />
            </AtomicSortDropdown>

          </AtomicLayoutSection>
          <AtomicLayoutSection section="results">
            {children}
            <AtomicQueryError />
            <AtomicNoResults />
          </AtomicLayoutSection>
            <AtomicLoadMoreResults />
          </AtomicLayoutSection>
            <AtomicResultsPerPage initialChoice={100} />
      </AtomicSearchLayout>
    </AtomicSearchInterface>
  );
};

function InstantResultsAriaLabelTemplate({i18n}: Bindings, result: Result) {
  const information = [result.title];

  if ('ec_rating' in result.raw) {
    information.push(
      i18n.t('stars', {
        count: result.raw.ec_rating as number,
        max: 5,
      })
    );
  } else {
    information.push(i18n.t('no-ratings-available'));
  }

  if ('ec_price' in result.raw) {
    information.push(
      (result.raw.ec_price as number).toLocaleString(
        i18n.languages as string[],
        {
          style: 'currency',
          currency: 'USD',
        }
      )
    );
  }

  return information.join(', ');
}

function InstantResultsTemplate() {
  return (
    <>
      <style>{'.result-root{padding: 14px;}'}</style>
      <AtomicResultSectionVisual>
        <AtomicResultImage field="ec_images" />
      </AtomicResultSectionVisual>
      <AtomicResultSectionTitle>
        <AtomicResultLink />
      </AtomicResultSectionTitle>
      <AtomicResultSectionTitleMetadata>
        <AtomicResultRating field="ec_rating" />
        <AtomicResultNumber field="ec_price">
          <AtomicFormatCurrency currency="USD" />
        </AtomicResultNumber>
      </AtomicResultSectionTitleMetadata>
    </>
  );
}
