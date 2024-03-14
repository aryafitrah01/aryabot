const cheerio = require('cheerio')
const axios = require('axios')
const { JSDOM } = require('jsdom')
const request = require('request')
const fetch = require('node-fetch')
const FormData = require('form-data');
const fs = require('fs')
const got = require('got')
const { queryString } = require('object-query-string')
const vm = require('node:vm')
const qs = require('qs')

const { URL_REGEX } = require('@adiwajshing/baileys')
///////
async function pinterest(query) {
	if (query.match(URL_REGEX)) {
		let res = await fetch('https://www.expertsphp.com/facebook-video-downloader.php', {
			method: 'post',
			body: new URLSearchParams(Object.entries({ url: query }))
		})
		let $ = cheerio.load(await res.text())
		let data = $('table[class="table table-condensed table-striped table-bordered"]').find('a').attr('href')
		if (!data) throw 'Can\'t download post :/'
		return data
	} else {
		let res = await fetch(`https://www.pinterest.com/resource/BaseSearchResource/get/?source_url=%2Fsearch%2Fpins%2F%3Fq%3D${query}&data=%7B%22options%22%3A%7B%22isPrefetch%22%3Afalse%2C%22query%22%3A%22${query}%22%2C%22scope%22%3A%22pins%22%2C%22no_fetch_context_on_resource%22%3Afalse%7D%2C%22context%22%3A%7B%7D%7D&_=1619980301559`)
		let json = await res.json()
		let data = json.resource_response.data.results
		if (!data.length) throw `Query "${query}" not found :/`
		return data[~~(Math.random() * (data.length))].images.orig.url
	}
}

