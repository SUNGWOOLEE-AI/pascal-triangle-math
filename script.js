// 파스칼의 삼각형 수학 수행 과제 JavaScript - 완전한 구현

// 전역 변수
let rowSumChart = null;
let oddEvenChart = null;
let binomialChart = null;
let probabilityChart = null;
let oddEvenPatternVisible = false;

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    console.log('페이지 로드됨');
    
    // 기본 기능들 바로 실행
    generatePascalTriangle();
    calculateBinomial();
    
    // Chart.js 로딩 체크를 지연시킴
    setTimeout(function() {
        if (typeof Chart === 'undefined') {
            console.error('Chart.js가 로드되지 않았습니다.');
            // 차트 없이도 기본 기능은 동작
        } else {
            console.log('Chart.js 로드됨, 차트 초기화 시작');
            initializeCharts();
            calculateCoinProbability();
        }
    }, 1000);
});

// 파스칼의 삼각형 생성 함수
function generatePascalTriangle() {
    console.log('삼각형 생성 함수 호출됨');
    const rowInput = document.getElementById('rowInput');
    const display = document.getElementById('pascalDisplay');
    
    if (!rowInput || !display) {
        console.error('필요한 요소를 찾을 수 없습니다.');
        return;
    }
    
    const rows = parseInt(rowInput.value) || 10;
    
    if (rows < 1 || rows > 15) {
        display.innerHTML = '<div class="error">행의 개수는 1~15 사이여야 합니다.</div>';
        return;
    }
    
    display.innerHTML = '';
    
    for (let n = 0; n < rows; n++) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'pascal-row';
        
        // 행 번호 표시
        const rowLabel = document.createElement('span');
        rowLabel.textContent = `${n}행: `;
        rowLabel.style.color = '#bdc3c7';
        rowLabel.style.marginRight = '10px';
        rowDiv.appendChild(rowLabel);
        
        for (let k = 0; k <= n; k++) {
            const value = binomialCoefficient(n, k);
            const numberSpan = document.createElement('span');
            numberSpan.className = 'pascal-number';
            numberSpan.textContent = value;
            numberSpan.title = `C(${n}, ${k}) = ${value}`;
            rowDiv.appendChild(numberSpan);
        }
        
        display.appendChild(rowDiv);
    }
    
    // 차트 업데이트
    if (rowSumChart) {
        updateRowSumChart(rows);
    }
    console.log('삼각형 생성 완료');
}

// 이항계수 계산 함수
function binomialCoefficient(n, k) {
    if (k > n || k < 0) return 0;
    if (k === 0 || k === n) return 1;
    
    let result = 1;
    for (let i = 0; i < Math.min(k, n - k); i++) {
        result = result * (n - i) / (i + 1);
    }
    return Math.round(result);
}

