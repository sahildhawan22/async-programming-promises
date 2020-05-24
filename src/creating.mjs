import setText, { appendText } from "./results.mjs";

export function timeout() {
    const wait = new Promise((resolve) => {
        setTimeout(() => {
            resolve("Timeout!");
        }, 1500);
    });

    //For handling the fulfilled state:
    wait.then((myText)=>{
        setText(myText);
    });
}

export function interval() {
    const wait = new Promise((resolve)=>{
        let counter = 0;
        setInterval(()=>{
            //console.log to see everytime the function fires
            console.log("Interval");
            resolve(`Timeout! ${++counter}`);
        }, 1500);
    });

    wait.then((text)=> {
        setText(text);
     }).finally(() => {
         appendText("--Done");
     });
}

export function clearIntervalChain() {

    let intervalId;
    const wait = new Promise((resolve)=>{
        let counter = 0;
        intervalId = setInterval(()=>{
            //console.log to see everytime the function fires
            console.log("Interval");
            resolve(`Timeout! ${++counter}`);
        }, 1500);
    });

    wait.then((text)=> {
        setText(text);
     }).finally(() => {
         clearInterval(intervalId);
     });
}

export function xhr() {
    let request = new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", "http://localhost:3000/users/7");
        xhr.onload = () => {
            if(xhr.status == 200){
                resolve(xhr.responseText);
            } else{
                reject(xhr.statusText);
            }
        };
        xhr.send();
    });

    request.then((text) => setText(text))
    .catch((reason) => setText(reason));
}

export function allPromises() {
    let categories = axios.get("http:localhost:3000/categories");

}

export function allSettled() {
}

export function race() {
}
