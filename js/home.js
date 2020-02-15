function change(){
  let read = document.querySelector("#read");
  
  if(read.dataset.change == "true"){
    read.innerHTML = "<<< Read less";
    read.dataset.change = false;
  }
  else {
    read.innerHTML = "Read more >>>";
    read.dataset.change = true;
  }
}

window.onload = change;
document.querySelector("#read").addEventListener("click", change);
