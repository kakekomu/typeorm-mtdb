import Logger from './logger';
import { faker } from '@faker-js/faker';

describe('Logger', () => {
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  test('logs message without target', () => {
    const logger = new Logger();
    const message = faker.lorem.sentence();
    logger.log(message);
    expect(consoleLogSpy).toHaveBeenCalledWith(message);
  });

  test('logs message with target', () => {
    const target = faker.word.noun();
    const logger = new Logger(target);
    const message = faker.lorem.sentence();
    logger.log(message);
    expect(consoleLogSpy).toHaveBeenCalledWith(`[${target}] ${message}`);
  });

  test('logs message with indentation', () => {
    const logger = new Logger();
    const message = faker.lorem.sentence();
    const indentation = faker.number.int({ min: 1, max: 5 });
    logger.log(message, indentation);
    expect(consoleLogSpy).toHaveBeenCalledWith(`${'  '.repeat(indentation)}${message}`);
  });

  test('logs message with target and indentation', () => {
    const target = faker.word.noun();
    const logger = new Logger(target);
    const message = faker.lorem.sentence();
    const indentation = faker.number.int({ min: 1, max: 5 });
    logger.log(message, indentation);
    expect(consoleLogSpy).toHaveBeenCalledWith(`${'  '.repeat(indentation)}[${target}] ${message}`);
  });
});
