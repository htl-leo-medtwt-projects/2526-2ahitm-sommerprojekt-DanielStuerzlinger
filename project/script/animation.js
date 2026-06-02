window.addEventListener("load", () => {

    gsap.from("#orbitLogo", {
        duration: 1.5,
        y: -10,
        opacity: 0,
        ease: "bounce.out"
    });

    gsap.from("h1", {
        duration: 1,
        opacity: 0,
        scale: 0.5
    });

    gsap.from(".mainButton", {
        duration: 1,
        opacity: 0,
        x: -200,
        stagger: 0.2
    });

    gsap.to("#orbitLogo", {
        y: 20,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    gsap.to("#backgroundObjekt1", {
        rotation: 38,
        y: -18,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    gsap.to("#backgroundObjekt2", {
        rotation: -18,
        y: 14,
        x: -10,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.6
    });

});