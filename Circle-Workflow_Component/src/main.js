document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".workflow-container");
  const circles = document.querySelectorAll(".circle");
  const heroTitle = document.querySelector(".hero-title");
  const animatedTexts = document.querySelectorAll(".animated-text");
  const section = document.querySelector(".two");
  const content = section.querySelector(".content");
  const video1 = document.getElementById("rvty-video-1");
  const video2 = document.getElementById("rvty-video-2");
  const yellowSVGWave = document.querySelector(
    ".rvty-hero-l2-banner-cover-yellow"
  );

  const targetTime = 2; // Time to trigger the video action
  let hasTriggered = false;

  // ** GSAP Initial Styles**
  gsap.set([content, animatedTexts[0], animatedTexts[1], circles, video2], {
    opacity: 0,
  });
  gsap.set(section, { "--before-top": "0px" });

  // **Center Element Function**
  function centerElement(element, textIndex = 0) {
    const containerRect = container.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    element.style.position = "absolute";
    element.style.top = `${
      containerRect.height / 2 - elementRect.height / 2
    }px`;
    element.style.left = `${containerRect.width / 2 - elementRect.width / 2}px`;
  }

  // **Center First Animated Text**
  function centerFirstAnimatedText() {
    centerElement(animatedTexts[0]);
  }

  // **Center Hero Title**
  function centerHeroTitle() {
    centerElement(heroTitle);
  }

  gsap.set(yellowSVGWave, {
    transformOrigin: "bottom center",
    scaleY: 1,
  });

  gsap.to(yellowSVGWave, {
    scaleY: 3,
    ease: "power1.out",
    scrollTrigger: {
      trigger: section,
      start: "top+=100px center",
      end: "+=500px",
      scrub: 1,
      immediateRender: false,
    },
  });

  // **Scroll Animation using ScrollTrigger**
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.create({
    trigger: section,
    start: "top center",
    onEnter: () => animateContent(),
  });

  function animateContent() {
    gsap.to(content, {
      y: -160,
      opacity: 1,
      duration: 2,
      ease: "power1.in",
      scrollTrigger: {
        trigger: section,
        start: "top center+=200px",
        end: "+=300px",
        scrub: 1,
      },
    });
  }

  // **Animate the first animated-text from center to top-left**
  function animateFirstAnimatedText() {
    gsap.to(animatedTexts[0], {
      duration: 0.5,
      delay: 0.5,
      top: "120px",
      left: "120px",
      xPercent: 0,
      yPercent: 0,
      opacity: 1,
      ease: "power1.inOut",
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
        gsap.to(animatedTexts[0], { opacity: 1, duration: 0.3, delay: 0 });
        animateFirstAnimatedText();
      },
    });
  }

  // **Call center function before animation**
  centerHeroTitle();
  centerFirstAnimatedText();

  // **Animate Circles, Second Animated Text, and Video2 Fade-out**
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
          if (index === 5) {
            // Fade out and remove video2
            if (video2) {
              gsap.to(video2, {
                delay: 1.3,
                opacity: 0,
                duration: 1.5,
                ease: "power1.out",
                onComplete: () => {
                  video2.remove(); // Remove the video from DOM
                },
              });
            }
          }
        },
      },

      ease: "power1.out",
      onComplete: () => {
        gsap.to(circles, {
          duration: 0.3,
          onComplete: () => {
            circles.forEach((circle) => circle.classList.add("flipped"));

            setTimeout(() => {
              circles.forEach((circle) => circle.classList.add("flip"));

              setTimeout(() => {
                document.querySelectorAll(".init-img").forEach((img) => {
                  gsap.to(img, {
                    opacity: 0,
                    duration: 0.5,
                    onComplete: () => (img.style.display = "none"),
                  });
                });
              }, 500);
            }, 500);
          },
        });
      },
    });
  }

  // **Trigger Animation at Specific Video Time**
  video1.addEventListener("timeupdate", () => {
    if (!hasTriggered && video1.currentTime >= targetTime) {
      hasTriggered = true;
      performAction();
    }
  });

  function performAction() {
    gsap.to(video1, {
      opacity: 0,
      duration: 0.5,
      ease: "power1.out",
      onComplete: () => {
        gsap.to(video2, {
          opacity: 1,
          duration: 0.5,
          ease: "power1.out",
        });
        video1.remove();
      },
    });
    console.log("The video has reached 5 seconds!");
    gsap.to(heroTitle, {
      opacity: 1,
      duration: 1,
      ease: "power1.out",
      delay: 1, // Small delay to ensure video is fully gone
    });

    animateHeroTitle(); // Proceed with the rest of the animation
  }
});
