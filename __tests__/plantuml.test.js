const plantuml = require('../plantuml');

describe('plantuml.js', () => {
  describe('compress', () => {
    it('should compress simple PlantUML code', () => {
      const simpleCode = 'A -> B: Hello';
      const result = plantuml.compress(simpleCode);

      expect(result).toMatch(/^https:\/\/www\.plantuml\.com\/plantuml\/svg\//);
      expect(result).toContain('svg');
    });

    it('should handle complex PlantUML code', () => {
      const complexCode = `
        @startuml
        participant User
        participant System
        User -> System: Login
        System -> User: Welcome
        @enduml
      `;
      const result = plantuml.compress(complexCode);

      expect(result).toMatch(/^https:\/\/www\.plantuml\.com\/plantuml\/svg\//);
    });

    it('should handle empty string', () => {
      const result = plantuml.compress('');
      expect(result).toMatch(/^https:\/\/www\.plantuml\.com\/plantuml\/svg\//);
    });

    it('should handle special characters', () => {
      const specialChars = 'A -> B: "Hello World!"';
      const result = plantuml.compress(specialChars);

      expect(result).toMatch(/^https:\/\/www\.plantuml\.com\/plantuml\/svg\//);
    });
  });
});