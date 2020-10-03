import React, {useEffect, useRef} from 'react';
import mapboxgl from 'mapbox-gl';
import {Box, Button, Flex, Grid, Heading, chakra} from '@chakra-ui/core';
import {FiPlus} from 'react-icons/fi';
import {Helmet} from 'react-helmet';

mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN;

export default function App() {
  const map = useRef();
  const mapContainer = useRef();

  useEffect(() => {
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-118.2437, 34.0522],
      zoom: 10
    });
  }, []);

  return (
    <>
      <Helmet title="Spotbook">
        <link
          rel="icon"
          href="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/237/round-pushpin_1f4cd.png"
        />
        <link
          rel="stylesheet"
          href="https://api.tiles.mapbox.com/mapbox-gl-js/v1.3.1/mapbox-gl.css"
        />
      </Helmet>
      <Grid h="100vh" templateColumns="1fr 2fr">
        <chakra.aside
          bg="white"
          boxShadow="lg"
          position="relative"
          zIndex="docked"
        >
          <Flex align="center" as="header" h="12" px="4">
            <Heading fontSize="2xl">📍 Spotbook</Heading>
            <Button
              ml="auto"
              size="sm"
              colorScheme="red"
              leftIcon={<Box as={FiPlus} fontSize="md" />}
            >
              Add spot
            </Button>
          </Flex>
        </chakra.aside>
        <Box as="main" position="relative" zIndex="base" ref={mapContainer} />
      </Grid>
    </>
  );
}
