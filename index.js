const form = document.querySelector(".expenseForm");
const localStorageKey = "expenseDetail";
const ul = document.querySelector("#items");
const baseurl =
  "https://crudcrud.com/api/d523ed85a61243e3bdb1ce312aa838de/appointment";

form.addEventListener("submit", handleFormSubmit);

window.onload = () => {
  showData();
};

function showData() {
  axios(baseurl)
    .then((res) => {
      const data = res.data;
      if (!data || !data.length) return;

      data.forEach((item) => {
        const newLi = makeli(
          item.expenseAmount,
          item.description,
          item.category
        );
        newLi.id = item._id;
        ul.appendChild(newLi);
      });
    })
    .catch((err) => console.log(err));
}

async function handleFormSubmit(e) {
  e.preventDefault();
  const data = e.target;
  let expenseAmount = data.expenseAmount.value;
  let description = data.description.value;
  let category = data.category.value;
  if (category == "Category") return;

  const newLiId = await putDataInServer(expenseAmount, description, category);

  const newLi = makeli(expenseAmount, description, category, newLiId);
  ul.appendChild(newLi);

  data.expenseAmount.value = "";
  data.description.value = "";
  data.category.value = "Category";
}
function putDataInServer(expenseAmount, description, category) {
  const obj = {
    expenseAmount,
    description,
    category,
  };
  return new Promise((resolve, reject) => {
    axios
      .post(baseurl, obj)
      .then((res) => resolve(res.data._id))
      .catch((err) => console.log(err));
  });
}

function makeli(expenseAmount, description, category, newId) {
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
  li.id = newId;
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
    form.expenseAmount.value = textArr[0];
    form.description.value = textArr[1];
    form.category.value = textArr[2];
  }
  const elId = el.id;
  axios
    .delete(baseurl + "/" + elId)
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
  el.remove();
}
