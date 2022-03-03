"use strict";

window.addEventListener("DOMContentLoaded", setup);
let systemHacked = false;
let allStudents = [];
let filterStudents;
let expelledStudents = [];
let regStudents = [];
let prefectsList = [];
let squadList = [];
let familiesArray = [];

const Student = {
  firstname: "",
  middlename: "",
  lastname: "",
  alias: "",
  house: "",
  blood: "",
  status: "",
  prefect: false,
  squad: false,
  regStudent: true,
  cannotBeExpelled: false,
  image: true,
};
const ailin = {
  firstname: "Ailin",
  middlename: "Maria",
  lastname: "Torre Val",
  house: "Ravenclaw",
  blood: "Pure Blood",
  prefect: false,
  squad: false,
  regStudent: true,
  cannotBeExpelled: true,
};
const marina = {
  firstname: "Marina",
  middlename: "Iuliana",
  lastname: "Tancau",
  house: "Gryffindor",
  blood: "Pure Blood",
  prefect: false,
  squad: false,
  regStudent: true,
  siblings: false,
  cannotBeExpelled: true,
};

function setup() {
  console.log("ready");
  //   setting filter events
  document
    .querySelectorAll("[data-action='filterB']")
    .forEach((button) => button.addEventListener("click", selectFilterB));
  document
    .querySelectorAll("[data-action='filterH']")
    .forEach((button) => button.addEventListener("click", selectFilterH));

  document.querySelector("#all").addEventListener("click", showAll);
  document
    .querySelectorAll("[data-action='filterS']")
    .forEach((button) => button.addEventListener("click", selectFilterS));
  document
    .querySelectorAll("[data-action='filtersp']")
    .forEach((button) => button.addEventListener("click", selectSPFilter));
  // setting sorting event
  document
    .querySelectorAll("[data-action='sort']")
    .forEach((button) => button.addEventListener("click", selectSort));

  //search bar
  document.querySelector("#sbar").addEventListener("input", searchBar);
  //hacking
  document
    .querySelector("#hacking-btn")
    .addEventListener("click", hackTheSystem);
  loadJSON();
}

async function loadJSON() {
  const studentsData = await fetch(
    "https://petlatkea.dk/2021/hogwarts/students.json"
  );
  const jsonData = await studentsData.json();

  const familiesData = await fetch(
    "https://petlatkea.dk/2021/hogwarts/families.json"
  );

  familiesArray = await familiesData.json();
  // when loaded, prepare data objects
  prepareObjects(jsonData);
}

function prepareObjects(jsonData) {
  allStudents = jsonData.map(prepareObject);
  filterStudents = allStudents;
  displayList(filterStudents);
  console.log("jsonData", jsonData);
  return filterStudents;
  //   prepareObject(allStudents);
}
function prepareObject(jsonObject) {
  // get name parts
  const student = Object.create(Student);
  let cleanFullname = jsonObject.fullname.trim();

  let firstName = cleanFullname.substring(0, cleanFullname.indexOf(" "));

  let middleName = cleanFullname.substring(
    cleanFullname.indexOf(" "),
    cleanFullname.lastIndexOf(" ")
  );

  let lastName = cleanFullname.substring(cleanFullname.lastIndexOf(" "));

  let cleanHouse = jsonObject.house.trim();
  let cleanLName = lastName.trim();
  let cleanName = firstName.trim();
  let cleanMName = middleName.trim();
  //capitalize
  student.lastname = `${cleanLName.substring(0, 1).toUpperCase()}${cleanLName
    .substring(1, cleanLName.length)
    .toLowerCase()}`;
  student.middlename = `${cleanMName.substring(0, 1).toUpperCase()}${cleanMName
    .substring(1, cleanMName.length)
    .toLowerCase()}`;
  if (firstName) {
    student.firstname = `${cleanName.substring(0, 1).toUpperCase()}${cleanName
      .substring(1, cleanName.length)
      .toLowerCase()}`;
  } else {
    student.firstname = `${cleanMName.substring(0, 1).toUpperCase()}${cleanMName
      .substring(1, cleanMName.length)
      .toLowerCase()}`;
    student.middlename = "";
  }
  if (cleanMName.startsWith('"')) {
    student.middlename = "";
    student.alias = cleanMName;
  }
  if (student.lastname === "Leanne") {
    student.image = false;
  }

  //   setting blood status
  let pureBlooded = familiesArray.pure;
  let halfBloodFamilies = familiesArray.half;

  if (pureBlooded.includes(student.lastname)) {
    student.blood = "Pure Blood";
  } else if (halfBloodFamilies.includes(student.lastname)) {
    student.blood = "Half-Blood";
  } else {
    student.blood = "Muggle";
  }

  student.house = `${cleanHouse.substring(0, 1).toUpperCase()}${cleanHouse
    .substring(1, cleanHouse.length)
    .toLowerCase()}`;

  student.regStudent = true;
  student.squad = false;
  student.prefect = false;
  student.cannotBeExpelled = false;

  return student;
}

