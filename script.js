// 파스칼의 삼각형 수학 수행 과제 JavaScript

// 전역 변수
let rowSumChart = null;
let oddEvenChart = null;
let binomialChart = null;
let probabilityChart = null;
let oddEvenPatternVisible = false;

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    generatePascalTriangle();
    initializeCharts();
    calculateBinomial();
    calculateCoinProbability();
});

// 파스칼의 삼각형 생성 함수
function generatePascalTriangle() {
    const rows = parseInt(document.getElementById('rowInput').value);
    const display = document.getElementById('pascalDisplay');
    
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
    updateRowSumChart(rows);
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
    const n = parseInt(document.getElementById('nInput').value);
    const k = parseInt(document.getElementById('kInput').value);
    const resultDiv = document.getElementById('binomialResult');
    
    if (n < 0 || k < 0 || n > 20 || k > 20) {
        resultDiv.innerHTML = '<div class="error">n과 k는 0~20 사이여야 합니다.</div>';
        return;
    }
    
    if (k > n) {
        resultDiv.innerHTML = '<div class="error">k는 n보다 클 수 없습니다.</div>';
        return;
    }
    
    const result = binomialCoefficient(n, k);
    const calculation = `${factorial(n)} / (${factorial(k)} × ${factorial(n-k)})`;
    
    resultDiv.innerHTML = `
        <h4>계산 결과</h4>
        <p><strong>C(${n}, ${k}) = ${result}</strong></p>
        <p>계산 과정: ${n}! / (${k}! × ${n-k}!) = ${calculation} = ${result}</p>
        <p>의미: ${n}개 중에서 ${k}개를 선택하는 경우의 수</p>
    `;
    
    updateBinomialChart(n);
}

// 차트 초기화
function initializeCharts() {
    // Row Sum Chart 초기화
    const rowSumCtx = document.getElementById('rowSumChart').getContext('2d');
    rowSumChart = new Chart(rowSumCtx, {
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
                },
                legend: {
                    display: true
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
    
    // Odd/Even Chart 초기화
    const oddEvenCtx = document.getElementById('oddEvenChart').getContext('2d');
    oddEvenChart = new Chart(oddEvenCtx, {
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

// 각 행의 합 차트 업데이트
function updateRowSumChart(maxRows) {
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
    const ctx = document.getElementById('binomialChart').getContext('2d');
    
    if (binomialChart) {
        binomialChart.destroy();
    }
    
    const labels = [];
    const data = [];
    
    for (let k = 0; k <= n; k++) {
        labels.push(`C(${n},${k})`);
        data.push(binomialCoefficient(n, k));
    }
    
    binomialChart = new Chart(ctx, {
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
        oddEvenChart.data.datasets[0].data = [];
        oddEvenChart.data.datasets[1].data = [];
        oddEvenChart.update();
    }
}

// 홀수/짝수 패턴 차트 업데이트
function updateOddEvenChart() {
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
    const n = parseInt(document.getElementById('coinFlips').value);
    const ctx = document.getElementById('probabilityChart').getContext('2d');
    
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
    
    probabilityChart = new Chart(ctx, {
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
document.getElementById('rowInput').addEventListener('input', function() {
    const value = parseInt(this.value);
    if (value < 1) this.value = 1;
    if (value > 15) this.value = 15;
});

document.getElementById('nInput').addEventListener('input', function() {
    const value = parseInt(this.value);
    if (value < 0) this.value = 0;
    if (value > 20) this.value = 20;
    
    // k 값이 n보다 큰 경우 조정
    const kInput = document.getElementById('kInput');
    if (parseInt(kInput.value) > value) {
        kInput.value = value;
    }
    kInput.max = value;
});

document.getElementById('kInput').addEventListener('input', function() {
    const value = parseInt(this.value);
    const nValue = parseInt(document.getElementById('nInput').value);
    if (value < 0) this.value = 0;
    if (value > nValue) this.value = nValue;
});

document.getElementById('coinFlips').addEventListener('input', function() {
    const value = parseInt(this.value);
    if (value < 1) this.value = 1;
    if (value > 10) this.value = 10;
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
    element.innerHTML = `<div class="error">${message}</div>`;
}

function showSuccess(elementId, message) {
    const element = document.getElementById(elementId);
    element.innerHTML = `<div class="success">${message}</div>`;
}

// Chart.js 로딩 확인
if (typeof Chart === 'undefined') {
    console.error('Chart.js가 로드되지 않았습니다.');
    document.querySelectorAll('.chart-container').forEach(container => {
        container.innerHTML = '<div class="error">차트를 로드할 수 없습니다. 인터넷 연결을 확인해주세요.</div>';
    });
}

// 성능 최적화: 디바운스 함수
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 디바운스된 함수들
const debouncedGeneratePascal = debounce(generatePascalTriangle, 300);
const debouncedCalculateBinomial = debounce(calculateBinomial, 300);
const debouncedCalculateCoin = debounce(calculateCoinProbability, 300);

// 입력 필드에 디바운스 적용
document.getElementById('rowInput').addEventListener('input', debouncedGeneratePascal);
document.getElementById('nInput').addEventListener('input', debouncedCalculateBinomial);
document.getElementById('kInput').addEventListener('input', debouncedCalculateBinomial);
document.getElementById('coinFlips').addEventListener('input', debouncedCalculateCoin);