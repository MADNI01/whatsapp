import classes from "./Chat.module.css";
import { Avatar } from "@material-ui/core";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../firebase/firebase";
import router from "next/router";
const Chats = (props) => {
  const [user] = useAuthState(auth);
  const getRecEmail = (users, logginUser) => {
    return users.filter((user) => user !== logginUser);
  };

  const recEmail = getRecEmail(props.users, user.email);

  const [rec] = useCollection(
    db.collection("users").where("email", "==", recEmail[0])
  );

  const recDetails = rec?.docs?.[0]?.data();


    const newChatHandler = () =>{
      router.push(`/chat/${props.id}`)
    }

  return (
    <div className={classes.chat} onClick={newChatHandler}>
      {recDetails ? (
        <Avatar src={recDetails.photoUrl} />
      ) : (
        <Avatar>{recEmail[0][0].toUpperCase()}</Avatar>
      )}
      <p>{recEmail}</p>
    </div>
  );
};

export default Chats;
