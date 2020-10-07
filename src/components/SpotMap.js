import 'mapbox-gl/dist/mapbox-gl.css';
import React, {useEffect, useRef} from 'react';
import mapboxgl from 'mapbox-gl';
import {Box} from '@chakra-ui/core';

export default function SpotMap() {
  const map = useRef();
  const mapContainer = useRef();

  useEffect(() => {
    mapboxgl.accessToken = process.env.GATSBY_MAPBOX_ACCESS_TOKEN;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-118.2437, 34.0522],
      zoom: 10
    });
  }, []);

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
