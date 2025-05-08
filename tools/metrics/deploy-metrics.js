#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

// Создаем директорию для метрик, если она не существует
const METRICS_DIR = path.join(process.cwd(), 'metrics-data');
fs.ensureDirSync(METRICS_DIR);

const DEPLOY_METRICS_FILE = path.join(METRICS_DIR, 'deploy-metrics.json');

// Получаем хеш коммита и время коммита
console.log('🔄 Начало сбора метрик деплоя...');
let commitHash, commitTime;

try {
  // Попытка получить хеш коммита
  try {
    commitHash = process.env.GITHUB_SHA || execSync('git rev-parse HEAD').toString().trim();
    console.log(`Хеш коммита: ${commitHash}`);
  } catch (error) {
    console.warn('Не удалось получить хеш коммита:', error.message);
    commitHash = 'unknown';
  }
  
  // Попытка получить время коммита
  try {
    if (commitHash !== 'unknown') {
      const commitTimeStr = execSync(`git show -s --format=%ct ${commitHash}`).toString().trim();
      commitTime = parseInt(commitTimeStr) * 1000; // конвертируем из секунд в миллисекунды
      console.log(`Время коммита: ${new Date(commitTime).toISOString()}`);
    } else {
      console.warn('Не удалось получить время коммита из-за неизвестного хеша');
      commitTime = Date.now() - 60000; // Условное время коммита (1 минуту назад)
    }
  } catch (error) {
    console.warn('Не удалось получить время коммита:', error.message);
    commitTime = Date.now() - 60000; // Условное время коммита (1 минуту назад)
  }
  
  // Текущее время - это время завершения деплоя
  const deployFinishTime = Date.now();
  const commitToDeployTime = deployFinishTime - commitTime;
  
  console.log(`Время завершения деплоя: ${new Date(deployFinishTime).toISOString()}`);
  console.log(`Время от коммита до деплоя: ${commitToDeployTime / 1000} секунд`);
  
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
    try {
      allMetrics = JSON.parse(fs.readFileSync(DEPLOY_METRICS_FILE, 'utf8'));
      if (!Array.isArray(allMetrics)) {
        console.warn('Файл метрик существует, но содержит неверный формат. Создаем новый массив.');
        allMetrics = [];
      }
    } catch (error) {
      console.warn('Не удалось прочитать предыдущие метрики деплоя:', error.message);
    }
  }
  
  // Добавляем новые метрики
  allMetrics.push(metrics);
  
  try {
    // Сохраняем обновленные метрики
    fs.writeFileSync(DEPLOY_METRICS_FILE, JSON.stringify(allMetrics, null, 2));
    console.log(`📊 Метрики деплоя сохранены в ${DEPLOY_METRICS_FILE}`);
    
    // Для дополнительной надежности выводим содержимое файла метрик
    console.log('Содержимое файла метрик деплоя:');
    if (fs.existsSync(DEPLOY_METRICS_FILE)) {
      console.log(fs.readFileSync(DEPLOY_METRICS_FILE, 'utf8'));
    } else {
      console.log('Файл метрик деплоя не найден после записи!');
    }
  } catch (error) {
    console.error('Ошибка при сохранении метрик деплоя:', error);
  }
} catch (error) {
  console.error('❌ Ошибка при сборе метрик деплоя:', error);
}