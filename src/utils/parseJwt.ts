export function parseJwt(token: any) {
  if (!token || typeof token !== "string") {
    return;
  }

  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace("-", "+").replace("_", "/");

  let decodedToken;
  if (typeof window !== "undefined") {
    decodedToken = JSON.parse(window.atob(base64));
  } else {
    decodedToken = JSON.parse(Buffer.from(base64, "base64").toString("utf-8"));
  }
  return decodedToken;
}
