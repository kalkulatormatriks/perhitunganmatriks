```javascript
/* =========================================================
   KALKULATOR MATRIKS
   JAVASCRIPT
========================================================= */


/* =========================================================
   FRACTION
========================================================= */

class Fraction {

    constructor(numerator = 0, denominator = 1) {

        if (numerator instanceof Fraction) {
            this.n = numerator.n;
            this.d = numerator.d;
            return;
        }

        if (typeof numerator === "string") {

            const parsed =
                Fraction.parse(numerator);

            this.n = parsed.n;
            this.d = parsed.d;

            return;
        }

        this.n = Number(numerator);
        this.d = Number(denominator);

        if (!Number.isFinite(this.n) ||
            !Number.isFinite(this.d)) {

            throw new Error(
                "Angka tidak valid."
            );
        }

        if (this.d === 0) {
            throw new Error(
                "Penyebut tidak boleh nol."
            );
        }

        if (this.d < 0) {
            this.n *= -1;
            this.d *= -1;
        }

        this.reduce();
    }


    static gcd(a, b) {

        a = Math.abs(
            Math.trunc(a)
        );

        b = Math.abs(
            Math.trunc(b)
        );

        while (b !== 0) {

            const temp = b;

            b = a % b;

            a = temp;
        }

        return a || 1;
    }


    reduce() {

        const divisor =
            Fraction.gcd(
                this.n,
                this.d
            );

        this.n /= divisor;
        this.d /= divisor;

        return this;
    }


    static parse(value) {

        const text =
            String(value)
                .trim()
                .replace(/\s+/g, "");

        if (text === "") {
            return new Fraction(0);
        }


        if (text.includes("/")) {

            const parts =
                text.split("/");

            if (parts.length !== 2) {

                throw new Error(
                    `Pecahan "${value}" tidak valid.`
                );
            }

            return new Fraction(
                Number(parts[0]),
                Number(parts[1])
            );
        }


        const number =
            Number(text);

        if (!Number.isFinite(number)) {

            throw new Error(
                `"${value}" bukan angka yang valid.`
            );
        }


        if (Number.isInteger(number)) {
            return new Fraction(number);
        }


        const decimal =
            String(number);

        const digits =
            decimal.split(".")[1]?.length || 0;

        const denominator =
            Math.pow(10, digits);

        const numerator =
            Math.round(
                number * denominator
            );

        return new Fraction(
            numerator,
            denominator
        );
    }


    add(other) {

        other =
            new Fraction(other);

        return new Fraction(
            this.n * other.d +
            other.n * this.d,

            this.d * other.d
        );
    }


    sub(other) {

        other =
            new Fraction(other);

        return new Fraction(
            this.n * other.d -
            other.n * this.d,

            this.d * other.d
        );
    }


    mul(other) {

        other =
            new Fraction(other);

        return new Fraction(
            this.n * other.n,
            this.d * other.d
        );
    }


    div(other) {

        other =
            new Fraction(other);

        if (other.n === 0) {

            throw new Error(
                "Tidak dapat membagi dengan nol."
            );
        }

        return new Fraction(
            this.n * other.d,
            this.d * other.n
        );
    }


    isZero() {
        return this.n === 0;
    }


    equals(other) {

        other =
            new Fraction(other);

        return (
            this.n === other.n &&
            this.d === other.d
        );
    }


    toString() {

        if (this.n === 0) {
            return "0";
        }

        if (this.d === 1) {
            return String(this.n);
        }

        return `${this.n}/${this.d}`;
    }
}


/* =========================================================
   DOM
========================================================= */

const rowsA =
    document.getElementById("rowsA");

const colsA =
    document.getElementById("colsA");

const rowsB =
    document.getElementById("rowsB");

const colsB =
    document.getElementById("colsB");

const matrixAContainer =
    document.getElementById("matrixA");

const matrixBContainer =
    document.getElementById("matrixB");

const resultSection =
    document.getElementById("resultSection");

const finalResult =
    document.getElementById("finalResult");

const resultTitle =
    document.getElementById("resultTitle");

const stepsContainer =
    document.getElementById("stepsContainer");

const stepCount =
    document.getElementById("stepCount");

let selectedOperation = null;

let lastResultText = "";


/* =========================================================
   CREATE INPUT
========================================================= */

function createMatrixInputs(
    container,
    rows,
    cols,
    name
) {

    container.innerHTML = "";

    container.style.gridTemplateColumns =
        `repeat(${cols}, minmax(55px, 1fr))`;


    for (let i = 0; i < rows; i++) {

        for (let j = 0; j < cols; j++) {

            const input =
                document.createElement("input");

            input.type = "text";

            input.className =
                "matrix-input";

            input.value = "0";

            input.placeholder = "0";

            input.dataset.row = i;

            input.dataset.col = j;

            input.setAttribute(
                "aria-label",
                `Matriks ${name}, baris ${i + 1}, kolom ${j + 1}`
            );

            container.appendChild(input);
        }
    }
}


/* =========================================================
   READ MATRIX
========================================================= */

function getMatrix(
    container,
    rows,
    cols
) {

    const inputs =
        container.querySelectorAll(
            ".matrix-input"
        );

    const matrix = [];

    let index = 0;


    for (let i = 0; i < rows; i++) {

        const row = [];

        for (let j = 0; j < cols; j++) {

            try {

                row.push(
                    Fraction.parse(
                        inputs[index].value
                    )
                );

            } catch (error) {

                throw new Error(
                    `Input baris ${i + 1}, kolom ${j + 1} tidak valid.`
                );
            }

            index++;
        }

        matrix.push(row);
    }

    return matrix;
}


/* =========================================================
   CREATE MATRICES
========================================================= */

document
    .getElementById("createMatrices")
    .addEventListener(
        "click",
        createMatrices
    );


function createMatrices() {

    const rA =
        clamp(rowsA.value);

    const cA =
        clamp(colsA.value);

    const rB =
        clamp(rowsB.value);

    const cB =
        clamp(colsB.value);


    rowsA.value = rA;
    colsA.value = cA;

    rowsB.value = rB;
    colsB.value = cB;


    createMatrixInputs(
        matrixAContainer,
        rA,
        cA,
        "A"
    );


    createMatrixInputs(
        matrixBContainer,
        rB,
        cB,
        "B"
    );


    document.getElementById(
        "sizeTextA"
    ).textContent =
        `${rA} × ${cA}`;


    document.getElementById(
        "sizeTextB"
    ).textContent =
        `${rB} × ${cB}`;
}


function clamp(value) {

    let number =
        parseInt(value);

    if (!Number.isFinite(number)) {
        number = 1;
    }

    return Math.max(
        1,
        Math.min(8, number)
    );
}


/* =========================================================
   CLEAR
========================================================= */

function clearMatrix(name) {

    const container =
        name === "A"
            ? matrixAContainer
            : matrixBContainer;


    container
        .querySelectorAll(".matrix-input")
        .forEach(input => {

            input.value = "0";

        });
}


/* =========================================================
   OPERATION SELECT
========================================================= */

document
    .querySelectorAll(".operation-button")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        ".operation-button"
                    )
                    .forEach(btn => {

                        btn.classList.remove(
                            "active"
                        );

                    });


                button.classList.add(
                    "active"
                );


                selectedOperation =
                    button.dataset.operation;
            }
        );
    });


/* =========================================================
   CALCULATE
========================================================= */

document
    .getElementById("calculateButton")
    .addEventListener(
        "click",
        calculate
    );


function calculate() {

    try {

        if (!selectedOperation) {

            throw new Error(
                "Silakan pilih operasi terlebih dahulu."
            );
        }


        const A =
            getMatrix(
                matrixAContainer,
                clamp(rowsA.value),
                clamp(colsA.value)
            );


        let B = null;


        if (
            selectedOperation === "add" ||
            selectedOperation === "subtract" ||
            selectedOperation === "multiply"
        ) {

            B =
                getMatrix(
                    matrixBContainer,
                    clamp(rowsB.value),
                    clamp(colsB.value)
                );
        }


        let result;


        switch (selectedOperation) {

            case "add":
                result = addMatrices(A, B);
                break;

            case "subtract":
                result = subtractMatrices(A, B);
                break;

            case "multiply":
                result = multiplyMatrices(A, B);
                break;

            case "transpose":
                result = transposeMatrix(A);
                break;

            case "determinant":
                result = determinantOperation(A);
                break;

            case "inverse":
                result = inverseOperation(A);
                break;

            case "gauss":
                result = gaussOperation(A);
                break;

            case "gaussJordan":
                result = gaussJordanOperation(A);
                break;

            case "lu":
                result = luOperation(A);
                break;

            default:
                throw new Error(
                    "Operasi tidak dikenali."
                );
        }


        showResult(
            result.title,
            result.finalHTML,
            result.steps
        );

    } catch (error) {

        showError(
            error.message
        );
    }
}


/* =========================================================
   HELPERS
========================================================= */

function cloneMatrix(matrix) {

    return matrix.map(row =>
        row.map(value =>
            new Fraction(value)
        )
    );
}


function isSquare(matrix) {

    return (
        matrix.length > 0 &&
        matrix.length ===
        matrix[0].length
    );
}


function matrixHTML(matrix) {

    const rows =
        matrix.length;

    const cols =
        matrix[0].length;


    let html =
        `<div class="display-matrix"
        style="grid-template-columns:
        repeat(${cols}, minmax(55px, auto));">`;


    matrix.forEach(row => {

        row.forEach(value => {

            html +=
                `<div class="matrix-value">
                    ${escapeHTML(value.toString())}
                 </div>`;
        });

    });


    html += "</div>";

    return html;
}


