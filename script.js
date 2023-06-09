'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const buttonScroll = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
// TABBED COMPONENTS
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const nav = document.querySelector('.nav');

const openModal = function (event) {
  event.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

buttonScroll.addEventListener('click', event => {
  // Get the x and y coor
  const s1coor = section1.getBoundingClientRect();
  // console.log(s1coor);
  // console.log(event.target.getBoundingClientRect());
  // console.log(
  //   'Current scroll (x|y) : ',
  //   window.pageXOffset,
  //   window.pageYOffset
  // );
  // console.log(
  //   'Height | Width viewport',
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth
  // );

  // Scrolling
  // window.scrollTo(
  //   s1coor.left + window.pageXOffset,
  //   s1coor.top + window.pageYOffset
  // );

  // MUST BE AN OBJECT TO IMPLEMENT THE BEHAVIOR
  // window.scrollTo({
  //   left: s1coor.left + window.pageXOffset,
  //   top: s1coor.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  // Modern way
  section1.scrollIntoView({ behavior: 'smooth' });
});

// document.querySelectorAll('.nav__link').forEach(function (link) {
//   link.addEventListener('click', function (event) {
//     event.preventDefault();

//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

// EVENT DELEGATION
// 1. Add event listener to common parent element
// 2. Deterime what element originated the event

document
  .querySelector('.nav__links')
  .addEventListener('click', function (event) {
    // console.log(event.target);
    event.preventDefault();

    // Matching strategy
    if (event.target.classList.contains('nav__link')) {
      const id = event.target.getAttribute('href');
      document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
    }
  });

tabsContainer.addEventListener('click', function (event) {
  const clicked = event.target.closest('.operations__tab');

  // Guard clause
  if (!clicked) return;

  // Remove all active tab, and add 1 active one.
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));

  tabsContent.forEach(content => {
    content.classList.remove('operations__content--active');
  });

  // console.log(clicked.dataset.tab);
  // Activate content area
  clicked.classList.add('.operations__tab--active');
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Navbar fade animation
const navbarHover = function (event) {
  if (event.target.classList.contains('nav__link')) {
    const link = event.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const bankistLogo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) {
        el.style.opacity = this;
      }
    });
    bankistLogo.style.opacity = this;
  }
};

// Passing an "argument" to the handler
nav.addEventListener('mouseover', navbarHover.bind(0.4));

nav.addEventListener('mouseout', navbarHover.bind(1));

// Sticky navbar
// const section1_coor = section1.getBoundingClientRect();
// console.log(section1_coor);

// window.addEventListener('scroll', function (event) {
//   console.log(window.scrollY);

//   window.scrollY > section1_coor.top
//     ? nav.classList.add('sticky')
//     : nav.classList.remove('sticky');
// });

// Sticky navigation -> Intersection observer API
// const observerCallback = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };

// const observerOptions = {
//   root: null,
//   // how many vh we start to intersect
//   threshold: [0, 0.2],
// };

// const observer = new IntersectionObserver(observerCallback, observerOptions);
// observer.observe(section1);

// When header is out of view, we want it to be sticky
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect();

const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);
  !entry.isIntersecting
    ? nav.classList.add('sticky')
    : nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight.height}px`, // applied 90px before it reaches the threshold
});
headerObserver.observe(header);

// REVEAL SECTIONS
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

// LAZY LOAD IMAGE
const targetImages = document.querySelectorAll('img[data-src]');
const loadImg = (entries, observer) => {
  const [entry] = entries;
  console.log(entry);

  if (!entry.isIntersecting) return;

  // Replace the source attribute with the data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

targetImages.forEach(img => imgObserver.observe(img));

// Slider
const slider = () => {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const radio = document.querySelector('.dots');

  let currSlide = 0;
  const totalSlides = slides.length - 1;

  const slider = document.querySelector('.slider');

  const createRadio = () => {
    slides.forEach((_, idx) => {
      radio.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${idx}"></button>`
      );
    });
  };

  const activateRadio = slide => {
    const allRadio = document.querySelectorAll('.dots__dot');
    allRadio.forEach(radio => radio.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach((s, idx) => {
      s.style.transform = `translateX(${100 * (idx - slide)}%)`;
    });
  };

  const initialize = () => {
    createRadio();
    activateRadio(0);
    goToSlide(0);
  };

  initialize();

  const prevSlide = () => {
    currSlide === 0 ? (currSlide = totalSlides) : currSlide--;

    goToSlide(currSlide);
    activateRadio(currSlide);
  };

  const nextSlide = () => {
    currSlide === totalSlides ? (currSlide = 0) : currSlide++;

    slides.forEach((slide, idx) => {
      slide.style.transform = `translateX(${100 * (idx - currSlide)}%)`;
    });

    activateRadio(currSlide);
  };

  btnLeft.addEventListener('click', prevSlide);
  btnRight.addEventListener('click', nextSlide); // -100%, 0%, 100%, 200%

  document.addEventListener('keydown', function (event) {
    event.key === 'ArrowLeft' ? prevSlide() : nextSlide();
  });

  radio.addEventListener('click', function (event) {
    if (event.target.classList.contains('dots__dot')) {
      const { slide } = event.target.dataset;
      goToSlide(slide);
      activateRadio(slide);
    }
  });
};
slider();
// First slide -> 0%
// Second slide -> 100%
// Third slide -> 200%
// Fourth slide -> 400%

