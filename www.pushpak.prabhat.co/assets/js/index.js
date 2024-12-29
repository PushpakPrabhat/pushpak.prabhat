// FAQ accordion.
(function(){
const accordionItems = document.querySelectorAll(".c-faq-accordion__item");

const toggledItem = (index) => {
  const currentItem = accordionItems[index];
  currentItem.classList.toggle("is-active");

  const toggle = currentItem.children[0];
  const content = currentItem.children[1];

  if (currentItem.classList.contains("is-active")) {
    toggle.setAttribute("aria-expanded", true);
    content.setAttribute("aria-hidden", false);
  } else {
    toggle.setAttribute("aria-expanded", false);
    content.setAttribute("aria-hidden", true);
  }
}

accordionItems.forEach((item, index) => {
  const accordionToggle = item.querySelector(".c-faq-accordion__toggle");
  accordionToggle.addEventListener("click", () => toggledItem(index));
});
})();

// Contact form.
(function() {
function checkMissingValues(items) {
  const isMissing = [];

  for (let index = 0; index < items.length; index++) {
    const currentItem = items[index];
    const currentItemEmpty = currentItem.validity.valueMissing;
    isMissing.push(currentItemEmpty);

    if (currentItemEmpty && currentItem.id === "name") {
      currentItem.nextElementSibling.textContent = "*Please enter a valid name";
    } else if (currentItemEmpty && currentItem.id === "email") {
      currentItem.nextElementSibling.textContent = "*Please enter a valid email";
    } else if (currentItemEmpty && currentItem.id === "message") {
      currentItem.nextElementSibling.textContent = "*Too shy to tell me something?";
    } else {
      currentItem.nextElementSibling.textContent = ""
    }
  }

  return isMissing.some((item) => {
    if (item === true) {
      return item;
    }
  });;
}

function checkValidEmail(email) {
  const isValid = email.validity.valid;
  if (!isValid) {
    email.nextElementSibling.textContent = "*Please enter a valid email";
    return true;
  } else {
    return false;
  }
}

const forms = document.querySelectorAll("form.c-contact-form");
forms.forEach((item) => {
  const currentForm = item;
  const nameField = currentForm.querySelector("#name");
  const emailField = currentForm.querySelector("#email");
  const messageField = currentForm.querySelector("#message");
  const inputFields = [
    nameField,
    emailField,
    messageField
  ];


  currentForm.setAttribute("novalidate", true);

  currentForm.addEventListener("submit", (event) => {

    const missingValues = checkMissingValues(inputFields);
    const invalidEmail = checkValidEmail(emailField);

    if (missingValues || invalidEmail) {
      // console.log(missingValues);
      // console.log("Please fill in the form.");
      event.preventDefault();
    }
  });
});
})();
