import '@testing-library/jest-dom'

// Robust in-memory localStorage polyfill for test environment
class MemoryStorage implements Storage {
  private store: Record<string, string> = {}

  get length(): number {
    return Object.keys(this.store).length
  }

  clear(): void {
    this.store = {}
  }

  getItem(key: string): string | null {
    return this.store[key] !== undefined ? this.store[key] : null
  }

  key(index: number): string | null {
    return Object.keys(this.store)[index] || null
  }

  removeItem(key: string): void {
    delete this.store[key]
  }

  setItem(key: string, value: string): void {
    this.store[key] = String(value)
  }
}

const storageInstance = new MemoryStorage()

if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'localStorage', {
    value: storageInstance,
    writable: true,
    configurable: true,
  })
}

if (typeof globalThis !== 'undefined') {
  Object.defineProperty(globalThis, 'localStorage', {
    value: storageInstance,
    writable: true,
    configurable: true,
  })
}
