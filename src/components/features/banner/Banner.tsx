import { Flex, Heading, Box, Grid, Container } from '@chakra-ui/react';
import { useContentfulInspectorMode } from '@contentful/live-preview/react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

import { CtfImage } from '@src/components/features/contentful/ctf-image/CtfImage';
import { HEADER_HEIGHT } from '@src/components/templates/header';
import { PageLandingFieldsFragment } from '@src/lib/__generated/sdk';

const StyledBox = styled(Box)`
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top center;
  }
`;

export const Banner = ({
  // Tutorial: contentful-and-the-starter-template.md
  // Uncomment the line below to make the Greeting field available to render
  // greeting,
  heroBannerHeadline,
  heroBannerHeadlineColor,
  banner,
  sys: { id: entryId },
}: PageLandingFieldsFragment) => {
  const router = useRouter();
  const inspectorProps = useContentfulInspectorMode({ entryId });

  const containerRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  const [headingVisible, setHeadingVisible] = useState(false);

  useEffect(() => {
    const handleFontSize = () => {
      window.requestAnimationFrame(() => {
        if (containerRef.current && headingRef.current) {
          headingRef.current.style.display = 'inline-block'; // In order to calculate the ratio for our font scaling, it needs to be inline, so it doesn't grab the full width of its parent.

          // Retrieve the width of both the container and the heading element
          const { width: containerWidth } = containerRef.current.getBoundingClientRect();
          const { width: headingWidth } = headingRef.current.getBoundingClientRect();

          // Retrieve some computed styles, that will be used to accurately remove any additional padding, margin and other layout altering properties from the container width
          const headingComputedStyle = window.getComputedStyle(headingRef.current, null);
          const headingFontSize = headingComputedStyle.getPropertyValue('font-size');
          const headingLetterSpacing = headingComputedStyle.getPropertyValue('letter-spacing');

          const containerComputedStyle = window.getComputedStyle(containerRef.current, null);

          // Calculate the amount of pixels that need to be deducted from the raw container width
          const containerWidthFluff =
            parseInt(containerComputedStyle.paddingLeft) +
            parseInt(containerComputedStyle.paddingRight) +
            Math.abs(parseInt(headingLetterSpacing));

          // Calculate the font-size based on its base times the scaling ratio
          headingRef.current.style.fontSize = `calc(${headingFontSize} * ${
            (containerWidth - containerWidthFluff) / headingWidth
          })`;

          setHeadingVisible(true);
        }
      });
    };

    handleFontSize(); // Runs the method once on init, and a second time after changing visibility so the heading size is corrected after initial calculation as a safeguard

    router.events.on('routeChangeComplete', handleFontSize);
    window.addEventListener('resize', handleFontSize);

    return () => {
      window.removeEventListener('resize', handleFontSize);
      router.events.off('routeChangeComplete', handleFontSize);
    };
  }, [headingVisible, router.events, router.query]);

  return (
    <Grid
      position="relative"
      gridRow={1}
      gridColumn={1}
      mt={`40px`}
      {...inspectorProps({ fieldId: 'banner' })}
    >
      <StyledBox
        gridColumnStart={2}
        zIndex={0}
        gridArea={{ base: '1/ 1 / 2 / 2' }}
        maxHeight={{ base: '40vh', lg: '60vh' }}
      >
        {banner?.url && (
          <CtfImage
            imageProps={{
              sizes: '80vw',
            }}
            {...banner}
          />
        )}
      </StyledBox>
    </Grid>
  );
};