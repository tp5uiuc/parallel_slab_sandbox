/* Initialization functions*/

// dynamically load the script on demand
class ScriptLoader {
    constructor(script) {
        this.script = script;
        this.scriptElement = document.createElement("script");
        this.head = document.querySelector("head");
    }

    load() {
        return new Promise((resolve, reject) => {
            this.scriptElement.src = this.script;
            this.scriptElement.onload = e => resolve(e);
            this.scriptElement.onerror = e => reject(e);
            this.head.appendChild(this.scriptElement);
        });
    }
}

/* Defaults */
class DefaultHarmonicOne {
    static defaultRe() {
        return 10;
    }
    static defaultEr() {
        return 13;
    }
    static defaultSolidZoneOccupancy() {
        return 50;
    }
    static defaultDensityRatio() {
        return 10;
    }
    static defaultViscosityRatio() {
        return 0;
    }
}

class DefaultHarmonicTwo {
    static defaultRe() {
        return 10;
    }
    static defaultEr() {
        return 43;
    }
    static defaultSolidZoneOccupancy() {
        return 50;
    }
    static defaultDensityRatio() {
        return 10;
    }
    static defaultViscosityRatio() {
        return 0;
    }
}

class DefaultHarmonicThree {
    static defaultRe() {
        return 10;
    }
    static defaultEr() {
        return 93;
    }
    static defaultSolidZoneOccupancy() {
        return 50;
    }
    static defaultDensityRatio() {
        return 10;
    }
    static defaultViscosityRatio() {
        return 0;
    }
}

class DefaultHarmonicZero {
    static defaultRe() {
        return 10;
    }
    static defaultEr() {
        return 2;
    }
    static defaultSolidZoneOccupancy() {
        return 50;
    }
    static defaultDensityRatio() {
        return 10;
    }
    static defaultViscosityRatio() {
        return 0;
    }
}

class DefaultTypical {
    static defaultRe() {
        return 10;
    }
    static defaultEr() {
        return 10;
    }
    static defaultSolidZoneOccupancy() {
        return 50;
    }
    static defaultDensityRatio() {
        return 10;
    }
    static defaultViscosityRatio() {
        return 1;
    }
}

/* Constants for the simulator that the user cannot change */
class ConstantParameters {
    static shear_rate(){
        return 1.0 / Math.PI;
    }

    static L(){
        return 2.0;
    }

    static omega() {
        return Math.PI;
    }

    static n_modes(){
        return 16;
    }

    static rho_f(){
        return 1.0;
    }

}

// async function to fetch the raw content of the gist
/**
 * @param filename
 */
async function fetchFile(filename) {

    // const gistID = 'ea4b6c8e831ff923640aeda185241d14'
    // const url = `https://api.github.com/gists/${gistID}`
    // const fileName = "random_walk_2d.py"

    const rawContent = await fetch(filename)

    // .then(res => res.json())
        .then(data =>

        // console.log(data.text());
            data.text()

            // return data.files[fileName].content;
        );

    // console.log(rawContent);

    return rawContent;
}

/**
 *
 */
function getPlotLayoutData() {
    return {
        xaxis: {
            title: "$U/U_{\\infty}$",
            range: [-1.5, 1.5],
            zeroline: false

            // linecolor : 'black',
            // linewidth : 2,
        },
        yaxis: {
            title: "$y/L$",
            scaleanchor: "x",
            scaleratio: 5,
            range: [0, 1],
            zeroline: false

            // linecolor : 'black',
            // linewidth : 2,
        },
        shapes: [{
            type: "line",
            xref: "paper",
            x0: 0,
            y0: solidZoneRatio(),
            x1: 1,
            y1: solidZoneRatio(),
            line: { color: "rgb(0, 0, 0)", width: 2, dash: "dashdot" }
        }],
        autosize: true,
        margin: { l: 40, r: 40, b: 40, t: 40 },
        showlegend: false
    };
}

// placehold plot
/**
 *
 */
function placeholderPlot() {
    Plotly.newPlot("plot_div",
        [
            {
                x: [0],
                y: [0],
                mode: "lines",
                type: "scatter",

                // marker : {size : 30}
                line: { color: "rgb(219, 64, 82)", width: 3 }
            }
        ],
        getPlotLayoutData());
}

/**
 * @param data
 * @param col
 */