// const h1 = document.querySelector('h1');

// // Goint downwards : child
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes);
// console.log(h1.children);
// h1.firstElementChild.style.color = 'orangered';
// h1.lastElementChild.style.color = 'azure';

// // Going upwards : parents
// console.log(h1.parentNode);
// console.log(h1.parentElement);

// h1.closest('.header').style.background = 'var(--gradient-secondary)';

// h1.closest('h1').style.background = 'var(--gradient-primary)';

// // Going sideways: siblings
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);

// console.log(h1.previousSibling);
// console.log(h1.nextSibling);

// console.log(h1.parentElement.children);
// [...h1.parentElement.children].forEach(el => {
//   if (el != h1) {
//     el.style.transform = 'scale(0.3)';
//   }
// });

//// LEARN BRO

// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

// const header = document.querySelector('.header');
// const allSections = document.querySelectorAll('.section');
// console.log(allSections);

// document.getElementById('section--1');
// // HTML collections
// const allBtns = document.getElementsByTagName('button');
// console.log(allBtns);

// console.log(document.getElementsByClassName('btn'));

// // Creating and inserting elements

// const message = document.createElement('div');
// message.classList.add('cookie-message');
// // message.textContent = 'We use cookies to improve functionality';
// message.innerHTML =
//   'We use cookies to improve functionality. <button class="btn btn--close-cookie">Got it!</button>';

// // Add element as the first child
// // header.prepend(message);
// header.append(message);

// Create message on prepend and apppend
// header.append(message.cloneNode(true));

// Other way
// header.before(message);
// header.after(message);

// Remove element
// document
//   .querySelector('.btn--close-cookie')
//   .addEventListener('click', function () {
//     message.remove();

//     //OLD WAY
//     // message.parentElement.removeChild(message);
//   });

// // Styles
// message.style.backgroundColor = '#37383d';
// message.style.width = '120%';

// console.log(message.style.height);
// // Only inline style work
// console.log(message.style.backgroundColor);
// console.log(message.style.color);

// // Get styles from style.css
// console.log(getComputedStyle(message).fontSize);
// console.log(getComputedStyle(message).height);

// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

// // change the color in the root
// document.documentElement.style.setProperty('--color-primary', 'orangered');

// // Attributes
// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt);
// console.log(logo.className);

// logo.alt = 'Pretty logo';

// // Non standard property
// console.log(logo.designer);
// console.log(logo.getAttribute('designer'));
// logo.setAttribute('company', 'Bankist');

// // Absolute path
// console.log(logo.src);
// // Relative path
// console.log(logo.getAttribute('src'));

// const link = document.querySelector('.nav__link--btn');
// console.log(link.href);
// console.log(link.getAttribute('href'));

// // Data attributes
// console.log(logo.dataset.versionNumber);

// // Classes
// logo.classList.add('c', 'd');
// logo.classList.remove('c', 'd');
// logo.classList.toggle('c');
// logo.classList.contains('c');

// DO NOT USE!
// logo.className = 'hahaha'

// const h1 = document.querySelector('h1');

// const alerth1 = event => {
//   alert('You hover the h1!');
// };
// h1.addEventListener('mouseenter', alerth1);

// setTimeout(() => h1.removeEventListener('mouseenter', alerth1), 2000);

// Another way for enter mouse
// h1.onmouseenter = event => {
//   console.log('You hover the h1!');
// };

// EVENT BUBBLING
// const randNum = (min, max) =>
//   Math.floor(Math.random(min, max) * (max - min + 1) + min);

// const randColor = () =>
//   `rgb(${randNum(0, 255)}, ${randNum(0, 255)}, ${randNum(0, 255)})`;

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   // this points to .nav__link
//   // DONT USE THIS WITH ARROW FUNCTION!!!
//   this.style.backgroundColor = randColor();
//   // e.target -> where the event occurs
//   // e.currentTarget -> equals to this keyword
//   // console.log(e.currentTarget === this);
//   console.log('LINK', e.target, e.currentTarget);

//   // Stop event propagation -> parent elements not called
//   // e.stopPropagation();
// });

// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randColor();
//   console.log('CONTAINER', e.target, e.currentTarget);
// });

// document.querySelector('.nav').addEventListener(
//   'click',
//   function (e) {
//     this.style.backgroundColor = randColor();
//     console.log('NAV', e.target, e.currentTarget);
//   }
//   // 3rd parameter = true -> Listening from the parent to target (traverse down)
// );

// Our entire code is executed while all the dom are loaded
document.addEventListener('DOMContentLoaded', function (event) {
  console.log('HTML parsed and DOM tree built!', event);
});

window.addEventListener('load', function (event) {
  console.log('Page fully loaded', event);
});

// window.addEventListener('beforeunload', function (event) {
//   event.preventDefault();
//   console.log(event);
//   event.returnValue = 'message';
// });
