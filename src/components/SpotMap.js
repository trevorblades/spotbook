import 'mapbox-gl/dist/mapbox-gl.css';
import PropTypes from 'prop-types';
import React, {useRef} from 'react';
import mapboxgl from 'mapbox-gl';
import useMount from 'react-use/lib/useMount';
import useUpdateEffect from 'react-use/lib/useUpdateEffect';
import {Box} from '@chakra-ui/core';

export default function SpotMap({mapRef, center, onMoveEnd}) {
  const mapContainer = useRef();

  useMount(() => {
    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center,
      zoom: 10,
      accessToken: process.env.GATSBY_MAPBOX_ACCESS_TOKEN
    });
    mapRef.current.on('load', onMoveEnd);
    mapRef.current.on('moveend', onMoveEnd);
  });

  useUpdateEffect(() => {
    mapRef.current.jumpTo({center});
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
  mapRef: PropTypes.object.isRequired,
  center: PropTypes.array.isRequired,
  onMoveEnd: PropTypes.func.isRequired
};
