const orbit = document.getElementById("orbit");
const professions = document.querySelectorAll(".profession");

const centerIcon = document.getElementById("centerIcon");
const centerTitle = document.getElementById("centerTitle");
const centerText = document.getElementById("centerText");

const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const particles = document.getElementById("particles");

let rotation = 0;
let speed = 0.018;
let paused = false;

let radius = 300;

let dragging = false;
let lastX = 0;


/* ================================
   KARTALAR
================================ */

const cards = Array.from(professions).map(
    (element, index) => {

        return {
            element: element,
            angle: (360 / professions.length) * index
        };

    }
);


/* ================================
   RADIUS
================================ */

function updateRadius() {

    const width = window.innerWidth;
    const height = window.innerHeight;

    if (width > 1200) {

        radius = Math.min(
            width * 0.24,
            height * 0.30
        );

    } else if (width > 700) {

        radius = Math.min(
            width * 0.27,
            height * 0.28
        );

    } else {

        radius = Math.min(
            width * 0.36,
            height * 0.25
        );
    }
}


/* ================================
   KARTALARNI JOYLASHTIRISH
================================ */

function updateCards() {

    cards.forEach(card => {

        const angle =
            card.angle + rotation;

        const rad =
            angle * Math.PI / 180;

        const x =
            Math.sin(rad) * radius;

        const y =
            -Math.cos(rad) * radius;


        /*
           Old tomondagi kartalar
           kattaroq ko‘rinadi.
        */

        const depth =
            (Math.cos(rad) + 1) / 2;

        const scale =
            0.72 + depth * 0.28;

        const opacity =
            0.45 + depth * 0.55;

        const z =
            Math.round(depth * 100);


        card.element.style.setProperty(
            "--x",
            `${x}px`
        );

        card.element.style.setProperty(
            "--y",
            `${y}px`
        );

        card.element.style.setProperty(
            "--scale",
            scale
        );

        card.element.style.setProperty(
            "--opacity",
            opacity
        );

        card.element.style.setProperty(
            "--z",
            z
        );
    });
}


/* ================================
   ANIMATION
================================ */

let lastTime = performance.now();

function animate(time) {

    const delta =
        time - lastTime;

    lastTime = time;


    if (!paused && !dragging) {

        /*
           Sekin va silliq aylanish.
        */

        rotation +=
            speed * delta;
    }


    updateCards();

    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);


/* ================================
   BOSHLANG‘ICH HOLAT
================================ */

updateRadius();
updateCards();


/* ================================
   RESIZE
================================ */

window.addEventListener(
    "resize",
    () => {

        updateRadius();
        updateCards();

    }
);


/* ================================
   TELEFON / SICHQONCHA
   BILAN AYLANtirish
================================ */

orbit.addEventListener(
    "pointerdown",
    event => {

        if (
            event.target.closest(".profession")
        ) {
            return;
        }

        dragging = true;

        lastX = event.clientX;

        orbit.classList.add("dragging");

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

        const difference =
            event.clientX - lastX;

        rotation +=
            difference * 0.25;

        lastX =
            event.clientX;
    }
);


function stopDragging(event) {

    dragging = false;

    orbit.classList.remove("dragging");

    try {

        orbit.releasePointerCapture(
            event.pointerId
        );

    } catch (error) {

        // Hech narsa qilmaymiz

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


/* ================================
   KASB KARTASINI BOSISH
================================ */

professions.forEach(card => {

    card.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            professions.forEach(item => {

                item.classList.remove(
                    "active"
                );

            });

            card.classList.add("active");


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

});


/* ================================
   PAUZA
================================ */

pauseBtn.addEventListener(
    "click",
    () => {

        paused = !paused;

        if (paused) {

            pauseBtn.innerHTML =
                "▶ <span>Davom</span>";

        } else {

            pauseBtn.innerHTML =
                "⏸ <span>Pauza</span>";
        }
    }
);


/* ================================
   RESET
================================ */

resetBtn.addEventListener(
    "click",
    () => {

        rotation = 0;

        paused = false;

        pauseBtn.innerHTML =
            "⏸ <span>Pauza</span>";


        professions.forEach(card => {

            card.classList.remove(
                "active"
            );

        });


        centerIcon.textContent =
            "⚙";

        centerTitle.textContent =
            "Kasblar olami";

        centerText.textContent =
            "Kasbga qo‘yiladigan asosiy talablar majmui";
    }
);


/* ================================
   PARTICLES
================================ */

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
            document.createElement("div");

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


/* ================================
   O‘QITUVCHI
================================ */

const teacher =
    document.querySelector(".teacher");

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
