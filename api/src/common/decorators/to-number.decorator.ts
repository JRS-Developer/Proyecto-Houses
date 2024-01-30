import { Transform } from 'class-transformer';

// It allows to transform strings from form-data requests to numbers
const ToNumber = () => {
  return Transform((params) => {
    if (Array.isArray(params.value)) {
      return params.value.map((v) => toNumber(v));
    }

    return toNumber(params.value);
  });
};

const toNumber = (value: any) => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  return Number(value);
};

export { ToNumber, toNumber };
