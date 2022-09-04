function loadingAnimation(element, clock, index, finishState){
    setTimeout(() => {
        element = clock[index];
        if(loadingState[chain]){
            if(index < clock.length - 1) loadingAnimation(chain, ++index);
            else loadingAnimation(chain, 0)
        } else {
            element = finishState;
        }
    }, 150);
}

export{loading}