function escapeHTML(text) {

    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   PENJUMLAHAN
========================================================= */

function addMatrices(A, B) {

    if (
        A.length !== B.length ||
        A[0].length !== B[0].length
    ) {

        throw new Error(
            "Ukuran A dan B harus sama untuk penjumlahan."
        );
    }


    const result = [];


    for (let i = 0; i < A.length; i++) {

        const row = [];

        for (let j = 0; j < A[0].length; j++) {

            row.push(
                A[i][j].add(B[i][j])
            );
        }

        result.push(row);
    }


    const steps = [

        {
            title:
                "Jumlahkan elemen yang bersesuaian",

            description:
                "Elemen pada posisi yang sama dari A dan B dijumlahkan.",

            calculation:
                "Cᵢⱼ = Aᵢⱼ + Bᵢⱼ"
        }
    ];


    for (let i = 0; i < A.length; i++) {

        for (
            let j = 0;
            j < A[0].length;
            j++
        ) {

            steps.push({

                title:
                    `Elemen C${i + 1}${j + 1}`,

                description:
                    `Baris ${i + 1}, kolom ${j + 1}.`,

                calculation:
                    `${A[i][j]} + ${B[i][j]}
                     = <strong>${result[i][j]}</strong>`
            });
        }
    }


    return {

        title:
            "Penjumlahan Matriks",

        finalHTML:
            matrixHTML(result),

        steps
    };
}


/* =========================================================
   PENGURANGAN
========================================================= */

function subtractMatrices(A, B) {

    if (
        A.length !== B.length ||
        A[0].length !== B[0].length
    ) {

        throw new Error(
            "Ukuran A dan B harus sama untuk pengurangan."
        );
    }


    const result = [];


    for (let i = 0; i < A.length; i++) {

        const row = [];

        for (
            let j = 0;
            j < A[0].length;
            j++
        ) {

            row.push(
                A[i][j].sub(B[i][j])
            );
        }

        result.push(row);
    }


    const steps = [

        {
            title:
                "Kurangkan elemen yang bersesuaian",

            description:
                "Elemen B dikurangkan dari elemen A pada posisi yang sama.",

            calculation:
                "Cᵢⱼ = Aᵢⱼ − Bᵢⱼ"
        }
    ];


    for (let i = 0; i < A.length; i++) {

        for (
            let j = 0;
            j < A[0].length;
            j++
        ) {

            steps.push({

                title:
                    `Elemen C${i + 1}${j + 1}`,

                description:
                    `Baris ${i + 1}, kolom ${j + 1}.`,

                calculation:
                    `${A[i][j]} − ${B[i][j]}
                     = <strong>${result[i][j]}</strong>`
            });
        }
    }


    return {

        title:
            "Pengurangan Matriks",

        finalHTML:
            matrixHTML(result),

        steps
    };
}


/* =========================================================
   PERKALIAN
========================================================= */

function multiplyMatrices(A, B) {

    if (A[0].length !== B.length) {

        throw new Error(
            `Kolom A (${A[0].length}) harus sama dengan baris B (${B.length}).`
        );
    }


    const result = [];


    for (let i = 0; i < A.length; i++) {

        const row = [];

        for (let j = 0; j < B[0].length; j++) {

            let sum =
                new Fraction(0);


            for (
                let k = 0;
                k < A[0].length;
                k++
            ) {

                sum =
                    sum.add(
                        A[i][k].mul(
                            B[k][j]
                        )
                    );
            }

            row.push(sum);
        }

        result.push(row);
    }


    const steps = [

        {
            title:
                "Gunakan metode baris × kolom",

            description:
                "Kalikan setiap elemen satu baris A dengan elemen pada satu kolom B, kemudian jumlahkan.",

            calculation:
                "Cᵢⱼ = Σ AᵢₖBₖⱼ"
        }
    ];


    for (let i = 0; i < A.length; i++) {

        for (
            let j = 0;
            j < B[0].length;
            j++
        ) {

            const terms = [];

            for (
                let k = 0;
                k < A[0].length;
                k++
            ) {

                terms.push(
                    `${A[i][k]} × ${B[k][j]}`
                );
            }


            steps.push({

                title:
                    `Elemen C${i + 1}${j + 1}`,

                description:
                    `Baris ${i + 1} A × kolom ${j + 1} B.`,

                calculation:
                    `${terms.join(" + ")}
                     = <strong>${result[i][j]}</strong>`
            });
        }
    }


    return {

        title:
            "Perkalian Matriks",

        finalHTML:
            matrixHTML(result),

        steps
    };
}


/* =========================================================
   TRANSPOSE
========================================================= */

function transposeMatrix(A) {

    const result = [];


    for (let j = 0; j < A[0].length; j++) {

        const row = [];

        for (let i = 0; i < A.length; i++) {

            row.push(
                new Fraction(A[i][j])
            );
        }

        result.push(row);
    }


    return {

        title:
            "Transpose Matriks",

        finalHTML:
            matrixHTML(result),

        steps: [

            {
                title:
                    "Tukar baris menjadi kolom",

                description:
                    "Elemen pada posisi Aᵢⱼ dipindahkan menjadi Aᵀⱼᵢ.",

                calculation:
                    "Aᵀᵢⱼ = Aⱼᵢ"
            },

            {
                title:
                    "Hasil transpose",

                description:
                    "Baris A sekarang menjadi kolom Aᵀ.",

                calculation:
                    matrixHTML(result)
            }

        ]
    };
}


/* =========================================================
   DETERMINAN
========================================================= */

function getMinor(
    A,
    rowRemove,
    colRemove
) {

    return A
        .filter(
            (_, i) =>
                i !== rowRemove
        )
        .map(row =>
            row.filter(
                (_, j) =>
                    j !== colRemove
            )
        );
}


function determinant(A) {

    if (!isSquare(A)) {

        throw new Error(
            "Determinan hanya untuk matriks persegi."
        );
    }


    const n = A.length;


    if (n === 1) {
        return new Fraction(A[0][0]);
    }


    if (n === 2) {

        return A[0][0]
            .mul(A[1][1])
            .sub(
                A[0][1]
                    .mul(A[1][0])
            );
    }


    let det =
        new Fraction(0);


    for (let j = 0; j < n; j++) {

        const minor =
            getMinor(A, 0, j);

        const sign =
            j % 2 === 0
                ? new Fraction(1)
                : new Fraction(-1);


        det =
            det.add(
                sign
                    .mul(A[0][j])
                    .mul(
                        determinant(minor)
                    )
            );
    }


    return det;
}


function determinantOperation(A) {

    const det =
        determinant(A);

    const steps = [];


    if (A.length === 1) {

        steps.push({

            title:
                "Matriks 1 × 1",

            description:
                "Determinan sama dengan elemen tunggal.",

            calculation:
                `|A| = ${A[0][0]}`
        });

    } else if (A.length === 2) {

        steps.push({

            title:
                "Gunakan rumus determinan",

            description:
                "Untuk matriks 2 × 2 digunakan ad − bc.",

            calculation:
                `|A| =
                 (${A[0][0]})(${A[1][1]})
                 −
                 (${A[0][1]})(${A[1][0]})`
        });


        steps.push({

            title:
                "Hitung hasil",

            description:
                "Hitung kedua hasil perkalian diagonal.",

            calculation:
                `<strong>|A| = ${det}</strong>`
        });

    } else {

        steps.push({

            title:
                "Ekspansi kofaktor",

            description:
                "Gunakan baris pertama untuk menghitung determinan.",

            calculation:
                "|A| = Σ (−1)¹⁺ʲ a₁ⱼ M₁ⱼ"
        });


        for (
            let j = 0;
            j < A.length;
            j++
        ) {

            const minor =
                getMinor(A, 0, j);

            const sign =
                j % 2 === 0
                    ? "+"
                    : "−";


            steps.push({

                title:
                    `Kofaktor kolom ${j + 1}`,

                description:
                    `Elemen ${A[0][j]} digunakan sebagai kofaktor.`,

                calculation:
                    `${sign} (${A[0][j]}) ×
                     ${matrixHTML(minor)}`
            });
        }


        steps.push({

            title:
                "Determinan akhir",

            description:
                "Jumlahkan seluruh hasil kofaktor.",

            calculation:
                `<strong>|A| = ${det}</strong>`
        });
    }


    return {

        title:
            "Determinan Matriks",

        finalHTML:
            `<div class="equation">
                |A| = <strong>${det}</strong>
             </div>`,

        steps
    };
}


/* =========================================================
   INVERS
========================================================= */

function inverseMatrix(A) {

    if (!isSquare(A)) {

        throw new Error(
            "Invers membutuhkan matriks persegi."
        );
    }


    const n =
        A.length;


    const augmented =
        A.map((row, i) => {

            const identity = [];

            for (let j = 0; j < n; j++) {

                identity.push(
                    new Fraction(
                        i === j ? 1 : 0
                    )
                );
            }


            return [
                ...row.map(
                    value =>
                        new Fraction(value)
                ),
                ...identity
            ];
        });


    const steps = [];


    steps.push({

        title:
            "Bentuk matriks augmented",

        description:
            "Gabungkan A dengan matriks identitas.",

        calculation:
            `[ A | I ] =
             ${matrixHTML(augmented)}`
    });


    for (let col = 0; col < n; col++) {

        let pivotRow = col;


        while (
            pivotRow < n &&
            augmented[pivotRow][col].isZero()
        ) {
            pivotRow++;
        }


        if (pivotRow === n) {

            throw new Error(
                "Matriks tidak mempunyai invers."
            );
        }


        if (pivotRow !== col) {

            [
                augmented[pivotRow],
                augmented[col]
            ] = [
                augmented[col],
                augmented[pivotRow]
            ];


            steps.push({

                title:
                    `Tukar R${col + 1} ↔ R${pivotRow + 1}`,

                description:
                    "Tukar baris agar pivot tidak nol.",

                calculation:
                    matrixHTML(augmented)
            });
        }


        const pivot =
            augmented[col][col];


        if (!pivot.equals(1)) {

            for (
                let j = 0;
                j < 2 * n;
                j++
            ) {

                augmented[col][j] =
                    augmented[col][j]
                        .div(pivot);
            }


            steps.push({

                title:
                    `R${col + 1} ÷ ${pivot}`,

                description:
                    "Ubah pivot menjadi 1.",

                calculation:
                    matrixHTML(augmented)
            });
        }


        for (let i = 0; i < n; i++) {

            if (i === col) {
                continue;
            }


            const factor =
                augmented[i][col];


            if (factor.isZero()) {
                continue;
            }


            for (
                let j = 0;
                j < 2 * n;
                j++
            ) {

                augmented[i][j] =
                    augmented[i][j]
                        .sub(
                            factor.mul(
                                augmented[col][j]
                            )
                        );
            }


            steps.push({

                title:
                    `R${i + 1} − (${factor})R${col + 1}`,

                description:
                    "Nolkan elemen lain pada kolom pivot.",

                calculation:
                    matrixHTML(augmented)
            });
        }
    }


    const inverse =
        augmented.map(
            row =>
                row.slice(n)
        );


    steps.push({

        title:
            "Matriks invers",

        description:
            "Bagian kanan matriks augmented menjadi A⁻¹.",

        calculation:
            `A⁻¹ = ${matrixHTML(inverse)}`
    });


    return {
        inverse,
        steps
    };
}


function inverseOperation(A) {

    const result =
        inverseMatrix(A);


    return {

        title:
            "Invers Matriks",

        finalHTML:
            matrixHTML(result.inverse),

        steps:
            result.steps
    };
}


/* =========================================================
   GAUSS
========================================================= */

function gaussOperation(A) {

    const matrix =
        cloneMatrix(A);

    const rows =
        matrix.length;

    const cols =
        matrix[0].length;

    const steps = [];

    let pivotRow = 0;


    steps.push({

        title:
            "Matriks awal",

        description:
            "Mulai eliminasi dari matriks awal.",

        calculation:
            matrixHTML(matrix)
    });


    for (
        let col = 0;
        col < cols &&
        pivotRow < rows;
        col++
    ) {

        let selected =
            pivotRow;


        while (
            selected < rows &&
            matrix[selected][col].isZero()
        ) {
            selected++;
        }


        if (selected === rows) {
            continue;
        }


        if (selected !== pivotRow) {

            [
                matrix[selected],
                matrix[pivotRow]
            ] = [
                matrix[pivotRow],
                matrix[selected]
            ];


            steps.push({

                title:
                    `Tukar R${pivotRow + 1} ↔ R${selected + 1}`,

                description:
                    "Pindahkan baris dengan pivot tidak nol.",

                calculation:
                    matrixHTML(matrix)
            });
        }


        const pivot =
            matrix[pivotRow][col];


        for (
            let i = pivotRow + 1;
            i < rows;
            i++
        ) {

            const factor =
                matrix[i][col]
                    .div(pivot);


            if (factor.isZero()) {
                continue;
            }


            for (
                let j = col;
                j < cols;
                j++
            ) {

                matrix[i][j] =
                    matrix[i][j]
                        .sub(
                            factor.mul(
                                matrix[pivotRow][j]
                            )
                        );
            }


            steps.push({

                title:
                    `R${i + 1} − (${factor})R${pivotRow + 1}`,

                description:
                    `Hilangkan elemen di bawah pivot kolom ${col + 1}.`,

                calculation:
                    matrixHTML(matrix)
            });
        }


        pivotRow++;
    }


    steps.push({

        title:
            "Bentuk eselon baris",

        description:
            "Eliminasi Gauss selesai.",

        calculation:
            matrixHTML(matrix)
    });


    return {

        title:
            "Eliminasi Gauss",

        finalHTML:
            matrixHTML(matrix),

        steps
    };
}


/* =========================================================
   GAUSS-JORDAN
========================================================= */

function gaussJordanOperation(A) {

    const matrix =
        cloneMatrix(A);

    const rows =
        matrix.length;

    const cols =
        matrix[0].length;

    const steps = [];

    let pivotRow = 0;


    steps.push({

        title:
            "Matriks awal",

        description:
            "Mulai proses Gauss-Jordan.",

        calculation:
            matrixHTML(matrix)
    });


    for (
        let col = 0;
        col < cols &&
        pivotRow < rows;
        col++
    ) {

        let selected =
            pivotRow;


        while (
            selected < rows &&
            matrix[selected][col].isZero()
        ) {
            selected++;
        }


        if (selected === rows) {
            continue;
        }


        if (selected !== pivotRow) {

            [
                matrix[selected],
                matrix[pivotRow]
            ] = [
                matrix[pivotRow],
                matrix[selected]
            ];


            steps.push({

                title:
                    `Tukar R${pivotRow + 1} ↔ R${selected + 1}`,

                description:
                    "Pilih baris dengan pivot tidak nol.",

                calculation:
                    matrixHTML(matrix)
            });
        }


        const pivot =
            matrix[pivotRow][col];


        if (!pivot.equals(1)) {

            for (
                let j = 0;
                j < cols;
                j++
            ) {

                matrix[pivotRow][j] =
                    matrix[pivotRow][j]
                        .div(pivot);
            }


            steps.push({

                title:
                    `R${pivotRow + 1} ÷ (${pivot})`,

                description:
                    "Ubah pivot menjadi 1.",

                calculation:
                    matrixHTML(matrix)
            });
        }


        for (let i = 0; i < rows; i++) {

            if (i === pivotRow) {
                continue;
            }


            const factor =
                matrix[i][col];


            if (factor.isZero()) {
                continue;
            }


            for (
                let j = 0;
                j < cols;
                j++
            ) {

                matrix[i][j] =
                    matrix[i][j]
                        .sub(
                            factor.mul(
                                matrix[pivotRow][j]
                            )
                        );
            }


            steps.push({

                title:
                    `R${i + 1} − (${factor})R${pivotRow + 1}`,

                description:
                    "Nolkan elemen lain pada kolom pivot.",

                calculation:
                    matrixHTML(matrix)
            });
        }


        pivotRow++;
    }


    steps.push({

        title:
            "Bentuk eselon baris tereduksi",

        description:
            "Semua pivot menjadi 1 dan elemen lainnya pada kolom pivot menjadi 0.",

        calculation:
            matrixHTML(matrix)
    });


    return {

        title:
            "Eliminasi Gauss-Jordan",

        finalHTML:
            matrixHTML(matrix),

        steps
    };
}


/* =========================================================
   LU
========================================================= */

function identityMatrix(n) {

    const matrix = [];


    for (let i = 0; i < n; i++) {

        const row = [];

        for (let j = 0; j < n; j++) {

            row.push(
                new Fraction(
                    i === j ? 1 : 0
                )
            );
        }

        matrix.push(row);
    }


    return matrix;
}


function luOperation(A) {

    if (!isSquare(A)) {

        throw new Error(
            "Dekomposisi LU membutuhkan matriks persegi."
        );
    }


    const n =
        A.length;


    const L =
        identityMatrix(n);

    const U =
        cloneMatrix(A);


    const steps = [];


    steps.push({

        title:
            "Matriks awal",

        description:
            "Gunakan A sebagai matriks U awal dan I sebagai L awal.",

        calculation:
            `A = ${matrixHTML(A)}`
    });


    for (let k = 0; k < n - 1; k++) {

        const pivot =
            U[k][k];


        if (pivot.isZero()) {

            throw new Error(
                "Pivot nol ditemukan. LU tanpa pivoting tidak dapat dilanjutkan."
            );
        }


        for (
            let i = k + 1;
            i < n;
            i++
        ) {

            const factor =
                U[i][k]
                    .div(pivot);


            L[i][k] =
                factor;


            for (
                let j = k;
                j < n;
                j++
            ) {

                U[i][j] =
                    U[i][j]
                        .sub(
                            factor.mul(
                                U[k][j]
                            )
                        );
            }


            steps.push({

                title:
                    `Eliminasi R${i + 1}`,

                description:
                    `Faktor eliminasi = ${factor}.`,

                calculation:
                    `<div class="operation-line">
                        R${i + 1}
                        ←
                        R${i + 1}
                        −
                        (${factor})R${k + 1}
                     </div>

                     <div class="operation-line">
                        U =
                        ${matrixHTML(U)}
                     </div>`
            });
        }
    }


    steps.push({

        title:
            "Matriks L",

        description:
            "Faktor eliminasi ditempatkan di bawah diagonal utama.",

        calculation:
            `L = ${matrixHTML(L)}`
    });


    steps.push({

        title:
            "Matriks U",

        description:
            "Matriks U berbentuk segitiga atas.",

        calculation:
            `U = ${matrixHTML(U)}`
    });


    steps.push({

        title:
            "Hasil dekomposisi",

        description:
            "Matriks A dapat ditulis sebagai A = LU.",

        calculation:
            `A = L × U`
    });


    return {

        title:
            "Dekomposisi LU",

        finalHTML:
            `<div>

                <div class="equation">
                    L =
                    ${matrixHTML(L)}
                </div>

                <div class="equation">
                    U =
                    ${matrixHTML(U)}
                </div>

             </div>`,

        steps
    };
}


/* =========================================================
   SHOW RESULT
========================================================= */

function showResult(
    title,
    finalHTML,
    steps
) {

    resultSection.classList.add(
        "show"
    );


    resultTitle.textContent =
        title;


    finalResult.innerHTML =
        finalHTML;


    stepsContainer.innerHTML =
        "";


    stepCount.textContent =
        `${steps.length} langkah`;


    steps.forEach(
        (step, index) => {

            const element =
                document.createElement(
                    "div"
                );

            element.className =
                "step";


            element.innerHTML = `

                <div class="step-number">
                    ${index + 1}
                </div>

                <div class="step-content">

                    <div class="step-title">
                        ${step.title}
                    </div>

                    <div class="step-description">
                        ${step.description}
                    </div>

                    <div class="step-calculation">
                        ${step.calculation}
                    </div>

                </div>
            `;


            stepsContainer.appendChild(
                element
            );
        }
    );


    lastResultText =
        createCopyText(
            title,
            finalHTML,
            steps
        );


    resultSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


/* =========================================================
   ERROR
========================================================= */

function showError(message) {

    resultSection.classList.add(
        "show"
    );


    resultTitle.textContent =
        "Terjadi Kesalahan";


    finalResult.innerHTML = `

        <div class="error-message">
            ${escapeHTML(message)}
        </div>

    `;


    stepsContainer.innerHTML = `

        <div class="empty-steps">
            Periksa kembali ukuran dan nilai matriks.
        </div>

    `;


    stepCount.textContent =
        "0 langkah";


    resultSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


/* =========================================================
   COPY
========================================================= */

document
    .getElementById("copyResult")
    .addEventListener(
        "click",
        async () => {

            try {

                await navigator.clipboard.writeText(
                    lastResultText
                );


                const button =
                    document.getElementById(
                        "copyResult"
                    );


                const old =
                    button.textContent;


                button.textContent =
                    "✓ Tersalin";


                setTimeout(() => {

                    button.textContent =
                        old;

                }, 1500);

            } catch {

                alert(
                    "Hasil tidak dapat disalin."
                );
            }
        }
    );


function createCopyText(
    title,
    finalHTML,
    steps
) {

    let text =
        `KALKULATOR MATRIKS\n${title}\n\n`;


    text +=
        "HASIL AKHIR\n";

    text +=
        stripHTML(finalHTML);


    text +=
        "\n\nLANGKAH PERHITUNGAN\n";


    steps.forEach(
        (step, index) => {

            text +=
                `\n${index + 1}. ${step.title}\n`;

            text +=
                `${step.description}\n`;

            text +=
                `${stripHTML(
                    step.calculation
                )}\n`;
        }
    );


    return text;
}


function stripHTML(html) {

    const temp =
        document.createElement(
            "div"
        );

    temp.innerHTML =
        html;

    return temp.innerText
        .replace(/\n{3,}/g, "\n\n")
        .trim();
}


/* =========================================================
   KEYBOARD
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter" &&
            event.target.classList.contains(
                "matrix-input"
            )
        ) {

            event.preventDefault();


            const inputs =
                Array.from(
                    document.querySelectorAll(
                        ".matrix-input"
                    )
                );


            const index =
                inputs.indexOf(
                    event.target
                );


            if (
                index >= 0 &&
                index < inputs.length - 1
            ) {

                inputs[index + 1].focus();
            }
        }
    }
);


/* =========================================================
   INITIAL
========================================================= */

createMatrices();
```
