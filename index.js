const form = document.querySelector(".expenseForm");
const localStorageKey = "expenseDetail";

form.addEventListener("submit", handleFormSubmit);

function handleFormSubmit(e) {
  e.preventDefault();
  const data = e.target;
  let expenseAmount = data.expenseAmount.value;
  let description = data.description.value;
  let category = data.category.value;
  if (category == "Category") return;

  const ul = document.querySelector("#items");

  const newLi = makeli(expenseAmount, description, category);
  ul.appendChild(newLi);

  setDataInLocalstorage(expenseAmount, description, category);

  data.expenseAmount.value = "";
  data.description.value = "";
  data.category.value = "Category";
}

function setDataInLocalstorage(expenseAmount, description, category) {
  const obj = {
    expenseAmount,
    description,
    category,
  };
  const dataAvailable = localStorage.getItem(localStorageKey);
  if (!dataAvailable) {
    const objSimplified = JSON.stringify([obj]);
    localStorage.setItem(localStorageKey, objSimplified);
    return;
  }

  const getData = JSON.parse(dataAvailable);
  const newData = [...getData, obj];
  const newDataSimplified = JSON.stringify(newData);
  localStorage.setItem(localStorageKey, newDataSimplified);
}

function makeli(expenseAmount, description, category) {
  const paraText = `${expenseAmount} - ${description} - ${category}`;
  const li = makeElement("li", ["list-group-item"]);
  const outerDiv = makeElement("div", ["row"]);
  const innerDivForText = makeElement("div", ["col", "col-9"]);
  const h3Ele = makeElement("h5", ["listItem", "many", "many"], paraText);
  const innerDivForBtn = makeElement("div", ["col"]);
  const delBtn = makeElement(
    "button",
    ["btn", "del-btn", "btn-primary"],
    "Delete"
  );
  const editBtn = makeElement(
    "button",
    ["btn", "edit-btn", "btn-primary"],
    "Edit"
  );

  delBtn.addEventListener("click", handleRemoveEdit);
  editBtn.addEventListener("click", handleRemoveEdit);

  innerDivForText.appendChild(h3Ele);
  innerDivForBtn.appendChild(editBtn);
  innerDivForBtn.appendChild(delBtn);

  outerDiv.appendChild(innerDivForText);
  outerDiv.appendChild(innerDivForBtn);

  li.appendChild(outerDiv);
  return li;
}
function makeElement(ele, arr, text = "") {
  const element = document.createElement(ele);
  for (let item of arr) {
    element.classList.add(item);
  }
  if (text) {
    element.textContent = text;
  }
  return element;
}
function handleRemoveEdit(e) {
  let el = e.target;
  const isEdit = el.className.indexOf("edit-btn") !== -1;
  while (el && el.parentNode) {
    el = el.parentNode;
    if (el.className.indexOf("list-group-item") !== -1) break;
  }

  const textArr = el.querySelector(".listItem").textContent.split(" - ");
  if (isEdit) {
    console.log(textArr);
    form.expenseAmount.value = textArr[0];
    form.description.value = textArr[1];
    form.category.value = textArr[2];
  }
  removeDataFromLocalStorage(textArr[1]);
  el.remove();
}
function removeDataFromLocalStorage(description) {
  const data = JSON.parse(localStorage.getItem(localStorageKey));
  const newData = data.filter((item) => {
    return item.description !== description;
  });
  const newDataSimplified = JSON.stringify(newData);
  localStorage.setItem(localStorageKey, newDataSimplified);
}
