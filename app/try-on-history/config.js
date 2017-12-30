const options = {
  development: {
    // hostname: 'http://localhost:8000',
    hostname: 'https://tryonhistory.herokuapp.com',
  },
  production: {
    hostname: '',
  },
};

export default options[process.env.NODE_ENV || 'development'];
