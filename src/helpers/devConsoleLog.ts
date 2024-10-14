export const devConsoleLog = (
  message?: unknown,
  ...optionalParams: unknown[]
) => {
  if (process.env.NEXT_PUBLIC_ENV === 'dev')
    // eslint-disable-next-line no-console
    console.log(message, optionalParams);
};

export const devConsoleError = (
  message?: unknown,
  ...optionalParams: unknown[]
) => {
  if (process.env.NEXT_PUBLIC_ENV === 'dev')
    // eslint-disable-next-line no-console
    console.error(message, optionalParams);
};
