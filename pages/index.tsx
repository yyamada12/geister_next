import React, { useState } from "react";

import Head from "next/head";
import Link from "next/link";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import styles from "../css_modules/home.module.css";

import { useSetPlayer } from "../contexts/playerContext";

const Home: React.FC = () => {
  const [name, setName] = useState("");
  const { setPlayerName } = useSetPlayer();

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.main}>
        <h1>Geister</h1>

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
      </div>
    </div>
  );
};

export default Home;
