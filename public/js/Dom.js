function domElement(tag,attributes,styles,child){
  if(typeof(tag) != "string"){
    console.error('string expected');
  } else if(typeof(attributes) != "object"){
    console.error('object expected');
  } else if(typeof(styles) != "object"){
    console.error('object expected');
  } else if(typeof(child) != "string" && typeof(child) != "object"){
    console.error('string or object expected');
  }
  var t = document.createElement(tag);
  for(var attr in attributes){
    t.setAttribute(attr,attributes[attr]);
  }
  for(var sty in styles){
    t.style[sty] = styles[sty];
  }
  if(typeof(child) === "string"){
    var x = document.createTextNode(child);
    t.appendChild(x);
  } else if(typeof(child) === "object"){
    t.appendChild(child);
  }
  return t;
}
