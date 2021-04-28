export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("token")!);
};

export function authHeader() {
  const user = JSON.parse(localStorage.getItem("token")!);
  if (user && user.id) {
    return { Token: user.id };
  } else {
    return {};
  }
}
