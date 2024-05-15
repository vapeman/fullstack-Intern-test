export async function getCurrencies(url: string) {
    let response = await fetch(url);
    return await response.json();
}

// async function SendRequest(url: string, body: object) {
//     let response = {};
//     try {
//         response = await fetch(url, {
//             method: 'GET',
//             headers: {
//                 'Accept': 'application/json, text/plain, */*',
//                 'Content-Type': 'application/json;charset=utf-8',
//             },
//             body: JSON.stringify(body)
//         });
//     }
//     catch (e) {
//         console.error(e, response);
//         throw e;
//     }
//     return response;
// }
// export async function sendRequestAndGetResponse(url: string, body: object) {
//     let response: any = {};
//     try {
//         response = await SendRequest(url, body);
//     }
//     catch(e) {
//         console.warn('An exception faced while making request to url ' + url, e);
//         return {status: false, exception: e};
//     }
//     if(response.ok) {
//         let data = {};
//         try {
//             data = await response.json();
//         }
//         catch (e) {
//             console.log('An exception faced while making request to get json body of response from url ' + url, e);
//             return {status: false, exception: e};
//             // return {'ok': false,'code': ERR_EXCEPTION,'body': undefined,'exception': e}
//         }
//         return {status: true, body: data};
//         // return {'ok': true,'code': ERR_NO,'body': data }
//     }
//     console.log('Response is not ok', response);
//     return {status: false, exception: {name: 'http', message: '', statusCode: response.status}};
//     // return {'status': false, 'code': ERR_BAD_REQUEST, 'data': undefined, 'bad_response': response};
// }