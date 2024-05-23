import { Box } from '@chakra-ui/react';
import { useContentfulLiveUpdates } from '@contentful/live-preview/react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useTranslation } from 'next-i18next';

import { HeroBanner } from '@src/components/features/hero-banner';
import { Banner } from '@src/components/features/banner';
import { ProductTileGrid } from '@src/components/features/product';
import { RelatedProductTileGrid } from '@src/components/features/related-products';
import { SeoFields } from '@src/components/features/seo';
import { client, previewClient } from '@src/lib/client';
import { getServerSideTranslations } from '@src/pages/utils/get-serverside-translations';

const Page = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t } = useTranslation();
  const page = useContentfulLiveUpdates(props.page);

  return (
    <>
      {page.seoFields && <SeoFields {...page.seoFields} />}
      <HeroBanner {...page} />
      {page.productsCollection?.items && (
        <Box
          mt={{
            base: 4,
            md: 9,
            lg: 16,
          }}
        >
          <ProductTileGrid
            title={t('product.trendingProducts')}
            products={page.productsCollection.items}
          />
        </Box>
      )}
      <Banner {...page} />
      {page.productsCollection?.items && (
        <Box
          mt={{
            base: 4,
            md: 9,
            lg: 16,
          }}
        >
          <RelatedProductTileGrid
            title={t('product.laptops')}
            relatedProducts={page.productsCollection.items}
          />
        </Box>
      )}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale, preview }) => {
  try {
    const gqlClient = preview ? previewClient : client;

    const data = await gqlClient.pageLanding({ locale, preview });

    const page = data.pageLandingCollection?.items[0];

    if (!page) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        ...(await getServerSideTranslations(locale)),
        page,
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
};

export default Page;
