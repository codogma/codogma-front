export const devConsoleInfo = (
  message?: unknown,
  ...optionalParams: unknown[]
) => {
  if (process.env.NEXT_PUBLIC_ENV === 'dev')
    // eslint-disable-next-line no-console
    console.info(message, optionalParams);
};

export const devConsoleWarn = (
  message?: unknown,
  ...optionalParams: unknown[]
) => {
  if (process.env.NEXT_PUBLIC_ENV === 'dev')
    // eslint-disable-next-line no-console
    console.warn(message, optionalParams);
};