async function shortUrl(url) {
	return await (await fetch(`https://tinyurl.com/api-create.php?url=${url}`)).text()
}
////////
async function hentaivid() {
return new Promise((resolve, reject) => {
const page = Math.floor(Math.random() * 1153)
axios.get('https://sfmcompile.club/page/' + page)
.then((data) => {
const $ = cheerio.load(data.data)
const hasil = []
$('#primary > div > div > ul > li > article').each(function (a, b) {
hasil.push({
title: $(b).find('header > h2').text(),
link: $(b).find('header > h2 > a').attr('href'),
category: $(b).find('header > div.entry-before-title > span > span').text().replace('in ', ''),
share_count: $(b).find('header > div.entry-after-title > p > span.entry-shares').text(),
views_count: $(b).find('header > div.entry-after-title > p > span.entry-views').text(),
type: $(b).find('source').attr('type') || 'image/jpeg',
video_1: $(b).find('source').attr('src') || $(b).find('img').attr('data-src'),
video_2: $(b).find('video > a').attr('href') || ''
})
})
resolve(hasil)
})
})
}
//////////
async function igstalk(Username) {
			return new Promise((resolve, reject) => {
				axios.get('https://dumpor.com/v/' + Username, {
					headers: {
						"cookie": "_inst_key=SFMyNTY.g3QAAAABbQAAAAtfY3NyZl90b2tlbm0AAAAYWGhnNS1uWVNLUU81V1lzQ01MTVY2R0h1.fI2xB2dYYxmWqn7kyCKIn1baWw3b-f7QvGDfDK2WXr8",
						"user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36"
					}
				}).then(res => {
					const $ = cheerio.load(res.data)
					const result = {
						profile: $('#user-page > div.user > div.row > div > div.user__img').attr('style').replace(/(background-image: url\(\'|\'\);)/gi, ''),
						fullname: $('#user-page > div.user > div > div.col-md-4.col-8.my-3 > div > a > h1').text(),
						username: $('#user-page > div.user > div > div.col-md-4.col-8.my-3 > div > h4').text(),
						post: $('#user-page > div.user > div > div.col-md-4.col-8.my-3 > ul > li:nth-child(1)').text().replace(' Posts', ''),
						followers: $('#user-page > div.user > div > div.col-md-4.col-8.my-3 > ul > li:nth-child(2)').text().replace(' Followers', ''),
						following: $('#user-page > div.user > div > div.col-md-4.col-8.my-3 > ul > li:nth-child(3)').text().replace(' Following', ''),
						bio: $('#user-page > div.user > div > div.col-md-5.my-3 > div').text()
					}
					resolve(result)
				})
			})
		}
//////////
async function ephoto(url, text) {
    let form = new FormData();
    let gT = await axios.get(url, {
        headers: {
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36"
        }
    });
    let $ = cheerio.load(gT.data);
    let token = $("input[name=token]").val();
    let build_server = $("input[name=build_server]").val();
    let build_server_id = $("input[name=build_server_id]").val();
    form.append("text[]", text);
    form.append("token", token);
    form.append("build_server", build_server);
    form.append("build_server_id", build_server_id);

    let res = await axios({
        url: url,
        method: "POST",
        data: form,
        headers: {
            Accept: "*/*",
            "Accept-Language": "en-US,en;q=0.9",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
            cookie: gT.headers["set-cookie"]?.join("; "),
            ...form.getHeaders() // Move the spread syntax here
        }
    });

    let $$ = cheerio.load(res.data);
    let json = JSON.parse($$("input[name=form_value_input]").val());
    json["text[]"] = json.text;
    delete json.text;

    let {
        data
    } = await axios.post("https://en.ephoto360.com/effect/create-image", new URLSearchParams(json), {
        headers: {
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
            cookie: gT.headers["set-cookie"].join("; ")
        }
    });

    return build_server + data.image;
}

///////
async function rmbg(buffer) {
			let form = new FormData
			form.append("size", "auto")
			form.append("image_file", fs.createReadStream(buffer), "ntah.webp")
			let res = await axios({
				url: "https://api.remove.bg/v1.0/removebg",
				method: "POST",
				data: form,
				responseType: "arraybuffer",
				headers: {
					"X-Api-Key": "dNaWDqPDEuzQTHDba6TACk57",
					...form.getHeaders()
				}
			})
			return res.data
		}
////////// baru 

//////////
async function stalkff(text) {
  var datap = {
    "voucherPricePoint.id": 8050,
    "voucherPricePoint.price": "",
    "voucherPricePoint.variablePrice": "",
    "email": "",
    "n": "",
    "userVariablePrice": "",
    "order.data.profile": "",
    "user.userId": text,
    "voucherTypeName": "FREEFIRE",
    "affiliateTrackingId": "",
    "impactClickId": "",
    "checkoutId": "",
    "tmwAccessToken": "",
    "shopLang": "in_ID",
  }
  var epep = await axios({
    "headers": {
    "Content-Type": "application/json; charset\u003dutf-8"
    },
    "method": "POST",
    "url": "https://order.codashop.com/id/initPayment.action",
    "data": datap
  })
  return {
    id: text,
    nickname: epep.data["confirmationFields"]["roles"][0]["role"]
  }
}  
//////////  
async function mlstalk(id, zoneId) {
  try {
    const response = await axios.post(
      'https://api.duniagames.co.id/api/transaction/v1/top-up/inquiry/store',
      new URLSearchParams(
        Object.entries({
          productId: '1',
          itemId: '2',
          catalogId: '57',
          paymentId: '352',
          gameId: id,
          zoneId: zoneId,
          product_ref: 'REG',
          product_ref_denom: 'AE',
        })
      ),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Referer: 'https://www.duniagames.co.id/',
          Accept: 'application/json',
        },
      }
    );
    return response.data.data.gameDetail;
  } catch (error) {
    throw error;
  }
}

// Contoh pemanggilan function
mlstalk('gameId', 'zoneId')
  .then((gameDetail) => {
    console.log(gameDetail);
  })
  .catch((error) => {
    console.error(error);
  });  
//////////  
async function Tiktokdl(url) {
//async function tiktokdl(url) {
try {
function API_URL(aweme) {
return `https://api16-core-c-useast1a.tiktokv.com/aweme/v1/feed/?aweme_id=${aweme}&version_name=1.0.4&version_code=104&build_number=1.0.4&manifest_version_code=104&update_version_code=104&openudid=4dsoq34x808ocz3m&uuid=6320652962800978&_rticket=1671193816600&ts=1671193816&device_brand=POCO&device_type=surya&device_platform=android&resolution=1080*2179&dpi=440&os_version=12&os_api=31&carrier_region=US&sys_region=US%C2%AEion=US&app_name=TikMate%20Downloader&app_language=en&language=en&timezone_name=Western%20Indonesia%20Time&timezone_offset=25200&channel=googleplay&ac=wifi&mcc_mnc=&is_my_cn=0&aid=1180&ssmix=a&as=a1qwert123&cp=cbfhckdckkde1`;
};
async function getAwemeId(url) {
// any :/
let result;
const Konto1 = /video\/([\d|\+]+)?\/?/;
const valid = url.match(Konto1);
if (valid) {
return valid[1];
}
else {
try {
const data = await got
.get(url, {
headers: {
"Accept-Encoding": "deflate",
},
maxRedirects: 0,
})
.catch((e) => e.response.headers.location);
const _url = data;
const _valid = _url.match(Konto1);
if (_valid) {
result = _valid[1];
}
}
catch (error) {
// console.log(error)
result = false;
}
}
return result;
};
const valid = await getAwemeId(url);
//if (!valid) return false // result = false
const data = await got
.get(API_URL(valid), {
headers: {
"Accept-Encoding": "deflate",
"User-Agent": "okhttp/3.14.9",
},
})
.catch((e) => e.response);
//if (!data) return false // result = false
const body = JSON.parse(data.body);
const obj = body.aweme_list.find((o) => o.aweme_id === valid)
const results = {
aweme_id: obj.aweme_id,
region: obj.region,
desc: obj.desc,
create_time: obj.create_time,
author: {
uid: obj.author.uid,
unique_id: obj.author.unique_id,
nickname: obj.author.nickname,
birthday: obj.author.birthday,
},
duration: obj.music.duration,
download: {
nowm: obj.video.play_addr.url_list[0],
wm: obj.video.download_addr.url_list[0],
music: obj.music.play_url.url_list[0],
music_info: {
id: obj.music.id,
title: obj.music.title,
author: obj.music.author,
is_original: obj.music.is_original,
cover_hd: obj.music.cover_hd.url_list[0],
cover_large: obj.music.cover_large.url_list[0],
cover_medium: obj.music.cover_medium.url_list[0],
},
},
};
return {
status: true,
result: results//data.body //valid
}
} catch (e) {
return { status: false, result: e }
}
}  
//////////  
const photoOxy = (url, text) => new Promise((resolve, reject) => {
  axios({
    method: 'GET',
    url: url,
    headers: {
      'user-agent': 'Mozilla/5.0 (Linux; Android 9; Redmi 7A) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.99 Mobile Safari/537.36'
    }
  })
  .then(({ data, headers }) => {
    const token = /<input type="hidden" name="token" value="(.*?)" id="token">/.exec(data)[1]
    const build_server = /<input type="hidden" name="build_server" value="(.*?)" id="build_server">/.exec(data)[1]
    const build_server_id = /<input type="hidden" name="build_server_id" value="(.*?)" id="build_server_id">/.exec(data)[1]
    const cookie = headers['set-cookie'][0]
    const form = new FormData()
    if (typeof text === 'string') text = [text]
    for (let texts of text) form.append('text[]', texts)
    form.append('sumbit', 'GO')
    form.append('token', token)
    form.append('build_server', build_server)
    form.append('build_server_id', build_server_id)
    axios({
      method: 'POST',
      url: url,
      data: form,
      headers: {
        'user-agent': 'Mozilla/5.0 (Linux; Android 9; Redmi 7A) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.99 Mobile Safari/537.36',
        'cookie': cookie,
        ...form.getHeaders()
      }
    })
    .then(({ data }) => {
      const form_value = /<div.*?id = "form_value".+>(.*?)<\/div>/.exec(data)[1]
      axios({
        method: 'GET',
        url: 'https://photooxy.com/effect/create-image?' + queryString(JSON.parse(form_value)),
        headers: {
          'user-agent': 'Mozilla/5.0 (Linux; Android 9; Redmi 7A) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.99 Mobile Safari/537.36',
          'cookie': cookie
        }
      })
      .then(({ data }) => {
        resolve(build_server + data.image)
      })
      .catch(reject)
    })
    .catch(reject)
  })
  .catch(reject)
})

const photoOxyRadio = (url, text, radio) => new Promise((resolve, reject) => {
  axios({
    method: 'GET',
    url: url,
    headers: {
      'user-agent': 'Mozilla/5.0 (Linux; Android 9; Redmi 7A) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.99 Mobile Safari/537.36'
    }
  })
  .then(({ data, headers }) => {
    const token = /<input type="hidden" name="token" value="(.*?)" id="token">/.exec(data)[1]
    const build_server = /<input type="hidden" name="build_server" value="(.*?)" id="build_server">/.exec(data)[1]
    const build_server_id = /<input type="hidden" name="build_server_id" value="(.*?)" id="build_server_id">/.exec(data)[1]
    const cookie = headers['set-cookie'][0]
    const form = new FormData()
    form.append('radio0[radio]', radio)
    if (typeof text === 'string') text = [text]
    for (let texts of text) form.append('text[]', texts)
    form.append('sumbit', 'GO')
    form.append('token', token)
    form.append('build_server', build_server)
    form.append('build_server_id', build_server_id)
    axios({
      method: 'POST',
      url: url,
      data: form,
      headers: {
        'user-agent': 'Mozilla/5.0 (Linux; Android 9; Redmi 7A) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.99 Mobile Safari/537.36',
        'cookie': cookie,
        ...form.getHeaders()
      }
    })
    .then(({ data }) => {
      const form_value = /<div.*?id = "form_value".+>(.*?)<\/div>/.exec(data)[1]
      axios({
        method: 'GET',
        url: 'https://photooxy.com/effect/create-image?' + queryString(JSON.parse(form_value)),
        headers: {
          'user-agent': 'Mozilla/5.0 (Linux; Android 9; Redmi 7A) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.99 Mobile Safari/537.36',
          'cookie': cookie
        }
      })
      .then(({ data }) => {
        resolve(build_server + data.image)
      })
      .catch(reject)
    })
    .catch(reject)
  })
  .catch(reject)
})
//////////  
async function Telesticker(url) {
    return new Promise(async (resolve, reject) => {
        if (!url.match(/(https:\/\/t.me\/addstickers\/)/gi)) throw 'Enther your url telegram sticker'
        packName = url.replace("https://t.me/addstickers/", "")
        data = await axios(`https://api.telegram.org/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/getStickerSet?name=${encodeURIComponent(packName)}`, {method: "GET",headers: {"User-Agent": "GoogleBot"}})
        const hasil = []
        for (let i = 0; i < data.data.result.stickers.length; i++) {
            fileId = data.data.result.stickers[i].thumb.file_id
            data2 = await axios(`https://api.telegram.org/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/getFile?file_id=${fileId}`)
            result = {
            status: 200,
            author: 'Xfarr05',
            url: "https://api.telegram.org/file/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/" + data2.data.result.file_path
            }
            hasil.push(result)
        }
    resolve(hasil)
    })
}
  
//////////  
async function tiktok(url) {
  // Try using tiklydown.eu.org API first
  let tiklydownAPI = `https://api.tiklydown.eu.org/api/download?url=${url}`;
  let response = await axios.get(tiklydownAPI);
  return response.data;
}  
//////////  

const APIs = {
    1: 'https://apkcombo.com',
    2: 'apk-dl.com',
    3: 'https://apk.support',
    4: 'https://apps.evozi.com/apk-downloader',
    5: 'http://ws75.aptoide.com/api/7',
    6: "https://cafebazaar.ir"
}
const Proxy = (url) => (url ? `https://translate.google.com/translate?sl=en&tl=fr&hl=en&u=${encodeURIComponent(url)}&client=webapp` : '')
const api = (ID, path = '/', query = {}) => (ID in APIs ? APIs[ID] : ID) + path + (query ? '?' + new URLSearchParams(Object.entries({
    ...query
})) : '')

const tools = {
    APIs,
    Proxy,
    api
}

let apkcombo = {
    search: async function(args) {
        let res = (await fetch(tools.Proxy(tools.api(1, '/search/' + encodeURIComponent(args.replace(' ', '-'))))))
        let ress = []
        res = (await res.text())
        let $ = cheerio.load(res)
        let link = []
        let name = []
        $('div.content-apps > a').each(function(a, b) {
            let nem = $(b).attr('title')
            name.push(nem)
            link.push($(b).attr('href').replace('https://apkcombo-com.translate.goog/', 'https://apkcombo.com/').replace('/?_x_tr_sl=en&_x_tr_tl=fr&_x_tr_hl=en&_x_tr_pto=wapp', ''))
        })
        for (var i = 0; i < (name.length || link.length); i++) {
            ress.push({
                name: name[i],
                link: link[i]
            })
        }
        return ress
    },
    download: async function(url) {
        let res = (await fetch(url))
        res = (await res.text())
        let $ = cheerio.load(res)
        let img = $('div.app_header.mt-14 > div.avatar > img').attr('data-src')
        let developer = $('div.container > div > div.column.is-main > div.app_header.mt-14 > div.info > div.author > a').html()
        let appname = $('div.container > div > div.column.is-main > div.app_header.mt-14 > div.info > div.app_name > h1').text()
        let link1 = 'https://apkcombo.com' + $('div.container > div > div.column.is-main > div.button-group.mt-14.mb-14.is-mobile-only > a').attr('href')
        res = (await fetch(link1))
        res = (await res.text())
        $ = cheerio.load(res)
        let link = $('#best-variant-tab > div:nth-child(1) > ul > li > ul > li > a').attr('href') + '&fp=945d4e52764ab9b1ce7a8fba0bb8d68d&ip=160.177.72.111'
        return {
            img,
            developer,
            appname,
            link
        }
    }
}

let apkdl = {
    search: async function(args) {
        let res = (await fetch(tools.Proxy(tools.api(2, '/search', {
            q: args
        }))))
        res = (await res.text())

        let $ = cheerio.load(res)

        let link = []
        let name = []
        let ress = []
        $('a.title').each(function(a, b) {
            let nem = $(b).text()
            name.push(nem)
            link.push($(b).attr('href').replace('https://apk--dl-com.translate.goog/', 'https://apk-dl.com/').replace('?_x_tr_sl=en&_x_tr_tl=fr&_x_tr_hl=en&_x_tr_pto=wapp', ''))
        })
        for (var i = 0; i < (name.length || link.length); i++) {
            ress.push({
                name: name[i],
                link: link[i]
            })
        }
        return ress
    },
    download: async function(url) {
        let res = (await fetch(tools.Proxy(url)))
        res = (await res.text())
        let $ = cheerio.load(res)
        let img = $('div.logo > img').attr('src')
        let developer = $('div.developer > a').attr('title')
        let appname = $('div.heading > h1 > a').attr('title')
        let link2 = $('div.download-btn > div > a.mdl-button.mdl-js-button.mdl-button--raised.mdl-js-ripple-effect.fixed-size.mdl-button--primary').attr('href')
        res = (await fetch(link2))
        res = (await res.text())
        $ = cheerio.load(res)
        let link1 = $('head > meta:nth-child(11)').attr('content')
        link1 = link1.replace('0; url=', '')
        res = (await fetch(link1))
        res = (await res.text())
        $ = cheerio.load(res)
        let link = 'https:' + $('body > div.mdl-layout.mdl-js-layout.mdl-layout--fixed-header > div > div > div > div > div > div:nth-child(1) > div:nth-child(3) > a').attr('href')
        return {
            img,
            developer,
            appname,
            link
        }
    }
}

let aptoide = {
    search: async function(args) {
        let res = (await fetch(tools.api(5, '/apps/search', {
            query: args,
            limit: 1000
        })))

        let ress = {}
        res = (await res.json())
        ress = res.datalist.list.map(v => {
            return {
                name: v.name,
                id: v.package
            }
        })
        return ress
    },
    download: async function(id) {
        let res = (await fetch(tools.api(5, '/apps/search', {
            query: id,
            limit: 1
        })))

        res = (await res.json())
        return {
            img: res.datalist.list[0].icon,
            developer: res.datalist.list[0].store.name,
            appname: res.datalist.list[0].name,
            link: res.datalist.list[0].file.path
        }
    }
}
//////////  
const fetchJson = (url, options) => new Promise(async (resolve, reject) => {
    fetch(url, options)
        .then(response => response.json())
        .then(json => {
            resolve(json)
        })
        .catch((err) => {
            reject(err)
        })
})


const getBuffer = async (url, options) => {
	try {
		options ? options : {}
		const res = await axios({
			method: "get",
			url,
			headers: {
				'DNT': 1,
                    'User-Agent': 'GoogleBot',
				'Upgrade-Insecure-Request': 1
			},
			...options,
			responseType: 'arraybuffer'
		})
		return res.data
	} catch (e) {
		console.log(`Error : ${e}`)
	}
}
  
 ////////// 
async function npmstalk(packageName) {
  let stalk = await axios.get("https://registry.npmjs.org/"+packageName)
  let versions = stalk.data.versions
  let allver = Object.keys(versions)
  let verLatest = allver[allver.length-1]
  let verPublish = allver[0]
  let packageLatest = versions[verLatest]
  return {
    name: packageName,
    versionLatest: verLatest,
    versionPublish: verPublish,
    versionUpdate: allver.length,
    latestDependencies: Object.keys(packageLatest.dependencies).length,
    publishDependencies: Object.keys(versions[verPublish].dependencies).length,
    publishTime: stalk.data.time.created,
    latestPublishTime: stalk.data.time[verLatest]
  }
}  
//////////  
async function jarak(dari, ke) {
var html = (await axios(`https://www.google.com/search?q=${encodeURIComponent('jarak ' + dari + ' ke ' + ke)}&hl=id`)).data
var $ = cheerio.load(html), obj = {}
var img = html.split("var s=\'")?.[1]?.split("\'")?.[0]
obj.img = /^data:.*?\/.*?;base64,/i.test(img) ? Buffer.from(img.split`,` [1], 'base64') : ''
obj.desc = $('div.BNeawe.deIvCb.AP7Wnd').text()?.trim()
return obj
}  
  
//////////  
async function ttimg(link) {
    try {
        let url = `https://dlpanda.com/es?url=${link}&token=G7eRpMaa`;
        let response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);
        let imgSrc = [];
        $('div.col-md-12 > img').each((index, element) => {
            imgSrc.push($(element).attr('src'));
        });
        return { data: imgSrc };
    } catch (error) {
        console.error(error);
        return { data: [] };
    }
}
  
