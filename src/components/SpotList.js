import PropTypes from 'prop-types';
import React, {useEffect, useMemo, useRef} from 'react';
import firebase from 'gatsby-plugin-firebase';
import geohash from 'ngeohash';
import mapboxgl from 'mapbox-gl';
import {List, ListItem, Text, useTheme} from '@chakra-ui/core';
import {useCollectionDataOnce} from 'react-firebase-hooks/firestore';

export default function SpotList({mapRef, bounds}) {
  const {colors} = useTheme();
  const markers = useRef([]);

  const query = useMemo(() => {
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();
    const geohashes = geohash
      .bboxes(sw.lat, sw.lng, ne.lat, ne.lng, 4)
      .slice(0, 10);
    return firebase
      .firestore()
      .collection('spots')
      .where('geohash', 'in', geohashes);
  }, [bounds]);

  const [spots, loading, error] = useCollectionDataOnce(query, {idField: 'id'});

  const filteredSpots = useMemo(
    () =>
      spots
        ? spots.filter(spot =>
            bounds.contains(
              new mapboxgl.LngLat(spot.coords.longitude, spot.coords.latitude)
            )
          )
        : [],
    [bounds, spots]
  );

  useEffect(() => {
    if (spots) {
      while (markers.current.length) {
        const marker = markers.current.pop();
        marker.remove();
      }

      spots.forEach(({coords}) => {
        const marker = new mapboxgl.Marker({color: colors.red[500]})
          .setLngLat([coords.longitude, coords.latitude])
          .addTo(mapRef.current);
        markers.current.push(marker);
      });
    }
  }, [colors.red, mapRef, spots]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text color="red.500">{error.message}</Text>;
  }

  if (!filteredSpots.length) {
    return <Text>No spots</Text>;
  }

  return (
    <List>
      {filteredSpots.map(spot => (
        <ListItem key={spot.id}>
          <div>{spot.name}</div>
          <div>🚨🚨</div>
        </ListItem>
      ))}
    </List>
  );
}

SpotList.propTypes = {
  bounds: PropTypes.object.isRequired,
  mapRef: PropTypes.object.isRequired
};
