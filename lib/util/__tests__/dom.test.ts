import { canvasToArrayBuffer, createCanvasContext, fetchImage } from '../dom';

describe('createCanvasContext', () => {
  let createElementSpy: jest.SpyInstance;

  beforeEach(() => {
    createElementSpy = jest.spyOn(document, 'createElement');
  });

  test('should return canvas', () => {
    const width = 512;
    const height = 256;

    createElementSpy.mockImplementationOnce((elementType) => {
      if (elementType === 'canvas') {
        const canvas = { width, height };
        const ctx = { getContext: () => ({ canvas }) }
        return ctx;
      }
      throw new Error('Invalid element type');
    });

    const output = createCanvasContext(width, height);
    expect(output.canvas.width).toBe(width);
    expect(output.canvas.height).toBe(height);
  });

  test('should throw when context 2d does not exist', () => {
    const width = 512;
    const height = 256;
    
    createElementSpy.mockImplementationOnce((elementType) => {
      if (elementType === 'canvas') {
        return { getContext: () => null };
      }
      throw new Error('Invalid element type');
    });

    expect(() => createCanvasContext(width, height)).toThrow();
  });
});

describe('canvasToArrayBuffer', () => {
  test('should resolve falsy blob', async() => {
    const mockCanvas = {
      toBlob: jest.fn().mockImplementation(async (fn: () => Promise<void>) => {
        await fn();
      })
    } as unknown as HTMLCanvasElement;
    const output = await canvasToArrayBuffer(mockCanvas);
    expect(output).toBeNull();
  });

  test('should resolve array buffer', async () => {
    const buf = new Uint8Array([]);
    const mockCanvas = {
      toBlob: jest.fn().mockImplementation(async (fn: (blob: any) => Promise<any>) => {
        await fn({
          arrayBuffer: jest.fn().mockResolvedValue(buf)
        });
      })
    } as unknown as HTMLCanvasElement;
    const output = await canvasToArrayBuffer(mockCanvas);
    expect(output).toBe(buf);
  });

  test('should reject with error', async () => {
    const mockCanvas = {
      toBlob: jest.fn().mockImplementation(async (fn: (blob: any) => Promise<any>) => {
        await fn({
          arrayBuffer: jest.fn().mockRejectedValue(new Error('Test error'))
        });
      })
    } as unknown as HTMLCanvasElement;
    await expect(canvasToArrayBuffer(mockCanvas)).rejects.toBeInstanceOf(Error);
  });
});

describe('fetchImage', () => {
  const imageUrl = 'http://test.com/image.png';
  let imageSpy: jest.SpyInstance;

  beforeEach(() => {
    imageSpy = jest.spyOn(window, 'Image');
  });

  test('should resolve an image', async () => {  
    imageSpy.mockImplementationOnce(() => {
      const image: any = {
        crossOrigin: undefined,
        src: undefined,
      };
      image.decode = jest.fn().mockResolvedValue(image);
      return image;
    });

    const output = await fetchImage(imageUrl);
    expect(output.crossOrigin).toBe('');
    expect(output.src).toBe(output.src);
  });

  test('should reject when error', async () => {  
    imageSpy.mockImplementationOnce(() => {
      const image: any = {
        crossOrigin: undefined,
        src: undefined,
      };
      image.decode = jest.fn().mockRejectedValue(new Error('Test image error'));
      return image;
    });

    await expect(fetchImage(imageUrl)).rejects.toBeInstanceOf(Error);
  });
});
