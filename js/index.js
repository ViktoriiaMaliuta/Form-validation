"use strict";

const form = document.querySelector(".contact-form");

class Validator {
  constructor(form) {
    this.form = form;
    this.inputFields = form.getElementsByClassName("validate");
    this.initializeValidation();

    this.isRequired = this.isRequired.bind(this);
    this.validateUserName = this.validateUserName.bind(this);
    this.validateLastName = this.validateLastName.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
    this.validatePassword = this.validatePassword.bind(this);
    this.validatePasswordConfirm = this.validatePasswordConfirm.bind(this);
    this.isDate = this.isDate.bind(this);
  }

  initializeValidation() {
    for (const item of this.inputFields) {
      item.addEventListener("blur", (event) => {
        this.validateForm(event);
      });
    }

    this.form.addEventListener("submit", (event) => {
      event.preventDefault();
      console.log("Form submitted");
      if (this.validateOnSubmit()) {
        this.submitForm();
      } else {
        alert("Form contains errors. Please fix them and try again.");
      }
    });
  }

  setError(element, message) {
    const errorSection = element.parentElement.querySelector(".error");
    errorSection.innerText = message;
    element.classList.add("invalid");
    element.classList.remove("valid");
  }

  setValid(element) {
    const errorSection = element.parentElement.querySelector(".error");
    errorSection.innerText = "";
    element.classList.remove("invalid");
    element.classList.add("valid");
  }

  isRequired(field) {
    if (field.value.trim() === "") {
      this.setError(field, `${field.name} is required`);
      return false;
    }
    this.setValid(field);
    return true;
  }

  validateUserName = (userName) => {
    if (!this.isRequired(userName)) return false;

    const regex = /[a-zA-Z]+/;
    const minLength = 4;

    if (!regex.test(userName)) {
      this.setError(userName, "Please enter your name");
      return false;
    }
    if (userName.value.length < minLength) {
      this.setError(userName, "Please enter your full name");
      return false;
    } else {
      this.setValid(userName);
      return true;
    }
  };

  validateLastName = (lastName) => {
    if (!this.isRequired(lastName)) return false;

    const regex = /[a-zA-Z]+/;
    const minLength = 4;

    if (!regex.test(lastName.value)) {
      this.setError(lastName, "Please enter your last name");
      return false;
    }
    if (lastName.value.length < minLength) {
      this.setError(lastName, "Please enter your full last name");
      return false;
    } else {
      this.setValid(lastName);
      return true;
    }
  };

  validateEmail = (email) => {
    if (!this.isRequired(email)) return false;

    const regex = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/;
    if (!regex.test(email.value)) {
      this.setError(email, "Email is incorrect");
      return false;
    } else {
      this.setValid(email);
      return true;
    }
  };

  validatePassword = (password) => {
    if (!this.isRequired(password)) return false;

    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
    if (!regex.test(password.value)) {
      this.setError(
        password,
        "Password must be 8-16 characters, contain at least one digit and one special character"
      );
      return false;
    } else {
      this.setValid(password);
      return true;
    }
  };

  validatePasswordConfirm = (passwordConfirm) => {
    if (!this.isRequired(passwordConfirm)) return false;

    const password = this.form.querySelector("#password");
    if (passwordConfirm.value !== password.value) {
      this.setError(passwordConfirm, "Passwords do not match!");
      return false;
    } else {
      this.setValid(passwordConfirm);
      return true;
    }
  };

  isDate = (dateField) => {
    if (!this.isRequired(dateField)) return false;

    const dateValue = dateField.value;
    const regex = /^\d{4}-\d{2}-\d{2}$/;

    if (!regex.test(dateValue)) {
      this.setError(
        dateField,
        "Please enter a valid date in the format YYYY-MM-DD."
      );
      return false;
    }

    const [year, month, day] = dateValue
      .split("-")
      .map((num) => parseInt(num, 10));
    const date = new Date(year, month - 1, day);

    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      this.setError(dateField, "Please enter a valid date.");
      return false;
    }

    this.setValid(dateField);
    return true;
  };

  validateForm(event) {
    switch (event.target.id) {
      case "user-name":
        this.validateUserName(event.target);
        break;
      case "last-name":
        this.validateLastName(event.target);
        break;
      case "email":
        this.validateEmail(event.target);
        break;
      case "password":
        this.validatePassword(event.target);
        break;
      case "passwordConfirm":
        this.validatePasswordConfirm(event.target);
        break;
      case "birthdate":
        this.isDate(event.target);
        break;
      default:
        if (event.target.classList.contains("required")) {
          this.isRequired(event.target);
        } else {
          alert("Validation error!");
        }
    }
  }

  validateOnSubmit = () => {
    let isValid = true;

    for (const item of this.inputFields) {
      if (item.id) {
        const fieldValidators = {
          "user-name": this.validateUserName,
          "last-name": this.validateLastName,
          email: this.validateEmail,
          password: this.validatePassword,
          passwordConfirm: this.validatePasswordConfirm,
          birthdate: this.isDate,
        };

        if (fieldValidators[item.id]) {
          isValid = fieldValidators[item.id](item) && isValid;
        }
      } else if (item.classList.contains("required")) {
        isValid = this.isRequired(item) && isValid;
      }
    }
    console.log("Is form valid:", isValid);
    return isValid;
  };

  submitForm = () => {
    const formData = new FormData(this.form);

    fetch("http://localhost:5500/submit-form", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return response.text().then((text) => {
            throw new Error(text || "Network response was not ok.");
          });
        }
      })
      .then((data) => {
        console.log("Form submission successful:", data);
      })
      .catch((error) => {
        console.error("There was a problem with the form submission:", error);
      });
  };
}

const validator = new Validator(form);
