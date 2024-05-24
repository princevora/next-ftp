import jsftp from "jsftp";
import { NextResponse } from "next/server";
import { resolve } from "path";
import { PassThrough } from "stream";
import mime from "mime-types";

export async function POST(req){
    const file = "your love is my drug8 bit (slowed).mp3";
    const data = {pass: "Princevora2007@",
    user: "two-a-penny-buses"};

    let contentType = mime.lookup(file) || 'application/octet-stream';

    const ftp = new jsftp({
        host: "files.000webhost.com",
        pass: data.pass,
        user: data.user
    });

    let size;
    ftp.auth(data.user, data.pass, (err, data) => {});
    ftp.raw("SIZE", file, (err, data) => {
        size = parseInt(data.text.slice(4));
    })

    const getFile = () => new Promise((resolve, reject) => {
        ftp.get(file, (err, socket) => {
            if(err) console.log(err);
            const strema = new PassThrough();
            socket.pipe(strema);
    
            resolve(strema)
        })
    })

    const rep = await getFile();
    const rsp = new NextResponse(rep, {
        headers: {
            "File-Size": size,
            "Content-Type": contentType
        }
    })
    return rsp;
}