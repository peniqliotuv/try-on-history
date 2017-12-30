export const createPostOptions = (body, token) => {
  const options = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
  };
  if (token) {
    options.headers['Authorization'] = `JWT ${token}`;
  }
  return options;
};

