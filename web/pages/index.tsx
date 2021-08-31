import { TextField, Container, Grid } from "@material-ui/core";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>FPL Basket</title>
        <meta name="FPL Basket" content="FPL Basket" />
        <link rel="icon" href="/logo192.png" />
      </Head>

      {/* <main className={styles.main}> */}
      <Container style={{ border: "1px solid yellow" }} maxWidth="lg">
        <Grid container direction="row-reverse">
          <Grid
            style={{ border: "2px solid black" }}
            item
            container
            direction="column"
            xs={12}
            md={6}
          >
            <Grid item>
              <img src="logo512.png" alt="logo" />
            </Grid>
          </Grid>
          <Grid
            style={{ border: "2px solid red" }}
            item
            container
            direction="column"
            xs={12}
            md={6}
          >
            <Grid item>
              <TextField id="league" label="League" variant="filled" required />
            </Grid>
          </Grid>
        </Grid>
      </Container>
      {/* </main> */}

      <footer className={styles.footer}></footer>
    </div>
  );
};

export default Home;