function assembleDataForStaticPlot(data, col) {
    return [

        // solid data first
        {
            x: data[0],
            y: data[1],
            mode: "lines",
            type: "scatter",
            line: { color: col, width: 3 }
        },

        // fluid data next
        {
            x: data[2],
            y: data[3],
            mode: "lines",
            type: "scatter",
            line: { color: col, width: 3 }
        }
    ];
}

// all_data is a array with 4 elements each
// all_colors is an array with hex values
/**
 * @param all_data
 * @param all_colors
 */
function staticPlot(all_data, all_colors) {
    plot_data = [];
    for (let i = 0; i < all_data.length; ++i) {
        plot_data =
        plot_data.concat(assembleDataForStaticPlot(all_data[i], all_colors[i]));
    }

    // console.log(plot_data);

    Plotly.newPlot("plot_div", plot_data, getPlotLayoutData());
}

// initialize animation
/**
 * @param xs
 * @param ys
 * @param xf
 * @param yf
 */
function initPlot(xs, ys, xf, yf) {
    Plotly.react("plot_div",
        [
            {
                x: xs,
                y: ys,
                mode: "lines",
                type: "scatter",
                marker: { size: 30 },
                line: { color: "rgb(219, 64, 82)", width: 3 }
            },
            {
                x: xf,
                y: yf,
                mode: "lines",
                type: "scatter",
                marker: { size: 30 },
                line: { color: "rgb(0, 64, 82)", width: 3 }
            }
        ],
        getPlotLayoutData());
}

/**
 *
 */
async function init() {
    initButton.classList.add("button--loading");
    //loadingIndicator.classList.add("mr-2", "progressAnimate");
    const loader = new ScriptLoader(
        "https://cdn.jsdelivr.net/pyodide/v0.17.0/full/pyodide.js"
    );
    await loader.load();
    await loadPyodide(
        { indexURL: "https://cdn.jsdelivr.net/pyodide/v0.17.0/full/" }
    );
    await pyodide.loadPackage([
        "numpy",
        "scipy"
    ]);

    // loader.load()
    //     .then(
    //         e => {
    //             loadPyodide(
    //                 {indexURL :
    //                 "https://cdn.jsdelivr.net/pyodide/v0.17.0/full/"})
    //                 .then(
    //                     () => {
    //                         pyodide
    //                             .loadPackage([
    //                               'numpy',
    //                               'scipy',
    //                             ])
    //                             // .then(() => {pyodide.runPythonAsync(`
    //                             //           import micropip; await
    //                             //
    //                             micropip.install('parallel_slab-1.0.0-py3-none-any.whl');
    //                             //           import parallel_slab
    //                             //            `)})
    //                             .then(() => {
    //                               console.log("Numpy, Scipy is now
    //                               available");
    //                               // reset styles of buttons
    //                               loadingIndicator.classList.remove(
    //                                   'mr-2', 'progressAnimate');
    //                               startButton.removeAttribute('disabled');
    //                               pauseButton.removeAttribute('disabled');
    //                               resetButton.removeAttribute('disabled');
    //                             })})})
    //     .catch(e => {console.log(e)});
    await pyodide.runPythonAsync(
        "import micropip; await micropip.install('parallel_slab-1.0.0-py3-none-any.whl'); import parallel_slab;"
    );

    console.log("Numpy, Scipy is now available ");

    // reset styles of buttons
    //loadingIndicator.classList.remove("mr-2", "progressAnimate");
    // startButton.removeAttribute("disabled");
    // pauseButton.removeAttribute("disabled");
    // resetButton.removeAttribute("disabled");
    simulateButton.removeAttribute("disabled");
    archetypeSelection.removeAttribute("disabled");
    initButton.classList.remove("button--loading");
}

/* Animation handlers*/
/**
 * @param t
 */
function Simulator(t) {
    xs = [-1.0, -0.5, 0.5, 1.0];
    ys = [
        0.2 + 0.1 * Math.sin(t), 0.3 + 0.1 * Math.sin(t), 0.1 + 0.1 * Math.sin(t),
        0.2
    ];
    xf = [-1.0, -0.5, 0.5, 1.0];
    yf = [
        0.5 + 0.1 * Math.sin(t), 0.7 + 0.1 * Math.sin(t), 0.6 + 0.2 * Math.sin(t),
        0.2
    ];

    return [xs, ys, xf, yf];
}

// this function return the promise of pyodide runPython function
/**
 * @param config
 * @param times
 */
