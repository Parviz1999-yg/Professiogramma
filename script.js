/* =========================================
   PROFESSIOGRAMMA
   JONLI 3D ORBIT
========================================= */

const orbit =
    document.getElementById("orbit");

const professions =
    document.querySelectorAll(".profession");

const centerIcon =
    document.getElementById("centerIcon");

const centerTitle =
    document.getElementById("centerTitle");

const centerText =
    document.getElementById("centerText");

const pauseBtn =
    document.getElementById("pauseBtn");

const resetBtn =
    document.getElementById("resetBtn");

const particles =
    document.getElementById("particles");


/* =========================================
   ASOSIY SOZLAMALAR
========================================= */

let rotation = 0;

let speed = 0.00022;

let paused = false;

let dragging = false;

let lastX = 0;

let dragVelocity = 0;

let radius = 300;


/* =========================================
   KARTALAR
========================================= */

const cards =
    Array.from(professions)
        .map((card, index) => {

            return {

                element: card,

                baseAngle:
                    (360 / professions.length) *
                    index

            };

        });


/* =========================================
   RADIUS HISOBLASH
========================================= */

function updateRadius() {

    const width =
        window.innerWidth;

    const height =
        window.innerHeight;


    if (width > 1200) {

        radius =
            Math.min(
                width * 0.225,
                height * 0.315
            );

    }

    else if (width > 900) {

        radius =
            Math.min(
                width * 0.22,
                height * 0.30
            );

    }

    else {

        radius =
            Math.min(
                width * 0.38,
                height * 0.30
            );

    }

}


/* =========================================
   KARTALARNI JOYLASHTIRISH
========================================= */

function updateCards() {

    cards.forEach(card => {

        const angle =
            card.baseAngle +
            rotation;


        const radians =
            angle *
            Math.PI /
            180;


        const x =
            Math.sin(radians) *
            radius;


        const y =
            -Math.cos(radians) *
            radius;


        const depth =
            (Math.cos(radians) + 1) / 2;


        const scale =
            0.72 +
            depth * 0.30;


        const opacity =
            0.45 +
            depth * 0.55;


        const zIndex =
            Math.round(
                depth * 100
            );


        card.element.style.setProperty(
            "--x",
            `${x}px`
        );


        card.element.style.setProperty(
            "--y",
            `${y}px`
        );


        card.element.style.setProperty(
            "--z",
            `${zIndex}`
        );


        card.element.style.setProperty(
            "--scale",
            scale
        );


        card.element.style.setProperty(
            "--opacity",
            opacity
        );

    });

}


/* =========================================
   ANIMATSIYA
========================================= */

let previousTime =
    performance.now();


function animate(currentTime) {

    const delta =
        currentTime -
        previousTime;


    previousTime =
        currentTime;


    if (!paused && !dragging) {

        rotation +=
            speed *
            delta;


        if (
            Math.abs(dragVelocity) >
            0.00001
        ) {

            rotation +=
                dragVelocity *
                delta;


            dragVelocity *=
                Math.pow(
                    0.001,
                    delta / 1000
                );

        }

    }


    updateCards();


    requestAnimationFrame(
        animate
    );

}


requestAnimationFrame(
    animate
);


/* =========================================
   DASTLABKI HOLAT
========================================= */

updateRadius();

updateCards();


window.addEventListener(
    "resize",
    () => {

        updateRadius();

        updateCards();

    }
);


/* =========================================
   MOUSE / TOUCH DRAG
========================================= */

orbit.addEventListener(
    "pointerdown",
    event => {

        if (
            event.target.closest(
                ".profession"
            )
        ) {

            return;

        }


        dragging = true;

        lastX =
            event.clientX;

        dragVelocity = 0;


        orbit.classList.add(
            "dragging"
        );


        orbit.setPointerCapture(
            event.pointerId
        );

    }
);


orbit.addEventListener(
    "pointermove",
    event => {

        if (!dragging) {

            return;

        }


        const currentX =
            event.clientX;


        const difference =
            currentX -
            lastX;


        rotation +=
            difference *
            0.20;


        dragVelocity =
            difference *
            0.0008;


        lastX =
            currentX;

    }
);


/* =========================================
   DRAGNI TO‘XTATISH
========================================= */

