import {loadContent} from './office_content_module.js'

window.onload = async () => {
    document.getElementById('content').innerHTML = loadContent();
    document.getElementById('office').style.background = '#DDDCE3';
    
}