function generateSimulator(config, times) {

    // return gistFetchPromise.then(res => pyodide.runPython(res))
    //     .then(_ => { return pyodide.globals.walk(stepNumber); })
    // return new Promise(function(resolve, reject) {
    //   // var sim = new Simulator;
    //   resolve(Simulator)
    // });
    return fileFetchPromise.then(res => pyodide.runPython(res))
        .then(_ => pyodide.globals.get("simulator")(config, times));
}

// this function execute the animation
/**
 * @param config
 */
function runSimulator(config) {

    // depends on whether reset button is pressed
    // if resetted, then generate a new random walk trajectory
    // otherwise resume the animation
    const n_samples = 15;
    const iters = linspace(0, n_samples, n_samples, endpoint = false);

    // period is 2?
    const times = linspace(0, 2.0, n_samples, endpoint = false);

    if (reset) {
        reset = false;
        simulatorPromise = generateSimulator(config, times);

        if (isAnimated()) {
            simulatorPromise.then(sim => {
                const pyresult = sim(i);
                const result = [...pyresult];

                pyresult.destroy();
                const [xs, ys, xf, yf] = result;

                initPlot(xs.toJs(), ys.toJs(), xf.toJs(), yf.toJs());
                startAnimate(sim);
            });
        } else {

            // stores col strings
            // var color_arr = new Array(n_samples);

            simulatorPromise.then(sim => {

                // stores (4,) tuples
                const dataArr = new Array(n_samples);
                const colorArr = new Array(n_samples);

                // populate the data_arr
                iters.forEach(index => {
                    const py_result = sim(index);
                    const result = [...py_result];

                    py_result.destroy();

                    // let py_colormap = sim.get_colormap(iters);
                    // let color_arr = [...py_colormap ];
                    // py_colormap.destroy();

                    // console.log(result);
                    const local_data = result.map(res => res.toJs());


                    // console.log(local_data);
                    dataArr[index] = local_data;
                    colorArr[index] = sim.get_colormap(index);
                });

                // let py_colormap = sim.get_colormap(iters);
                // let color_arr = [...py_colormap ];
                // py_colormap.destroy();

                // console.log(dataArr[0]);
                // console.log(colorArr[0]);

                // with this data array
                staticPlot(dataArr, colorArr);

                // do that
            });
        }
    } else {
        if (isAnimated()) {
            simulatorPromise.then(sim => {
                startAnimate(sim);
            });
        } else {

            // do nothing
        }
    }
}

/**
 * @param sim
 */
function startAnimate(sim) {

    // traceHead = {x : x.slice(0, i).slice(-1), y : y.slice(0, i).slice(-1)};
    // traceTail = {x : x.slice(0, i), y : y.slice(0, i)};
    // console.log(x, y);
    if (i <= 50) {
        const pyresult = sim(i);
        const result = [...pyresult];

        pyresult.destroy();
        const [xs, ys, xf, yf] = result;


        // color = i % 2 ? 'rgb(219, 64, 82)' : 'rgb(0, 64, 82)';
        Plotly.animate(
            "plot_div", {
                data:
              [{ x: xs.toJs(), y: ys.toJs() }, { x: xf.toJs(), y: yf.toJs() }]
            },
            { transition: { duration: 0 }, frame: { duration: 0, redraw: false } }
        );
        requestID = requestAnimationFrame(() => {
            startAnimate(sim);
        });
    }
    i += 1;
}

// reset the animation
/**
 *
 */
function resetAnimation() {
    i = 0;
    reset = true;
    cancelAnimationFrame(requestID);
    placeholderPlot();
}

// reset the plot
/**
 *
 */
function resetPlot() {
    reset = true;
    placeholderPlot();
}

// pause the animation
/**
 *
 */
function pauseAnimation() {
    cancelAnimationFrame(requestID);
}

/**
 *
 */
function restartSimulator() {
    if (isAnimated()) {

    // is this a good idea?
    // resetAnimation();
    } else {
        resetPlot();
        startSimulator();
    }
}

/**
 *
 */
function startSimulator() {
    const config = buildConfig();

    console.log(config);
    runSimulator(config);
}

/* Utilities */
/**
 * @param value
 * @param precision
 */
function round(value, precision = 1) {
    const multiplier = Math.pow(10, precision || 0);

    return (Math.round(value * multiplier) / multiplier).toFixed(precision);
}

/**
 * @param slider_value
 */
