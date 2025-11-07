const pickFields = <T extends Record<string, unknown>, K extends keyof T>(
  source: T,
  keys: K[]
): Pick<T, K> => {
  const result = {} as Pick<T, K>;

  for (const key of keys) {
    if (source && Object.hasOwnProperty.call(source, key)) {
      result[key] = source[key];
    }
  }

  return result;
};

export default pickFields;
