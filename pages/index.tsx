import React, { useState } from "react";

import Head from "next/head";
import Link from "next/link";

import { Button, TextField } from "@material-ui/core";

import styles from "../css_modules/home.module.css";

import { useSetPlayer } from "../contexts/playerContext";

const Home: React.FC = () => {
  const [name, setName] = useState("");
  const { setPlayerName } = useSetPlayer();

  return (
    <React.Fragment>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.main}>
        <h1>Geister</h1>

        <TextField
          label="Player name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        ></TextField>
        <br />
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
    </React.Fragment>
  );
};

export default Home;
