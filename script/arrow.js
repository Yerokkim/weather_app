/*arrow function*/

const multiply1= function(x,y){
    return x * y;
};

const multiply2=(x,y)=>{return x*y}

const multiply3 = (x,y)=> x * y;

multiply3(3,4);

console.log(multiply1(1,2));

const products=[
    {name:'product1', price:649},
    {name: 'product2', price: 576 },
    {name: 'product3', price: 489 },
];

let price =products.map(function(product){
    return product.price
})

console.log(price);

document.querySelector("h1").addEventListener('click', ()=>{
    console.log(this);
})


function Person(){
    this.age=0;
    setInterval(( )=>{
        this.age++;
    },1000);
    }

    var p= new Person();

console.log(p);

let module1=(function(){
    let nrArr =[11,12,0,99];
      let biggestNr= () =>{
          let max= Math.max();
          for(let i= 0; i<=nrArr.length -1; i++)
           if(nrArr[i]>max) max=nrArr[i]
            return max;
      }
      return{
          biggestNr
      }
})();

module1.biggestNr();

console.log(module1.biggestNr());

