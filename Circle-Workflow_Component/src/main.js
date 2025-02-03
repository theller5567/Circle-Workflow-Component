document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".workflow-container");
  const circles = document.querySelectorAll(".circle");
  const heroTitle = document.querySelector(".hero-title");
  const animatedTexts = document.querySelectorAll(".animated-text");
  const section = document.querySelector(".two");
  const content = section.querySelector(".content");
  const video = document.getElementById("myVideo");
  const yellowSVGWave = document.querySelector(".rvty-hero-l2-banner-cover-yellow");

  const targetTime = 5; // Time to trigger the video action
  let hasTriggered = false;

  if (!yellowSVGWave) {
    console.error("❌ ERROR: .rvty-hero-l2-banner-cover-yellow not found!");
  } else {
    console.log(`Initial height: ${yellowSVGWave.getBBox().height}px`);
  }
  console.log("Initial scaleY:", getComputedStyle(yellowSVGWave).transform);


  // **Ensure Yellow SVG starts at 176px before animation**
  gsap.set(yellowSVGWave, {
    transformOrigin: "bottom center", 
    scaleY: 1, 
  });
  
  gsap.to(yellowSVGWave, {
    scaleY: 3, 
    ease: "power1.out",
    scrollTrigger: {
      trigger: section,
      start: "top center",
      end: '+=500px',
      scrub: 1,
      immediateRender: false, // ❌ Prevents jumping on load
      markers: true,
      
      onUpdate: (self) => {
        console.log(`GSAP running - Scroll Progress: ${self.progress}`);
        console.log(`GSAP scaleY: ${getComputedStyle(yellowSVGWave).transform}`);
      },
    },
  });
  
  


  // **Initial Styles**
  gsap.set(section, { "--before-top": "0px" });
  gsap.set(content, { opacity: 0 });
  gsap.set(circles, { opacity: 0, visibility: "hidden" });
  gsap.set(animatedTexts, { opacity: 0 });
  gsap.set(heroTitle, { opacity: 0 });

  // **Center Hero Title in the Container**
  function centerHeroTitle() {
    const containerRect = container.getBoundingClientRect();
    const titleRect = heroTitle.getBoundingClientRect();
    heroTitle.style.position = "absolute";
    heroTitle.style.top = `${containerRect.height / 2 - titleRect.height / 2}px`;
    heroTitle.style.left = `${containerRect.width / 2 - titleRect.width / 2}px`;
  }

  // **Center First Animated Text**
  function centerFirstAnimatedText() {
    const containerRect = container.getBoundingClientRect();
    const textRect = animatedTexts[0].getBoundingClientRect();

    animatedTexts[0].style.position = "absolute";
    animatedTexts[0].style.top = `${containerRect.height / 2 - textRect.height / 2}px`;
    animatedTexts[0].style.left = `${containerRect.width / 2 - textRect.width / 2}px`;
  }

  // **Scroll Animation using ScrollTrigger**
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.create({
    trigger: section,
    start: "top center",
    onEnter: () => animateContent(),
  });
  console.log(section.getBoundingClientRect().top);

  function animateContent() {
    gsap.to(content, {
      y: -160,
      opacity: 1,
      duration: 2,
      ease: "power1.out",
      scrollTrigger: {
        trigger: section,
        start: "top center",
        end: "+=300px",
        scrub: 1,
      },
    });
  }

  // **Animate the first animated-text from center to top-left**
  function animateFirstAnimatedText() {
    gsap.to(animatedTexts[0], {
      duration: 1,
      delay: 0.5,
      top: "120px",
      left: "120px",
      xPercent: 0,
      yPercent: 0,
      opacity: 1,
      ease: "power1.out",
      onComplete: () => {
        showWorkflowElements();
      },
    });
  }

  // **Update Hero Title Animation**
  function animateHeroTitle() {
    gsap.to(heroTitle, { opacity: 1, duration: 1, delay: 1 });

    gsap.to(heroTitle, {
      delay: 1.5,
      duration: 1,
      fontSize: "24px",
      top: "100px",
      left: "120px",
      ease: "power1.out",
      onComplete: () => {
        gsap.to(animatedTexts[0], { opacity: 1, duration: 0.3, delay: 0.5 });
        animateFirstAnimatedText();
      },
    });
  }

  // **Call center function before animation**
  centerHeroTitle();
  centerFirstAnimatedText();

  // **Animate Circles and Second Animated Text**
  function showWorkflowElements() {
    gsap.to(circles, {
      opacity: 1,
      visibility: "visible",
      duration: 0.5,
      stagger: {
        each: 0.5,
        onStart: function () {
          const index = Array.from(circles).indexOf(this.targets()[0]);

          // When the 4th circle starts animating in, fade in second animated text
          if (index === 3) {
            gsap.to(animatedTexts[1], {
              delay: 0.5,
              opacity: 1,
              duration: 1,
              ease: "power1.out",
            });
          }
        },
      },

      ease: "power1.out",
      onComplete: () => {
        gsap.to(circles, {
          duration: 0.3,
          onComplete: () => {
            circles.forEach(circle => circle.classList.add("flipped"));

            setTimeout(() => {
              circles.forEach(circle => circle.classList.add("flip"));

              setTimeout(() => {
                document.querySelectorAll(".init-img").forEach(img => {
                  gsap.to(img, {
                    opacity: 0,
                    duration: 0.5,
                    onComplete: () => (img.style.display = "none"),
                  });
                });
              },);
            }, 500);
          },
        });
      },
    });
  }

  // **Trigger Animation at Specific Video Time**
  video.addEventListener("timeupdate", () => {
    if (!hasTriggered && video.currentTime >= targetTime) {
      hasTriggered = true;
      performAction();
    }
  });

  function performAction() {
    gsap.to(video, { opacity: 0, onComplete(){
      video.remove();
    } });
    console.log("The video has reached 5 seconds!");
    gsap.to(heroTitle, {
      opacity: 1,
      duration: 1,
      ease: "power1.out",
      delay: 1, // Small delay to ensure video is fully gone
    });
  
    animateHeroTitle(); // Proceed with the rest of the animation
  }


  // **Debounce Utility for Resize Events**
  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  // **Initialize**
  window.addEventListener("resize", debounce(centerHeroTitle, 200));

  // **Trigger Hero Title Animation**
  setTimeout(() => {
    animateHeroTitle();
  }, 4000);
});
