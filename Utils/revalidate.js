require('dotenv').config();
function revalidateStaticWeb(){
    return new Promise((resolve,reject)=>{
        secret = process.envMY_SECRET_TOKEN;
        fetch("https://melange-blog.vercel.app/api/revalidate",{
            headers:{
                "content-type" : "application/json"
            },
            body : JSON.stringify({"secret":secret})
        }).then((res)=>{
            if(res.status == 200){
                res.json().then((dat)=>{
                    console.log(typeof(dat));
                    console.log(dat);
                    resolve(dat);
                }).catch((err)=>{
                    console.log(err);
                    reject(err);
                })
            }else{
                res.json().then((dat)=>{
                    console.log(typeof(dat));
                    console.log(dat);
                    reject(dat);
                }).catch((err)=>{
                    reject(err);
                })
            }
        }).catch((err)=>{
            reject(err);
        })
    })
    
}
module.exports = revalidateStaticWeb;