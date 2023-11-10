const execs = require('child_process').exec;
const WebSocket = require('ws')
const isRunning = (query, cb) => {
	execs("ps -A", (err, stdout, stderr) => {
		cb(stdout.toLowerCase().indexOf(query.toLowerCase()) > -1);
	});
}

let program = ["code","msedge","nvim","yesplaymusic"]
let now = []

const ws = new WebSocket('ws://192.168.10.213:4000/ws', {
	perMessageDeflate: true
});

ws.on('open', (msg) =>{
  ws.send(JSON.stringify({
    meta:"send"
  }))
});

const send_data=()=>{
	console.log(now);

  ws.send(JSON.stringify({
    meta:"using",
		data:now
  }))
}

setInterval(() => {
	program.forEach((item,index)=>{
		isRunning(item,(status)=>{
			if(status && now.indexOf(item)===-1){
					now.push(item)
					send_data()
			}
			if(!status && now.indexOf(item)>=0){
				now=now.filter((old)=>{
					return  old!=item
				})
				send_data()
			}
		})
	})

}, 1000)