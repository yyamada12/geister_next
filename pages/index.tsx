import React, { useState } from "react";

import Head from "next/head";
import Link from "next/link";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import { useSetPlayer } from "../contexts/playerContext";

const Home: React.FC = () => {
  const [name, setName] = useState("");
  const { setPlayerName } = useSetPlayer();

  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="title">Geister</h1>

        <TextField
          label="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        ></TextField>
        <Link href="/lobby">
          <Button
            variant="contained"
            color="primary"
            disabled={!name}
            onClick={() => {
              setPlayerName(name);
            }}
          >
            start
          </Button>
        </Link>
      </main>

      <style jsx>{`
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
};

export default Home;