function stopDragging(event) {

    if (!dragging) {

        return;

    }


    dragging = false;


    orbit.classList.remove(
        "dragging"
    );


    try {

        orbit.releasePointerCapture(
            event.pointerId
        );

    }

    catch (error) {

        /* Hech narsa qilmaymiz */

    }

}


orbit.addEventListener(
    "pointerup",
    stopDragging
);


orbit.addEventListener(
    "pointercancel",
    stopDragging
);


/* =========================================
   KARTA BOSILGANDA
========================================= */

professions.forEach(
    card => {

        card.addEventListener(
            "click",
            event => {

                event.stopPropagation();


                professions.forEach(
                    item => {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                card.classList.add(
                    "active"
                );


                const name =
                    card.dataset.name;


                const icon =
                    card.dataset.icon;


                const description =
                    card.dataset.description;


                centerIcon.innerHTML =
                    icon;


                centerTitle.textContent =
                    name;


                centerText.textContent =
                    description;


                centerIcon.animate(
                    [

                        {
                            transform:
                                "scale(.7) rotate(-20deg)",

                            opacity: 0.2
                        },

                        {
                            transform:
                                "scale(1.1) rotate(10deg)",

                            opacity: 1
                        },

                        {
                            transform:
                                "scale(1) rotate(0deg)",

                            opacity: 1
                        }

                    ],
                    {

                        duration: 500,

                        easing:
                            "cubic-bezier(.2,.8,.2,1)"

                    }
                );


                card.animate(
                    [

                        {
                            filter:
                                "brightness(1)"
                        },

                        {
                            filter:
                                "brightness(1.35)"
                        },

                        {
                            filter:
                                "brightness(1)"
                        }

                    ],
                    {

                        duration: 500

                    }
                );

            }
        );

    }
);


/* =========================================
   PAUZA
========================================= */

pauseBtn.addEventListener(
    "click",
    () => {

        paused =
            !paused;


        if (paused) {

            pauseBtn.innerHTML =
                "▶ <span>Davom</span>";

        }

        else {

            pauseBtn.innerHTML =
                "⏸ <span>Pauza</span>";

        }

    }
);


/* =========================================
   RESET
========================================= */

resetBtn.addEventListener(
    "click",
    () => {

        rotation = 0;

        dragVelocity = 0;

        paused = false;


        pauseBtn.innerHTML =
            "⏸ <span>Pauza</span>";


        professions.forEach(
            card => {

                card.classList.remove(
                    "active"
                );

            }
        );


        centerIcon.textContent =
            "⚙";


        centerTitle.textContent =
            "Kasblar olami";


        centerText.textContent =
            "Kasbga qo‘yiladigan asosiy talablar majmui";

    }
);


/* =========================================
   ZARRACHALAR
========================================= */

function createParticles() {

    const count =
        window.innerWidth > 1400
            ? 45
            : 30;


    for (
        let i = 0;
        i < count;
        i++
    ) {

        const particle =
            document.createElement(
                "div"
            );


        particle.className =
            "particle";


        particle.style.left =
            Math.random() * 100 +
            "%";


        particle.style.top =
            Math.random() * 100 +
            "%";


        particle.style.setProperty(
            "--duration",
            (8 + Math.random() * 15) +
            "s"
        );


        particle.style.setProperty(
            "--delay",
            (-Math.random() * 15) +
            "s"
        );


        particle.style.setProperty(
            "--move-x",
            (-150 + Math.random() * 300) +
            "px"
        );


        const size =
            1 +
            Math.random() * 3;


        particle.style.width =
            size + "px";


        particle.style.height =
            size + "px";


        particles.appendChild(
            particle
        );

    }

}


createParticles();


/* =========================================
   MOUSE WHEEL
========================================= */

orbit.addEventListener(
    "wheel",
    event => {

        event.preventDefault();


        speed +=
            event.deltaY *
            -0.000002;


        speed =
            Math.max(
                -0.001,
                Math.min(
                    0.001,
                    speed
                )
            );

    },
    {
        passive: false
    }
);


/* =========================================
   O‘QITUVCHINI BOSHLANG‘ICH
   HOLATDA TANLASH
========================================= */

const teacher =
    document.querySelector(
        ".teacher"
    );


if (teacher) {

    setTimeout(
        () => {

            teacher.classList.add(
                "active"
            );

        },
        1200
    );

          }