// 팩토리얼 계산 함수
function factorial(n) {
    if (n <= 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

// 이항계수 계산 및 표시
function calculateBinomial() {
    console.log('이항계수 계산 함수 호출됨');
    const nInput = document.getElementById('nInput');
    const kInput = document.getElementById('kInput');
    const resultDiv = document.getElementById('binomialResult');
    
    if (!nInput || !kInput || !resultDiv) {
        console.error('필요한 요소를 찾을 수 없습니다.');
        return;
    }
    
    const n = parseInt(nInput.value) || 5;
    const k = parseInt(kInput.value) || 2;
    
    if (n < 0 || k < 0 || n > 20 || k > 20) {
        resultDiv.innerHTML = '<div class="error">n과 k는 0~20 사이여야 합니다.</div>';
        return;
    }
    
    if (k > n) {
        resultDiv.innerHTML = '<div class="error">k는 n보다 클 수 없습니다.</div>';
        return;
    }
    
    const result = binomialCoefficient(n, k);
    
    resultDiv.innerHTML = `
        <h4>계산 결과</h4>
        <p><strong>C(${n}, ${k}) = ${result}</strong></p>
        <p>계산 과정: ${n}! / (${k}! × ${n-k}!) = ${result}</p>
        <p>의미: ${n}개 중에서 ${k}개를 선택하는 경우의 수</p>
    `;
    
    // 차트 업데이트
    if (typeof Chart !== 'undefined') {
        updateBinomialChart(n);
    }
    console.log('이항계수 계산 완료');
}

// 차트 초기화
function initializeCharts() {
    console.log('차트 초기화 시작');
    
    if (typeof Chart === 'undefined') {
        console.error('Chart.js가 로드되지 않았습니다.');
        return;
    }
    
    try {
        // Row Sum Chart 초기화
        const rowSumCtx = document.getElementById('rowSumChart');
        if (rowSumCtx) {
            rowSumChart = new Chart(rowSumCtx.getContext('2d'), {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: '각 행의 합 (2^n)',
                        data: [],
                        borderColor: '#667eea',
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: '파스칼의 삼각형 각 행의 합',
                            font: { size: 16, weight: 'bold' }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: '합계'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: '행 번호 (n)'
                            }
                        }
                    },
                    animation: {
                        duration: 1000,
                        easing: 'easeInOutQuart'
                    }
                }
            });
            updateRowSumChart(10);
        }
        
        // Odd/Even Chart 초기화
        const oddEvenCtx = document.getElementById('oddEvenChart');
        if (oddEvenCtx) {
            oddEvenChart = new Chart(oddEvenCtx.getContext('2d'), {
                type: 'scatter',
                data: {
                    datasets: [{
                        label: '홀수 (1)',
                        data: [],
                        backgroundColor: '#e74c3c',
                        pointRadius: 4
                    }, {
                        label: '짝수 (0)',
                        data: [],
                        backgroundColor: '#ecf0f1',
                        pointRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: '홀수/짝수 패턴 (시에르핀스키 삼각형)',
                            font: { size: 16, weight: 'bold' }
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: '위치 (k)'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: '행 번호 (n)'
                            },
                            reverse: true
                        }
                    }
                }
            });
        }
        
        console.log('차트 초기화 완료');
    } catch (error) {
        console.error('차트 초기화 중 오류 발생:', error);
    }
}

// 각 행의 합 차트 업데이트
function updateRowSumChart(maxRows) {
    if (!rowSumChart) return;
    
    const labels = [];
    const data = [];
    
    for (let n = 0; n < maxRows; n++) {
        labels.push(`${n}행`);
        data.push(Math.pow(2, n));
    }
    
    rowSumChart.data.labels = labels;
    rowSumChart.data.datasets[0].data = data;
    rowSumChart.update();
}

// 이항계수 차트 업데이트
function updateBinomialChart(n) {
    const ctx = document.getElementById('binomialChart');
    if (!ctx) return;
    
    if (binomialChart) {
        binomialChart.destroy();
    }
    
    const labels = [];
    const data = [];
    
    for (let k = 0; k <= n; k++) {
        labels.push(`C(${n},${k})`);
        data.push(binomialCoefficient(n, k));
    }
    
    binomialChart = new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: `${n}행의 이항계수`,
                data: data,
                backgroundColor: 'rgba(102, 126, 234, 0.8)',
                borderColor: '#667eea',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: `파스칼의 삼각형 ${n}행의 이항계수`,
                    font: { size: 14, weight: 'bold' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '이항계수 값'
                    }
                }
            },
            animation: {
                duration: 800,
                easing: 'easeInOutQuart'
            }
        }
    });
}

// 홀수/짝수 패턴 토글
function toggleOddEvenPattern() {
    oddEvenPatternVisible = !oddEvenPatternVisible;
    
    if (oddEvenPatternVisible) {
        updateOddEvenChart();
    } else {
        if (oddEvenChart) {
            oddEvenChart.data.datasets[0].data = [];
            oddEvenChart.data.datasets[1].data = [];
            oddEvenChart.update();
        }
    }
}

