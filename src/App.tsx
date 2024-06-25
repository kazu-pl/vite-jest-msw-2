import { useEffect, useState } from "react";

import axios from "axios";
import { CharactersResponse } from "./types/api.types";

function App() {
  const [error, setError] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [data, setData] = useState<CharactersResponse | null>(null);

  useEffect(() => {
    const fetchDataFromApi = async () => {
      setError(false);
      setIsFetching(true);
      try {
        const response = await axios.get<CharactersResponse>(
          `http://localhost:4000/characters?currentPage=${1}&pageSize=${5}&sortDirection=asc&sortBy=createdAt`
        );

        console.log({ useEffect_try_success: response.data });
        setData(response.data);
      } catch (err) {
        console.log({ useEffect_catch_err: err });
        setError(true);
      } finally {
        setIsFetching(false);
      }
    };

    fetchDataFromApi();
  }, []);

  if (isFetching) {
    return <div>fetching</div>;
  }

  if (error) {
    return <div>error</div>;
  }
  if ((!isFetching && !data) || data?.data.length === 0) {
    return <div>no data</div>;
  }

  return <div data-testid="totalItems">{data?.totalItems}</div>;
}

export default App;
