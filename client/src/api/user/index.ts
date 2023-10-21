import service from "@utils/requestAxios";
export const getAllUsers = async (id: string) => {
  return service.get(`/user/allusers/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Bearer " + localStorage.getItem("__auth_provider_token__") || "",
    },
  });
};
