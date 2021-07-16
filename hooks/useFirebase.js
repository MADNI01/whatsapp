import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase/firebase";

const useFirebase = () => {
  const [user] = useAuthState(auth);
  const [userPhoto, setUserPhoto] = useState();

  useEffect(() => {
    db.collection("users")
      .doc(user.uid)
      .onSnapshot((snap) => {
        let userDetails = snap.data();
        setUserPhoto(userDetails.photoUrl);
      });
  }, []);



  return { userPhoto };
};

export default useFirebase;
