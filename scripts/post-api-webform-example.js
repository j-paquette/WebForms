const submit = document.getElementById("submit");

const getFormData = () => {
  const form = document.getElementById("form");
  return new FormData(form);
}

const toJson = function(event) {
  const formData = getFormData();
  const url = "https://reqres.in/api/users";
  
  event.preventDefault();
  let object = {};
  formData.forEach((value, key) => {
    if (!Reflect.has(object, key)) {
      object[key] = value;
      return;
    }
    if (!Array.isArray(object[key])) {
      object[key] = [object[key]];
    }
    object[key].push(value);
  });
  let json = JSON.stringify(object);
  console.log(json);

  // Submit the data.
  const request = new XMLHttpRequest();
  request.open("POST", url);
  request.send(formData);
};

submit.addEventListener("click", toJson);

