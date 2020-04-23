export default class Cookie {
    getCookie(name) {
        var value = '; ' + document.cookie;
        var parts = value.split('; ' + name + '=');
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    setCookie(name, value, path) {
        var d = new Date();
        d.setTime(d.getTime() + (24*60*60*1000));
        var expires = 'expires='+ d.toUTCString();
        document.cookie = name + '=' + value + ';' + expires + ';path=/' + path;
    }

    deleteCookie(name, path) {
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/' + path + '/';
    }

    getHeaders() {
        return {
            headers: {
                Authorization: 'Token ' + this.getCookie('token')
            }
        }
    }

    checkLoggedIn() {
        if (this.getCookie('token') === undefined) {
            alert('Please log in!')
            window.location = '/'
        }
    }
}