function transform(slider_value) {

    // range from 1--100, so we multiply by 0.1 to get the actual value
    return parseFloat(slider_value) * 0.1;
}

/**
 * @param start
 * @param stop
 * @param num
 * @param endpoint
 */
function linspace(start, stop, num, endpoint = true) {
    const div = endpoint ? (num - 1) : num;
    const step = (stop - start) / div;

    return Array.from({ length: num }, (_, i) => start + step * i);
}

/**
 *
 */
function solidZoneRatio() {
    return parseFloat(solidZoneSlider.value) * 0.01;
}

/**
 *
 */
function reynoldsNumber() {
    return round(transform(reynoldsSlider.value));
}

/**
 *
 */
function ericksenNumber() {
    return round(transform(ericksenSlider.value));
}

/**
 *
 */
function densityRatio() {
    return round(transform(densitySlider.value));
}

/**
 *
 */
function viscosityRatio() {
    return round(transform(viscositySlider.value));
}

/**
 *
 */
function LfOverLs(){
    return (1 - solidZoneRatio())/ solidZoneRatio();
}

/**
 *
 */
function deltaFluid(){
    return round(Math.sqrt(ConstantParameters.shear_rate() / reynoldsNumber()), 2);
}

/**
 *
 */
function deltaSolid(){
    // log stuff to console for now
    return round(LfOverLs() * Math.sqrt(viscosityRatio()) * deltaFluid(), 2);
}

/**
 *
 */
function lambdaSolid(){
    return round(LfOverLs() * Math.sqrt(ConstantParameters.shear_rate() * ConstantParameters.shear_rate() / densityRatio() /
                              reynoldsNumber() / ericksenNumber()), 2);

}


/**
 *
 */
function isAnimated() {
    return false;
}

/* Display */
/**
 *
 */
function showReynoldsNumber() {
    reynoldsReadout.innerHTML = reynoldsNumber();
}

/**
 *
 */
function showEricksenNumber() {
    ericksenReadout.innerHTML = ericksenNumber();
}

/**
 *
 */
function showSolidZoneOccupancy() {
    solidZoneReadout.innerHTML = `${parseInt(solidZoneSlider.value)}%`;
}

/**
 *
 */
function showDensityRatio() {
    densityReadout.innerHTML = densityRatio();
}

/**
 *
 */
function showViscosityRatio() {
    viscosityReadout.innerHTML = viscosityRatio();
}

/**
 * function to display the delta F readout
 */
function showDeltaF() {
    deltaFReadout.innerHTML = deltaFluid();
}

/**
 * function to display the delta S readout;
 */
function showDeltaS() {
    deltaSReadout.innerHTML = deltaSolid();
}

/**
 * function to display the delta lambda readout;
 */
function showLambda() {
    lambdaReadout.innerHTML = lambdaSolid();
}

// load pyodide
const loader =
    new ScriptLoader("https://cdn.jsdelivr.net/pyodide/v0.17.0/full/pyodide.js");

// select buttons and input field
const initButton = document.querySelector("#initButton");
// const startButton = document.querySelector("#start");
// const pauseButton = document.querySelector("#pause");
// const resetButton = document.querySelector("#reset");
//const initButton = document.querySelector("#initButton");
const simulateButton = document.querySelector("#simulateButton");
const archetypeSelection = document.querySelector("#archetypeSelection");
//const animateCheckBox = document.querySelector("#enableAnimate");

// loader
//const loadingIndicator = document.querySelector("#loadingIndicator");

// sliders
const reynoldsSlider = document.querySelector("#reynoldsSlider");
const ericksenSlider = document.querySelector("#ericksenSlider");
const solidZoneSlider = document.querySelector("#solidZoneSlider");
const densitySlider = document.querySelector("#densitySlider");
const viscositySlider = document.querySelector("#viscositySlider");

// readouts
const reynoldsReadout = document.querySelector("#reynoldsReadout");
const ericksenReadout = document.querySelector("#ericksenReadout");
const solidZoneReadout = document.querySelector("#solidZoneReadout");
const densityReadout = document.querySelector("#densityReadout");
const viscosityReadout = document.querySelector("#viscosityReadout");
const deltaFReadout = document.querySelector('#deltaFReadout');
const deltaSReadout = document.querySelector('#deltaSReadout');
const lambdaReadout = document.querySelector('#lambdaReadout');

// build up config
/**
 *
 */
