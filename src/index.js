import * as ReactDOM from 'react-dom/client';
import Chatbot from './Chatbot';
import "./index.css";

import { library } from '@fortawesome/fontawesome-svg-core';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

// Add the icon to the library
library.add(faPaperPlane, faSpinner);

const container = document.getElementById('chatbot');
const cb = ReactDOM.createRoot(container);
cb.render(<Chatbot />)