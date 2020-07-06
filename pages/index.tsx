import React, { useState, useContext } from "react";

import Head from "next/head";
import Link from "next/link";

import { useSetPlayer } from "../contexts/playerContext";

export default function Home() {
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
        <div>
          name:
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></input>
        </div>
        <Link href="/lobby">
          <button
            disabled={!name}
            onClick={() => {
              setPlayerName(name);
            }}
          >
            start
          </button>
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
}
