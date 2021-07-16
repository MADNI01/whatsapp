import SideBar from "../../components/SideBar";
import classes from "./chat.module.css";
import ChatScreen from "../../components/ChatScreen";
import { db } from "../../firebase/firebase";
import router from "next/router";
import { useState } from "react";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
const chat = ({ messages, chat }) => {
  const [showSideBar, setShowSideBar] = useState(false);

  const sideBarClass = showSideBar ? "show" : "hide";

  const showSideHandler = () =>{
    setShowSideBar(!showSideBar)
  }

  return (
    <div className={classes.chat}>
      <div className={classes[sideBarClass]}>
        <SideBar />
        <div className={classes.arrow}>
          <ArrowRightIcon style={{ width: "60px", height: "60px" }} onClick={showSideHandler} />
        </div>
      </div>
      <div className={classes.chatscreen} onClick={()=>setShowSideBar(false)}>
        <ChatScreen key={router.query.id} messages={messages} chat={chat}  />
      </div>
    </div>
  );
};

export default chat;

export async function getServerSideProps(context) {
  const ref = db.collection("chats").doc(context.query.id);

  const messagesRef = await ref
    .collection("messages")
    .orderBy("timeStamp", "asc")
    .get();

  const messages = messagesRef.docs.map((doc) => ({
    ...doc.data(),
    timeStampe: doc.data().timeStamp.toDate().getTime(),
    id: doc.id,
  }));

  const chatRef = await ref.get();
  const chat = {
    ...chatRef.data(),
  };

  return {
    props: {
      messages: JSON.stringify(messages),
      chat,
    },
  };
}
