import { auth, db } from "../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "../styles/globals.css";
import Login from "./login";
import Loading from "../components/Loading";
import { useEffect } from "react";
import firebase from "firebase";
import NProgress from "nprogress";
import Head from 'next/head'
import router from "next/router";
function MyApp({ Component, pageProps }) {
  const [user, loading] = useAuthState(auth);

  router.events.on("routeChangeStart", (url) => {
    NProgress.start();
  });
  router.events.on("routeChangeComplete", (url) => {
    NProgress.done();
  });
  useEffect(() => {
    if (user) {
      db.collection("users").doc(user.uid).set(
        {
          email: user.email,
          lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
          photoUrl: user.photoURL,
        },
        { merge: true }
      );
    }
  }, [user]);
  if (loading) return <Loading />;
  if (!user) return <Login />;

  if (user) return (<>
  <Head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css"
          integrity="sha512-42kB9yDlYiCEfx2xVwq0q7hT4uf26FUgSIZBK8uiaEnTdShXjwr8Ip1V4xGJMg3mHkUt9nNuTDxunHF0/EgxLQ=="
          crossorigin="anonymous"
          referrerpolicy="no-referrer"
        />
        
      </Head>
  <Component {...pageProps} />;
  </>)
}

export default MyApp;
