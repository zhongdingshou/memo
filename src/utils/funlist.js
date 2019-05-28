let config = require('./config');

function achieveFunctions(functionsType){
  console.log(functionsType);
  switch (functionsType) {
    case "command":
      command();
      break;
    case "questions":
      questions();
      break;
    case "mail":
      mail();
      break;
    case "encryption":
      encryption();
      break;
    case "abandon":
      abandon();
      break;
    default: return ;

  }
}
function command(){
  
}
function questions(){

}
function mail(){

}
function encryption(){

}
function abandon(){

}

export default {
  achieveFunctions
}