// 홀수/짝수 패턴 차트 업데이트
function updateOddEvenChart() {
    if (!oddEvenChart) return;
    
    const oddPoints = [];
    const evenPoints = [];
    const maxRows = 12;
    
    for (let n = 0; n < maxRows; n++) {
        for (let k = 0; k <= n; k++) {
            const value = binomialCoefficient(n, k);
            const point = { x: k - n/2, y: n };
            
            if (value % 2 === 1) {
                oddPoints.push(point);
            } else {
                evenPoints.push(point);
            }
        }
    }
    
    oddEvenChart.data.datasets[0].data = oddPoints;
    oddEvenChart.data.datasets[1].data = evenPoints;
    oddEvenChart.update();
}

// 동전 던지기 확률 계산
function calculateCoinProbability() {
    const n = parseInt(document.getElementById('coinFlips').value) || 5;
    const ctx = document.getElementById('probabilityChart');
    if (!ctx) return;
    
    if (probabilityChart) {
        probabilityChart.destroy();
    }
    
    const labels = [];
    const probabilities = [];
    const colors = [];
    
    for (let k = 0; k <= n; k++) {
        labels.push(`${k}번 앞면`);
        const probability = binomialCoefficient(n, k) / Math.pow(2, n);
        probabilities.push((probability * 100).toFixed(2));
        
        // 색상 그라데이션
        const intensity = probability / (1 / Math.pow(2, n));
        colors.push(`rgba(102, 126, 234, ${0.3 + intensity * 0.7})`);
    }
    
    probabilityChart = new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '확률 (%)',
                data: probabilities,
                backgroundColor: colors,
                borderColor: '#667eea',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: `동전 ${n}번 던지기 확률 분포`,
                    font: { size: 16, weight: 'bold' }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const k = context.dataIndex;
                            const combinations = binomialCoefficient(n, k);
                            const totalOutcomes = Math.pow(2, n);
                            return [
                                `확률: ${context.parsed.y}%`,
                                `경우의 수: ${combinations}`,
                                `전체 경우의 수: ${totalOutcomes}`,
                                `계산: C(${n},${k}) / 2^${n}`
                            ];
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '확률 (%)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: '앞면이 나오는 횟수'
                    }
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeInOutQuart'
            }
        }
    });
}

// 반응형 차트 리사이즈
window.addEventListener('resize', function() {
    if (rowSumChart) rowSumChart.resize();
    if (oddEvenChart) oddEvenChart.resize();
    if (binomialChart) binomialChart.resize();
    if (probabilityChart) probabilityChart.resize();
});

// 입력 필드 유효성 검사
document.addEventListener('DOMContentLoaded', function() {
    const rowInput = document.getElementById('rowInput');
    const nInput = document.getElementById('nInput');
    const kInput = document.getElementById('kInput');
    const coinFlips = document.getElementById('coinFlips');
    
    if (rowInput) {
        rowInput.addEventListener('input', function() {
            const value = parseInt(this.value);
            if (value < 1) this.value = 1;
            if (value > 15) this.value = 15;
        });
    }
    
    if (nInput) {
        nInput.addEventListener('input', function() {
            const value = parseInt(this.value);
            if (value < 0) this.value = 0;
            if (value > 20) this.value = 20;
            
            // k 값이 n보다 큰 경우 조정
            if (kInput && parseInt(kInput.value) > value) {
                kInput.value = value;
            }
            if (kInput) kInput.max = value;
        });
    }
    
    if (kInput) {
        kInput.addEventListener('input', function() {
            const value = parseInt(this.value);
            const nValue = parseInt(nInput ? nInput.value : 0);
            if (value < 0) this.value = 0;
            if (value > nValue) this.value = nValue;
        });
    }
    
    if (coinFlips) {
        coinFlips.addEventListener('input', function() {
            const value = parseInt(this.value);
            if (value < 1) this.value = 1;
            if (value > 10) this.value = 10;
        });
    }
});

// 키보드 이벤트 처리
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const activeElement = document.activeElement;
        if (activeElement.id === 'rowInput') {
            generatePascalTriangle();
        } else if (activeElement.id === 'nInput' || activeElement.id === 'kInput') {
            calculateBinomial();
        } else if (activeElement.id === 'coinFlips') {
            calculateCoinProbability();
        }
    }
});

// 에러 처리 함수
function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `<div class="error">${message}</div>`;
    }
}

function showSuccess(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `<div class="success">${message}</div>`;
    }
}