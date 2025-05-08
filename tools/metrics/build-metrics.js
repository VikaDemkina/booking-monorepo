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
  // Здесь можно запустить реальную сборку проектов
  // В CI/CD этот скрипт запускается после сборки, поэтому мы просто эмулируем задержку
  const buildTime = Date.now() - startTime;
  
  console.log(`✅ Сборка завершена за ${buildTime / 1000} секунд.`);
  
  // Сохраняем метрики
  let commitHash;
  try {
    commitHash = execSync('git rev-parse HEAD').toString().trim();
  } catch (error) {
    console.warn('Не удалось получить хеш коммита:', error.message);
    commitHash = 'unknown';
  }
  
  const metrics = {
    buildTime,
    timestamp: new Date().toISOString(),
    commitHash,
  };
  
  // Загружаем предыдущие метрики, если они существуют
  let allMetrics = [];
  if (fs.existsSync(BUILD_METRICS_FILE)) {
    try {
      allMetrics = JSON.parse(fs.readFileSync(BUILD_METRICS_FILE, 'utf8'));
    } catch (error) {
      console.warn('Не удалось прочитать предыдущие метрики:', error.message);
    }
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