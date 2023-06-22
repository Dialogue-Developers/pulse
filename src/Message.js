import React from "react";
import './Message.css'

function Message(props) {
    return (
<<<<<<< HEAD
        <li className={"message appeared " + props.position}>            
            <div className="wrapper_text">
=======
        <li className={"message " + props.position} key={props.key}>
            <div className="text_wrapper">
>>>>>>> db091a31e72e5bc580da1df5ff6ad8ae4e0e8df0
                <div className="text">
                    <span dangerouslySetInnerHTML={{ __html: props.text }} />
                </div>
            </div>
        </li>
    )
}

export { Message }