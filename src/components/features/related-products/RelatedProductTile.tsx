import { Box, Center, Text, useTheme } from '@chakra-ui/react';
import { useContentfulInspectorMode } from '@contentful/live-preview/react';
import Link from 'next/link';

import { CtfImage } from '@src/components/features/contentful/ctf-image';
import { FormatCurrency } from '@src/components/shared/format-currency';
import { PageProductFieldsFragment } from '@src/lib/__generated/sdk';

export const ProductTile = ({
  featuredProductImage,
  name,
  price,
  slug,
  sys: { id: entryId },
}: PageProductFieldsFragment) => {
  const inspectorProps = useContentfulInspectorMode({ entryId });
  const theme = useTheme();
  return slug ? (
    <div {...inspectorProps({ fieldId: 'featuredProductImage' })}>
      <Box as={Link} href={slug}>
        {featuredProductImage && (
          <Box borderRadius={4} overflow="hidden">
            <CtfImage {...featuredProductImage} />
          </Box>
        )}
        <Text {...inspectorProps({ fieldId: 'name' })} mt={2} fontWeight="700" color="#4caf50">
          {name}
        </Text>
        {price && (
          <Text {...inspectorProps({ fieldId: 'price' })} mt={3} fontWeight="500" color="#fb6c21;">
            <FormatCurrency value={price} />
          </Text>
        )}
      </Box>
    </div>
  ) : null;
};
