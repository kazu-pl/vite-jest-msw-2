import { useEffect, useState } from "react";

import "./App.css";
import axios from "axios";
import { CharactersResponse } from "./types/api.types";

function App() {
  const [error, setError] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [data, setData] = useState<CharactersResponse | null>(null);

  const [count, setCount] = useState(1);

  useEffect(() => {
    const fetchDataFromApi = async () => {
      setError(false);
      setIsFetching(true);
      try {
        const response = await axios.get<CharactersResponse>(
          `http://localhost:4000/characters?count=${count}`
        );

        console.log({ useEffect_try_success: response.data });
        console.log({
          useEffect_try_success_array_of_items: response.data.data,
        });
        setData(response.data);
      } catch (err) {
        console.log({ useEffect_catch_err: err });
        setError(true);
      } finally {
        setIsFetching(false);
      }
    };

    fetchDataFromApi();
  }, [count]);

  if (isFetching) {
    return <div>fetching</div>;
  }

  if (error) {
    return <div>error</div>;
  }
  if ((!isFetching && !data) || data?.data.length === 0) {
    return <div>no data</div>;
  }

  return (
    <div data-testid="totalItems">
      {data?.totalItems}
      <button onClick={() => setCount((prev) => prev + 1)}>increase</button>
    </div>
  );
}

export default App;
