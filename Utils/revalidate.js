const secrets = require('../secrets');
const log = require('electron-log');
const paths = new Map([
    ["blogs","/"],
    ["editorials",'/editorials'],
    ["devlogs","/devlogs"]
])
function revalidateStaticWeb(data){
    return new Promise((resolve,reject)=>{
        const secret = secrets.MY_SECRET_TOKEN;

        fetch("https://melange-blog.vercel.app/api/revalidate",{
            method: "POST",
            headers:{
                "content-type" : "application/json"
            },
            body : JSON.stringify({"secret":secret,"path":paths.get(data.collection)})
        }).then((res)=>{
            if(res.status == 200){
                res.json().then((dat)=>{
                    // log.info(dat)
                    if(dat.message == "Invalid token"){
                        log.error("Invalid Token")
                        log.error(dat)
                        reject("Invalid Token");
                    }else{
                        resolve(dat);
                    }
                }).catch((err)=>{
                    log.error(err)
                    reject(err);
                })
            }else{
                res.json().then((dat)=>{
                    log.error("revalidate request failed, state != 200")
                    log.info(dat)
                    reject(dat);
                }).catch((err)=>{
                    log.error(err)
                })
            }
        }).catch((err)=>{
            log.error(err)
            reject(err);
        })
    })
    
}
module.exports = revalidateStaticWeb;