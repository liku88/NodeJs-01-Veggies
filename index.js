//file module
const fs = require("fs");

//http module
const http = require("http");

//url module
const url = require("url");

const textInp = fs.readFileSync("./txt/input.txt", "utf8");
const textOut = `This is what we know about the avacoado: ${textInp}.\nCreated on ${Date.now()}`;

const dataSyn = fs.readFileSync("./dev-data/data.json", 'utf-8');
const prodData = JSON.parse(dataSyn);

const tempOverview = fs.readFileSync("./templates/template-overview.html", "utf-8");
const tempProduct = fs.readFileSync("./templates/template-product.html", "utf-8");
const tempCard = fs.readFileSync("./templates/template-card.html", "utf-8");


const replaceTemplate = (temp , product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTSNAME%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);

    if(!product.organic) output = output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');

    return output;

}


const server = http.createServer((req , res) => {
    const {query , pathname}  =  url.parse(req.url , true);

    //Overview Page
    //------------------
    if(pathname === '/' || pathname === '/overview'){
        // res.end("This is overview");
            res.writeHead(200, {
                'Content-type' : 'text/html',
            });
            const cardsHtml = prodData.map((data) => replaceTemplate(tempCard , data)).join('');
            const output = tempOverview.replace(' {%PRODUCT_CARD%}', cardsHtml);
            res.end(output);
    }else if(pathname === '/product'){
        res.writeHead(200, {
            'Content-type' : 'text/html',
        });
        const product = prodData[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);

    }
    else if(pathname === '/api'){
    
           res.writeHead(200, {
            'Content-type' : 'application/json',
        });
           res.end(dataSyn);
        
        
    }
    else{
        res.writeHead(404, {
            'Content-type' : 'text/html',
            'my-own-header' : 'hello-world'
        });
        res.end("404 page");
    }
    
});

server.listen(8000, '127.0.0.1');
