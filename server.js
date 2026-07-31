const Fastify=require("fastify");
const path=require("node:path");
const fs=require("node:fs/promises");
const mime=require("mime-types");

const app=Fastify({logger:false});
const docs=path.resolve(__dirname,"docs");

const blacklist=[
    ".git",
    "node_modules"
];
const PORT=3000;

async function reply404(reply){
    reply.code(404).type("text/html");
    return reply.send(await fs.readFile(path.join(docs,"404.html")));
}

app.get("/*",async(req,reply)=>{
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
});
console.log(`Starting server on port: ${PORT}`);
app.listen({port:PORT},err=>{
    if(err)throw err;
    console.log(`Server is online - preview at http://127.0.0.1:${PORT}`);
});