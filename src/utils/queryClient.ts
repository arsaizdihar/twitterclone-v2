import axios from "axios";
import { QueryClient } from "react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry(failureCount, error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) return false;
        }
        if (failureCount < 4) return true;
        else return false;
      },
    },
  },
});
export default queryClient;
