import React, {useState} from 'react';
import SearchInput from '../components/SearchInput';
import SpotMap from '../components/SpotMap';
import {Box, Button, Flex, Grid, Heading} from '@chakra-ui/core';
import {FiPlus} from 'react-icons/fi';
import {Helmet} from 'react-helmet';

export default function App() {
  const [result, setResult] = useState(null);
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
          <Heading mr="6" fontSize="3xl">
            📍 Spothub
          </Heading>
          <SearchInput onResultClick={setResult} />
          <Button
            ml="auto"
            borderRadius="lg"
            colorScheme="red"
            leftIcon={<Box as={FiPlus} fontSize="md" />}
          >
            Add spot
          </Button>
        </Flex>
        {result && (
          <Grid flexGrow="1" templateColumns="1fr 2fr">
            {/* <chakra.aside
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
            </chakra.aside> */}
            <aside />
            <SpotMap center={result.center} />
          </Grid>
        )}
      </Flex>
    </>
  );
}
