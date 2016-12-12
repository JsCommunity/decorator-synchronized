/* eslint-env jest */

import synchronized from './'

describe('synchronized functions', () => {
  it('should synchronize async functions', () => {
    let i = 0
    const fn = synchronized((expectedI, result) => {
      expect(i).toBe(expectedI)

      return Promise.resolve().then(() => {
        i++
        return result
      })
    })

    return Promise.all([
      fn(0, 'foo').then(result => {
        expect(result).toBe('foo')
      }),
      fn(1, 'bar').then(result => {
        expect(result).toBe('bar')
      })
    ]).then(() => expect(i).toBe(2))
  })

  it('should synchronize async rejected functions', () => {
    let i = 0
    const fn = synchronized((expectedI, error) => {
      expect(i).toBe(expectedI)

      return Promise.resolve().then(() => {
        i++
        return Promise.reject(error)
      })
    })

    return Promise.all([
      fn(0, 'foo').then(() => {
        expect(true).toBe(false)
      }).catch(error => {
        expect(error).toBe('foo')
      }),
      fn(1, 'bar').then(() => {
        expect(true).toBe(false)
      }).catch(error => {
        expect(error).toBe('bar')
      })
    ]).then(() => {
      expect(i).toBe(2)
    })
  })
})

describe('synchronized methods', () => {
  it('should be bound', () => {
    class Test {
      @synchronized
      fn (thisArg) {
        expect(this).toBe(thisArg)
      }
    }

    const t = new Test()
    return t.fn.call(null, t)
  })

  it('should not synchronize between instances', () => {
    let i = 0

    class Test {
      @synchronized
      fn (expectedI) {
        expect(i).toBe(expectedI)

        return Promise.resolve().then(() => {
          ++i
        })
      }
    }

    return Promise.all([
      new Test().fn(0),
      new Test().fn(0)
    ]).then(() => {
      expect(i).toBe(2)
    })
  })

  it('should synchronize async static methods', () => {
    let i = 0
    class Test {
      @synchronized
      static fn (expectedI, result) {
        expect(i).toBe(expectedI)

        return Promise.resolve().then(() => {
          i++
          return result
        })
      }
    }

    const { fn } = Test

    return Promise.all([
      fn(0, 'foo').then(result => {
        expect(result).toBe('foo')
      }),
      fn(1, 'bar').then(result => {
        expect(result).toBe('bar')
      })
    ]).then(() => {
      expect(i).toBe(2)
    })
  })

  it('should behave like a normal property', () => {
    class Test {
      @synchronized
      fn () {
        return 0
      }
    }

    const t = new Test()
    t.fn = 42

    expect(Object.getOwnPropertyDescriptor(t, 'fn')).toEqual({
      configurable: true,
      enumerable: true,
      value: 42,
      writable: true
    })
  })
})
