export const returnType = (type) => {
  return `RETURN_${type}`;
};

export const formatAnswer = (type, payload, opts = {}) => {
  return JSON.stringify({
    type: returnType(type),
    ...opts,
    payload,
  });
};
