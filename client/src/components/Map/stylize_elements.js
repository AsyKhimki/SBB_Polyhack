
/* TEST FUNCTIONS TO ADJUST LINE OUTPUT */

export function colorById(id) {
    console.log("Line id");
    console.log(id);
    var res = parseInt(id) === 1 ? "red" : "blue";
    console.log(res);
    return res;
  }
  
export function weightById (id) {
  
    var res = parseInt(id) === 1 ? 2 : 10;
    console.log(res);
    return res;
  }
  
export function opacityById(id){
  
    var res = parseInt(id) === 1 ? 0.25 : 1;
    console.log(res);
    return res;
  }

 