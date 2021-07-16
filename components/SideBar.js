import classes from "./SideBar.module.css";
import { Avatar } from "@material-ui/core";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchIcon from "@material-ui/icons/Search";
import { auth, db } from "../firebase/firebase";
import { useRouter } from "next/router";
import useFirebase from "../hooks/useFirebase";
import * as EmailValidator from "email-validator";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import Chats from "./Chats";
const SideBar = () => {
  const router = useRouter()
  const { userPhoto } = useFirebase();
  const [user] = useAuthState(auth);
  const chatsRef = db
    .collection("chats")
    .where("users", "array-contains", user.email);
  const [chatsSnapshot] = useCollection(chatsRef);

  const newChatHandler = () => {
    const recEmail = prompt("Add your friend email");

    if (!recEmail) return null;

    if (
      recEmail.length > 0 &&
      EmailValidator.validate(recEmail) &&
      recEmail != user.email &&
      !chatAlreadyExist(recEmail)
    ) {
      db.collection("chats").add({
        users: [user.email, recEmail],
      });
    }
  };
  
  const chatAlreadyExist = (rec) =>
    !!chatsSnapshot?.docs.find(
      (chat) => chat.data().users.find((user) => user === rec)
    );

    
  return (
    
      <div className={classes.container}>
        <div className={classes.header}>
          <Avatar
            src={userPhoto}
            onClick={() => {
              auth.signOut().then(() => {
                router.push("/login");
              });
            }}
          />
          <div>
            <ChatIcon onClick={newChatHandler} />
            <MoreVertIcon style={{ marginLeft: "20px" }} />
          </div>
        </div>

        <div className={classes.search}>
          <SearchIcon />
          <input placeholder="Search in chats" />
        </div>
        <button onClick={newChatHandler}>START A NEW CHAT</button>
        
          <div className={classes.con}>
          {chatsSnapshot?.docs.map((chat)=>(
            <Chats id={chat.id} users={chat.data().users} key={chat.id} />
          ))}
          </div>
        
      </div>
    
  );
};

export default SideBar;
