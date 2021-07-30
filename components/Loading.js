import {Circle} from 'better-react-spinkit'
import classes from './Loading.module.css'
const Loading = () => {
    return ( 
        <div className={classes.loading}>
            <Circle color='#13ae0c' size={60}/>
        </div>
     );
}
 
export default Loading;
