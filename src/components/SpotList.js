import React from 'react';
import firebase from 'gatsby-plugin-firebase';
import {List, ListItem, Text} from '@chakra-ui/core';
import {useCollection} from 'react-firebase-hooks/firestore';

export default function SpotList() {
  const [value, loading, error] = useCollection(
    firebase.firestore().collection('spots')
  );

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text color="red.500">{error.message}</Text>;
  }

  if (!value.docs.length) {
    return <Text>No spots</Text>;
  }

  return (
    <List>
      {value.docs.map(doc => (
        <ListItem key={doc.id}>
          <div>{doc.get('name')}</div>
          <div>🚨🚨</div>
        </ListItem>
      ))}
    </List>
  );
}
