
export async function postCatChng(postBody){

const url =process.env.SITE_API_URL

console.log('postBody from postCatChng: ', postBody)
const requestOptions = {
method: "POST",
headers: {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${process.env.SITE_API_KEY}`,

    'Accept': '*/*',
   
    'Connection': 'keep-alive',
    'Cookie': 'NEXT_LOCALE=en',
    'Referer': url,
    'Host': 'www.hepsales.com',
},
body: JSON.stringify(postBody),
redirect: "follow"

}

const response = await fetch(url, requestOptions)

const status = response.ok
console.log('response.ok: ', status)
return status
}