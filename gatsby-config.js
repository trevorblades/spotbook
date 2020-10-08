module.exports = {
  plugins: [
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-chakra-ui',
      options: {
        isUsingColorMode: false
      }
    },
    {
      resolve: 'gatsby-plugin-firebase',
      options: {
        credentials: {
          apiKey: 'AIzaSyDycvThvJqH5dwNfYZNcKSLQgVuVuV_Kbg',
          authDomain: 'spothub-bde61.firebaseapp.com',
          databaseURL: 'https://spothub-bde61.firebaseio.com',
          projectId: 'spothub-bde61',
          storageBucket: 'spothub-bde61.appspot.com',
          messagingSenderId: '216378207213',
          appId: '1:216378207213:web:f001f947a741f4c12955e4',
          measurementId: 'G-V2D0G6XLL1'
        }
      }
    }
  ]
};
