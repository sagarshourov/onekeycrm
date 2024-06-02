export const authHeader = () => {
  const token = localStorage.getItem("token");

  if (token) {
    return {
      Authorization: `Bearer ${token}`,
      ContentType: "application/json",
    };
  } else {
    return {};
  }
};
