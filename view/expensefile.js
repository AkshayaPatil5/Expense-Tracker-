function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}
function download() {
    const token = localStorage.getItem('token');
    const decodedtoken = parseJwt(token)
    if (decodedtoken.ispremiumuser == null) {
        alert("please buy membership to download a report")
    }

    else {
        axios.get('http://localhost:3000/expense/download', { headers: { "Authorization": token } })
            .then((response) => {
                if (response.status === 201) {
                    var a = document.createElement("a");
                    a.href = response.data.fileurl;
                    a.download = 'myexpense.csv';
                    a.click();
                } else {
                    throw new Error(response.data.message)
                }


            })
            .catch((err) => {
                console.log(err);
            });
    }

}

document.addEventListener("DOMContentLoaded", function () {
    const navbarContainer = document.getElementById('navbar-container');
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            navbarContainer.innerHTML = xhr.responseText;
        }
    };

    xhr.open("GET", "navbar.html", true);
    xhr.send();
});