const orbit = document.getElementById("orbit");
const professions = document.querySelectorAll(".profession");

const centerIcon = document.getElementById("centerIcon");
const centerTitle = document.getElementById("centerTitle");
const centerText = document.getElementById("centerText");

const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const particles = document.getElementById("particles");


/* =========================================================
   SETTINGS
========================================================= */

let rotation = 0;
let paused = false;
let dragging = false;

let lastX = 0;

let speed = 0.025;


/* OVAL O'LCHAMI */
let radiusX = 500;
let radiusY = 190;


/* =========================================================
   CARDS
========================================================= */

const cards = Array.from(professions).map(
    (element, index) => ({
        element: element,
        angle:
            (360 / professions.length) * index
    })
);


/* =========================================================
   RESPONSIVE OVAL
========================================================= */

function updateRadius() {

    const width =
        window.innerWidth;

    const height =
        window.innerHeight;


    if (width >= 1400) {

        radiusX =
            Math.min(
                width * 0.36,
                540
            );

        radiusY =
            Math.min(
                height * 0.16,
                190
            );
    }

    else if (width >= 1000) {

        radiusX =
            Math.min(
                width * 0.34,
                470
            );

        radiusY =
            Math.min(
                height * 0.15,
                165
            );
    }

    else if (width >= 700) {

        radiusX =
            Math.min(
                width * 0.37,
                390
            );

        radiusY =
            Math.min(
                height * 0.14,
                145
            );
    }

    else {

        radiusX =
            Math.min(
                width * 0.39,
                280
            );

        radiusY =
            Math.min(
                height * 0.13,
                105
            );
    }
}


/* =========================================================
   UPDATE OVAL CARDS
========================================================= */

function updateCards() {

    cards.forEach(card => {

        const angle =
            card.angle + rotation;

        const rad =
            angle * Math.PI / 180;


        /*
         * X katta
         * Y kichik
         *
         * Shu sababli aylana
         * gorizontal ovalga aylanadi.
         */

        const x =
            Math.sin(rad) * radiusX;

        const y =
            -Math.cos(rad) * radiusY;


        /*
         * Old-orqa chuqurlik
         */

        const depth =
            (Math.cos(rad) + 1) / 2;


        const scale =
            0.76 + depth * 0.24;


        const opacity =
            0.60 + depth * 0.40;


        const zIndex =
            Math.round(
                10 + depth * 100
            );


        card.element.style.transform =
            `translate(-50%, -50%)
             translate3d(${x}px, ${y}px, 0)
             scale(${scale})`;


        card.element.style.opacity =
            opacity;


        card.element.style.zIndex =
            zIndex;


        card.element.style.willChange =
            "transform";

    });
}


/* =========================================================
   ANIMATION
========================================================= */

let lastTime =
    performance.now();


function animate(currentTime) {

    const delta =
        currentTime - lastTime;

    lastTime =
        currentTime;


    if (!paused && !dragging) {

        rotation +=
            speed * delta;
    }


    updateCards();

    requestAnimationFrame(
        animate
    );
}


requestAnimationFrame(
    animate
);


updateRadius();
updateCards();


/* =========================================================
   RESIZE
========================================================= */

window.addEventListener(
    "resize",
    () => {

        updateRadius();
        updateCards();

    }
);


/* =========================================================
   DRAG
========================================================= */

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


        orbit.classList.add(
            "dragging"
        );


        try {

            orbit.setPointerCapture(
                event.pointerId
            );

        }

        catch (error) {}

    }
);


orbit.addEventListener(
    "pointermove",
    event => {

        if (!dragging) {
            return;
        }


        const difference =
            event.clientX - lastX;


        rotation +=
            difference * 0.3;


        lastX =
            event.clientX;

    }
);


function stopDragging(event) {

    dragging = false;

    orbit.classList.remove(
        "dragging"
    );


    try {

        orbit.releasePointerCapture(
            event.pointerId
        );

    }

    catch (error) {}
}


orbit.addEventListener(
    "pointerup",
    stopDragging
);

orbit.addEventListener(
    "pointercancel",
    stopDragging
);


/* =========================================================
   CARD CLICK
========================================================= */

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


                centerIcon.innerHTML =
                    card.dataset.icon;


                centerTitle.textContent =
                    card.dataset.name;


                centerText.textContent =
                    card.dataset.description;


                centerIcon.animate(
                    [
                        {
                            transform:
                                "scale(.7)",

                            opacity: 0.2
                        },

                        {
                            transform:
                                "scale(1.15)",

                            opacity: 1
                        },

                        {
                            transform:
                                "scale(1)",

                            opacity: 1
                        }
                    ],
                    {
                        duration: 450,

                        easing:
                            "cubic-bezier(.2,.8,.2,1)"
                    }
                );

            }
        );

    }
);


/* =========================================================
   PAUSE
========================================================= */

if (pauseBtn) {

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

}


/* =========================================================
   RESET
========================================================= */

if (resetBtn) {

    resetBtn.addEventListener(
        "click",
        () => {

            rotation = 0;

            paused = false;


            if (pauseBtn) {

                pauseBtn.innerHTML =
                    "⏸ <span>Pauza</span>";

            }


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

}


/* =========================================================
   PARTICLES
========================================================= */

function createParticles() {

    if (!particles) {
        return;
    }


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
            Math.random() * 100 + "%";


        particle.style.top =
            Math.random() * 100 + "%";


        particle.style.setProperty(
            "--duration",
            (8 + Math.random() * 15) + "s"
        );


        particle.style.setProperty(
            "--delay",
            (-Math.random() * 15) + "s"
        );


        particle.style.setProperty(
            "--move-x",
            (-150 + Math.random() * 300) + "px"
        );


        const size =
            1 + Math.random() * 3;


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


/* =========================================================
   TEACHER HIGHLIGHT
========================================================= */

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