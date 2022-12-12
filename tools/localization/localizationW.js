onconnect = function( e ) {
    const port = e.ports[0];
    url = port.url;
    port.onmessage = onmessage.bind(port);
}
onmessage = async function (e) { switch(e.data?.type){
    case 'init':{

    } break;
    default:{
        
    } break; 
}}