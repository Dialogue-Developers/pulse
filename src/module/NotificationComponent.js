import React from 'react'
import addNotification from 'react-push-notification';

const NotificationComponent = () => {

    const buttonClick = () => {
        console.log(`clicked`)
        addNotification({
            title: 'Warning',
            subtitle: 'This is a subtitle',
            message: 'This is a very long message',
            theme: 'darkblue',
            // native: true // when using native, your OS will handle theming.
        });
    };

    return (
        <div className="page">
            <button onClick={buttonClick} className="button">
                Click to see the Notificaation.
            </button>
        </div>
    );
};

export default NotificationComponent;
