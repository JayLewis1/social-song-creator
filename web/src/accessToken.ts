export let accessToken = "";

export const setAccessToken = (s: string) => {
  accessToken = s;
}

export const getAccessToken = () => {
  console.log(`This is the accesssToken ${accessToken}`);
    return accessToken;
}