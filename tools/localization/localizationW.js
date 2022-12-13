onconnect = function( e ) {
    const port = e.ports[0];
    url = port.url;
    port.onmessage = onmessage.bind(port);
}
onmessage = async function (e) { switch(e.data?.type){
    case 'init':{
        console.log('init')

    } break;
    case 'setlanguage':{
        console.log('setlanguage')

    } break;
    case 'translate':{
        console.log('translate')

    } break;
    case 'edit':{
        console.log('edit')

    } break;

    case 'save':{
        console.log('save')

    } break;    
    
    default:{
        
    } break; 
}}