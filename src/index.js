import * as ReactDOM from 'react-dom/client';
import Chatbot from './Chatbot';
import "./index.css"

const container = document.getElementById('chatbot');
const cb = ReactDOM.createRoot(container);
cb.render(<Chatbot />)