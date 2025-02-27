import { authApi } from "apis/Api";

const authLogin = async () => {
  const res = await authApi.getUri();
  window.location.href = res.data.uri;
};

const getLogin = async (code: string) => {
  const res = await authApi.login(code);
  return res.data;
};

const getAuthFile = async (accessToken: string, githubId: string) => {
  const res = await authApi.getAuthFile(accessToken, githubId);
  return res.data;
};

const putAuthFile = async (data: { accessToken: string; githubId: string; blogType: 0 | 1; template: string }) => {
  const res = await authApi.putAuthFile(data);
  return res.data.statusCode;
};

const setSecretRepo = async (accessToken: string, githubId: string) => {
  const res = await authApi.putSecretRepo(accessToken, githubId);
  return res.data.statusCode;
};

export { authLogin, getLogin, getAuthFile, putAuthFile, setSecretRepo };
