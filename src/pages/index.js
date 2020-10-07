import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import React, {useEffect, useRef, useState} from 'react';
import SpotList from '../components/SpotList';
import SpotMap from '../components/SpotMap';
import mapboxgl from 'mapbox-gl';
import querystring from 'querystring';
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Grid,
  Heading,
  Input,
  List,
  ListItem,
  Text,
  chakra
} from '@chakra-ui/core';
import {FiPlus} from 'react-icons/fi';
import {Helmet} from 'react-helmet';
import {useDebouncedCallback} from 'use-debounce';

export default function App() {
  const [results, setResults] = useState([]);

  const debounced = useDebouncedCallback(async value => {
    const query = encodeURIComponent(value);
    const params = querystring.stringify({
      access_token: process.env.GATSBY_MAPBOX_ACCESS_TOKEN,
      types: ['district', 'place', 'locality', 'neighborhood']
    });
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?${params}`
    );

    if (response.ok) {
      const data = await response.json();
      setResults(data.features);
    }
  }, 1000);

  return (
    <>
      <Helmet title="Spothub">
        <link
          rel="icon"
          href="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/237/round-pushpin_1f4cd.png"
        />
      </Helmet>
      <Center h="100vh">
        <Box
          w="full"
          maxW="500px"
          borderRadius="lg"
          borderWidth="1px"
          boxShadow="sm"
          position="absolute"
          top="8"
          left="8"
        >
          <chakra.input
            w="full"
            px="4"
            py="3"
            fontSize="lg"
            bgColor="transparent"
            outline="none"
            placeholder="Search for a location"
            onChange={event => debounced.callback(event.target.value)}
          />
          {results.length > 0 && (
            <>
              <Divider />
              <List>
                {results.map(result => (
                  <ListItem key={result.id}>
                    <Text>{result.text}</Text>
                    {result.context.length > 0 && (
                      <Text fontSize="sm" color="gray.500">
                        {result.context[0].text}
                      </Text>
                    )}
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </Box>
      </Center>
      {/* <Grid h="100vh" templateColumns="1fr 2fr">
        <chakra.aside
          bg="white"
          boxShadow="lg"
          position="relative"
          zIndex="docked"
        >
          <Flex align="center" as="header" h="12" px="4">
            <Heading fontSize="2xl">📍 Spothub</Heading>
            <Button
              ml="auto"
              size="sm"
              colorScheme="red"
              leftIcon={<Box as={FiPlus} fontSize="md" />}
            >
              Add spot
            </Button>
          </Flex>
          <SpotList />
        </chakra.aside>
        <SpotMap />
      </Grid> */}
    </>
  );
}
