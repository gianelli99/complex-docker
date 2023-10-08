import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Link } from "react-router-dom";
import { FormEventHandler, useEffect, useState } from "react";
import { fetchIndexes, fetchValues, sendIndex } from "./api";

function App() {
  const [index, setIndex] = useState("");
  const [seenIndexes, setSeenIndexes] = useState<Array<{ number: string }>>([]);
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    let ignore = false;

    const fetch = async () => {
      const { data: indexes } = await fetchIndexes();
      if (ignore) {
        return;
      }
      setSeenIndexes(indexes);
    };

    fetch();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    let ignore = false;

    const fetch = async () => {
      const { data: values } = await fetchValues();
      if (ignore) {
        return;
      }
      setValues(values);
    };

    fetch();

    return () => {
      ignore = true;
    };
  }, []);

  const handleSubmit: FormEventHandler = async (event) => {
    event.preventDefault();

    try {
      await sendIndex(index);
    } catch (error) {
      console.log(error);
    }

    setIndex("");
  };

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React + Gian!</h1>
      <Link to="other-page">Go to other pages!</Link>

      <div>
        <form onSubmit={handleSubmit}>
          <label>
            Enter your index:
            <input
              type="number"
              name="value"
              id="value"
              onChange={(e) => setIndex(e.target.value)}
              value={index}
            />
          </label>
          <button type="submit">SUBMIT</button>
        </form>

        <h2>Indexes I have seen:</h2>
        {seenIndexes.map(({ number }) => number).join(", ")}

        <h2>Calculated values:</h2>
        {Object.keys(values).map((index) => (
          <div key={index}>
            {`For index ${index} I calculated ${values[index]}`}
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
