import React from "react";
import './Message.css'

function Message(props) {

    return (
        <li className={"message appeared " + props.position}>            
            <div className="wrapper_text">
                <div className="text">
                    <span dangerouslySetInnerHTML={{ __html: props.text }} />
                </div>
            </div>
        </li>
    )
}

export { Message }