//////////  
const RemoVebg = (url, color) => {
  return new Promise(async (resolve, reject) => {
    const payload = {
      "image_file_b64": "",
      "image_url": url,
      "size": "preview",
      "type": "auto",
      "type_level": "1",
      "format": "auto",
      "roi": "0% 0% 100% 100%",
      "crop": false,
      "crop_margin": "0",
      "scale": "original",
      "position": "original",
      "channels": "rgba",
      "add_shadow": false,
      "semitransparency": true,
      "bg_color": color,
      "bg_image_url": ""
    }
    await axios({
      method: "POST", 
      url: "https://api.remove.bg/v1.0/removebg",
      data: payload,
      headers: {
        "accept": "application/json",
        "X-API-Key": "UgjxxGCBGrEy98UwMwziHLp2",
        "Content-Type": "application/json"
      }
    })
    .then(( res ) => {
      const buffer = Buffer.from(res.data.data.result_b64, "base64")
      resolve(buffer)
    })
    .catch((e) => {
      resolve(e?.response)
    })
  })
}  
 //////////  
function twitter(link){
	return new Promise((resolve, reject) => {
		let config = {
			'URL': link
		}
		axios.post('https://twdown.net/download.php',qs.stringify(config),{
			headers: {
				"accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
				"sec-ch-ua": '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
				"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
				"cookie": "_ga=GA1.2.1388798541.1625064838; _gid=GA1.2.1351476739.1625064838; __gads=ID=7a60905ab10b2596-229566750eca0064:T=1625064837:RT=1625064837:S=ALNI_Mbg3GGC2b3oBVCUJt9UImup-j20Iw; _gat=1"
			}
		})
		.then(({ data }) => {
		const $ = cheerio.load(data)
		resolve({
				desc: $('div:nth-child(1) > div:nth-child(2) > p').text().trim(),
				thumb: $('div:nth-child(1) > img').attr('src'),
				video_sd: $('tr:nth-child(2) > td:nth-child(4) > a').attr('href'),
				video_hd: $('tbody > tr:nth-child(1) > td:nth-child(4) > a').attr('href'),
				audio: 'https://twdown.net/' + $('body > div.jumbotron > div > center > div.row > div > div:nth-child(5) > table > tbody > tr:nth-child(3) > td:nth-child(4) > a').attr('href')
			})
		})
	.catch(reject)
	})
}  
//////////    

