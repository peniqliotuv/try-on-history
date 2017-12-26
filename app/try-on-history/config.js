const options = {
  development: {
    hostname: 'http://localhost:8000',
    // hostname: 'http://b4f771ed.ngrok.io',
  },
  production: {
    hostname: '',
  },
};

export default options[process.env.NODE_ENV || 'development'];
