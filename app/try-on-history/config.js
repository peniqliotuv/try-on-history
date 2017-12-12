const options = {
  development: {
    hostname: 'http://localhost:8000',
  },
  production: {
    hostname: '',
  },
};

export default options[process.env.NODE_ENV || 'development'];
