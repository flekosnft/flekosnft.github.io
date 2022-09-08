const clock = ['/', '-', '\\', '|'];

var loading = {};

function loadingAnimatation(element, interval){
    let index = 0;
    loading[element.id] = setInterval(() => {
        if(index >= clock.length - 1) index = 0;
        element.innerHTML = clock[index++];
    }, interval)
}

function finishLoadingAnimation(element){
    clearInterval(loading[element.id]);
    if (loading.length == 0) loading = {};
    element.innerHTML = '';
}


export{loadingAnimatation, finishLoadingAnimation}