function selectSort(event) {
  const sortParam = event.target.dataset.sort;
  console.log(`user select, ${sortParam}`);
  sortList(sortParam);
}

function sortList(sortParam) {
  filterStudents = filterStudents.sort(sortByParam);

  function sortByParam(studentA, studentB) {
    if (studentA[sortParam] < studentB[sortParam]) {
      return -1;
    } else {
      return 1;
    }
  }

  buildList(filterStudents);
}
//blood
function selectFilterB(event) {
  const filter = event.target.dataset.filter;
  console.log(`user select, ${filter}`);
  filterBList(filter);
}
function filterBList(blood) {
  filterStudents = allStudents;
  if (blood === "Pure Blood") {
    filterStudents = filterStudents.filter(
      (student) => student.blood === "Pure Blood"
    );
  } else if (blood === "Half-Blood") {
    filterStudents = filterStudents.filter(
      (student) => student.blood === "Half-Blood"
    );
  } else {
    filterStudents = filterStudents.filter(
      (student) => student.blood === "Muggle"
    );
  }
  console.log(filterStudents);
  buildList(filterStudents);
}

//house
function selectFilterH(event) {
  const filter = event.target.dataset.filter;
  console.log(`user select, ${filter}`);
  filterHList(filter);
}
function filterHList(house) {
  filterStudents = allStudents;
  if (house === "Gryffindor") {
    filterStudents = filterStudents.filter(
      (student) => student.house === "Gryffindor"
    );
  } else if (house === "Hufflepuff") {
    filterStudents = filterStudents.filter(
      (student) => student.house === "Hufflepuff"
    );
  } else if (house === "Ravenclaw") {
    filterStudents = filterStudents.filter(
      (student) => student.house === "Ravenclaw"
    );
  } else if (house === "Slytherin") {
    filterStudents = filterStudents.filter(
      (student) => student.house === "Slytherin"
    );
  }
  console.log(filterStudents);
  buildList(filterStudents);
}
//regular and expelled
function selectFilterS(event) {
  const filter = event.target.dataset.filter;
  console.log(`user select, ${filter}`);
  filterSlist(filter);
}
function filterSlist(filter) {
  filterStudents = allStudents;

  if (filter === "regular") {
    filterStudents = filterStudents.filter(
      (student) => student.regStudent === true
    );
  } else {
    filterStudents = filterStudents.filter(
      (student) => student.regStudent === false
    );
  }
  buildList(filterStudents);
}

//prefects and squad lists
function selectSPFilter(event) {
  const filter = event.target.dataset.filter;
  console.log(`user select, ${filter}`);
  filterSPlist(filter);
}

function filterSPlist(filter) {
  filterStudents = allStudents;

  if (filter === "pref") {
    filterStudents = filterStudents.filter(
      (student) => student.prefect === true
    );
  } else {
    filterStudents = filterStudents.filter((student) => student.squad === true);
  }
  buildList(filterStudents);
}

function showAll() {
  filterStudents = allStudents;
  displayList(allStudents);
}

function buildList() {
  let regStudents = filterStudents.filter(
    (student) => student.regStudent === true
  );
  displayList(regStudents);
}

function displayList(students) {
  document.querySelector("#list tbody").innerHTML = "";
  console.log("displayList");
  students.forEach(displayStudent);
}

