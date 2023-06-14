import React from "react";
import './Message.css'

function Message(props) {

    return (
        <li className={"message appeared " + props.position}>
            <div className="avatar" />
            <div className="text_wrapper">
                <div className="text">
                    <span dangerouslySetInnerHTML={{ __html: props.text }} />
                </div>
            </div>
        </li>
    )
}

export { Message }