//////////  
async function cerpen(category) {
	return new Promise(async (resolve, reject) => {
		let title = category.toLowerCase().replace(/[()*]/g, "")
		let length, judul = title.replace(/\s/g, "-")
		try {
			let res = await axios.get('http://cerpenmu.com/category/cerpen-'+judul)
			let $ = await cheerio.load(res.data)
			length = $('html body div#wrap div#content article.post div.wp-pagenavi a')
			length = length['4'].attribs.href.split('/').pop()
		} catch { length = 0 }
		let page = Math.floor(Math.random() * parseInt(length))
		axios.get('http://cerpenmu.com/category/cerpen-'+judul+'/page/'+page)
		.then((get) => {
			let $ = cheerio.load(get.data)
			let link = []
			$('article.post').each(function (a, b) {
				link.push($(b).find('a').attr('href'))
			})
			let random = link[Math.floor(Math.random() * link.length)]
			axios.get(random)
			.then((res) => {
				let $$ = cheerio.load(res.data)
				let hasil = {
					title: $$('#content > article > h1').text(),
					author: $$('#content > article').text().split('Cerpen Karangan: ')[1].split('Kategori: ')[0],
					kategori: $$('#content > article').text().split('Kategori: ')[1].split('\n')[0],
					lolos: $$('#content > article').text().split('Lolos moderasi pada: ')[1].split('\n')[0],
					cerita: $$('#content > article > p').text()
				}
				resolve(hasil)
			})
		})
	})
}