function displayStudent(student) {
  const clone = document
    .querySelector("template#student")
    .content.cloneNode(true);

  // set clone data
  clone.querySelector("[data-field=name]").textContent = student.firstname;
  clone.querySelector("[data-field=middle-name]").textContent =
    student.middlename;
  clone.querySelector("[data-field=last-name]").textContent = student.lastname;

  clone.querySelector("[data-field=house]").textContent = student.house;
  clone.querySelector("[data-field=blood-status]").textContent = student.blood;
  if (student.regStudent) {
    clone.querySelector("[data-field=status]").textContent = "Regular Student";
  } else {
    clone.querySelector("[data-field=status]").textContent = "Expelled Student";
  }

  if (student.prefect) {
    clone.querySelector("#smallicon").classList.remove("grey");
  } else {
    clone.querySelector("#smallicon").classList.add("grey");
  }

  if (student.squad) {
    clone.querySelector(".inqsquad").classList.remove("grey");
  } else {
    clone.querySelector(".inqsquad").classList.add("grey");
  }

  //counters lists
  document.querySelector(
    "#counter-all"
  ).textContent = `(${allStudents.length})`;
  document.querySelector(
    "#counter-pref"
  ).textContent = `(${prefectsList.length})`;
  document.querySelector(
    "#counter-squad"
  ).textContent = `(${squadList.length})`;

  let countRegStudents = allStudents.filter(
    (student) => student.regStudent === true
  );
  document.querySelector(
    "#counter-regular"
  ).textContent = `(${countRegStudents.length})`;
  document.querySelector(
    "#counter-expelled"
  ).textContent = `(${expelledStudents.length})`;

  let countPureBlood = allStudents.filter(
    (student) => student.blood === "Pure Blood"
  );
  document.querySelector(
    "#counter-pureblood"
  ).textContent = `(${countPureBlood.length})`;

  let countHalfBlood = allStudents.filter(
    (student) => student.blood === "Half-Blood"
  );
  document.querySelector(
    "#counter-halfblood"
  ).textContent = `(${countHalfBlood.length})`;

  let countMuggle = allStudents.filter((student) => student.blood === "Muggle");
  document.querySelector(
    "#counter-muggles"
  ).textContent = `(${countMuggle.length})`;

  clone
    .querySelector("[data-field=last-name")
    .addEventListener("click", openPU);

  clone.querySelector("[data-field=name").addEventListener("click", openPU);
  clone.querySelector("#smallicon").addEventListener("click", prefClicked);
  clone.querySelector(".inqsquad").addEventListener("click", squadClicked);

  function prefClicked() {
    if (student.regStudent === true) {
      if (student.prefect === true) {
        student.prefect = false;
        const index = prefectsList.indexOf(student);
        prefectsList.splice(index, 1);
        console.log("taking out of the array");
      } else {
        console.log("its your student");
        student.prefect = true;
        //   prefects.push(student);
        checkPrefect(student);
      }
    } else {
      student.prefect = false;
    }
    buildList();
  }

  function checkPrefect(student) {
    const prefectsHouse = prefectsList.filter(
      (stud) => stud.house === student.house
    );
    console.log(prefectsHouse);
    const nrHouse = prefectsHouse.length;
    if (student.prefect === true) {
      if (nrHouse >= 2) {
        console.log("you can have only 2 per house", prefectsHouse);
        document.querySelector("#pref-popup").classList.remove("hidden");
        document.querySelector("#pref-btn").addEventListener("click", closePU);
        student.prefect = false;
      } else {
        makePrefect(student);
        console.log("make prefect");
      }
    }
  }

  function makePrefect(student) {
    student.prefect = true;
    prefectsList.push(student);
    buildList();
  }
  function squadClicked() {
    if (systemHacked === false) {
      if (student.regStudent === true) {
        if (student.blood === "Pure Blood" || student.house === "Slytherin") {
          if (student.squad === true) {
            student.squad = false;
            const index = squadList.indexOf(student);
            squadList.splice(index, 1);
          } else {
            student.squad = true;
            squadList.push(student);
          }
        } else {
          console.log("cannot be in the inq squad");
          document.querySelector("#squad-popup").classList.remove("hidden");
          document
            .querySelector("#squad-btn")
            .addEventListener("click", closePU);
        }
      } else {
        student.squad = false;
      }
    } else {
      hackingSquad();
    }
    buildList();
  }

  function hackingSquad() {
    if (student.blood === "Pure Blood" || student.house === "Slytherin") {
      squadList.push(student);
      student.squad = true;
      setTimeout(squadHacked, 3000);
    } else {
      document.querySelector("cant be squad");
      document.querySelector("#squad-popup").classList.remove("hidden");
      document.querySelector("#squad-btn").addEventListener("click", closePU);
    }
    buildList();
  }

  function squadHacked() {
    student.squad = false;
    const index = squadList.indexOf(student);
    squadList.splice(index, 1);
    buildList();
  }

  function openPU() {
    console.log("show student info", student.lastname);

    document.querySelector("#student-popup").classList.remove("hidden");
    document.querySelector("#popup-name").textContent =
      student.firstname + " " + student.middlename + " " + student.lastname;
    document.querySelector("#popup-house").textContent = student.house;
    document.querySelector("#popup-blood").textContent = student.blood;

    if (student.regStudent) {
      document.querySelector("#popup-status").textContent = "Regular Student";
    } else {
      document.querySelector("#popup-status").textContent = "Expelled Student";
    }
    if (student.alias) {
      document.querySelector("#popup-name").textContent =
        student.firstname + " " + student.alias + " " + student.lastname;
    } else {
      document.querySelector("#popup-name").textContent =
        student.firstname + " " + student.middlename + " " + student.lastname;
    }
    if (student.prefect) {
      document.querySelector("#popup-pref").classList.remove("hidden");
    } else {
      document.querySelector("#popup-pref").classList.add("hidden");
    }
    if (student.squad) {
      document.querySelector("#popup-sq").classList.remove("hidden");
      document.querySelector("#popup-sq").textContent =
        "Member of the Inquisitory Squad";
    } else {
      document.querySelector("#popup-sq").classList.add("hidden");
      document.querySelector("#popup-sq").textContent =
        "Not Member of the Inquisitory Squad";
    }
    if (student.image === false) {
      console.log("show leanne pic");
      //TO ADD image for Leanne
    }
    //add image in the pop-up window
    document.querySelector("#h-logo").src = `/img/${student.house}.png`;

    // document.querySelector("#popup-status").textContent = student.status;
    document.querySelector("#student-pic").src = `/students-pics/${
      student.lastname
    }_${student.firstname.charAt(0)}.png`;

    // document.querySelector("#popup-house-logo").textContent =
    //   student.house.charAt(0);

    //fixing patil issue
    if (student.lastname.includes("-")) {
      let urlImage;
      let imglastName = student.lastname.substring(
        student.lastname.indexOf("-") + 1
      );
      urlImage =
        imglastName + "_" + student.firstname.charAt(0).toLowerCase() + ".png";
      console.log(urlImage);
      document.querySelector("#student-pic").src = `/students-pics/${urlImage}`;
    } else if (student.lastname === "Patil") {
      document.querySelector(
        "#student-pic"
      ).src = `/students-pics/${student.lastname}_${student.firstname}.png`;
    } else {
      document.querySelector("#student-pic").src = `/students-pics/${
        student.lastname
      }_${student.firstname.charAt(0)}.png`;
    }


    if (student.lastname.includes("-")) {
      document.querySelector(
        "#student-pic"
      ).src = `/students-pics/${student.lastname.indexOf(
        "-",
        student.lastname.substring(1)
      )}_${student.firstname.charAt(0)}.png`;
    }

    document.querySelector("#popup-close").addEventListener("click", closePU);

    document
      .querySelector("#popup-expell")
      .addEventListener("click", clickExpell);

    function clickExpell() {
      if (student.cannotBeExpelled === false) {
        expelledStudents.push(student);
        student.regStudent = false;
        student.squad = false;
        student.prefect = false;
        document
          .querySelector("#popup-expell")
          .removeEventListener("click", clickExpell);
        document.querySelector("#popup-status").textContent =
          "Expelled Student";
      } else {
        console.log("you cannot expell me");
      }
      buildList();
    }
  }

  document.querySelector("#list tbody").appendChild(clone);
}
function hackTheSystem() {
  document
    .querySelector("#hacking-btn")
    .removeEventListener("click", hackTheSystem);
    document
    .querySelector("#hacking-btn")
    .classList.add("hack-red");
  
  systemHacked = true;
  allStudents.push(marina);
  allStudents.push(ailin);
  allStudents.forEach(randomBlood);
  console.log("system hacked");
  buildList();
}
function randomBlood(student) {
  console.log(student);
  if (student.blood === "Pure Blood") {
    if (student.cannotBeExpelled === false) {
      const types = ["Muggle", "Half Blood"];
      const randomNumber = Math.floor(Math.random() * 2);
      student.blood = types[randomNumber];
      console.log(student.blood);
    } else {
      student.blood = "Pure Blood";
    }
  } else {
    student.blood = "Pure Blood";
  }
}
function searchBar(e) {
  const searchString = e.target.value.toLowerCase();
  const searchStudent = allStudents.filter((student) => {
    return (
      student.firstname.toLowerCase().includes(searchString) ||
      student.lastname.toLowerCase().includes(searchString) ||
      student.house.toLowerCase().includes(searchString)
    );
  });
  displayList(searchStudent);
}

function closePU() {
  document.querySelector("#student-popup").classList.add("hidden");

  document.querySelector("#pref-popup").classList.add("hidden");

  document.querySelector("#squad-popup").classList.add("hidden");
}
