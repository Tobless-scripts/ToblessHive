function showSideBar() {
    const sidebar = document.querySelector(".container");
    sidebar.style.display = "flex";
    sidebar.style.transition = "all 3s ease-in-out";
}

function hideSideBar() {
    const sidebar = document.querySelector(".container");
    sidebar.style.display = "none";
    document.querySelector(".content").classList.remove("blurred");
}

window.onscroll = function () {
    var header = document.querySelector(".fixed");
    if (window.scrollY > 30) {
        header.classList.add("sticky");
    } else {
        header.classList.remove("sticky");
    }
};

const firstVideo = document.getElementById("videoContainer");
const secondVideo = document.getElementById("trending-video");
const thirdVideo = document.getElementById("popular-video");
const fourthVideo = document.getElementById("featured-video");

const sections = [firstVideo, secondVideo, thirdVideo, fourthVideo];
const buttons = [
    document.getElementById("first"),
    document.getElementById("second"),
    document.getElementById("third"),
    document.getElementById("fourth"),
];

const showSection = (sectionToShow, clickedButton) => {
    sections.forEach((section) => {
        if (section === sectionToShow) {
            section.classList.add("visible");
            section.classList.remove("inVisible");
        } else {
            section.classList.add("inVisible");
            section.classList.remove("visible");
        }
    });

    buttons.forEach((button) => {
        if (button === clickedButton) {
            button.classList.add("current");
        } else {
            button.classList.remove("current");
        }
    });
};

document
    .getElementById("first")
    .addEventListener("click", (e) => showSection(firstVideo, e.target));

document
    .getElementById("second")
    .addEventListener("click", (e) => showSection(secondVideo, e.target));

document
    .getElementById("third")
    .addEventListener("click", (e) => showSection(thirdVideo, e.target));

document
    .getElementById("fourth")
    .addEventListener("click", (e) => showSection(fourthVideo, e.target));
