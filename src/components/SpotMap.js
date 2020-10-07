import 'mapbox-gl/dist/mapbox-gl.css';
import PropTypes from 'prop-types';
import React, {useEffect, useRef} from 'react';
import mapboxgl from 'mapbox-gl';
import {Box} from '@chakra-ui/core';

export default function SpotMap({center}) {
  const map = useRef();
  const mapContainer = useRef();

  useEffect(() => {
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center,
      zoom: 10,
      accessToken: process.env.GATSBY_MAPBOX_ACCESS_TOKEN
    });
  }, [center]);

  return (
    <Box
      as="main"
      css={{
        'canvas:focus': {
          outline: 'none'
        }
      }}
      ref={mapContainer}
    />
  );
}

SpotMap.propTypes = {
  center: PropTypes.array.isRequired
};
