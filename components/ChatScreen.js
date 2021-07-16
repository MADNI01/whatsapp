import classes from "./ChatScreen.module.css";
import { Avatar } from "@material-ui/core";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import NavigationIcon from "@material-ui/icons/Navigation";
import { useRef, useState } from "react";
import { db, auth } from "../firebase/firebase";
import router from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "firebase";
import Message from "./Message";
import { useCollection } from "react-firebase-hooks/firestore";
import TimeAgo from 'timeago-react'
const chatScreen = (props) => {
  const [message, setMessage] = useState("");
  const [user] = useAuthState(auth);
  const lastMessageRef = useRef();

  const ScrollToBottom = () => {
    lastMessageRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  const [messagesSnapshot] = useCollection(
    db
      .collection("chats")
      .doc(router.query.id)
      .collection("messages")
      .orderBy("timeStamp", "asc")
  );

  const ShowMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((message) => (
        <Message
          key={message.id}
          message={message.data().message}
          date={message.data().timeStamp?.toDate().getTime()}
          user={message.data().user}
        />
      ));
    } else {
      return JSON.parse(props.messages).map((message) => (
        <Message
          key={message.id}
          message={message.message}
          date={message.timeStamp}
          user={message.user}
        />
      ));
    }
  };

  const inputChangeHandler = (e) => {
    setMessage(e.target.value);
  };
  const sendMessageHandler = (e) => {
    e.preventDefault();

    if (message == "") return;

    db.collection("chats").doc(router.query.id).collection("messages").add({
      user: user.email,
      message: message,
      timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setMessage("");
    ScrollToBottom();
  };

  const getRecEmail = (users, user) => {
    return users.filter((u) => u !== user);
  };
  const recEmail = getRecEmail(props.chat.users, user.email);
  const [recSnapshot] = useCollection(
    db.collection("users").where("email", "==", recEmail[0])
  );
  const recDetails = recSnapshot?.docs?.[0]?.data();

  return (
    <div className={classes.chat}>
      <div className={classes.header}>
        <div className={classes.left}>
          {recDetails ? (
            <Avatar src={recDetails.photoUrl} />
          ) : (
            <Avatar>{recEmail[0][0].toUpperCase()}</Avatar>
          )}
          <div className={classes.info}>
            <h3>{recEmail}</h3>
            <p>Last seen :{recDetails ? (<TimeAgo datetime={recDetails.lastSeen.toDate()} />) : 'unavailable'}</p>
          </div>
        </div>
        <div className={classes.right}>
          <AttachFileIcon />
          <MoreVertIcon />
        </div>
      </div>
      <div className={classes.container}>
        <div className={classes.mainchat}>
          {ShowMessages()}
          <div ref={lastMessageRef} />
        </div>
        <div className={classes.form}>
          <InsertEmoticonIcon />
          <form onSubmit={sendMessageHandler}>
            <input type="text" onChange={inputChangeHandler} value={message} />
            <button></button>
          </form>
          <NavigationIcon
            onClick={sendMessageHandler}
            style={{ cursor: "pointer" }}
          />
        </div>
      </div>
    </div>
  );
};

export default chatScreen;
