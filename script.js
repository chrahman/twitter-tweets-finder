const username = document.getElementById("username");

//Create references to the dropdown's
const singleYearSelect = document.getElementById("singleYear");
const singleMonthSelect = document.getElementById("singleMonth");
const singleDaySelect = document.getElementById("singleDay");

const fromYearSelect = document.getElementById("fromYear");
const fromMonthSelect = document.getElementById("fromMonth");
const fromDaySelect = document.getElementById("fromDay");

const toYearSelect = document.getElementById("toYear");
const toMonthSelect = document.getElementById("toMonth");
const toDaySelect = document.getElementById("toDay");

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function createDateDropdowns(yearSelect, monthSelect, daySelect) {

  //Months are always the same
  (function populateMonths() {
    for (let i = 0; i < months.length; i++) {
      const option = document.createElement("option");
      option.textContent = months[i];
      monthSelect.appendChild(option);
    }
    monthSelect.value = "";
  })();

  let previousDay;

  function populateDays(month) {
    //Delete all of the children of the day dropdown
    //if they do exist
    while (daySelect.firstChild) {
      daySelect.removeChild(daySelect.firstChild);
    }
    //Holds the number of days in the month
    let dayNum;
    //Get the current year
    let year = yearSelect.value;
    if (month === "") {
      //If no month is selected, set the number of days to 31
      dayNum = 31;
    }
    else if (
      month === "January" ||
      month === "March" ||
      month === "May" ||
      month === "July" ||
      month === "August" ||
      month === "October" ||
      month === "December"
    ) {
      dayNum = 31;
    } else if (
      month === "April" ||
      month === "June" ||
      month === "September" ||
      month === "November"
    ) {
      dayNum = 30;
    } else {
      //Check for a leap year
      if (new Date(year, 1, 29).getMonth() === 1) {
        dayNum = 29;
      } else {
        dayNum = 28;
      }
    }
    //Insert the correct days into the day <select>
    for (let i = 1; i <= dayNum; i++) {
      const option = document.createElement("option");
      option.textContent = i;
      daySelect.appendChild(option);
    }
    daySelect.value = "";
    if (previousDay) {
      daySelect.value = previousDay;
      if (daySelect.value === "") {
        daySelect.value = previousDay - 1;
      }
      if (daySelect.value === "") {
        daySelect.value = previousDay - 2;
      }
      if (daySelect.value === "") {
        daySelect.value = previousDay - 3;
      }
    }
  }

  function populateYears() {
    //Get the current year as a number
    let year = new Date().getFullYear();
    let firstTweet = new Date().getFullYear() - 2005; // Because first tweet was in 2006
    //Make the previous 100 years be an option
    for (let i = 0; i < firstTweet; i++) {
      const option = document.createElement("option");
      option.textContent = year - i;
      yearSelect.appendChild(option);
    }
    yearSelect.value = "";
  }

  populateDays(monthSelect.value);
  populateYears();

  yearSelect.onchange = function () {
    populateDays(monthSelect.value);
    resetError();
  };
  monthSelect.onchange = function () {
    populateDays(monthSelect.value);
    resetError();
  };
  daySelect.onchange = function () {
    previousDay = daySelect.value;
    resetError();
  };
}

function isError(error, errorElemnt) {
  const errorEl = document.createElement("span");
  errorEl.textContent = error;
  errorEl.classList.add("error-message", "text-danger", "w-100", "ms-1");
  errorElemnt.insertAdjacentElement("afterend", errorEl);
}

function resetError() {
  const errorElements = document.querySelectorAll(".error-message");
  errorElements.forEach((singleElement) => {
    singleElement.remove();
  });
}

createDateDropdowns(singleYearSelect, singleMonthSelect, singleDaySelect);
createDateDropdowns(fromYearSelect, fromMonthSelect, fromDaySelect);
createDateDropdowns(toYearSelect, toMonthSelect, toDaySelect);

function generateLink(e) {
  e.preventDefault();
  resetError();
  if (!username.value) {
    isError("Username is required", username);
    return;
  }

  if (singleMonthSelect.value || singleDaySelect.value || singleYearSelect.value) {
    const dateFields = [singleMonthSelect, singleDaySelect, singleYearSelect];
    for (let i = 0; i < dateFields.length; i++) {
      const singleElement = dateFields[i];
      
      if (!singleElement.value) {
        isError("This field is required", singleElement);
        return;
      }
    }
    const singleDate = `${singleYearSelect.value}-${months.indexOf(singleMonthSelect.value)+1}-${singleDaySelect.value}`;
    window.open(`https://twitter.com/search?lang=en&q=(from%3A${username.value})%20until%3A${singleDate}&src=typed_query`);
  }
  else if (fromMonthSelect.value || fromDaySelect.value || fromYearSelect.value || toMonthSelect.value || toDaySelect.value || toYearSelect.value) {
    const dateFields = [fromMonthSelect, fromDaySelect, fromYearSelect, toMonthSelect, toDaySelect, toYearSelect];
    for (let i = 0; i < dateFields.length; i++) {
      const singleElement = dateFields[i];
      
      if (!singleElement.value) {
        isError("This field is required", singleElement);
        return;
      }
    }
    const fromDate = `${fromYearSelect.value}-${months.indexOf(fromMonthSelect.value)+1}-${fromDaySelect.value}`;
    const toDate = `${toYearSelect.value}-${months.indexOf(toMonthSelect.value)+1}-${toDaySelect.value}`;
    if (toDate < fromDate) {
      alert("To date must be after from date");
      return;
    }
    window.open(`https://twitter.com/search?lang=en&q=(from%3A${username.value})%20until%3A${toDate}%20since%3A${fromDate}&src=typed_query`);
  }
  else {
    isError("Please select date range", singleMonthSelect);
    return;
  }
}

const navLinks = document.querySelectorAll(".navbar-nav .nav-item .nav-link");
navLinks.forEach((navLink) => {
   if (navLink.getAttribute('href').replace(".html", "") === window.location.pathname.replace(".html", "")) {
    navLink.classList.add("active");
  }
});