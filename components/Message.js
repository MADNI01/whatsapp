import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/firebase';
import classes from './message.module.css'
import moment from 'moment';
const Message = (props) => {
    const [user] = useAuthState(auth)


    const type = props.user == user.email ? 'sender' : 'receiver'


    return ( 
        <div className={classes[type]}>
            <div>{props.message} <p>{props.date? moment(props.date).format('LT') : '...'}</p></div>
        </div>
     );
}
 
export default Message;