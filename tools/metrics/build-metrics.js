#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

// Создаем директорию для метрик, если она не существует
const METRICS_DIR = path.join(process.cwd(), 'metrics-data');
fs.ensureDirSync(METRICS_DIR);

const BUILD_METRICS_FILE = path.join(METRICS_DIR, 'build-metrics.json');

// Запускаем сборку и измеряем время
console.log('🔄 Начало сборки проекта...');
const startTime = Date.now();

try {
  // Выполняем реальную сборку проекта
  execSync('pnpm --filter=@booking/common build', { stdio: 'inherit' });
  execSync('pnpm --filter=@booking/frontend build', { stdio: 'inherit' });
  
  const endTime = Date.now();
  const buildTime = endTime - startTime;
  
  console.log(`✅ Сборка завершена за ${buildTime / 1000} секунд.`);
  
  // Сохраняем метрики
  const metrics = {
    buildTime,
    timestamp: new Date().toISOString(),
    commitHash: execSync('git rev-parse HEAD').toString().trim(),
  };
  
  // Загружаем предыдущие метрики, если они существуют
  let allMetrics = [];
  if (fs.existsSync(BUILD_METRICS_FILE)) {
    allMetrics = JSON.parse(fs.readFileSync(BUILD_METRICS_FILE, 'utf8'));
  }
  
  // Добавляем новые метрики
  allMetrics.push(metrics);
  
  // Сохраняем обновленные метрики
  fs.writeFileSync(BUILD_METRICS_FILE, JSON.stringify(allMetrics, null, 2));
  
  console.log(`📊 Метрики сборки сохранены в ${BUILD_METRICS_FILE}`);
} catch (error) {
  console.error('❌ Ошибка сборки:', error);
  process.exit(1);
}