export class SecurityService {
    public static setAntiForgeryTokens() {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open('GET', '/sitefinity/anticsrf');
            xhr.setRequestHeader('X-SF-ANTIFORGERY-REQUEST', 'true');
            xhr.responseType = 'json';
            xhr.onload = function () {
                const response = xhr.response;
                if (response != null) {
                    const token = response.Value;
                    document.querySelectorAll('input[name = \'sf_antiforgery\']').forEach((i: any) => i.value = token);
                    resolve('');
                } else {
                    resolve('');
                }
            };
            xhr.onerror = function () {
                reject();
            };
            xhr.send();
        });
    };
}
