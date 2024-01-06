const gethomePage = (request, response, next) => {
    response.sendFile('index.html', { root: 'view' });
}


const geterrorPage = (request, response, next) => {
    response.sendFile('pagenotfound404.html', { root: 'view' });
}


module.exports={
    
    gethomePage,
    geterrorPage
}