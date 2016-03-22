
# staticfile

staticfile,即静态文件服务器。当浏览器发送URL，静态文件服务端解析URL，对应到硬盘上的文件，应该有以下结果
1. 如果文件存在，返回200状态码，并发送文件到浏览器端.
2. 如果文件不存在，返回404状态码，发送一个404的文件到浏览器端。
### 实现路由
实现路由需要添加url模块，用于解析pathname
```
var pathname = url.parse(request.url).pathname.toLowerCase();
var realpath = "public" + pathname;
### 读取静态文件
读取文件需要添加fs模块。通过path模块的path.exists方法来判断静态文件是否存在磁盘上。如果不存在我们响应给客户端404错误。
如果文件存在则调用fs.readFile方法读取文件.如果发生错误，我们响应给客户端500错误，表明存在内部错误。正常状态下则发送读取到的文件给客户端，表明200状态

```
###MIME类型支持
静态文件服务器同时要存放html, css, js, png, gif, jpg等不同类型的文件，所以要支持MIME类型。
path.extname来获取文件的后缀名。由于extname返回值包含”.”，所以通过slice方法来剔除掉”.”，对于没有后缀名的文件，我们一律认为是unknown。

```
var ext = path.extname(realPath);
ext = ext ? ext.slice(1) : 'unknown';
```
## License
Apache 