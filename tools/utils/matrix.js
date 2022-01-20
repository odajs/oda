
// Транспонирование матрицы
export function transMatrix(A){//На входе двумерный массив
    const m = A?.length || 0;
    const n = A?.[0]?.length || 0;
    const AT = [];
    for (let i = 0; i < n; i++) {
        AT[i] = [];
        for (let j = 0; j < m; j++)
            AT[i][j] = A[j][i];
    }
    return AT;
}

//Сложение матриц
export function sumMatrix(A, B) { //На входе двумерные массивы одинаковой размерности
    const m = A?.length || 0;
    const n = A?.[0]?.length || 0;
    const C = [];
    for (let i = 0; i < m; i++) {
        C[i] = [];
        for (let j = 0; j < n; j++)
            C[i][j] = A[i][j] + B[i][j];
    }
    return C;
}

// Умножение матрицы на число
export function multMatrixNumber(a, A) {// a - число, A - матрица (двумерный массив)
    const m = A?.length || 0;
    const n = A?.[0]?.length || 0;
    const B = [];
    for (let i = 0; i < m; i++) {
        B[i] = [];
        for (let j = 0; j < n; j++)
            B[i][j] = a * A[i][j];
    }
    return B;
}

// Умножение матриц
export function multiplyMatrix(A, B) {
    const rowsA = A?.length || 0;
    const colsA = A?.[0]?.length || 0;
    const rowsB = B?.length || 0;
    const colsB = B?.[0]?.length || 0;
    const C = [];
    if (colsA !== rowsB)
        return false;
    for (let i = 0; i < rowsA; i++)
        C[i] = [];
    for (let k = 0; k < colsB; k++) {
        for (let i = 0; i < rowsA; i++) {
            let t = 0;
            for (let j = 0; j < rowsB; j++)
                t += A[i][j] * B[j][k];
            C[i][k] = t;
        }
    }
    return C;
}

// Возведение матрицы в степень
export function matrixPow(n, A) {
    if (n === 1)
        return A;
    return multiplyMatrix(A, matrixPow(n - 1, A));
}

// Определитель матрицы
export function determinant(A) {  // Используется алгоритм Барейса, сложность O(n^3)
    const N = A?.length || 0;
    const B = [];
    let denom = 1;
    let exchanges = 0;
    for (let i = 0; i < N; ++i) {
        B[i] = [];
        for (let j = 0; j < N; ++j)
            B[i][j] = A[i][j];
    }
    for (let i = 0; i < N - 1; ++i) {
        let maxN = i;
        let maxValue = Math.abs(B[i][i]);
        for (let j = i + 1; j < N; ++j) {
            let value = Math.abs(B[j][i]);
            if (value > maxValue) {
                maxN = j;
                maxValue = value;
            }
        }
        if (maxN > i) {
            const temp = B[i];
            B[i] = B[maxN];
            B[maxN] = temp;
            ++exchanges;
        } else {
            if (maxValue === 0)
                return maxValue;
        }
        const value1 = B[i][i];
        for (let j = i + 1; j < N; ++j) {
            let value2 = B[j][i];
            B[j][i] = 0;
            for (let k = i + 1; k < N; ++k)
                B[j][k] = (B[j][k] * value1 - B[i][k] * value2) / denom;
        }
        denom = value1;
    }
    if (exchanges % 2)
        return -B[N - 1][N - 1];
    return B[N - 1][N - 1];
}

// Ранг матрицы
export function matrixRank(A) {
    const m = A?.length || 0;
    const n = A?.[0]?.length || 0;
    const k = (m < n ? m : n);
    let r = 1;
    let rank = 0;
    while (r <= k) {
        const B = [];
        for (let i = 0; i < r; i++)
            B[i] = [];
        for (let a = 0; a < m - r + 1; a++) {
            for (let b = 0; b < n - r + 1; b++) {
                for (let c = 0; c < r; c++) {
                    for (let d = 0; d < r; d++)
                        B[c][d] = A[a + c][b + d];
                }
                if (determinant(B) !== 0)
                    rank = r;
            }
        }
        r++;
    }
    return rank;
}

// Союзная (присоединенная) матрица
export function adjugateMatrix(A) { // A - двумерный квадратный массив
    const N = A?.length || 0;
    const adjA = [];
    for (let i = 0; i < N; i++) {
        adjA[i] = [];
        for (let j = 0; j < N; j++) {
            const B = [];
            const sign = ((i + j) % 2 == 0) ? 1 : -1;
            for (let m = 0; m < j; m++) {
                B[m] = [];
                for (let n = 0; n < i; n++)
                    B[m][n] = A[m][n];
                for (let n = i + 1; n < N; n++)
                    B[m][n - 1] = A[m][n];
            }
            for (let m = j + 1; m < N; m++) {
                B[m - 1] = [];
                for (let n = 0; n < i; n++)
                    B[m - 1][n] = A[m][n];
                for (let n = i + 1; n < N; n++)
                    B[m - 1][n - 1] = A[m][n];
            }
            adjA[i][j] = sign * determinant(B);
        }
    }
    return adjA;
}

// Обратная матрица
export function inverseMatrix(A) {// A - двумерный квадратный массив
    const det = determinant(A);
    if (det === 0)
        return false;
    const N = A?.length || 0;
    A = adjugateMatrix(A);
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++)
            A[i][j] /= det;
    }
    return A;
}