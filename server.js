const Fastify=require("fastify");
const path=require("node:path");
const fs=require("node:fs/promises");
const mime=require("mime-types");

const app=Fastify({logger:false});
const docs=path.resolve(__dirname,"docs");

const blacklist=[
    ".git/",
    "node_modules/"
];
const PORT=3000;

async function reply404(reply){
    reply.code(404).type("text/html");
    return reply.send(await fs.readFile(path.join(docs,"404.html")));
}
process.on('SIGINT',function(){
    console.log("\x1b[33m▶\x1b[38;5;244m Caught interrupt signal\x1b[0m");
    process.exit(0);
});

async function handleRequest(req,reply){
    const p=decodeURIComponent(req.params["*"]||"");
    if(p===".env"){return reply404(reply)}
    for(const dir of blacklist){if(p.startsWith(dir)){return reply404(reply)}}
    if(p&&!path.extname(p)&&!req.raw.url.endsWith("/")){
        try{
            const index=path.resolve(docs,p,"index.html");
            if(index.startsWith(docs)&&(await fs.stat(index)).isFile()){
                return reply.redirect(req.raw.url+"/");
            }
        }catch{}
    }
    const files=p?[p,path.join(p,"index.html"),...(path.extname(p)?[]:[p+".html"])]:["index.html"];
    for(const file of files){
        const full=path.resolve(docs,file);
        if(!full.startsWith(docs))continue;
        try{
            if((await fs.stat(full)).isFile()){
                reply.type(mime.lookup(full)||"application/octet-stream");
                return reply.send(await fs.readFile(full));
            }
        }catch{}
    }
    return reply404(reply);
}
app.get("/*",handleRequest);

console.log(`\x1b[38;5;244mStarting server on port: \x1b[34m${PORT}\x1b[0m`);
app.listen({port:PORT},err=>{
    if(err){console.warn(`\x1b[31m✗ Error: \x1b[0m${err}\x1b[0m`);}
    else{console.log(`\x1b[32m√\x1b[0m Server is online\x1b[38;5;244m - preview at \x1b[36mhttp://127.0.0.1:${PORT}\x1b[0m`);}
});