import React from "react";
import './Message.css'

function Message(props) {
    return (
        <li className={"message " + props.position} key={props.key}>
            <div className="wrapper_text">
                <div className="text">
                    <span dangerouslySetInnerHTML={{ __html: props.text }} />
                </div>
            </div>
        </li>
    )
}

export { Message }