//////////  
async function Spotifydl(text) {
  const response = await fetch(`https://api.caliph.biz.id/api/download/spotify?url=${text}&apikey=qnGcf9ft`);
  return response;
}
///////////
async function Spotify(text) {
  const response = await fetch(`https://api.caliph.biz.id/api/search/spotify?query=${text}&apikey=qnGcf9ft`);
  return response;
}

/////////////
const Gempa = () => new Promise((resolve, reject) => {
  axios.get('https://www.bmkg.go.id/gempabumi/gempabumi-dirasakan.bmkg').then((response) => {
  const $ = cheerio.load(response.data)

  const urlElems = $('table.table-hover.table-striped')

  for (let i = 0; i < urlElems.length; i++) {
    const urlSpan = $(urlElems[i]).find('tbody')[0]

    if (urlSpan) {
      const urlData = $(urlSpan).find('tr')[0]
      var Kapan = $(urlData).find('td')[1]
      var Letak = $(urlData).find('td')[2]
      var Magnitudo = $(urlData).find('td')[3]
      var Kedalaman = $(urlData).find('td')[4]
      var Wilayah = $(urlData).find('td')[5]
      var lintang = $(Letak).text().split(' ')[0]
      var bujur = $(Letak).text().split(' ')[2]
      var hasil = {
        Waktu: $(Kapan).text(),
        Lintang: lintang,
        Bujur: bujur,
        Magnitudo: $(Magnitudo).text(),
        Kedalaman: $(Kedalaman).text().replace(/\t/g, '').replace(/I/g, ''),
        Wilayah: $(Wilayah).text().replace(/\t/g, '').replace(/I/g, '').replace('-','').replace(/\r/g, '').split('\n')[0],
     	Map: $('div.row > div > img').attr('src')
      }
      // We then print the text on to the console
      resolve(hasil);
    
    }
  }
  }).catch(err => reject(err))
})  
//////////
function Lirik(judul) {
    return new Promise(async (resolve, reject) => {
        try {
            let { data } = await axios.get(`https://www.musixmatch.com/search/${judul}`);
            const $ = cheerio.load(data);

            let limk = 'https://www.musixmatch.com';
            const link = limk + $('div.media-card-body > div > h2').find('a').attr('href');

            let { data: lyricsData } = await axios.get(link);
            const $$ = cheerio.load(lyricsData);

            let hasil = {
                thumb: 'https:' + $$('div.col-sm-1.col-md-2.col-ml-3.col-lg-3.static-position > div > div > div').find('img').attr('src'),
                lirik: $$('div.col-sm-10.col-md-8.col-ml-6.col-lg-6 > div.mxm-lyrics').find('span > p > span').text() + '\n' + $$('div.col-sm-10.col-md-8.col-ml-6.col-lg-6 > div.mxm-lyrics').find('span > div > p > span').text()
            };

            resolve(hasil);
        } catch (error) {
            reject(error);
        }
    });
}
///////////////////
async function jadianime(url) {
  try {
    const { data } = await axios.post("https://tools.revesery.com/image-anime/convert.php", new URLSearchParams(Object.entries({
      "image-url": url
    })));
    return Buffer.from(data.image.split(",")[1], "base64");
  } catch (error) {
    console.error(error);
    throw 'Error in jadianime function';
  }
}
///////
async function swallpapercraft(query) {
	return new Promise((resolve, reject) => {
		axios.get('https://wallpaperscraft.com/search/?query=' + query)
			.then(({
				data
			}) => {
				const $ = cheerio.load(data)
				const result = [];
				$('span.wallpapers__canvas').each(function(a, b) {
					result.push($(b).find('img').attr('src'))
				})
				resolve(result)
			})
			.catch(reject)
	})
}
//////////
async function scariresep(query) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get('https://resepkoki.id/?s=' + query);
            const $ = cheerio.load(response.data);

            const recipes = [];

            $('article').each((index, element) => {
                const judul = $(element).find('header h3 a').text().trim();
                const link = $(element).find('div.archive-item-media a').attr('href');

                if (judul && link) {
                    recipes.push({ judul, link });
                }
            });

            const result = {
                creator: "Wudysoft",
                data: recipes
            };

            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}

