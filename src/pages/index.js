import React, {useRef, useState} from 'react';
import SearchInput from '../components/SearchInput';
import SpotResults from '../components/SpotResults';
import querystring from 'querystring';
import {Box, Button, Flex, Heading} from '@chakra-ui/core';
import {FiNavigation, FiPlus} from 'react-icons/fi';
import {Helmet} from 'react-helmet';

export default function App() {
  const input = useRef();
  const [query, setQuery] = useState('');
  const [locating, setLocating] = useState(false);
  const [center, setCenter] = useState(null);
  return (
    <>
      <Helmet title="Spothub">
        <link
          rel="icon"
          href="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/237/round-pushpin_1f4cd.png"
        />
      </Helmet>
      <Flex direction="column" h="100vh">
        <Flex zIndex="1" align="center" as="header" h="16" px="4">
          <Heading mr="8" fontSize="3xl">
            📍 Spothub
          </Heading>
          <SearchInput
            inputRef={input}
            value={query}
            onChange={setQuery}
            onSelect={feature => {
              setCenter(feature.center);
              setQuery(feature.text);
              input.current.blur();
            }}
          />
          <Button
            ml="2"
            size="lg"
            leftIcon={<Box as={FiNavigation} fontSize="lg" />}
            borderRadius="xl"
            colorScheme="messenger"
            variant="ghost"
            isLoading={locating}
            onClick={() => {
              setLocating(true);
              navigator.geolocation.getCurrentPosition(async position => {
                const {latitude, longitude} = position.coords;
                const params = querystring.stringify({
                  access_token: process.env.GATSBY_MAPBOX_ACCESS_TOKEN,
                  types: ['place']
                });

                // reverse geocode the current location
                // https://docs.mapbox.com/api/search/#reverse-geocoding
                const response = await fetch(
                  `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?${params}`
                );

                const {features} = await response.json();
                if (features.length) {
                  // show the location name in the search bar if one is found
                  setQuery(features[0].text);
                }

                // center the map
                setCenter([longitude, latitude]);
                setLocating(false);
              });
            }}
          >
            My location
          </Button>
          <Button
            ml="auto"
            size="lg"
            borderRadius="xl"
            colorScheme="messenger"
            leftIcon={<Box as={FiPlus} fontSize="lg" />}
          >
            Add spot
          </Button>
        </Flex>
        {center && <SpotResults center={center} />}
      </Flex>
    </>
  );
}
