
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

export function adjustSizeByDVW(dwm) {

  var res = 100;
  if(dwm >= 100000){
    res = 10000;
  } 
  else if (dwm >= 10000) {
    res = 5000;
  }
  else if (dwm >= 1000) {
    res = 1000;
  }

  return res
}

 