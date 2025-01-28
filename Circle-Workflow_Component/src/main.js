document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.workflow-container');
  const circles = document.querySelectorAll('.circle');
  const heroTitle = document.querySelector('.hero-title');
  const animatedTexts = document.querySelectorAll('.animated-text');
  const bannerContainer = document.querySelector('.rvty-hero-container');
  const section = document.querySelector('.two');
  const content = section.querySelector('.content');
  const video = document.getElementById("myVideo");
  
  const circleRadius = 90;
  const targetTime = 10; // Time to trigger the video action
  let hasTriggered = false;

  // GSAP setup
  gsap.registerPlugin(ScrollTrigger);

  // ScrollTrigger for the section
  ScrollTrigger.create({
    trigger: '.two',
    start: 'top center +=300',
    end: 'bottom center',
    onEnter: () => console.log('Entered the section'),
    onLeave: () => console.log('Left the section'),
    onUpdate: (self) => {
      console.log(
        `Current After Height: ${getComputedStyle(section).getPropertyValue("--after-height")}`
      );
    },
  });

  // Initial CSS variables setup
  gsap.set(section, { "--before-top": "0px" });
  gsap.set(content, { opacity: 0 });
  gsap.set(bannerContainer, {
    "--after-height": "176px",
    "--svg-yallow-scale": 1,
  });

  // Animate the pseudo-element and scale
  gsap.to(bannerContainer, {
    "--after-height": "400px",
    "--svg-yallow-scale": 1.2,
    ease: "none",
    scrollTrigger: {
      trigger: bannerContainer,
      start: "top",
      end: "bottom -=50",
      scrub: true,
      onUpdate: (self) => {
        console.log(`Scroll Progress: ${self.progress}`);
      },
    },
  });

  // Animate the section content
  gsap.to(content, {
    y: -165,
    opacity: 1,
    ease: "power1.inOut",
    scrollTrigger: {
      trigger: section,
      start: "-=500",
      end: "bottom center",
      scrub: true,
      onUpdate: (self) => console.log(`Content Progress: ${self.progress}`),
    },
  });

  // Hide circles initially
  function hideWorkflowElements() {
    gsap.set(circles, { opacity: 0, visibility: "hidden" });
  }

  // Show and animate circles
  function showWorkflowElements() {
    gsap.to(circles, {
      opacity: 1,
      visibility: "visible",
      duration: 1,
      stagger: {
        each: 1,
        onStart: function () {
          this.targets()[0].classList.add("flipped");
        },
      },
      ease: "power1.out",
      onComplete: () => {
        setTimeout(() => {
          circles.forEach(circle => circle.classList.add("flip"));

          // Remove .init-img after flip animation
          setTimeout(() => {
            document.querySelectorAll(".init-img").forEach(img => {
              img.style.opacity = "0";
              setTimeout(() => img.style.display = "none", 300);
            });
          }, 1500); // Delay for flip animation
        }, 500);
      },
    });
  }

  // Center the hero title
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

  // Animate the hero title and texts
  function animateHeroTitle() {
    gsap.to(heroTitle, {
      delay: 1.5,
      duration: 1,
      fontSize: "18px",
      opacity: 1,
      top: "110px",
      left: "120px",
      transform: "translate(0, 0)",
      ease: "power1.out",
      onComplete: () => {
        showWorkflowElements();

        // Animate the first text
        gsap.set(animatedTexts[0], { top: "120px", left: "120px", opacity: 1 });
        animateTextWithSplit(animatedTexts[0], 4, 0, () => {
          // Animate the second text after the first
          gsap.set(animatedTexts[1], {
            bottom: "120px",
            right: "120px",
            opacity: 1,
          });
          animateTextWithSplit(animatedTexts[1], 2);
        });
      },
    });
  }

  // SplitText animation
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
        stagger: { each: charStagger },
        onComplete: () => {
          //split.revert();
          if (onComplete) onComplete();
        },
      }
    );
  }

  // Perform action when video reaches a specific time
  video.addEventListener("timeupdate", () => {
    if (!hasTriggered && video.currentTime >= targetTime) {
      hasTriggered = true;
      performAction();
    }
  });

  // Custom action when video reaches target time
  function performAction() {
    video.remove();
    centerHeroTitle();
    animateHeroTitle();
    console.log("The video has reached 10 seconds!");
  }

  // Debounce utility for resize events
  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  // Initialize
  hideWorkflowElements();

  window.addEventListener("resize", debounce(() => {
    centerHeroTitle();
  }, 200));
});
