/* =========================================
   PROFESSIOGRAMMA
   KASBLAR ORBITASI
========================================= */

const orbit = document.getElementById("orbit");

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

/*
   Aylanish tezligi.
   Kattaroq son = tezroq aylanish.
*/
let speed = 0.025;

let paused = false;

let dragging = false;

let lastX = 0;

let dragVelocity = 0;

let radius = 300;


/* =========================================
   KARTALARNI ORBITAGA JOYLASHTIRISH
========================================= */

const cards =
    Array.from(professions).map(
        (card, index) => {

            return {

                element: card,

                /*
                   Har bir karta aylananing
                   boshqa nuqtasidan boshlanadi.
                */

                baseAngle =
                    (360 / professions.length) *
                    index
            };
        }
    );


/* =========================================
   ORBIT RADIUSINI ANIQLASH
========================================= */

function updateRadius() {

    const width =
        window.innerWidth;

    const height =
        window.innerHeight;


    if (width > 1200) {

        radius =
            Math.min(
                width * 0.25,
                height * 0.32
            );

    }

    else if (width > 900) {

        radius =
            Math.min(
                width * 0.27,
                height * 0.30
            );

    }

    else {

        radius =
            Math.min(
                width * 0.38,
                height * 0.27
            );
    }
}


/* =========================================
   KARTALARNI HARAKATLANTIRISH
========================================= */

function updateCards() {

    cards.forEach(card => {

        /*
           Asosiy formula:

           Har bir karta o'z burchagiga ega.
           rotation esa barcha kartalarni
           birgalikda aylantiradi.
        */

        const angle =
            card.baseAngle +
            rotation;


        const radians =
            angle *
            Math.PI /
            180;


        /*
           X koordinata
        */

        const x =
            Math.sin(radians) *
            radius;


        /*
           Y koordinata

           -cos ishlatilgani uchun
           birinchi karta yuqoridan boshlanadi.
        */

        const y =
            -Math.cos(radians) *
            radius;


        /*
           Karta markazga qanchalik
           yaqinligini aniqlaymiz.

           Old tomonda katta,
           orqa tomonda kichik bo'ladi.
        */

        const depth =
            (Math.cos(radians) + 1) / 2;


        const scale =
            0.70 +
            depth * 0.32;


        const opacity =
            0.45 +
            depth * 0.55;


        /*
           Oldingi kartalar yuqorida,
           orqadagi kartalar pastda.
        */

        const zIndex =
            Math.round(
                depth * 100
            );


        /*
           CSS o'zgaruvchilarini
           yangilaymiz.
        */

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
            zIndex
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
   ANIMATION
========================================= */

let previousTime =
    performance.now();


function animate(currentTime) {

    const delta =
        currentTime -
        previousTime;


    previousTime =
        currentTime;


    /*
       Oddiy avtomatik aylanish.
    */

    if (!paused && !dragging) {

        rotation +=
            speed *
            delta;


        /*
           Qo‘l bilan aylantirgandan
           keyingi inertsiya.
        */

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


    /*
       Har bir frame'da
       kartalarni qayta joylashtiramiz.
    */

    updateCards();


    requestAnimationFrame(
        animate
    );
}


requestAnimationFrame(
    animate
);


/* =========================================
   BOSHLANG‘ICH HOLAT
========================================= */

updateRadius();

updateCards();


/* =========================================
   EKRAN O‘LCHAMI O‘ZGARSA
========================================= */

window.addEventListener(
    "resize",
    () => {

        updateRadius();

        updateCards();
    }
);


/* =========================================
   SICHQONCHA / TELEFONDA SUDRASH
========================================= */

orbit.addEventListener(
    "pointerdown",
    event => {

        /*
           Kartaning o'zini bossak,
           drag boshlanmaydi.
        */

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


        /*
           Barmoq/sichqoncha
           bilan aylantirish.
        */

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
   DRAG TUGASHI
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
   KASB KARTASINI BOSISH
========================================= */

professions.forEach(
    card => {

        card.addEventListener(
            "click",
            event => {

                event.stopPropagation();


                /*
                   Boshqa active kartalarni
                   o'chiramiz.
                */

                professions.forEach(
                    item => {

                        item.classList.remove(
                            "active"
                        );
                    }
                );


                /*
                   Tanlangan kartani
                   active qilamiz.
                */

                card.classList.add(
                    "active"
                );


                /*
                   HTML ichidagi
                   data-* ma'lumotlarni olamiz.
                */

                const name =
                    card.dataset.name;


                const icon =
                    card.dataset.icon;


                const description =
                    card.dataset.description;


                /*
                   Markazdagi ma'lumotni
                   yangilaymiz.
                */

                centerIcon.innerHTML =
                    icon;


                centerTitle.textContent =
                    name;


                centerText.textContent =
                    description;


                /*
                   Markaz ikonkasiga
                   chiroyli animatsiya.
                */

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


                /*
                   Tanlangan kartaga
                   qisqa yorqin effekt.
                */

                card.animate(
                    [

                        {
                            filter:
                                "brightness(1)"
                        },

                        {
                            filter:
                                "brightness(1.4)"
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
   PAUZA / DAVOM
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
   FON ZARRACHALARI
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
   MOUSE WHEEL — TEZLIK
========================================= */

orbit.addEventListener(
    "wheel",
    event => {

        event.preventDefault();


        speed +=
            event.deltaY *
            -0.00015;


        speed =
            Math.max(
                -0.08,
                Math.min(
                    0.08,
                    speed
                )
            );
    },

    {
        passive: false
    }
);


/* =========================================
   O‘QITUVCHINI AVTOMATIK AJRATISH
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
