import { createSimpleRestDataProvider } from "@refinedev/rest/simple-rest";
export const { dataProvider, kyInstance } = createSimpleRestDataProvider({
  apiURL: import.meta.env.VITE_API_URL,
});
