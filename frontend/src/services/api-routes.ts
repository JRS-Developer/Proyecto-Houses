export const API_ROUTES = {
  houses: {
    list: "/houses",
    create: "/houses",
    one: (id: number) => `/houses/${id}`,
    update: (id: number) => `/houses/${id}`,
    delete: (id: number) => `/houses/${id}`,
  },
};