function buildConfig() {

    // ratios are always solid()/fluid()

    // shear rate
    const shear_rate = ConstantParameters.shear_rate();

    // length of domain
    const L = ConstantParameters.L();

    // length of soldi
    const L_s = solidZoneRatio() * 0.5 * L;
    const L_f = 0.5 * L - L_s;

    // n_modes
    const n_modes = ConstantParameters.n_modes();
    const rho_f = ConstantParameters.rho_f();
    const rho_s = densityRatio() * rho_f;

    // d
    const omega = ConstantParameters.omega();
    const mu_f = rho_f * shear_rate * omega * L_f * L_f / reynoldsNumber();
    const mu_s = rho_s * mu_f * viscosityRatio() / rho_f;

    // log stuff to console for now
    const delta_f = deltaFluid();
    const delta_s = deltaSolid();
    const lambda = lambdaSolid();

    console.log("delta_f : ", delta_f);
    console.log("delta_s : ", delta_s);
    console.log("lambda : ", lambda);

    return {
        L_s,
        L_f,
        n_modes,
        V_wall: omega * L * shear_rate * 0.5,
        omega,
        rho_f,
        rho_s,
        mu_f,
        mu_s,
        c_1: mu_f * shear_rate * omega * 0.5 / ericksenNumber(),
        c_3: 0.0
    };
}

// add event listeners
// button for initializing pyodide
initButton.addEventListener("click", init, { once: true });

// button for run python code and animation
// note that we need to use parseInt here since the input value is string
simulateButton.addEventListener("click", startSimulator);
// startButton.addEventListener("click", startSimulator);
// pauseButton.addEventListener("click", pauseAnimation);
// resetButton.addEventListener("click", resetAnimation);


function defaultSimulationParameters() {

    // set default here
    // choose case from the drop down menu
    const defaults = (() => {
        switch (archetypeSelection.value) {
            case "h1":
                return DefaultHarmonicOne;
            case "h2":
                return DefaultHarmonicTwo;
            case "h3":
                return DefaultHarmonicThree;
            case "h0":
                return DefaultHarmonicZero;
            case "tp":
                return DefaultTypical;

        // case 'test':
        //   return curvatureParamIDs[2];
        }
    })();

    // sliders
    reynoldsSlider.value = defaults.defaultRe();
    ericksenSlider.value = defaults.defaultEr();
    solidZoneSlider.value = defaults.defaultSolidZoneOccupancy();
    densitySlider.value = defaults.defaultDensityRatio();
    viscositySlider.value = defaults.defaultViscosityRatio();

    // showStaticParameterInfo();
    showParameterInfo();
}


/**
 *
 */
function addListeners() {

    /**
     * @param fn
     */
    function reset_and_(...fns) {

        // return a closure
        return () => {
            fns.forEach(f => f());
            restartSimulator();
        };
    }

    const slider_pairs = [
        [ericksenSlider, reset_and_(showEricksenNumber, showDiagnostics)],
        [reynoldsSlider, reset_and_(showReynoldsNumber, showDiagnostics)],
        [solidZoneSlider, reset_and_(showSolidZoneOccupancy, showDiagnostics)],
        [viscositySlider, reset_and_(showViscosityRatio, showDiagnostics)],
        [densitySlider, reset_and_(showDensityRatio, showDiagnostics)]
    ];

    slider_pairs.forEach(p => {
        p[0].addEventListener("input", p[1]);
        p[0].addEventListener("change", p[1]);
    });

    const selection_pairs = [
        // [curvatureSelection, reset_and_(showCurvatureInfo)],
        // [liftSelection, reset_and_(showLiftInfo)],
        [archetypeSelection, reset_and_(defaultSimulationParameters)]
    ];

    selection_pairs.forEach(p => {
        p[0].addEventListener("change", p[1]);
    });
}

function showDiagnostics(){
    showDeltaF();
    showDeltaS();
    showLambda();
}

function showParameterInfo() {
    showReynoldsNumber();
    showEricksenNumber();
    showSolidZoneOccupancy();
    showDensityRatio();
    showViscosityRatio();
    showDiagnostics();
}


// perform the gist fetching
const fileFetchPromise = fetchFile("parallel_slab_sandbox.py");
// initButton.addEventListener("click", init, { once: true });
// placeholder plot
addListeners();
MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
defaultSimulationParameters();
placeholderPlot();


// display at first go
showParameterInfo();

// globals
let requestID;
var reset = true;
let simulatorPromise;
var i = 0;
