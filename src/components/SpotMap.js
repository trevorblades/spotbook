import 'mapbox-gl/dist/mapbox-gl.css';
import PropTypes from 'prop-types';
import React, {useRef} from 'react';
import firebase from 'gatsby-plugin-firebase';
import mapboxgl from 'mapbox-gl';
import useDeepCompareEffect from 'react-use/lib/useDeepCompareEffect';
import useMount from 'react-use/lib/useMount';
import useUpdateEffect from 'react-use/lib/useUpdateEffect';
import {
  Box,
  Grid,
  List,
  ListItem,
  Text,
  chakra,
  useTheme
} from '@chakra-ui/core';
import {useCollectionDataOnce} from 'react-firebase-hooks/firestore';

export default function SpotMap({center}) {
  const {colors} = useTheme();

  const mapContainer = useRef();
  const map = useRef();
  const markers = useRef([]);

  const [spots, loading, error] = useCollectionDataOnce(
    firebase.firestore().collection('spots'),
    {
      idField: 'id'
    }
  );

  useMount(() => {
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center,
      zoom: 10,
      accessToken: process.env.GATSBY_MAPBOX_ACCESS_TOKEN
    });
  });

  useUpdateEffect(() => {
    map.current.jumpTo({center});
  }, [center]);

  useDeepCompareEffect(() => {
    if (spots) {
      while (markers.current.length) {
        const marker = markers.current.pop();
        marker.remove();
      }

      spots.forEach(({coords}) => {
        const marker = new mapboxgl.Marker({color: colors.red[500]})
          .setLngLat([coords.longitude, coords.latitude])
          .addTo(map.current);
        markers.current.push(marker);
      });
    }
  }, [spots]);

  return (
    <Grid flexGrow="1" templateColumns="1fr 2fr">
      <chakra.aside>
        {loading ? (
          <Text>Loading...</Text>
        ) : error ? (
          <Text color="red.500">{error.message}</Text>
        ) : !spots.length ? (
          <Text>No spots</Text>
        ) : (
          <List>
            {spots.map(spot => (
              <ListItem key={spot.id}>
                <div>{spot.name}</div>
                <div>🚨🚨</div>
              </ListItem>
            ))}
          </List>
        )}
      </chakra.aside>
      <Box
        as="main"
        css={{
          'canvas:focus': {
            outline: 'none'
          }
        }}
        ref={mapContainer}
      />
    </Grid>
  );
}

SpotMap.propTypes = {
  center: PropTypes.array.isRequired
};
