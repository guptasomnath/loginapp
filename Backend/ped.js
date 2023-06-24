const word = Array.from(process.env.WORD);
const hase = process.env.HASH.split(',');

exports.encode = (text) => {
  let encodedText = '';
  for(let i = 0; i < text.length; i++){
    const indexOf = word.indexOf(text.charAt(i));
    encodedText += indexOf == -1 ? text.charAt(i) : hase[indexOf];
  }

  return encodedText;
}

exports.decode = (text) => {
  let value = text;
  let decodedText = '';
  while(value != ''){
   let sliceData = value.slice(0, 4);
   const indexOf = hase.indexOf(sliceData);
   if(indexOf == -1){
    sliceData = value.slice(0, 1);
    decodedText += sliceData;
   }else{
    decodedText += word[indexOf];
   }

   value = value.replace(sliceData, '');
  }
  
  return decodedText;
}

exports.randomKey = (KeyLength) => {
  if(typeof KeyLength != "number"){
     return 'Key Length Should Be Is Numbers';
  }
  if(KeyLength > 30){
    return 'Key Length Should Be Less The 30';
  }

  let randomKeys = "";
  for(let i = 0; i < KeyLength; i++){
     const randomNum = Math.floor(Math.random() * hase.length);
     randomKeys += hase[randomNum];
  }
  
  return randomKeys;
}