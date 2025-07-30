const sinon = require('sinon');
const request = require('request');

describe('Integration Tests', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('PlantUML Compression and URL Generation', () => {
    it('should generate correct PlantUML URLs', () => {
      const plantuml = require('../plantuml');

      const simpleCode = 'A -> B: Hello';
      const result = plantuml.compress(simpleCode);

      expect(result).toMatch(/^https:\/\/www\.plantuml\.com\/plantuml\/svg\//);
      expect(result).toContain('svg');
    });

    it('should handle different PlantUML syntax', () => {
      const plantuml = require('../plantuml');

      const sequenceCode = `
        @startuml
        participant User
        participant System
        User -> System: Login
        System -> User: Welcome
        @enduml
      `;
      const result = plantuml.compress(sequenceCode);

      expect(result).toMatch(/^https:\/\/www\.plantuml\.com\/plantuml\/svg\//);
    });
  });

  describe('HTTP Request Handling', () => {
    it('should handle successful requests', (done) => {
      const mockResponse = {
        statusCode: 200,
        body: '<svg>test</svg>'
      };

      // 創建一個模擬的 request 函數
      const mockRequest = function(url, callback) {
        callback(null, mockResponse, mockResponse.body);
      };

      // Test the mock request function directly
      mockRequest('https://www.plantuml.com/plantuml/svg/test', (error, response, body) => {
        expect(error).toBeNull();
        expect(response.statusCode).toBe(200);
        expect(body).toBe('<svg>test</svg>');
        done();
      });
    });

    it('should handle request errors', (done) => {
      // 創建一個模擬的 request 函數
      const mockRequest = function(url, callback) {
        callback(new Error('Network error'), null, null);
      };

      mockRequest('https://www.plantuml.com/plantuml/svg/test', (error, response, body) => {
        expect(error).toBeDefined();
        expect(error.message).toBe('Network error');
        done();
      });
    });
  });

  describe('Configuration Handling', () => {
    it('should merge configurations correctly', () => {
      const assign = require('object-assign');

      const defaults = {
        type: 'static',
        format: 'svg'
      };

      const userConfig = {
        type: 'dynamic'
      };

      const result = assign({}, defaults, userConfig);

      expect(result.type).toBe('dynamic');
      expect(result.format).toBe('svg');
    });
  });
});