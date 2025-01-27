document.addEventListener('DOMContentLoaded', () => {
  const svg = document.querySelector('.workflow-svg');
  const svgPath = document.querySelector('#workflow-path');
  const container = document.querySelector('.workflow-container');
  const circles = document.querySelectorAll('.circle');
  const heroTitle = document.querySelector('.hero-title');
  const animatedTexts = document.querySelectorAll('.animated-text');
  const circleRadius = 90;
  const pathLength = svgPath.getTotalLength();
  // GSAP Animation with ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);
  // Show the previous button after the first click on the next button
  let isPrevButtonVisible = false;
  console.log(`Number of animated texts: ${animatedTexts.length}`);
  const section = document.querySelector('.two');
  const content = section.querySelector('.content');

  // Ensure GSAP ScrollTrigger is registered
  gsap.registerPlugin(ScrollTrigger);


  function adjustCircleSizes() {
    const circles = document.querySelectorAll('.circle');
    const svgPath = document.querySelector('#workflow-path');
    const pathLength = svgPath.getTotalLength();
    const minGap = 32; // 2rem in pixels
    const maxRadius = 90; // Default radius
    const circleCenters = [];
  
    // Calculate positions along the SVG path for each circle
    circles.forEach((circle, index) => {
      const offset = (index + 1) / (circles.length + 1); // Distribute evenly
      const length = pathLength * offset;
      const point = svgPath.getPointAtLength(length);
      circleCenters.push({ x: point.x, y: point.y });
    });
  
    // Adjust circle sizes to maintain at least a 2rem gap
    for (let i = 0; i < circleCenters.length - 1; i++) {
      const current = circleCenters[i];
      const next = circleCenters[i + 1];
  
      const distance = Math.sqrt(
        Math.pow(next.x - current.x, 2) + Math.pow(next.y - current.y, 2)
      );
  
      // Calculate the maximum radius that ensures the minimum gap
      const maxCircleRadius = (distance - minGap) / 2;
      const adjustedRadius = Math.min(maxRadius, maxCircleRadius);
  
      circles[i].style.width = `${adjustedRadius * 2}px`;
      circles[i].style.height = `${adjustedRadius * 2}px`;
      circles[i].style.borderRadius = '50%'; // Ensure circles remain round
    }
  
    // Adjust the last circle size
    const lastCircle = circles[circleCenters.length - 1];
    lastCircle.style.width = `${maxRadius * 2}px`;
    lastCircle.style.height = `${maxRadius * 2}px`;
    lastCircle.style.borderRadius = '50%';
  }
  
  // Call this function whenever the circles are positioned
  adjustCircleSizes();
  
  // If needed, debounce the function call on window resize
  window.addEventListener('resize', debounce(adjustCircleSizes, 200));
  

  ScrollTrigger.create({
    trigger: '.two', // Section being observed
  start: 'top center +=300',
    end: 'bottom center',
    onEnter: () => console.log('Entered the section'),
    onLeave: () => console.log('Left the section'),
    onUpdate: (self) => console.log(
      `Current After Height: ${getComputedStyle(section).getPropertyValue("--after-height")}`
    ),
  });

  // Set initial values for the --before-top and --after-height variables in CSS
  gsap.set(section, {
    "--before-top": "0px",
    "--after-height": "318px",
  });

  // Animate the before pseudo-element
  gsap.to(section, {
    "--before-top": "-80px", // Move the pseudo-element to -80px
    ease: "none", // Linear animation for smooth scrolling
    markers: { startColor: "white", endColor: "white", fontSize: "18px", fontWeight: "bold", indent: 20 },
    scrollTrigger: {
      trigger: section,
      start: "top center -500px", // Start when the section's top reaches the center of the viewport
      end: "+=200", // End when the section's bottom reaches the center
      scrub: true, // Smoothly tie animation to scroll
      onUpdate: (self) => {
        console.log(
          `Scroll Progress: ${self.progress}, Before Top: ${getComputedStyle(section).getPropertyValue(
            '--before-top'
          )}`
        );
      },
    },
  });

  // Animate the after pseudo-element
  gsap.to(section, {
    "--after-height": "100px", // Animate the pseudo-element's height
    ease: "none", // Linear animation for smooth scrolling
    scrollTrigger: {
      trigger: section,
      start: "top center", // Start when the section's top reaches the center
      end: "bottom center", // End when the section's bottom reaches the center
      scrub: true,
      onUpdate: (self) => {
        console.log(
          `Scroll Progress: ${self.progress}, After Height: ${getComputedStyle(section).getPropertyValue(
            '--after-height'
          )}`
        );
      },
    },
  });

  // Animate the content inside the section
  gsap.to(content, {
    y: -50, // Move content up
    ease: "power1.inOut",
    scrollTrigger: {
      trigger: section,
      start: "top center", // Animation starts when the section's top reaches the center
      end: "bottom center", // Animation ends when the section's bottom reaches the center
      scrub: true,
      onUpdate: (self) => {
        console.log(`Content Progress: ${self.progress}`);
      },
    },
  });


  const carousel = document.querySelector(".carousel");
  const slides = document.querySelectorAll(".carousel-slide");
  const prevButton = document.querySelector(".carousel-control.prev");
  const nextButton = document.querySelector(".carousel-control.next");

  let currentIndex = 0; // Tracks the current slide
  const carouselWidth = carousel.getBoundingClientRect().width;
  const containerWidth = document.querySelector('.carousel-container').getBoundingClientRect().width;

  console.log(`Carousel Width: ${carouselWidth}`);
  console.log(`Container Width: ${containerWidth}`);

  // Helper function to log slide visibility
  function logSlideVisibility() {
    slides.forEach((slide, index) => {
      const computedStyle = window.getComputedStyle(slide);
      console.log(
        `Slide ${index + 1}: visibility=${computedStyle.visibility}, opacity=${computedStyle.opacity}`
      );
    });
  }

  // Helper function to log carousel transform
  function logCarouselTransform() {
    const computedStyle = window.getComputedStyle(carousel);
    console.log(`Carousel transform: ${computedStyle.transform}`);
  }

  // Function to update the carousel's position
  function updateCarousel() {
    const offset = -currentIndex * 100; // Calculate translateX percentage
    carousel.style.transform = `translateX(${offset}%)`;
  }

  slides.forEach((slide, index) => {
    console.log(`Slide ${index + 1} width: ${slide.getBoundingClientRect().width}`);
  });
  

  // Event listener for the next button
  nextButton.addEventListener('click', () => {
    if (!isPrevButtonVisible) {
      prevButton.style.opacity = '1';
      prevButton.style.visibility = 'visible';
      isPrevButtonVisible = true; // Ensure it only happens once
    }
    currentIndex = (currentIndex + 1) % slides.length; // Cycle to the next slide
    const newTransform = `translateX(-${currentIndex * 100}%)`;
    carousel.style.transform = newTransform;
  
    // Log dimensions for debugging
    const carouselWidth = carousel.getBoundingClientRect().width;
    const containerWidth = document.querySelector('.carousel-container').getBoundingClientRect().width;
  
    console.log(`Next Slide Index: ${currentIndex}`);
    console.log(`Updated carousel transform: ${newTransform}`);
    console.log(`Carousel Width: ${carouselWidth}`);
    console.log(`Container Width: ${containerWidth}`);
    logSlideVisibility();
  });
  
  prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length; // Cycle to the previous slide
    const newTransform = `translateX(-${currentIndex * 100}%)`;
    carousel.style.transform = newTransform;
  
    console.log(`Previous Slide Index: ${currentIndex}`);
    console.log(`Updated carousel transform: ${newTransform}`);
    logSlideVisibility();
  });

  // Initialize the carousel at the first slide
  updateCarousel();

  // Update carousel on window resize
  window.addEventListener('resize', updateCarousel);

  // Hide SVG and circles initially
  function hideWorkflowElements() {
    gsap.set([svg, circles], { opacity: 0, visibility: "hidden" });
  }

  // Show SVG and circles and start their animation
  function showWorkflowElements() {
    gsap.to([svg, circles], {
      opacity: 1,
      visibility: "visible",
      duration: 1,
      ease: "power1.out",
    });

    animateSvgLine();
  }

  // Center the Hero Title in the Container
  function centerHeroTitle() {
    const containerRect = container.getBoundingClientRect();
    const titleRect = heroTitle.getBoundingClientRect();

    const centeredTop = containerRect.height / 2 - titleRect.height / 2;
    const centeredLeft = containerRect.width / 2 - titleRect.width / 2;

    heroTitle.style.position = 'absolute';
    heroTitle.style.top = `${centeredTop}px`;
    heroTitle.style.left = `${centeredLeft}px`;

    console.log(`Hero title centered at: top=${centeredTop}px, left=${centeredLeft}px`);
  }

  // Animate the Hero Title and First Animated Text
  function animateHeroTitle() {
    gsap.to(heroTitle, {
      delay: 1.5,
      duration: 1,
      fontSize: "18px",
      top: "110px",
      left: "120px",
      transform: "translate(0, 0)",
      ease: "power1.out",
      onComplete: () => {
        showWorkflowElements();

        // Set and animate the first text
        gsap.set(animatedTexts[0], {
          top: `120px`,
          left: `120px`,
          opacity: 1,
        });

        animateTextWithSplit(animatedTexts[0], 4, 0, () => {
          // After the first text animation completes, animate the second text
          gsap.set(animatedTexts[1], {
            bottom: `120px`,
            right: `120px`,
            opacity: 1,
          });

          // Animate the second text
          //animateTextWithSplit(animatedTexts[1], 2);
        });
      },
    });
  }

  // Animate Text with GSAP SplitText Plugin
  function animateTextWithSplit(element, totalDuration, startDelay = 0, onComplete = null) {
    const split = new SplitText(element, { type: "chars" });
    const chars = split.chars;
    const charStagger = totalDuration / chars.length;

    gsap.fromTo(
      chars,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: charStagger,
        delay: startDelay,
        ease: "power1.out",
        stagger: {
          each: charStagger,
        },
        onComplete: () => {
          //split.revert();
          if (onComplete) onComplete();
        },
      }
    );
  }

  // Animate the SVG Line
  function animateSvgLine() {
    const circleTriggerPoints = Array.from(circles).map((_, index) => {
      const offset = (index + 1) / (circles.length + 1);
      return pathLength * offset;
    });
  
    svgPath.style.strokeDasharray = pathLength;
    svgPath.style.strokeDashoffset = pathLength;
  
    gsap.to(svgPath, {
      delay: 0,
      strokeDashoffset: 0,
      duration: 5.5,
      ease: "sine.inOut",
      onUpdate: function () {
        const currentLength = pathLength - gsap.getProperty(svgPath, "strokeDashoffset");
  
        circleTriggerPoints.forEach((triggerPoint, index) => {
          const circle = circles[index];
          if (currentLength >= triggerPoint && !circle.classList.contains("flip")) {
            circle.classList.add("flip");
          }
        });
        const fourthCircleTrigger = circleTriggerPoints[3];
        if (currentLength >= fourthCircleTrigger && !animatedTexts[1].classList.contains("animated")) {
          animatedTexts[1].classList.add("animated");
          animateTextWithSplit(animatedTexts[1], 2);
        }
      },
      onComplete: function () {
        // Fade in the carousel navigation buttons
        gsap.to([nextButton], {
          delay: 0,
          opacity: 1,
          visibility: "visible",
          duration: 0.2,
          ease: "power1.in",
        });
      },
    });
  }

  function getFirstIntersection() {
    const step = 1;
    let foundHorizontal = false;

    for (let i = 0; i < pathLength; i += step) {
      const point1 = svgPath.getPointAtLength(i);
      const point2 = svgPath.getPointAtLength(i + step);
      if (Math.abs(point1.y - point2.y) < 0.1) foundHorizontal = true;
      if (foundHorizontal && Math.abs(point1.x - point2.x) < 0.1) return point1;
    }
    console.error("Couldn't find the first intersection point.");
    return null;
  }

  function getLastIntersection() {
    const step = 1;
    let foundHorizontal = false;

    for (let i = pathLength; i >= 0; i -= step) {
      const point1 = svgPath.getPointAtLength(i);
      const point2 = svgPath.getPointAtLength(i - step);
      if (Math.abs(point1.y - point2.y) < 0.1) foundHorizontal = true;
      if (foundHorizontal && Math.abs(point1.x - point2.x) < 0.1) return point1;
    }
    console.error("Couldn't find the last intersection point.");
    return null;
  }

  function positionCircles() {
    const containerWidth = container.getBoundingClientRect().width;
    const svgRect = svg.getBoundingClientRect();
    const viewBox = svg.viewBox.baseVal;
    const scaleX = containerWidth / viewBox.width;
    const scaleY = svgRect.height / viewBox.height;

    const firstIntersection = getFirstIntersection();
    if (!firstIntersection) return;

    const firstCircleX = firstIntersection.x * scaleX + circleRadius * 1.3;
    const firstCircleY = firstIntersection.y * scaleY + circleRadius * 1.3;

    const firstCircle = circles[0];
    firstCircle.style.left = `${firstCircleX - circleRadius}px`;
    firstCircle.style.top = `${firstCircleY - circleRadius * 1.5}px`;

    const lastIntersection = getLastIntersection();
    if (!lastIntersection) return;

    const lastCircleX = lastIntersection.x * scaleX;
    const totalSpacing = lastCircleX - firstCircleX;
    const circleSpacing = totalSpacing / (circles.length - 1);

    circles.forEach((circle, index) => {
      const xPosition = firstCircleX + index * circleSpacing - circleRadius;
      const yPosition = firstCircleY - circleRadius;

      circle.style.left = `${xPosition}px`;
      circle.style.top = `${yPosition}px`;

      console.log(`Circle ${index + 1} positioned at x: ${xPosition}, y: ${yPosition}`);
    });
  }

  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  hideWorkflowElements();
  centerHeroTitle();
  animatedTexts.forEach((text) => new SplitText(text, { type: "chars" }));
  animateHeroTitle();
  positionCircles();

  window.addEventListener("resize", debounce(() => {
    centerHeroTitle();
    adjustCircleSizes();
    positionCircles();
  }, 200));
});
