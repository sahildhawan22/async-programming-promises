import setText, {appendText, showWaiting, hideWaiting} from './results.mjs';

export function get(){
 /*  axios.get("http://localhost:3000/orders/1").then(
    res => setText(JSON.stringify(res.data))
  ) */

  //then accepts only 1 function as its parameter and is used to handle the FULFILLED state of the promise, i.e then is used to handle success of the API Call.
  axios.get("http://localhost:3000/orders/1").then(
    function({data}){
      setText(JSON.stringify(data));
    }
  );

  //See in the second example, we used JS destructuring to directly access data key of our result from Promise.
}

export function getCatch(){

  // Delibrately failing the request
 /*  axios.get("http://localhost:3000/orders/123").then(
      res => {
        if(res.status == 200)
          setText(JSON.stringify(res.data));
        else
          setText("Error");
      }
    ) 
  */
  
  
  /* 
    ****The above results in Error not appearing in result box!*****
    Also, it shows  following 2 errors:
    1. orders/123:1 Failed to load resource: the server responded with a status of 404 (Not Found)
    2. axios.min.js:8 Uncaught (in promise) Error: Request failed with status code 404

    While the first error is expected, why are we facing the second error?
    It's because we're not handling the REJECTED state of promise. You can't handle the REJECTED state in FULFILLED state, i.e you can't handle failure of promise in "then" function.

    To handle the REJECTED state, chain the catch function like below:
  */

  axios.get("http://localhost:3000/orders/123").then(
      (response) => {
        setText(JSON.stringify(response.data));
      }
    ).catch((error) => {
        setText(error);
      }
    );

    /* Did you notice the single param in catch?
      It's a single param which is sent by REJECTED state depicting the reason why it failed.
    */

}



export function chain(){

  /* 
    ** PROMISES return PROMISES. **
    ** Settled functions i.e then and catch, both return promises, so we can chain them. **

  */

  /* 
    This time instead of seeing the order on the screen by running the same code snippet as in get() function, we'll print which city is order being shipped to.
    For that, we first need to load the order and then see its shipping address in the next API call. DON'T FORGET to return the promise from first then. And for that, we first need to load the order and then look up the shipping address in our second API call.
    See doc file.
  */

  axios.get("http://localhost:3000/orders/2").then(({data}) => {
   return axios.get(`http://localhost:3000/addresses/${data.shippingAddress}`)
  }).then(({data}) => {
    setText(`City: ${data.city}`);
  }); 

}

export function chainCatch(){
  /* 
    The following code catches error in the catch chained snippet.
    ** Since it's the last snippet in the stack, it can catch error of both the then before it. **
    Try skipping return in the first then. Or if you don't skip return in 1st then, try making data.my.city in setText of the next then.
    Since you're handling the error in catch, you will not see the same error in console now.
  */
  /* axios.get("http://localhost:3000/orders/2")
  .then(({data}) => {
    return axios.get(`http://localhost:3000/addresses/${data.shippingAddress}`)
  })
  .then(({data}) => {
    setText(`City: ${data.city}`);
  })
  .catch((err) => setText(err)); */

  //For more fine-grain catching of errors, i.e catching errors specific to a then:
  axios.get("http://localhost:3000/orders/213")
  .then(({data}) => {
    //Instead of returning the shippingAddress, throw an error which will be catched by catch immediately under this then.
     return axios.get(`http://localhost:3000/addresses/${data.shippingAddress}`);
     //throw new Error("Catch me below");
  })
  .catch( (err) => {
    setText(err);
    //Now if we skip the below return, the next then will try to destructure the undefined and 2nd catch will again work.
    //return {data: {}};
    //See doc now.
    //Now we don't want that return {data: {}}; if there was indeed error. Since second catch will catch the error from this catch to our second then, this is more appropriate thing to do:
    throw new Error(err);
  })
  .then(({data}) => {
    setText(`City: ${data.city}`);
  })
  .catch((err) => setText(err));

}

export function final(){
  showWaiting();
  axios.get("http://localhost:3000/orders/2")
  .then(({data}) => {
    return axios.get(`http://localhost:3000/addresses/${data.shippingAddress}`)
  })
  .then(({data}) => {
    setText(`City: ${data.city}`);
  })
  .catch((err) => setText(err))
  .finally(() => {
    setTimeout(()=>{
      hideWaiting();
      appendText("-- Finished");
    }, 1500);
  });
}