import PropTypes from 'prop-types';
import React, {useRef, useState} from 'react';
import SpotList from './SpotList';
import SpotMap from './SpotMap';
import {Grid, Text, chakra} from '@chakra-ui/core';

export default function SpotResults({center}) {
  const map = useRef();
  const [bounds, setBounds] = useState(null);
  return (
    <Grid flexGrow="1" templateColumns="1fr 2fr">
      <chakra.aside px="6" py="4">
        {bounds ? (
          <SpotList mapRef={map} bounds={bounds} />
        ) : (
          <Text>Loading</Text>
        )}
      </chakra.aside>
      <SpotMap
        mapRef={map}
        center={center}
        onMoveEnd={event => setBounds(event.target.getBounds())}
      />
    </Grid>
  );
}

SpotResults.propTypes = {
  center: PropTypes.array.isRequired
};
