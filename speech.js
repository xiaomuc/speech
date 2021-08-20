// get url params
var url = new URL(window.location.href);
var params = url.searchParams;
const inputTextarea = document.getElementById("FlexTextarea");
const log = document.getElementById("event-log");
const list_view = document.getElementById("list-view");
var timer; 
var inputArray=[];
function writeLog(msg){
    const date1 = new Date();
    //log.textContent = log.textContent + date1.toLocaleTimeString()+`:` + msg + `\n`;
    log.textContent = log.textContent + `${performance.now()}\t${msg}\n`;
}
function flexTextarea(el) {
    sz = params.get("size");
    writeLog("size:"+sz);
    if(sz != null){
        el.style.fontSize=sz;
    }
    tm = params.get("timer");
    if(tm == null){
        tm = 30000;
    }
    writeLog("timer:"+tm);
    const dummy = el.querySelector('.FlexTextarea__dummy')
    el.querySelector('.FlexTextarea__textarea').addEventListener('input', e => {
        dummy.textContent = e.target.value + '\u200b';
        writeLog(`${e.type}\t${e.data}`);
        //writeLog(e.target.value);
        inputTime = performance.now();
        inputValue = e.data;
        if(inputValue==null){
            inputValue = '[null]';
        }

        if(inputArray.length>0 && inputTime - inputArray[0].time < 5){
            inputValue = inputArray[0].value + inputValue;
        }
        inputArray.unshift({
            time:inputTime,
            value:inputValue
        });
        clearTimeout(timer);
        for(var i=0; i<inputArray.length;i++){
            var item = inputArray[i];
            if(inputTime-item.time>5 && inputValue==item.value){
                timer = setTimeout(clr,tm);
                writeLog('timer set')
                break;
            }
        };
        list_view.textContent="";
        for(var i=0;i<inputArray.length;i++){
            item = inputArray[i];
            list_view.textContent = list_view.textContent + `${item.time}\t${item.value}\n`;
        }
    });
}
var clr = function(){
    document.getElementById("text_form").reset();
    writeLog("timer-timeout");
    inputTextarea.focus();
    inputArray=[];
}

window.onload = function(){
    document.querySelectorAll('.FlexTextarea').forEach(flexTextarea)
}