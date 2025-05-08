#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

// Создаем директорию для метрик, если она не существует
const METRICS_DIR = path.join(process.cwd(), 'metrics-data');
fs.ensureDirSync(METRICS_DIR);

const DEPLOY_METRICS_FILE = path.join(METRICS_DIR, 'deploy-metrics.json');

// Получаем хеш коммита и время коммита
const commitHash = process.env.GITHUB_SHA || execSync('git rev-parse HEAD').toString().trim();
const commitTimeStr = execSync(`git show -s --format=%ct ${commitHash}`).toString().trim();
const commitTime = parseInt(commitTimeStr) * 1000; // конвертируем из секунд в миллисекунды

// Текущее время - это время завершения деплоя
const deployFinishTime = Date.now();
const commitToDeployTime = deployFinishTime - commitTime;

// Сохраняем метрики
const metrics = {
  commitHash,
  commitTime,
  deployFinishTime,
  commitToDeployTime,
  timestamp: new Date().toISOString(),
};

// Загружаем предыдущие метрики, если они существуют
let allMetrics = [];
if (fs.existsSync(DEPLOY_METRICS_FILE)) {
  allMetrics = JSON.parse(fs.readFileSync(DEPLOY_METRICS_FILE, 'utf8'));
}

// Добавляем новые метрики
allMetrics.push(metrics);

// Сохраняем обновленные метрики
fs.writeFileSync(DEPLOY_METRICS_FILE, JSON.stringify(allMetrics, null, 2));

console.log(`📊 Метрики деплоя сохранены в ${DEPLOY_METRICS_FILE}`);
console.log(`⏱️ Время от коммита до деплоя: ${commitToDeployTime / 1000} секунд`);