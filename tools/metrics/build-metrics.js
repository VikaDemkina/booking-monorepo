#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

// Создаем директорию для метрик, если она не существует
const METRICS_DIR = path.join(process.cwd(), 'metrics-data');
fs.ensureDirSync(METRICS_DIR);

const BUILD_METRICS_FILE = path.join(METRICS_DIR, 'build-metrics.json');

// Запускаем сборку и измеряем время
console.log('🔄 Начало измерения времени сборки...');
const startTime = Date.now();

try {
  // Эмулируем сборку или выполняем другие действия
  console.log('Имитация процесса сборки...');
  // В реальности здесь может быть execSync('pnpm build') или другая команда сборки
  
  // Добавляем небольшую задержку для имитации сборки
  setTimeout(() => {
    // Код, который выполняется после задержки
    const endTime = Date.now();
    const buildTime = endTime - startTime;
    
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
        if (!Array.isArray(allMetrics)) {
          console.warn('Файл метрик существует, но содержит неверный формат. Создаем новый массив.');
          allMetrics = [];
        }
      } catch (error) {
        console.warn('Не удалось прочитать предыдущие метрики:', error.message);
      }
    }
    
    // Добавляем новые метрики
    allMetrics.push(metrics);
    
    try {
      // Сохраняем обновленные метрики
      fs.writeFileSync(BUILD_METRICS_FILE, JSON.stringify(allMetrics, null, 2));
      console.log(`📊 Метрики сборки сохранены в ${BUILD_METRICS_FILE}`);
      
      // Для дополнительной надежности выводим содержимое файла метрик
      console.log('Содержимое файла метрик:');
      if (fs.existsSync(BUILD_METRICS_FILE)) {
        console.log(fs.readFileSync(BUILD_METRICS_FILE, 'utf8'));
      } else {
        console.log('Файл метрик не найден после записи!');
      }
    } catch (error) {
      console.error('Ошибка при сохранении метрик:', error);
    }
    
  }, 1000); // Задержка 1 секунда
} catch (error) {
  console.error('❌ Ошибка при измерении времени сборки:', error);
}