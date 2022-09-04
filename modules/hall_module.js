import {loadContent} from './hall_content_module.js'

window.onload = async () => {
    document.getElementById('hall').style.background = '#DDDCE3';
    document.getElementById('content').innerHTML = loadContent();
}