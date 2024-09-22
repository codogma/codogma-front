export const devConsole = (logs: any) => {
  if (process.env.NEXT_PUBLIC_ENV === 'dev') console.log(logs);
};