///////
function quotesAnime() {
return new Promise((resolve, reject) => {
const page = Math.floor(Math.random() * 184);
axios.get('https://otakotaku.com/quote/feed/' + page)
.then(({ data }) => {
const $ = cheerio.load(data);
const hasil = [];
$('div.kotodama-list').each(function (l, h) {
hasil.push({
link: $(h).find('a').attr('href'),
gambar: $(h).find('img').attr('data-src'),
karakter: $(h).find('div.char-name').text().trim(),
anime: $(h).find('div.anime-title').text().trim(),
episode: $(h).find('div.meta').text(),
up_at: $(h).find('small.meta').text(),
quotes: $(h).find('div.quote').text().trim()
});
});
resolve(hasil);
})
.catch(reject);
});
}
///////
function servermc() {
    return new Promise((resolve, reject) => {
        axios.get(`https://minecraftpocket-servers.com/country/indonesia/`)
            .then(({ data }) => {
                const $ = cheerio.load(data);
                const hasil = [];

                $("tr").each(function (c, d) {
                    const ip = $(d).find("button.btn.btn-secondary.btn-sm").eq(1).text().trim().replace(':19132', '');
                    const port = '19132';
                    const versi = $(d).find("a.btn.btn-info.btn-sm").text().trim();
                    const player = $(d).find("td.d-none.d-md-table-cell > strong").eq(1).text().trim();

                    const Data = {
                        ip: ip,
                        port: port,
                        versi: versi,
                        player: player
                    };
                    hasil.push(Data);
                });

                resolve(hasil);
            })
            .catch(reject);
    });
}

////////

////////

////////

///////

//////
module.exports = { 
pinterest,
hentaivid,
ephoto,
jarak,
igstalk,
stalkff,
mlstalk,
Tiktokdl,
photoOxy,
photoOxyRadio,
Telesticker,
tiktok,
apkdl,
apkcombo,
aptoide,
getBuffer,
npmstalk,
ttimg,
RemoVebg,
twitter,
cerpen,
Spotifydl,
Spotify,
Gempa,
Lirik,
jadianime,
swallpapercraft,
scariresep,
quotesAnime,
servermc
}