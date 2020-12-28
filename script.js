/**
 * Initialization
 */

let clickedNums = [];
initLotteryPicker();

/**
 * Listeners
 */

// Flip a coin - "Go" button is clicked
$('#coin-flipper .go').on('click', function() {
    const amount = parseInt($('#coin-flipper .flip-amount').val());
    const result = coinFlipper(amount);

    $('#coin-flipper .heads-counter').html(result.heads);
    $('#coin-flipper .tails-counter').html(result.tails);
});

// Lottery - a number is clicked
$('.lottery-picker td').on('click', function() {
    togglePickedNumber($(this));
});

// Lottery - "Go" button is clicked
$('#lottery .go').on('click', function() {
    let result = autoLottery(clickedNums);

    for (let i = 2; i <= 5; i++) {
        $('.lottery-tries-' + i).html(result.tries[i].toLocaleString());
    }

    $('.lottery-duration').html(result.duration.toLocaleString());
    $('.lottery-speed').html(result.speed.toLocaleString());
});

// Random image generator - "Go" button is clicked
$('#random-image .go').on('click', function() {
    const canvas = document.querySelector('#random-image canvas');
    randomizeCanvas(canvas);
});

/**
 * Functions
 */

// Flips a coin multiple times
function coinFlipper(amount) {
    let heads = 0;
    let tails = 0;

    let i = 0;
    while (i < amount) {
        if (Math.random() < 0.5) {
            ++heads;
        } else {
            ++tails;
        }

        ++i;
    }

    return {
        heads: heads,
        tails: tails,
    };
}

// Yeah, I'm not going to copy-paste and manually fill out 90 cells
function initLotteryPicker() {
    const max = 90;
    const splitter = 10;

    let cols = [];
    for (let i = 1; i <= max; i++) {
        cols.push(`<td>${i}</td>`);
    }

    let rows = [];
    for (let i = 0; i < max/splitter; i++) {
        rows.push('<tr>' + cols.slice(i * splitter, i * splitter + splitter).join() + '</tr>');
    }

    $('.lottery-picker').append(rows.join());
}

// Marks a number as picked
function togglePickedNumber(num) {
    if (!num.hasClass('clicked')) {
        // Don't allow selecting more than 5 numbers
        if (clickedNums.length < 5) {
            clickedNums.push(parseInt(num.text()));
            num.addClass('clicked');
        }
    } else {
        clickedNums = clickedNums.filter(val => val !== parseInt(num.text()));
        num.removeClass('clicked');
    }

    // Don't allow pressing the button unless 5 numbers are selected
    $('#lottery .go').prop('disabled', clickedNums.length < 5);
}

// Single iteration of lottery
function lottery(guesses) {
    const max = 90;
    let points = 0;
    let random;

    let randoms = [];
    for (let i = 0; i < 5; i++) {
        // Don't allow duplications
        do {
            random = Math.floor(Math.random() * max) + 1;
        } while (randoms.includes(random));
        randoms.push(random);
    }

    randoms.forEach(function (num) {
        if (guesses.includes(num)) {
            ++points;
        }
    });

    return points;
}

// Multiple iterations of lottery
function autoLottery(guesses) {
    let points = 0;
    let tries = {
        total: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
    };

    let start = Date.now();

    do {
        ++tries.total;
        points = lottery(guesses);

        for (let i = 2; i <= 5; i++) {
            if (points >= i && tries[i] === 0) tries[i] = tries.total;
        }
    } while (points < 5);

    let end = Date.now();

    let duration = (end - start) / 1000;
    let speed = Math.round(tries.total/duration);

    return {
        tries: tries,
        duration: duration,
        speed: speed,
    };
}

// Randomizes an entire canvas
function randomizeCanvas(canvas) {
    const ctx = canvas.getContext('2d');

    for (let i = 0; i < canvas.getAttribute('width'); i++) {
        for (let j = 0; j < canvas.getAttribute('height'); j++) {
            randomizePixel(ctx, i, j);
        }
    }
}

// Randomizes a single pixel
function randomizePixel(ctx, x, y) {
    ctx.fillStyle = '#' + Math.floor(Math.random() * 16777215).toString(16);
    ctx.fillRect(x, y, 1, 1);
}