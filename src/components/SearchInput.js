import PropTypes from 'prop-types';
import React, {useEffect, useRef, useState} from 'react';
import querystring from 'querystring';
import {Box, List, ListItem, Spinner, Text, chakra} from '@chakra-ui/core';
import {useDebounce} from 'use-debounce';

export default function SearchInput({setFeature}) {
  const input = useRef();
  const [value, setValue] = useState('');
  const [focus, setFocus] = useState(false);
  const [searching, setSearching] = useState(false);
  const [features, setFeatures] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [debounced] = useDebounce(value, 500);

  useEffect(() => {
    if (debounced) {
      const query = encodeURIComponent(debounced);
      const params = querystring.stringify({
        access_token: process.env.GATSBY_MAPBOX_ACCESS_TOKEN,
        types: ['district', 'place', 'locality', 'neighborhood']
      });

      setSearching(true);
      fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?${params}`
      )
        .then(response => response.json())
        .then(data => {
          setSearching(false);
          setFeatures(data.features);
          setSelectedIndex(0);
        });
    } else {
      setFeatures([]);
    }
  }, [debounced]);

  function selectFeature(feature) {
    setValue(feature.text);
    setFeature(feature);
    input.current.blur();
  }

  function handleKeyDown(event) {
    switch (event.key) {
      case 'Escape':
        setValue('');
        break;
      case 'Enter':
        if (Number.isInteger(selectedIndex)) {
          return selectFeature(features[selectedIndex]);
        }
        break;
      case 'ArrowUp':
      case 'ArrowDown': {
        const direction = event.key === 'ArrowUp' ? -1 : 1;
        setSelectedIndex(prevSelectedIndex =>
          Number.isInteger(prevSelectedIndex)
            ? Math.max(
                0,
                Math.min(features.length - 1, prevSelectedIndex + direction)
              )
            : 0
        );
        break;
      }
      default:
    }
  }

  return (
    <Box w="300px" position="relative">
      <chakra.input
        w="full"
        px="6"
        h="12"
        borderRadius="xl"
        bg="gray.50"
        _focus={{
          bgImage: 'linear-gradient(transparent, white)',
          boxShadow: 'xl'
        }}
        fontSize="lg"
        outline="none"
        placeholder="Search for a location"
        ref={input}
        onFocus={() => {
          setFocus(true);
          setSelectedIndex(0);
        }}
        onBlur={() => setFocus(false)}
        onKeyDown={handleKeyDown}
        value={value}
        onChange={event => setValue(event.target.value)}
      />
      {searching && (
        <Box
          right="4"
          top="50%"
          transform="translateY(-50%)"
          position="absolute"
        >
          <Spinner size="small" />
        </Box>
      )}
      {focus && value && features.length > 0 && (
        <List
          py="4"
          position="absolute"
          top="100%"
          left="0"
          mt="4"
          width="200%"
          bg="white"
          borderRadius="xl"
          boxShadow="xl"
          onMouseDown={event => event.preventDefault()}
        >
          {features.map((feature, index) => (
            <ListItem
              key={feature.id}
              px="6"
              py="2"
              lineHeight="short"
              onClick={() => selectFeature(feature)}
              bg={index === selectedIndex && 'gray.50'}
              onMouseEnter={() => setSelectedIndex(index)}
              onMouseLeave={() => setSelectedIndex(null)}
            >
              <Text>{feature.text}</Text>
              {feature.context.length > 0 && (
                <Text fontSize="sm" color="gray.500">
                  {feature.context[0].text}
                </Text>
              )}
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}

SearchInput.propTypes = {
  setFeature: PropTypes.func.isRequired
};
