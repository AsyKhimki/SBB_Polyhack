
/* TEST FUNCTIONS TO ADJUST LINE OUTPUT */

export function colorById(id) {
    var res = parseInt(id) === 1 ? "red" : "blue";
    return res;
  }
  
export function weightById (id) {
  
    var res = parseInt(id) === 1 ? 2 : 10;
    return res;
  }
  
export function opacityById(id){
  
    var res = parseInt(id) === 1 ? 0.25 : 1;
    return res;
  }

 