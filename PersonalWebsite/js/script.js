'use strict';

// Helper function to add an event listener to multiple elements
const addEventOnElements = function (elements, eventType, callback) {
  for (let i = 0, len = elements.length; i < len; i++) {
    elements[i].addEventListener(eventType, callback);
  }
}


document.addEventListener('DOMContentLoaded', () => {

    /*==========================================================
     * MOBILE NAVBAR TOGGLER AND HEADER SCROLL BEHAVIOR
     *==========================================================*/

    const navbar = document.querySelector("[data-navbar]");
    const navTogglers = document.querySelectorAll("[data-nav-toggler]");
    const navLinks = document.querySelectorAll("[data-navbar] a");
    const header = document.querySelector("[data-header]");

    const toggleNavbar = function () {
        navbar.classList.toggle("active");
        document.body.classList.toggle("nav-active"); // Prevents body scroll
    }

    // Add click event listener to the waffle icon to toggle the navbar
    addEventOnElements(navTogglers, "click", toggleNavbar);

    // Add click event listener to close the navbar when a link is clicked
    addEventOnElements(navLinks, "click", toggleNavbar);

    // Add 'active' class to header when window scrolls down
    const activeElementOnScroll = function () {
        if (window.scrollY > 100) {
            header.classList.add("active");
        } else {
            header.classList.remove("active");
        }
    }
    window.addEventListener("scroll", activeElementOnScroll);


    /*==========================================================
     * GALLERY ZOOM EFFECT
     *==========================================================*/

    const photoContainers = document.querySelectorAll('.photo-card');
    const body = document.body;

    photoContainers.forEach(container => {
        container.addEventListener('click', (e) => {
            // Prevent this click from also triggering the document-level listener
            e.stopPropagation();

            // Toggle the zoomed class on the clicked container
            container.classList.toggle('zoomed');

            // Toggle the zoomed-active class on the body
            body.classList.toggle('zoomed-active');
        });
    });

    // Close the zoomed image when clicking anywhere on the page outside of it
    document.addEventListener('click', (e) => {
        const zoomedContainer = document.querySelector('.photo-card.zoomed');
        
        // If there's a zoomed image and the click was outside of it...
        if (zoomedContainer && !zoomedContainer.contains(e.target)) {
            zoomedContainer.classList.remove('zoomed');
            body.classList.remove('zoomed-active');
        }
    });

    // Close the zoomed image when pressing the Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const zoomedContainer = document.querySelector('.photo-card.zoomed');
            if (zoomedContainer) {
                zoomedContainer.classList.remove('zoomed');
                body.classList.remove('zoomed-active');
            }
        }
    });

});
    