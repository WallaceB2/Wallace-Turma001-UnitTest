const AnaliseDeDados = require("../src/analiseDeDados");

describe('AnaliseDeDados', () => {
  let analise;

  beforeEach(() => {
    analise = new AnaliseDeDados([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  describe('Métodos Básicos', () => {
    test('adicionarDados() deve adicionar novos valores', () => {
      analise.adicionarDados([10, 11]);
      expect(analise.dados).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
    });

    test('adicionarDados() deve lançar erro para entrada não-array', () => {
      expect(() => analise.adicionarDados(42)).toThrow("Os dados devem ser um array.");
    });

    test('limparDados() deve resetar o array', () => {
      analise.limparDados();
      expect(analise.dados).toEqual([]);
    });

    test('ordenarDados() deve retornar cópia ordenada sem alterar original', () => {
      const original = [...analise.dados];
      const ordenado = analise.ordenarDados();
      expect(ordenado).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      expect(analise.dados).toEqual(original);
    });
  });

  describe('Estatísticas Descritivas', () => {
    test('calcularMedia() deve retornar a média correta', () => {
      expect(analise.calcularMedia()).toBe(5);
    });

    test('calcularMedia() deve retornar null para array vazio', () => {
      analise.limparDados();
      expect(analise.calcularMedia()).toBeNull();
    });

    test('calcularMediana() deve funcionar para arrays ímpares', () => {
      expect(analise.calcularMediana()).toBe(5);
    });

    test('calcularMediana() deve funcionar para arrays pares', () => {
      analise.adicionarDados([10]);
      expect(analise.calcularMediana()).toBe(5.5);
    });

    test('calcularModa() deve retornar todas as modas', () => {
      analise.adicionarDados([5, 5]);
      expect(analise.calcularModa()).toEqual([5]);
    });

    test('calcularModa() deve retornar múltiplas modas para mesma frequência', () => {
      analise.limparDados();
      analise.adicionarDados([1, 2, 2, 3, 3]);
      expect(analise.calcularModa()).toEqual([2, 3]);
    });
  });

  describe('Medidas de Dispersão', () => {
    test('calcularVariancia() deve retornar valor correto', () => {
      expect(analise.calcularVariancia()).toBeCloseTo(6.666, 2);
    });

    test('calcularDesvioPadrao() deve retornar raiz da variância', () => {
      expect(analise.calcularDesvioPadrao()).toBeCloseTo(2.581, 2);
    });

    test('calcularAmplitude() deve retornar diferença entre max e min', () => {
      expect(analise.calcularAmplitude()).toBe(8);
    });

    test('calcularCoeficienteVariacao() deve retornar valor correto', () => {
      expect(analise.calcularCoeficienteVariacao()).toBeCloseTo(51.639, 2);
    });

    test('calcularCoeficienteVariacao() deve retornar null para média zero', () => {
      analise.limparDados();
      analise.adicionarDados([0, 0, 0]);
      expect(analise.calcularCoeficienteVariacao()).toBeNull();
    });
  });

  describe('Operações Avançadas', () => {
    test('calcularPercentil(50) deve equivaler à mediana', () => {
      expect(analise.calcularPercentil(50)).toBe(5);
    });

    test('calcularPercentil() deve retornar null para percentil inválido', () => {
      expect(analise.calcularPercentil(-10)).toBeNull();
      expect(analise.calcularPercentil(110)).toBeNull();
    });

    test('calcularPercentil() deve interpolar valores', () => {
      expect(analise.calcularPercentil(30)).toBeCloseTo(3.4);
    });

    test('normalizarDados() deve escalar entre 0 e 1', () => {
      const normalizados = analise.normalizarDados();
      expect(normalizados[0]).toBe(0);
      expect(normalizados[8]).toBe(1);
    });

    test('normalizarDados() deve retornar zeros quando min = max', () => {
      analise.limparDados();
      analise.adicionarDados([5, 5, 5]);
      expect(analise.normalizarDados()).toEqual([0, 0, 0]);
    });

    test('removerOutliers() deve filtrar valores extremos', () => {
      analise.adicionarDados([100, -100]);
      analise.removerOutliers();
      expect(analise.dados).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    test('removerOutliers() deve usar fator personalizado', () => {
      analise.adicionarDados([20, -20]);
      analise.removerOutliers(1.0);
      expect(analise.dados).toEqual([2, 3, 4, 5, 6, 7, 8]);
    });

    test('calcularCorrelacao() deve retornar 1 para arrays idênticos', () => {
      expect(analise.calcularCorrelacao([1, 2, 3, 4, 5, 6, 7, 8, 9])).toBeCloseTo(1);
    });

    test('calcularCorrelacao() deve retornar -1 para correlação inversa', () => {
      expect(analise.calcularCorrelacao([9, 8, 7, 6, 5, 4, 3, 2, 1])).toBeCloseTo(-1);
    });

    test('calcularCorrelacao() deve retornar null para tamanhos diferentes', () => {
      expect(analise.calcularCorrelacao([1, 2, 3])).toBeNull();
    });
  });

  describe('Operações Matemáticas', () => {
    test('calcularSoma() deve retornar a soma dos elementos', () => {
      expect(analise.calcularSoma()).toBe(45);
    });

    test('calcularProduto() deve retornar o produto dos elementos', () => {
      expect(analise.calcularProduto()).toBe(362880);
    });

    test('calcularProduto() deve retornar 1 para array vazio', () => {
      analise.limparDados();
      expect(analise.calcularProduto()).toBe(1);
    });
  });

  describe('Edge Cases', () => {
    test('deve lidar com array vazio', () => {
      analise.limparDados();
      expect(analise.calcularMedia()).toBeNull();
      expect(analise.calcularMediana()).toBeNull();
      expect(analise.calcularModa()).toBeNull();
      expect(analise.calcularVariancia()).toBeNull();
      expect(analise.calcularDesvioPadrao()).toBeNull();
      expect(analise.encontrarMinimo()).toBeNull();
      expect(analise.encontrarMaximo()).toBeNull();
      expect(analise.calcularAmplitude()).toBeNaN();
      expect(analise.normalizarDados()).toEqual([]);
    });

    test('deve lidar com array de um elemento', () => {
      analise.limparDados();
      analise.adicionarDados([42]);
      expect(analise.calcularMedia()).toBe(42);
      expect(analise.calcularMediana()).toBe(42);
      expect(analise.calcularModa()).toEqual([42]);
      expect(analise.calcularDesvioPadrao()).toBe(0);
      expect(analise.calcularVariancia()).toBe(0);
      expect(analise.encontrarMinimo()).toBe(42);
      expect(analise.encontrarMaximo()).toBe(42);
      expect(analise.calcularAmplitude()).toBe(0);
      expect(analise.normalizarDados()).toEqual([0]);
    });

    test('deve lidar com valores negativos', () => {
      analise.limparDados();
      analise.adicionarDados([-5, -3, -1]);
      expect(analise.calcularMedia()).toBe(-3);
      expect(analise.calcularMediana()).toBe(-3);
      expect(analise.encontrarMinimo()).toBe(-5);
      expect(analise.encontrarMaximo()).toBe(-1);
      expect(analise.calcularAmplitude()).toBe(4);
    });

    test('deve lidar com valores decimais', () => {
      analise.limparDados();
      analise.adicionarDados([1.5, 2.5, 3.5]);
      expect(analise.calcularMedia()).toBeCloseTo(2.5);
      expect(analise.calcularMediana()).toBe(2.5);
    });
  });
});