const Car = require('./car')

const capitalizeString = (string) => `${string[0].toUpperCase()}${string.slice(1)}`

class UnsupportedBrandError extends Error {}

class CarFactory {
  #supportedBrands = ['Fiat', 'Lancia', 'Ford', 'Subaru']

  constructor (factoryName, brands) {
    const flattedBrands = brands.toString().split(',').map(capitalizeString)
    const unsupportedBrands = flattedBrands.reduce((acc, item) => {
      if (!this.#supportedBrands.includes(item))
        acc.push(item)
      return acc
    }, [])

    if (unsupportedBrands.length > 0)
      throw new UnsupportedBrandError(`Brand not supported: '${unsupportedBrands.join(', ')}'`)

    this.name = factoryName
    this.brands = flattedBrands
  }

  get factoryName () {
    return `${this.name} produces: ${this.brands.join(', ')}`
  }

  createCar = (brand) => {
    if ((this.brands.length > 1 && brand === undefined) || (brand !== undefined && !this.brands.includes(capitalizeString(brand))))
      throw new UnsupportedBrandError('Factory does not have a brand or do not support it')

    return new Car(brand !== undefined ? capitalizeString(brand) : this.brands[0])
  }

  * createCars (...args) {
    for (const specification of args) {
      if (typeof specification === 'number')
        for (let i = 0; i < specification; i++) {
          yield this.createCar(this.brands[i % this.brands.length])
        }
      else {
        const [count, brand] = specification
        for (let i = 0; i < count; i++) {
          yield this.createCar(brand)
        }
      }
    }
  }
}

module.exports = {
  UnsupportedBrandError,
  CarFactory
}
